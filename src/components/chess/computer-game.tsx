import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Crown,
  Flag,
  Handshake,
  History,
  Maximize2,
  Minimize2,
  RefreshCw,
  User,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { ChessBoard } from "@/components/chess/chess-board";
import { useChessGame } from "@/hooks/use-chess-game";
import { useChessClock } from "@/hooks/use-chess-clock";
import { useStockfish } from "@/hooks/use-stockfish";
import { useAuth } from "@/contexts/auth-context";
import { useSettings } from "@/contexts/settings-context";
import { playChessSound } from "@/lib/sound";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_ENGINE_LEVEL, ENGINE_LEVELS, COMPUTER_TIME_CONTROL_IDS, findEngineLevel } from "@/lib/engine-levels";
import { TIME_CONTROLS, baseMs, findTimeControl, formatClock, incrementMs } from "@/lib/time-controls";
import { cn } from "@/lib/utils";

type ColorChoice = "white" | "black" | "random";

const computerTimeControls = TIME_CONTROLS.filter((tc) => COMPUTER_TIME_CONTROL_IDS.includes(tc.id));
const DEFAULT_COMPUTER_TC = computerTimeControls.find((tc) => tc.id === "5+0") ?? computerTimeControls[0]!;

export function ComputerGame() {
  const { profile } = useAuth();
  const { settings } = useSettings();
  const engine = useStockfish();

  const [colorChoice, setColorChoice] = useState<ColorChoice>("white");
  const [levelId, setLevelId] = useState(DEFAULT_ENGINE_LEVEL.id);
  const [timeControlId, setTimeControlId] = useState(DEFAULT_COMPUTER_TC.id);
  const [started, setStarted] = useState(false);
  const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
  const [manualOrientation, setManualOrientation] = useState<"white" | "black" | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [resignConfirmOpen, setResignConfirmOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [movesDrawerOpen, setMovesDrawerOpen] = useState(false);
  const [boardMode, setBoardMode] = useState<"3d" | "2d">("3d");

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(async () => {
    const elem = containerRef.current;
    if (!elem) return;

    try {
      if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  const level = useMemo(() => findEngineLevel(levelId), [levelId]);
  const timeControl = useMemo(() => findTimeControl(timeControlId), [timeControlId]);

  const game = useChessGame();
  const clock = useChessClock({
    baseMs: baseMs(timeControl),
    incrementMs: incrementMs(timeControl),
    onFlag: (color) => game.flag(color),
  });

  const gameRef = useRef(game);
  gameRef.current = game;
  const clockRef = useRef(clock);
  clockRef.current = clock;

  useEffect(() => {
    if (game.result) {
      setResultOpen(true);
      playChessSound("gameEnd", settings);
    }
  }, [game.result, settings]);

  useEffect(() => {
    if (game.isGameOver) {
      clock.pause();
      engine.stop();
    }
  }, [game.isGameOver, clock, engine]);

  useEffect(() => {
    if (engine.ready) engine.setSkill(level.skill);
  }, [engine, engine.ready, level.skill]);

  const engineColor: "w" | "b" = playerColor === "w" ? "b" : "w";

  // Engine turn handling
  useEffect(() => {
    if (!started || !engine.ready || game.isGameOver) return;
    if (game.turn !== engineColor) return;
    let cancelled = false;
    void engine
      .bestMove(game.fen, { depth: level.depth, moveTimeMs: level.moveTimeMs })
      .then((move) => {
        if (cancelled || !move) return;
        const current = gameRef.current;
        if (current.isGameOver || current.turn !== engineColor) return;
        const played = current.makeMove(move.from, move.to, move.promotion);
        if (played) {
          clockRef.current.switchTurn(engineColor);
          if (current.inCheck) {
            playChessSound("check", settings);
          } else {
            playChessSound("move", settings);
          }
        }
      });
    return () => {
      cancelled = true;
    };
  }, [started, engine, engine.ready, game.fen, game.turn, game.isGameOver, engineColor, level.depth, level.moveTimeMs, settings]);

  const startGame = useCallback(() => {
    const color: "w" | "b" =
      colorChoice === "random" ? (Math.random() < 0.5 ? "w" : "b") : colorChoice === "white" ? "w" : "b";
    engine.newGame();
    engine.setSkill(level.skill);
    game.reset();
    clock.reset();
    setPlayerColor(color);
    setManualOrientation(null);
    setResultOpen(false);
    setMovesDrawerOpen(false);
    setStarted(true);
    clock.start("w");
    playChessSound("gameStart", settings);
  }, [colorChoice, engine, game, clock, level.skill, settings]);

  function handleMove(from: string, to: string, promotion?: string) {
    if (!started || game.turn !== playerColor) return false;
    const isCapture = game.legalMovesFrom(from).some((m) => m.to === to && (m.flags.includes("c") || m.flags.includes("e")));
    const played = game.makeMove(from, to, promotion);
    if (played) {
      clock.switchTurn(playerColor);
      if (game.inCheck) {
        playChessSound("check", settings);
      } else if (isCapture) {
        playChessSound("capture", settings);
      } else {
        playChessSound("move", settings);
      }
    }
    return played;
  }

  const handleResignClick = () => {
    if (settings.confirmBeforeResign) {
      setResignConfirmOpen(true);
    } else {
      game.resign(playerColor);
    }
  };

  const handleDrawClick = () => {
    if (game.isGameOver) return;
    game.offerDraw();
  };

  const handleFlipBoard = () => {
    const currentOr = manualOrientation ?? (playerColor === "w" ? "white" : "black");
    setManualOrientation(currentOr === "white" ? "black" : "white");
  };

  const orientation: "white" | "black" = manualOrientation ?? (playerColor === "w" ? "white" : "black");
  const topColor: "w" | "b" = engineColor;
  const bottomColor: "w" | "b" = playerColor;
  const playerName = profile?.username || "sreen2003";

  const initialMs = baseMs(timeControl);

  // Group moves into pairs for the 2-column moves drawer
  const movePairs = useMemo(() => {
    const pairs: { number: number; white?: string; black?: string }[] = [];
    game.history.forEach((m, idx) => {
      const pIdx = Math.floor(idx / 2);
      pairs[pIdx] ??= { number: pIdx + 1 };
      if (idx % 2 === 0) {
        pairs[pIdx]!.white = m.san;
      } else {
        pairs[pIdx]!.black = m.san;
      }
    });
    return pairs;
  }, [game.history]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "transition-colors duration-300 relative select-none flex flex-col justify-between items-center bg-[#0d0f12] text-foreground",
        isFullscreen
          ? "fixed inset-0 z-50 w-screen h-screen p-2 sm:p-4 overflow-hidden"
          : "w-full h-full max-h-screen py-1 sm:py-2 px-3 sm:px-6 overflow-hidden"
      )}
    >
      {/* Subtle Midnight Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(40,44,52,0.45)_0%,rgba(13,15,18,0.98)_75%)]" />

      {/* HEADER (Height: ~56-64px) */}
      <header className="w-full max-w-[1200px] h-14 sm:h-16 px-2 sm:px-4 flex items-center justify-between shrink-0 z-20">
        {/* LEFT: ChessMind Logo */}
        <Link to="/play" className="flex items-center gap-2.5 text-stone-200 hover:text-white transition-colors group">
          <div className="size-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors shadow-xs">
            <Crown className="size-4.5" />
          </div>
          <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-stone-100 uppercase">
            ChessMind
          </span>
        </Link>

        {/* CENTER: Stockfish · Difficulty */}
        <div className="hidden min-[440px]:flex items-center gap-1.5 sm:gap-2 font-mono">
          <span className="font-medium text-xs sm:text-sm text-stone-200">Stockfish</span>
          <span className="text-stone-600">·</span>
          <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded bg-stone-800/80 border border-stone-700/60 text-amber-400 font-semibold uppercase tracking-wider">
            {level.label.replace(/^Level \d+ · /, "")}
          </span>
        </div>

        {/* RIGHT: 3D | 2D Segmented Control & Fullscreen Button */}
        <div className="flex items-center gap-2">
          {/* Segmented 3D | 2D Control */}
          <div className="flex items-center bg-stone-900/90 border border-stone-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setBoardMode("3d")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer",
                boardMode === "3d" ? "bg-amber-500/20 text-amber-400 shadow-xs" : "text-stone-400 hover:text-stone-200"
              )}
            >
              3D
            </button>
            <button
              type="button"
              onClick={() => setBoardMode("2d")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer",
                boardMode === "2d" ? "bg-amber-500/20 text-amber-400 shadow-xs" : "text-stone-400 hover:text-stone-200"
              )}
            >
              2D
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen"}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition-colors cursor-pointer border border-stone-800"
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </header>

      {/* MAIN GAME AREA: Centerpiece Chessboard, Attached Player Bars */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-1 sm:p-2 z-10 relative min-h-0">
        <div className="w-full max-w-[min(68vh,740px,94vw)] flex flex-col items-center justify-center relative space-y-1">
          {/* TOP PLAYER BAR (Stockfish) */}
          <div className="w-full flex items-center justify-between py-1 px-1.5 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-7 rounded-full bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-stone-300 shrink-0">
                <Bot className="size-4" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base text-stone-100 tracking-tight truncate">
                  Stockfish
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase">
                  {engineColor === "w" ? "White" : "Black"}
                </span>
              </div>
              {started && game.turn === engineColor && !game.isGameOver && (
                <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 font-semibold tracking-wide flex items-center gap-1.5 animate-pulse pl-1">
                  <span className="size-1.5 rounded-full bg-amber-400" />
                  STOCKFISH THINKING
                </span>
              )}
            </div>

            {/* Clock: Active bright, Inactive muted */}
            <div
              role="timer"
              className={cn(
                "font-digital text-2xl sm:text-3xl tabular-nums font-bold tracking-wider transition-colors",
                started && clock.active === topColor
                  ? clock.times[topColor] <= 20000
                    ? "text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    : "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                  : "text-stone-500 opacity-75"
              )}
            >
              {formatClock(started ? clock.times[topColor] : initialMs)}
            </div>
          </div>

          {/* CHESSBOARD (Centerpiece) */}
          <div className="w-full aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
            <ChessBoard
              fen={game.fen}
              boardOrientation={orientation}
              onMove={handleMove}
              legalMovesFrom={game.legalMovesFrom}
              lastMove={game.lastMove ? { from: game.lastMove.from, to: game.lastMove.to } : null}
              checkSquare={game.checkSquare}
              interactive={started && !game.isGameOver && game.turn === playerColor}
              topClockMs={started ? clock.times[topColor] : initialMs}
              bottomClockMs={started ? clock.times[bottomColor] : initialMs}
              activeClock={clock.active}
              isExpanded={started}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              boardMode={boardMode}
              onBoardModeChange={setBoardMode}
              showEmbeddedControls={false}
            />

            {/* SETUP OVERLAY (Collapses smoothly on Start Game) */}
            <AnimatePresence>
              {!started && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md rounded-2xl"
                >
                  <div className="w-full max-w-sm bg-stone-900/95 border border-stone-800 rounded-xl p-5 shadow-2xl space-y-4">
                    <div className="text-center space-y-1">
                      <h2 className="font-display font-bold text-lg text-stone-100">Match Setup</h2>
                      <p className="text-xs text-stone-400">Configure your match against Stockfish</p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-stone-400">Your Color</label>
                        <Select value={colorChoice} onValueChange={(v) => setColorChoice(v as ColorChoice)}>
                          <SelectTrigger className="h-9 bg-stone-950 border-stone-800 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-900 border-stone-800 text-xs">
                            <SelectItem value="white">White (Play First)</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="random">Random</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-stone-400">Difficulty</label>
                        <Select value={levelId} onValueChange={setLevelId}>
                          <SelectTrigger className="h-9 bg-stone-950 border-stone-800 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-900 border-stone-800 text-xs">
                            {ENGINE_LEVELS.map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.label} · {l.blurb}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-stone-400">Time Control</label>
                        <Select value={timeControlId} onValueChange={setTimeControlId}>
                          <SelectTrigger className="h-9 bg-stone-950 border-stone-800 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-stone-900 border-stone-800 text-xs">
                            {computerTimeControls.map((tc) => (
                              <SelectItem key={tc.id} value={tc.id}>
                                {tc.label} ({tc.category})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={startGame}
                      className="w-full h-10 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm tracking-wider uppercase transition-colors cursor-pointer shadow-lg"
                    >
                      Start Game
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GAME OVER OVERLAY (Clean centered overlay over board) */}
            <AnimatePresence>
              {game.isGameOver && resultOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs rounded-2xl pointer-events-auto"
                >
                  <div className="w-full max-w-xs bg-stone-900/95 border border-amber-500/30 rounded-xl p-5 text-center shadow-2xl space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                      {game.result?.status.toUpperCase() || "GAME OVER"}
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-stone-100">
                      {game.result?.winner === playerColor
                        ? "You Win"
                        : game.result?.winner === engineColor
                          ? "Stockfish Wins"
                          : "Draw"}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono">
                      {game.result?.reason}
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setResultOpen(false)}
                        className="border-stone-700 text-stone-300 hover:text-white text-xs h-8"
                      >
                        Review Board
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setStarted(false);
                          game.reset();
                          clock.reset();
                          setResultOpen(false);
                        }}
                        className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs h-8"
                      >
                        New Game
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTTOM PLAYER BAR (Player) */}
          <div className="w-full flex items-center justify-between py-1 px-1.5 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-7 rounded-full bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                <User className="size-4" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base text-stone-100 tracking-tight truncate">
                  {playerName}
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase">
                  {playerColor === "w" ? "White" : "Black"}
                </span>
              </div>
              {started && game.turn === playerColor && !game.isGameOver && (
                <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-semibold tracking-wide flex items-center gap-1.5 animate-pulse pl-1">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  YOUR TURN
                </span>
              )}
            </div>

            {/* Clock: Active bright, Inactive muted */}
            <div
              role="timer"
              className={cn(
                "font-digital text-2xl sm:text-3xl tabular-nums font-bold tracking-wider transition-colors",
                started && clock.active === bottomColor
                  ? clock.times[bottomColor] <= 20000
                    ? "text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    : "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "text-stone-500 opacity-75"
              )}
            >
              {formatClock(started ? clock.times[bottomColor] : initialMs)}
            </div>
          </div>
        </div>
      </main>

      {/* COMPACT BOTTOM ACTION BAR: [ RESIGN ] [ DRAW ] [ FLIP ] [ MOVES ] */}
      <footer className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2 z-20 shrink-0">
        <button
          type="button"
          disabled={!started || game.isGameOver}
          onClick={handleResignClick}
          className="px-3.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900/80 hover:bg-rose-950/40 hover:border-rose-800/60 text-stone-300 hover:text-rose-300 text-xs font-mono font-semibold tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
        >
          <Flag className="size-3.5" />
          <span>Resign</span>
        </button>

        <button
          type="button"
          disabled={!started || game.isGameOver}
          onClick={handleDrawClick}
          className="px-3.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-xs font-mono font-semibold tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
        >
          <Handshake className="size-3.5" />
          <span>Draw</span>
        </button>

        <button
          type="button"
          onClick={handleFlipBoard}
          className="px-3.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-xs font-mono font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="size-3.5" />
          <span>Flip</span>
        </button>

        <button
          type="button"
          onClick={() => setMovesDrawerOpen((prev) => !prev)}
          className={cn(
            "px-3.5 py-1.5 rounded-lg border text-xs font-mono font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5",
            movesDrawerOpen
              ? "border-amber-500/60 bg-amber-500/20 text-amber-400"
              : "border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100"
          )}
        >
          <History className="size-3.5" />
          <span>Moves {game.history.length > 0 ? `(${game.history.length})` : ""}</span>
        </button>

        {game.isGameOver && !resultOpen && (
          <button
            type="button"
            onClick={() => {
              setStarted(false);
              game.reset();
              clock.reset();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs font-mono tracking-wider uppercase transition-all cursor-pointer shadow-sm"
          >
            New Game
          </button>
        )}
      </footer>

      {/* SLIM MOVES DRAWER (Slides upward from bottom) */}
      <AnimatePresence>
        {movesDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-14 sm:bottom-16 inset-x-0 mx-auto max-w-sm w-full z-40 px-4"
          >
            <div className="bg-stone-900/95 border border-stone-800 rounded-xl shadow-2xl p-3 space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <History className="size-3.5" />
                  Moves History ({game.history.length})
                </span>
                <button
                  type="button"
                  onClick={() => setMovesDrawerOpen(false)}
                  className="text-stone-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="max-h-52 overflow-y-auto pr-1 space-y-0.5 font-mono text-xs">
                {movePairs.length === 0 ? (
                  <p className="text-center py-4 text-stone-500 text-xs">
                    No moves played yet.
                  </p>
                ) : (
                  movePairs.map((pair, row) => (
                    <div
                      key={pair.number}
                      className="grid grid-cols-[2rem_1fr_1fr] items-center py-1 px-2 rounded-md odd:bg-stone-800/40"
                    >
                      <span className="text-stone-500 tabular-nums">{pair.number}.</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded",
                          row * 2 === game.history.length - 1
                            ? "bg-amber-500/20 text-amber-300 font-bold"
                            : "text-stone-300"
                        )}
                      >
                        {pair.white || ""}
                      </span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded",
                          row * 2 + 1 === game.history.length - 1
                            ? "bg-amber-500/20 text-amber-300 font-bold"
                            : "text-stone-300"
                        )}
                      >
                        {pair.black || ""}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resign confirmation dialog */}
      <AlertDialog open={resignConfirmOpen} onOpenChange={setResignConfirmOpen}>
        <AlertDialogContent className="max-w-md bg-stone-900 border-stone-800 text-stone-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Resign game?</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-400">
              Are you sure you want to concede to Stockfish? This will end the match.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-stone-800 text-stone-300 hover:bg-stone-800">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => game.resign(playerColor)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
            >
              Resign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
