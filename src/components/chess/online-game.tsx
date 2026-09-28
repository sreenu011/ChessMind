import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move, type Square } from "chess.js";
import {
  Check,
  Clock,
  Copy,
  Crown,
  Flag,
  Handshake,
  History,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Share2,
  User,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { auth } from "@/lib/firebase";
import { formatChange } from "@/lib/rating";
import { submitRatedResult } from "@/lib/rating.functions";

import { ChessBoard } from "@/components/chess/chess-board";
import { findTimeControl, formatClock } from "@/lib/time-controls";
import { useAuth } from "@/contexts/auth-context";
import { useSettings } from "@/contexts/settings-context";
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
import { ErrorState, LoadingState } from "@/components/ui/state-panels";
import { cn } from "@/lib/utils";
import {
  cancelGame,
  finishGame,
  isWaitingExpired,
  joinGame,
  pushMove,
  setDrawOffer,
  subscribeToGame,
  touchPresence,
  type GameDoc,
  type GameResultDoc,
} from "@/lib/games";

function outcomeFrom(chess: Chess): GameResultDoc | null {
  if (!chess.isGameOver()) return null;
  if (chess.isCheckmate()) {
    const winner = chess.turn() === "w" ? "b" : "w";
    return { status: "checkmate", winner, reason: `Checkmate — ${winner === "w" ? "White" : "Black"} delivers mate.` };
  }
  if (chess.isStalemate()) return { status: "stalemate", winner: null, reason: "Stalemate — no legal moves left." };
  if (chess.isInsufficientMaterial())
    return { status: "draw", winner: null, reason: "Draw by insufficient material." };
  if (chess.isThreefoldRepetition()) return { status: "draw", winner: null, reason: "Draw by threefold repetition." };
  return { status: "draw", winner: null, reason: "Draw by the fifty-move rule." };
}

export function OnlineGame({ gameId }: { gameId: string }) {
  const { user, profile } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const submitRating = useServerFn(submitRatedResult);
  const [manualOrientation, setManualOrientation] = useState<"white" | "black" | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [resignConfirmOpen, setResignConfirmOpen] = useState(false);
  const [drawConfirmOpen, setDrawConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [game, setGame] = useState<GameDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [resultOpen, setResultOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ratingNote, setRatingNote] = useState<string | null>(null);
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

  const joinAttempted = useRef(false);
  const flagClaimed = useRef(false);
  const ratingSubmitted = useRef(false);

  // Real-time Firestore listener — no polling anywhere in this component.
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = subscribeToGame(
        gameId,
        (data, fromCache) => {
          setGame(data);
          setOffline(fromCache);
          setLoading(false);
          if (!data) setError("This game could not be found.");
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        },
      );
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
    return () => unsubscribe();
  }, [gameId]);

  // Visual countdown only; the authoritative times live in the game document.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const myColor: "w" | "b" | null = !game || !user
    ? null
    : game.white?.uid === user.uid
      ? "w"
      : game.black?.uid === user.uid
        ? "b"
        : null;

  // Seat the second player automatically when they open the invite.
  useEffect(() => {
    if (!game || !user || joinAttempted.current) return;
    if (game.status !== "waiting" || myColor || isWaitingExpired(game)) return;
    joinAttempted.current = true;
    joinGame(gameId, {
      uid: user.uid,
      username: profile?.username ?? user.displayName ?? "Challenger",
      rating: profile?.rating ?? 1200,
    }).catch((err: Error) => toast.error(err.message));
  }, [game, user, myColor, gameId, profile]);

  // Lightweight heartbeat (every 15s, never per second).
  useEffect(() => {
    if (!myColor || !game || game.status === "finished") return;
    touchPresence(gameId, myColor).catch(() => {});
    const id = window.setInterval(() => {
      touchPresence(gameId, myColor).catch(() => {});
    }, 15_000);
    return () => window.clearInterval(id);
  }, [myColor, gameId, game?.status]);

  const chess = useMemo(() => {
    if (!game) return null;
    try {
      return new Chess(game.fen);
    } catch {
      return null;
    }
  }, [game?.fen]);

  const running = !!game && game.status === "active" && !game.result;
  const elapsed = running && game?.lastMoveAt ? Math.max(0, now - game.lastMoveAt.toMillis()) : 0;
  const whiteMs = game ? Math.max(0, game.whiteTimeMs - (running && game.turn === "w" ? elapsed : 0)) : 0;
  const blackMs = game ? Math.max(0, game.blackTimeMs - (running && game.turn === "b" ? elapsed : 0)) : 0;

  // Whoever is watching claims the flag once a clock empties.
  useEffect(() => {
    if (!game || !running || flagClaimed.current || !myColor) return;
    const loser = whiteMs === 0 ? "w" : blackMs === 0 ? "b" : null;
    if (!loser) return;
    flagClaimed.current = true;
    const winner = loser === "w" ? "b" : "w";
    finishGame(gameId, {
      status: "timeout",
      winner,
      reason: `${winner === "w" ? "White" : "Black"} wins on time.`,
    }).catch(() => {});
  }, [whiteMs, blackMs, running, gameId, myColor, game]);

  useEffect(() => {
    if (game?.result) setResultOpen(true);
  }, [game?.result]);

  // Hand the finished game to the trusted rating service.
  useEffect(() => {
    if (!game?.result || game.status !== "finished" || game.rated) return;
    if (!myColor || !auth?.currentUser || ratingSubmitted.current) return;
    ratingSubmitted.current = true;
    void auth.currentUser
      .getIdToken()
      .then((idToken) => submitRating({ data: { idToken, gameId } }))
      .then((outcome) => {
        if (!outcome?.applied) {
          if (outcome?.reason) setRatingNote(outcome.reason);
          return;
        }
        const mine = outcome.changes?.[auth!.currentUser!.uid];
        if (mine) {
          setRatingNote(
            `Rating ${mine.oldRating} → ${mine.newRating} (${formatChange(mine.ratingChange)})`,
          );
        }
      })
      .catch(() => setRatingNote("Rating update failed — it will be retried next time."));
  }, [game?.result, game?.status, game?.rated, myColor, gameId, submitRating]);

  const legalMovesFrom = useCallback(
    (square: string): Move[] => {
      if (!chess) return [];
      try {
        return chess.moves({ square: square as Square, verbose: true }) as Move[];
      } catch {
        return [];
      }
    },
    [chess],
  );

  const myTurn = !!game && !!myColor && game.turn === myColor && game.status === "active" && !game.result;

  const handleMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!game || !chess || !myColor || !myTurn) return false;
      let move: Move | null = null;
      try {
        move = chess.move({ from, to, ...(promotion ? { promotion } : {}) }) as Move;
      } catch {
        return false;
      }
      if (!move) return false;

      const remaining = myColor === "w" ? whiteMs : blackMs;
      const withIncrement = remaining + game.incrementMs;
      const record = { from, to, ...(promotion ? { promotion } : {}), san: move.san };

      pushMove(
        gameId,
        record,
        {
          fen: chess.fen(),
          turn: chess.turn(),
          whiteTimeMs: myColor === "w" ? withIncrement : whiteMs,
          blackTimeMs: myColor === "b" ? withIncrement : blackMs,
          result: outcomeFrom(chess),
        },
        [...game.moves, record],
      ).catch((err: Error) => toast.error(err.message));

      // Optimistic local update; the listener confirms moments later.
      setGame((prev) =>
        prev
          ? {
              ...prev,
              fen: chess.fen(),
              turn: chess.turn(),
              moves: [...prev.moves, record],
              lastMove: { from, to },
              whiteTimeMs: myColor === "w" ? withIncrement : whiteMs,
              blackTimeMs: myColor === "b" ? withIncrement : blackMs,
            }
          : prev,
      );
      return true;
    },
    [game, chess, myColor, myTurn, whiteMs, blackMs, gameId],
  );

  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/game/${gameId}` : "";

  async function copyInvite() {
    const textToCopy = game?.inviteCode ?? inviteUrl;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      toast.success(game?.inviteCode ? "Code copied!" : "Invite link copied!");
    } catch {
      toast.error("Copy failed.");
    }
  }

  async function shareInvite() {
    try {
      await navigator.share({
        title: "ChessMind Game",
        text: game?.inviteCode ? `Join my chess game with code: ${game.inviteCode}` : "Join my chess game!",
        url: inviteUrl,
      });
    } catch {
      /* user dismissed the share sheet */
    }
  }

  const backToPlay = (
    <Button asChild variant="outline" className="min-h-11 w-full border-stone-800 text-stone-200">
      <Link to="/play">Back to play</Link>
    </Button>
  );

  if (loading) {
    return <LoadingState label="Loading game…" />;
  }

  if (error || !game) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-100">Game not found</h2>
        <p className="text-sm text-stone-400 max-w-sm">
          The invitation may be invalid or the game may have been deleted.
        </p>
        <div className="w-48">{backToPlay}</div>
      </div>
    );
  }

  if (game.status === "cancelled") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-100">Game cancelled</h2>
        <p className="text-sm text-stone-400 max-w-sm">
          The host cancelled this game before it started.
        </p>
        <div className="w-48">{backToPlay}</div>
      </div>
    );
  }

  if (!myColor && game.status !== "waiting") {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-100">Game already started</h2>
        <p className="text-sm text-stone-400 max-w-sm">
          This game already has two active players.
        </p>
        <div className="w-48">{backToPlay}</div>
      </div>
    );
  }

  if (game.status === "waiting" && isWaitingExpired(game)) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-100">Invite expired</h2>
        <p className="text-sm text-stone-400 max-w-sm">
          Waiting games expire after 30 minutes. Start a new game to play again.
        </p>
        <div className="w-48">{backToPlay}</div>
      </div>
    );
  }

  const isGameStarted = game.status === "active" || game.status === "finished";
  const defaultOrientation: "white" | "black" = myColor === "b" ? "black" : "white";
  const orientation: "white" | "black" = manualOrientation ?? defaultOrientation;
  const topColor: "w" | "b" = orientation === "white" ? "b" : "w";
  const bottomColor: "w" | "b" = orientation === "white" ? "w" : "b";
  const seat = (color: "w" | "b") => (color === "w" ? game.white : game.black);
  const msFor = (color: "w" | "b") => (color === "w" ? whiteMs : blackMs);

  const opponentColor: "w" | "b" | null = myColor ? (myColor === "w" ? "b" : "w") : null;
  const opponentSeen = opponentColor ? game.presence?.[opponentColor] : null;
  const opponentAway =
    game.status === "active" && !!opponentSeen && now - opponentSeen.toMillis() > 45_000;

  const drawOfferFromOpponent = !!myColor && !!game.drawOffer && game.drawOffer !== myColor;
  const drawOfferPending = !!myColor && game.drawOffer === myColor;
  const isHost = game.createdBy === user?.uid;

  // Move pairs for 2-column move drawer
  const movePairs: { number: number; white?: string; black?: string }[] = [];
  game.moves.forEach((m, idx) => {
    const pIdx = Math.floor(idx / 2);
    movePairs[pIdx] ??= { number: pIdx + 1 };
    if (idx % 2 === 0) {
      movePairs[pIdx]!.white = m.san;
    } else {
      movePairs[pIdx]!.black = m.san;
    }
  });

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
          <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors shadow-xs">
            <Crown className="size-4.5" />
          </div>
          <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-stone-100 uppercase">
            ChessMind
          </span>
        </Link>

        {/* CENTER: Match Status */}
        <div className="hidden min-[440px]:flex items-center gap-1.5 sm:gap-2 font-mono">
          <span className="font-medium text-xs sm:text-sm text-stone-200">
            {isGameStarted ? "Live Match" : "Match Room"}
          </span>
          <span className="text-stone-600">·</span>
          <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded bg-stone-800/80 border border-stone-700/60 text-emerald-400 font-semibold uppercase tracking-wider">
            {findTimeControl(game.timeControlId).label}
          </span>
          <div className="hidden sm:flex items-center gap-1 pl-1 text-[11px] text-stone-400">
            {offline ? (
              <span className="text-rose-400 flex items-center gap-1"><WifiOff className="size-3" /> Reconnecting</span>
            ) : opponentAway ? (
              <span className="text-amber-400 flex items-center gap-1"><Wifi className="size-3" /> Opponent Away</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1"><Wifi className="size-3" /> Live</span>
            )}
          </div>
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
                boardMode === "3d" ? "bg-emerald-500/20 text-emerald-400 shadow-xs" : "text-stone-400 hover:text-stone-200"
              )}
            >
              3D
            </button>
            <button
              type="button"
              onClick={() => setBoardMode("2d")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-all font-semibold cursor-pointer",
                boardMode === "2d" ? "bg-emerald-500/20 text-emerald-400 shadow-xs" : "text-stone-400 hover:text-stone-200"
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
          {/* TOP PLAYER BAR (Opponent) */}
          <div className="w-full flex items-center justify-between py-1 px-1.5 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-7 rounded-full bg-stone-800/80 border border-stone-700/60 flex items-center justify-center text-stone-300 shrink-0">
                <User className="size-4" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base text-stone-100 tracking-tight truncate">
                  {seat(topColor)?.username ?? "Waiting for opponent…"}
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase">
                  {topColor === "w" ? "White" : "Black"}
                </span>
              </div>
              {running && game.turn === topColor && (
                <span className="text-[10px] sm:text-[11px] font-mono text-amber-400 font-semibold tracking-wide flex items-center gap-1.5 animate-pulse pl-1">
                  <span className="size-1.5 rounded-full bg-amber-400" />
                  THINKING
                </span>
              )}
            </div>

            {/* Clock: Active bright, Inactive muted */}
            <div
              role="timer"
              className={cn(
                "font-digital text-2xl sm:text-3xl tabular-nums font-bold tracking-wider transition-colors",
                running && game.turn === topColor
                  ? msFor(topColor) <= 20000
                    ? "text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    : "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                  : "text-stone-500 opacity-75"
              )}
            >
              {formatClock(msFor(topColor))}
            </div>
          </div>

          {/* CHESSBOARD (Centerpiece) */}
          <div className="w-full aspect-square relative rounded-2xl overflow-hidden shadow-2xl">
            <ChessBoard
              fen={game.fen}
              boardOrientation={orientation}
              onMove={handleMove}
              legalMovesFrom={legalMovesFrom}
              lastMove={game.lastMove}
              checkSquare={null}
              interactive={myTurn}
              topClockMs={msFor(topColor)}
              bottomClockMs={msFor(bottomColor)}
              activeClock={running ? game.turn : null}
              isExpanded={isGameStarted}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              boardMode={boardMode}
              onBoardModeChange={setBoardMode}
              showEmbeddedControls={false}
            />

            {/* WAITING FOR OPPONENT OVERLAY */}
            <AnimatePresence>
              {!isGameStarted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md rounded-2xl"
                >
                  <div className="w-full max-w-sm bg-stone-900/95 border border-stone-800 rounded-xl p-6 shadow-2xl text-center space-y-4">
                    <span className="mx-auto grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Crown className="size-6" />
                    </span>
                    <div className="space-y-1">
                      <h2 className="font-display font-bold text-lg text-stone-100">Waiting for Opponent</h2>
                      <p className="text-xs text-stone-400">
                        {game.inviteCode ? "Share this 6-digit code with your friend:" : "Share this link with your friend:"}
                      </p>
                    </div>

                    {game.inviteCode ? (
                      <div className="rounded-xl border border-emerald-500/30 bg-stone-950 p-3 shadow-inner">
                        <span className="font-mono text-3xl font-extrabold tracking-[0.25em] text-emerald-400">
                          {game.inviteCode}
                        </span>
                      </div>
                    ) : (
                      <p className="break-all rounded-lg border border-stone-800 bg-stone-950 px-3 py-2 font-mono text-xs text-stone-300">
                        {inviteUrl}
                      </p>
                    )}

                    <div className="flex flex-col gap-2 pt-1">
                      <Button
                        onClick={copyInvite}
                        className="h-10 w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-stone-950 cursor-pointer text-xs uppercase tracking-wider"
                      >
                        {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
                        {copied ? "Copied to clipboard!" : game.inviteCode ? "Copy 6-Digit Code" : "Copy Invite Link"}
                      </Button>
                      {canShare && (
                        <Button
                          variant="outline"
                          onClick={shareInvite}
                          className="h-9 w-full border-stone-800 text-stone-300 text-xs"
                        >
                          <Share2 className="mr-2 size-4" /> Share with Friend
                        </Button>
                      )}
                    </div>

                    <p className="flex items-center justify-center gap-2 text-xs text-stone-400 font-mono pt-1">
                      <Loader2 className="size-3.5 animate-spin text-emerald-400" />
                      Waiting for them to join…
                    </p>

                    {isHost && (
                      <button
                        type="button"
                        onClick={() => setCancelModalOpen(true)}
                        className="text-xs text-stone-500 hover:text-stone-300 transition-colors pt-1 cursor-pointer"
                      >
                        Cancel match
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FLOATING DRAW OFFER BANNER */}
            <AnimatePresence>
              {drawOfferFromOpponent && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-4 inset-x-4 z-40 bg-stone-900/95 border border-amber-500/40 rounded-xl p-3 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md"
                >
                  <p className="text-xs font-medium text-stone-200">
                    Your opponent offers a draw.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        finishGame(gameId, { status: "draw", winner: null, reason: "Draw agreed." }).catch((err: Error) =>
                          toast.error(err.message),
                        )
                      }
                      className="h-8 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs px-3"
                    >
                      <Check className="mr-1 size-3.5" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDrawOffer(gameId, null).catch((err: Error) => toast.error(err.message))}
                      className="h-8 border-stone-700 text-stone-300 hover:text-white text-xs px-3"
                    >
                      <X className="mr-1 size-3.5" /> Decline
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GAME OVER OVERLAY (Clean centered overlay over board) */}
            <AnimatePresence>
              {game.result && resultOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs rounded-2xl pointer-events-auto"
                >
                  <div className="w-full max-w-xs bg-stone-900/95 border border-emerald-500/30 rounded-xl p-5 text-center shadow-2xl space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                      {game.result.status.toUpperCase()}
                    </span>
                    <h3 className="font-display text-2xl font-extrabold text-stone-100">
                      {game.result.winner === myColor
                        ? "You Win!"
                        : game.result.winner
                          ? `${seat(game.result.winner)?.username ?? "Opponent"} Wins`
                          : "Draw"}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono">
                      {game.result.reason}
                    </p>
                    {ratingNote && (
                      <p className="text-xs text-amber-400 font-mono pt-1">
                        {ratingNote}
                      </p>
                    )}
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
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs h-8"
                      >
                        <Link to="/play">Play Again</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTTOM PLAYER BAR (You) */}
          <div className="w-full flex items-center justify-between py-1 px-1.5 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-7 rounded-full bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                <User className="size-4" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm sm:text-base text-stone-100 tracking-tight truncate">
                  {seat(bottomColor)?.username ?? profile?.username ?? "You"}
                </span>
                <span className="text-[11px] font-mono text-stone-500 uppercase">
                  {bottomColor === "w" ? "White" : "Black"}
                </span>
              </div>
              {running && game.turn === bottomColor && (
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
                running && game.turn === bottomColor
                  ? msFor(bottomColor) <= 20000
                    ? "text-rose-500 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                    : "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  : "text-stone-500 opacity-75"
              )}
            >
              {formatClock(msFor(bottomColor))}
            </div>
          </div>
        </div>
      </main>

      {/* COMPACT BOTTOM ACTION BAR: [ RESIGN ] [ DRAW ] [ FLIP ] [ MOVES ] */}
      <footer className="w-full flex items-center justify-center gap-2 sm:gap-3 py-2 z-20 shrink-0">
        <button
          type="button"
          disabled={!myColor || game.status !== "active" || !!game.result}
          onClick={() => {
            if (!myColor) return;
            if (settings.confirmBeforeResign) {
              setResignConfirmOpen(true);
            } else {
              finishGame(gameId, {
                status: "resigned",
                winner: myColor === "w" ? "b" : "w",
                reason: `${myColor === "w" ? "White" : "Black"} resigned.`,
              }).catch((err: Error) => toast.error(err.message));
            }
          }}
          className="px-3.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900/80 hover:bg-rose-950/40 hover:border-rose-800/60 text-stone-300 hover:text-rose-300 text-xs font-mono font-semibold tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
        >
          <Flag className="size-3.5" />
          <span>Resign</span>
        </button>

        <button
          type="button"
          disabled={!myColor || game.status !== "active" || !!game.result || drawOfferPending}
          onClick={() => {
            if (!myColor) return;
            if (settings.confirmBeforeDraw) {
              setDrawConfirmOpen(true);
            } else {
              setDrawOffer(gameId, myColor).catch((err: Error) => toast.error(err.message));
            }
          }}
          className="px-3.5 py-1.5 rounded-lg border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-xs font-mono font-semibold tracking-wider uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
        >
          <Handshake className="size-3.5" />
          <span>{drawOfferPending ? "Offered" : "Draw"}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const currentOr = manualOrientation ?? (myColor === "b" ? "black" : "white");
            setManualOrientation(currentOr === "white" ? "black" : "white");
          }}
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
              ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-400"
              : "border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100"
          )}
        >
          <History className="size-3.5" />
          <span>Moves {game.moves.length > 0 ? `(${game.moves.length})` : ""}</span>
        </button>

        {game.result && !resultOpen && (
          <button
            type="button"
            onClick={() => navigate({ to: "/play" })}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs font-mono tracking-wider uppercase transition-all cursor-pointer shadow-sm"
          >
            Play Again
          </button>
        )}
      </footer>

      {/* SLIM MOVES DRAWER */}
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
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <History className="size-3.5" />
                  Moves History ({game.moves.length})
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
                          row * 2 === game.moves.length - 1
                            ? "bg-emerald-500/20 text-emerald-300 font-bold"
                            : "text-stone-300"
                        )}
                      >
                        {pair.white || ""}
                      </span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded",
                          row * 2 + 1 === game.moves.length - 1
                            ? "bg-emerald-500/20 text-emerald-300 font-bold"
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

      {/* Cancel game confirmation dialog */}
      <AlertDialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <AlertDialogContent className="max-w-md bg-stone-900 border-stone-800 text-stone-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Game?</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-400">
              Are you sure you want to cancel this game? Your invite code will no longer be usable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {cancelError && <p className="text-xs text-rose-500 text-center">{cancelError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelling}
              className="border-stone-800 text-stone-300 hover:bg-stone-800"
            >
              Keep Game
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              onClick={async (e) => {
                e.preventDefault();
                if (cancelling) return;
                setCancelling(true);
                setCancelError(null);
                try {
                  await cancelGame(gameId);
                  toast.success("Game cancelled.");
                  setCancelModalOpen(false);
                  navigate({ to: "/play" });
                } catch {
                  setCancelError("Unable to cancel the game. Please try again.");
                  setCancelling(false);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resign confirmation dialog */}
      <AlertDialog open={resignConfirmOpen} onOpenChange={setResignConfirmOpen}>
        <AlertDialogContent className="max-w-md bg-stone-900 border-stone-800 text-stone-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Resign game?</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-400">
              Are you sure you want to resign this game? This will count as a loss.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-stone-800 text-stone-300 hover:bg-stone-800">Keep Playing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setResignConfirmOpen(false);
                if (myColor) {
                  finishGame(gameId, {
                    status: "resigned",
                    winner: myColor === "w" ? "b" : "w",
                    reason: `${myColor === "w" ? "White" : "Black"} resigned.`,
                  }).catch((err: Error) => toast.error(err.message));
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Resign Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Draw confirmation dialog */}
      <AlertDialog open={drawConfirmOpen} onOpenChange={setDrawConfirmOpen}>
        <AlertDialogContent className="max-w-md bg-stone-900 border-stone-800 text-stone-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Offer a draw?</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-400">
              Are you sure you want to offer a draw to your opponent?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-stone-800 text-stone-300 hover:bg-stone-800">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setDrawConfirmOpen(false);
                if (myColor) {
                  setDrawOffer(gameId, myColor).catch((err: Error) => toast.error(err.message));
                }
              }}
            >
              Send Draw Offer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
