import { useEffect, useMemo, useState } from "react";
import { Flag, Handshake, RotateCcw, Repeat2 } from "lucide-react";

import { ChessBoard } from "@/components/chess/chess-board";
import { GameResultDialog } from "@/components/chess/game-result-dialog";
import { PlayerClock } from "@/components/chess/player-clock";
import { useChessGame } from "@/hooks/use-chess-game";
import { useChessClock } from "@/hooks/use-chess-clock";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveList } from "@/components/chess/move-list";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_TIME_CONTROL, TIME_CONTROLS, baseMs, findTimeControl, incrementMs } from "@/lib/time-controls";

export function LocalGame() {
  const game = useChessGame();
  const { profile } = useAuth();
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [resultOpen, setResultOpen] = useState(false);
  const [timeControlId, setTimeControlId] = useState(DEFAULT_TIME_CONTROL.id);
  const timeControl = useMemo(() => findTimeControl(timeControlId), [timeControlId]);

  const clock = useChessClock({
    baseMs: baseMs(timeControl),
    incrementMs: incrementMs(timeControl),
    onFlag: (color) => game.flag(color),
  });

  useEffect(() => {
    if (game.result) setResultOpen(true);
  }, [game.result]);

  // Stop the clocks as soon as the game ends for any reason.
  useEffect(() => {
    if (game.isGameOver) clock.pause();
  }, [game.isGameOver, clock]);

  const turnLabel = game.turn === "w" ? "White" : "Black";
  const status = game.result
    ? game.result.reason
    : game.inCheck
      ? `${turnLabel} is in check`
      : `${turnLabel} to move`;


  function handleMove(from: string, to: string, promotion?: string) {
    const mover = game.turn;
    const played = game.makeMove(from, to, promotion);
    if (played) clock.switchTurn(mover);
    return played;
  }

  function newGame() {
    game.reset();
    clock.reset();
    setResultOpen(false);
  }

  const whiteName = profile?.username ?? "White";
  const topColor = orientation === "white" ? "b" : "w";
  const bottomColor = orientation === "white" ? "w" : "b";
  const nameFor = (color: "w" | "b") => (color === "w" ? whiteName : "Opponent (same device)");
  const ratingFor = (color: "w" | "b") => (color === "w" ? (profile?.rating ?? null) : null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div className="animate-rise mx-auto w-full max-w-[650px] space-y-3">
        <PlayerClock
          username={nameFor(topColor)}
          rating={ratingFor(topColor)}
          color={topColor}
          ms={clock.times[topColor]}
          active={clock.active === topColor}
        />
        <ChessBoard
          fen={game.fen}
          boardOrientation={orientation}
          onMove={handleMove}
          legalMovesFrom={game.legalMovesFrom}
          lastMove={game.lastMove ? { from: game.lastMove.from, to: game.lastMove.to } : null}
          checkSquare={game.checkSquare}
          interactive={!game.isGameOver}
          topClockMs={clock.times[topColor]}
          bottomClockMs={clock.times[bottomColor]}
          activeClock={clock.active}
        />
        <PlayerClock
          username={nameFor(bottomColor)}
          rating={ratingFor(bottomColor)}
          color={bottomColor}
          ms={clock.times[bottomColor]}
          active={clock.active === bottomColor}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant={game.isGameOver ? "secondary" : "default"} className="px-3 py-1.5 text-sm" role="status" aria-live="polite">
            {status}
          </Badge>
          <Button variant="ghost" size="sm" className="min-h-10" aria-label="Flip the board" onClick={() => setOrientation((o) => (o === "white" ? "black" : "white"))}>
            <Repeat2 className="mr-2 size-4" /> Flip board
          </Button>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start lg:space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Local game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Time control</p>
              <Select
                value={timeControlId}
                onValueChange={(value) => {
                  setTimeControlId(value);
                  game.reset();
                  setResultOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_CONTROLS.map((tc) => (
                    <SelectItem key={tc.id} value={tc.id}>
                      {tc.label} · {tc.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="min-h-11" onClick={newGame}>
                <RotateCcw className="mr-2 size-4" /> New game
              </Button>
              <Button
                variant="outline"
                className="min-h-11"
                onClick={() => {
                  game.undo();
                  clock.pause();
                }}
                disabled={game.history.length === 0}
              >
                Undo move
              </Button>
              <Button variant="outline" className="min-h-11" onClick={() => game.resign(game.turn)} disabled={game.isGameOver}>
                <Flag className="mr-2 size-4" /> Resign
              </Button>
              <Button variant="outline" className="min-h-11" onClick={game.offerDraw} disabled={game.isGameOver}>
                <Handshake className="mr-2 size-4" /> Draw
              </Button>
            </div>
          </CardContent>
        </Card>

        <MoveList san={game.history.map((m) => m.san)} />

        <Card className="bg-card/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Position (FEN)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="break-all font-mono text-xs text-muted-foreground">{game.fen}</p>
          </CardContent>
        </Card>
      </div>

      <GameResultDialog
        result={game.result}
        open={resultOpen}
        onOpenChange={setResultOpen}
        onRematch={newGame}
      />
    </div>
  );
}
