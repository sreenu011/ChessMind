import { useCallback, useEffect, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";

import { ChessBoard } from "@/components/chess/chess-board";

export type LearningBoardStatus = "idle" | "wrong" | "solved";

export type LearningChessBoardProps = {
  fen: string;
  orientation?: "white" | "black";
  /** SAN moves, alternating: learner, opponent, learner, ... */
  solution: string[];
  onSolved?: () => void;
  onWrong?: () => void;
  onProgress?: (playedSan: string) => void;
  resetKey?: string | number;
};

/**
 * A guided board: the learner may only play the move the lesson asks for.
 * Everything is validated by the existing chess.js integration — no second
 * engine, and the real game code is untouched.
 */
export function LearningChessBoard({
  fen,
  orientation = "white",
  solution,
  onSolved,
  onWrong,
  onProgress,
  resetKey,
}: LearningChessBoardProps) {
  const gameRef = useRef(new Chess(fen));
  const [position, setPosition] = useState(fen);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<LearningBoardStatus>("idle");
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const reset = useCallback(() => {
    gameRef.current = new Chess(fen);
    setPosition(fen);
    setIndex(0);
    setStatus("idle");
    setLastMove(null);
  }, [fen]);

  useEffect(() => {
    reset();
  }, [reset, resetKey]);

  const legalMovesFrom = useCallback(
    (square: string): Move[] => {
      if (status === "solved") return [];
      try {
        return gameRef.current.moves({ square: square as never, verbose: true }) as Move[];
      } catch {
        return [];
      }
    },
    [status],
  );

  const onMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (status === "solved") return false;
      const expected = solution[index];
      if (!expected) return false;
      const game = gameRef.current;
      let played: Move | null = null;
      try {
        played = game.move({ from, to, promotion: promotion ?? "q" }) as Move;
      } catch {
        return false;
      }
      if (!played) return false;

      if (played.san !== expected) {
        game.undo();
        setStatus("wrong");
        onWrong?.();
        return false;
      }

      setLastMove({ from: played.from, to: played.to });
      setPosition(game.fen());
      setStatus("idle");
      onProgress?.(played.san);

      const reply = solution[index + 1];
      if (reply) {
        window.setTimeout(() => {
          try {
            const replyMove = gameRef.current.move(reply) as Move;
            setLastMove({ from: replyMove.from, to: replyMove.to });
            setPosition(gameRef.current.fen());
          } catch {
            /* content is validated at build time; ignore */
          }
          setIndex(index + 2);
          if (!solution[index + 2]) {
            setStatus("solved");
            onSolved?.();
          }
        }, 550);
        setIndex(index + 1);
        return true;
      }

      setIndex(index + 1);
      setStatus("solved");
      onSolved?.();
      return true;
    },
    [index, onProgress, onSolved, onWrong, solution, status],
  );

  const checkSquare = (() => {
    const game = gameRef.current;
    if (!game.inCheck()) return null;
    const turn = game.turn();
    for (const row of game.board()) {
      for (const square of row) {
        if (square && square.type === "k" && square.color === turn) return square.square;
      }
    }
    return null;
  })();

  return (
    <div className="space-y-3">
      <ChessBoard
        fen={position}
        boardOrientation={orientation}
        onMove={onMove}
        legalMovesFrom={legalMovesFrom}
        lastMove={lastMove}
        checkSquare={checkSquare}
        interactive={status !== "solved"}
      />
      <div className="sr-only" role="status" aria-live="polite">
        {status === "solved" ? "Correct" : status === "wrong" ? "Try again" : ""}
      </div>
      <input type="hidden" data-learning-status={status} />
      <button type="button" className="sr-only" onClick={reset}>
        Reset position
      </button>
    </div>
  );
}
