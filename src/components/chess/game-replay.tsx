import { useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Pause, Play, Shield, Swords } from "lucide-react";

import { ChessBoard } from "@/components/chess/chess-board";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { formatResultReason } from "@/lib/game-history";
import { STARTING_FEN, fetchGame, type GameDoc } from "@/lib/games";
import { formatTimeControlLabel } from "@/lib/time-controls";
import { cn } from "@/lib/utils";

type Frame = { fen: string; san: string; from: string; to: string };

function buildFrames(game: GameDoc): Frame[] {
  const chess = new Chess(STARTING_FEN);
  const frames: Frame[] = [];
  for (const move of game.moves ?? []) {
    try {
      const played = chess.move({
        from: move.from,
        to: move.to,
        ...(move.promotion ? { promotion: move.promotion } : {}),
      });
      if (!played) break;
      frames.push({ fen: chess.fen(), san: move.san || played.san, from: played.from, to: played.to });
    } catch {
      break;
    }
  }
  return frames;
}

export function GameReplay({ gameId }: { gameId: string }) {
  const { user } = useAuth();
  const [game, setGame] = useState<GameDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ply, setPly] = useState(0);
  const [playing, setPlaying] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const activeMoveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchGame(gameId)
      .then((doc) => {
        if (cancelled) return;
        if (!doc) setError("This game could not be found.");
        else if (doc.status !== "finished") setError("This game is still in progress — replay is available once it finishes.");
        setGame(doc);
      })
      .catch(() => !cancelled && setError("You do not have access to this game."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  const frames = useMemo(() => (game ? buildFrames(game) : []), [game]);
  const total = frames.length;

  useEffect(() => {
    if (game && total > 0) {
      setPly(total);
    }
  }, [game, total]);

  useEffect(() => {
    if (!playing) return;
    if (ply >= total) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setPly((p) => Math.min(total, p + 1)), 900);
    return () => clearTimeout(id);
  }, [playing, ply, total]);

  // Scroll active move into view
  useEffect(() => {
    if (activeMoveRef.current && listRef.current) {
      activeMoveRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [ply]);

  const current = ply > 0 ? frames[ply - 1] : null;
  const fen = current?.fen ?? STARTING_FEN;
  const lastMove = current ? { from: current.from, to: current.to } : null;

  if (loading) return <p className="text-muted-foreground p-8 text-center">Loading game replay…</p>;
  if (!game) return <p className="text-muted-foreground p-8 text-center">{error ?? "This game could not be found."}</p>;

  const tcLabel = formatTimeControlLabel(game.timeControlId, game.baseMs, game.incrementMs);
  const isUnratedControl =
    game.rated === false ||
    game.timeControlId === "training" ||
    game.timeControlId === "unrated" ||
    game.id.startsWith("training_") ||
    game.id.startsWith("practice_") ||
    game.id.startsWith("computer_");
  const isRated = !isUnratedControl && (game.rated === true || game.timeControlId !== "training");

  const isUserBlack = user?.uid ? game.black?.uid === user.uid && game.white?.uid !== user.uid : false;
  const boardOrientation: "white" | "black" = isUserBlack ? "black" : "white";

  const topPlayer = boardOrientation === "black" ? game.white : game.black;
  const bottomPlayer = boardOrientation === "black" ? game.black : game.white;
  const topColorLabel = boardOrientation === "black" ? "White ♔" : "Black ♚";
  const bottomColorLabel = boardOrientation === "black" ? "Black ♚" : "White ♔";

  let userOutcome: "win" | "loss" | "draw" = "draw";
  if (game.result?.winner) {
    const userColor: "w" | "b" = user?.uid && game.black?.uid === user.uid ? "b" : "w";
    userOutcome = game.result.winner === userColor ? "win" : "loss";
  }
  const resultReasonStr = formatResultReason(game.result, userOutcome);

  const pairs: { no: number; white?: Frame; black?: Frame }[] = [];
  frames.forEach((f, i) => {
    const no = Math.floor(i / 2) + 1;
    if (i % 2 === 0) pairs.push({ no, white: f });
    else pairs[pairs.length - 1]!.black = f;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="mx-auto w-full max-w-[650px] space-y-4">
        {/* TOP PLAYER CARD */}
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/70 px-4 py-3 shadow-xs">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border/60">
              <AvatarFallback className="text-xs font-bold">
                {(topPlayer?.username ?? "P2").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{topPlayer?.username ?? "Opponent"}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {topColorLabel} · {topPlayer?.rating ? `Rating: ${topPlayer.rating}` : "Rating unavailable"}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {tcLabel}
          </Badge>
        </div>

        {/* CHESSBOARD (READ-ONLY FOR REVIEW) */}
        <ChessBoard
          fen={fen}
          boardOrientation={boardOrientation}
          interactive={false}
          onMove={() => false}
          legalMovesFrom={() => []}
          lastMove={lastMove}
        />

        {/* BOTTOM PLAYER CARD */}
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/70 px-4 py-3 shadow-xs">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-border/60">
              <AvatarFallback className="text-xs font-bold">
                {(bottomPlayer?.username ?? "P1").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{bottomPlayer?.username ?? "Player"}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {bottomColorLabel} · {bottomPlayer?.rating ? `Rating: ${bottomPlayer.rating}` : "Rating unavailable"}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Move {ply} of {total}
          </span>
        </div>

        {/* REPLAY CONTROL BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="First move"
              disabled={ply === 0}
              onClick={() => {
                setPlaying(false);
                setPly(0);
              }}
            >
              <ChevronFirst className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous move"
              disabled={ply === 0}
              onClick={() => {
                setPlaying(false);
                setPly((p) => Math.max(0, p - 1));
              }}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              onClick={() => setPlaying((p) => !p)}
              disabled={total === 0}
              className="min-w-[100px] font-semibold"
            >
              {playing ? <Pause className="mr-2 size-4" /> : <Play className="mr-2 size-4" />}
              {playing ? "Pause" : "Play"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next move"
              disabled={ply >= total}
              onClick={() => {
                setPlaying(false);
                setPly((p) => Math.min(total, p + 1));
              }}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Last move"
              disabled={ply >= total}
              onClick={() => {
                setPlaying(false);
                setPly(total);
              }}
            >
              <ChevronLast className="size-4" />
            </Button>
          </div>

          <Badge variant="secondary" className="font-mono text-xs">
            Review Mode (Read-Only)
          </Badge>
        </div>
      </div>

      {/* RIGHT SIDEBAR: RESULT & MOVES LIST */}
      <div className="space-y-4">
        {/* GAME RESULT SUMMARY CARD */}
        <Card className="border-border/70 bg-card/70">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Game Result</CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs uppercase font-bold px-2 py-0.5",
                  isRated
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-slate-500/30 bg-slate-500/10 text-slate-400",
                )}
              >
                {isRated ? "Rated" : "Training"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-lg font-bold tracking-tight text-foreground">{resultReasonStr}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5 font-mono">
                Status: {game.result?.status ?? "finished"}
              </p>
            </div>

            <div className="border-t border-border/40 pt-3 text-xs text-muted-foreground space-y-1 font-mono">
              <p>Time Control: {tcLabel}</p>
              <p>Total Moves: {total}</p>
              <p className="text-[11px] text-muted-foreground/80 pt-1">
                Finished games are immutable. No moves can be submitted during replay.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* MOVE HISTORY LIST */}
        <Card className="border-border/70 bg-card/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span>Move History</span>
              <span className="text-xs font-mono font-normal text-muted-foreground">{total} Plies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={listRef} className="max-h-[380px] space-y-1 overflow-y-auto pr-1 font-mono text-sm">
              {pairs.length === 0 ? (
                <p className="font-sans text-xs text-muted-foreground">No moves recorded for this game.</p>
              ) : (
                pairs.map((pair, index) => {
                  const whitePly = index * 2 + 1;
                  const blackPly = index * 2 + 2;
                  const isWhiteActive = ply === whitePly;
                  const isBlackActive = ply === blackPly;

                  return (
                    <div key={pair.no} className="flex items-center gap-2 py-0.5 text-xs">
                      <span className="w-7 text-right text-muted-foreground font-semibold">{pair.no}.</span>
                      {pair.white ? (
                        <button
                          ref={isWhiteActive ? activeMoveRef : null}
                          type="button"
                          className={cn(
                            "rounded px-2 py-1 transition-colors hover:bg-muted font-mono",
                            isWhiteActive ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-foreground",
                          )}
                          onClick={() => {
                            setPlaying(false);
                            setPly(whitePly);
                          }}
                        >
                          {pair.white.san}
                        </button>
                      ) : null}
                      {pair.black ? (
                        <button
                          ref={isBlackActive ? activeMoveRef : null}
                          type="button"
                          className={cn(
                            "rounded px-2 py-1 transition-colors hover:bg-muted font-mono",
                            isBlackActive ? "bg-primary text-primary-foreground font-bold shadow-xs" : "text-foreground",
                          )}
                          onClick={() => {
                            setPlaying(false);
                            setPly(blackPly);
                          }}
                        >
                          {pair.black.san}
                        </button>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
