import { useCallback, useEffect, useRef, useState } from "react";
import { Chess, type Move } from "chess.js";

import { ChessBoard } from "@/components/chess/chess-board";
import type { LearningExercise } from "@/lib/learn/interactive-types";

export type BoardExerciseStatus = "idle" | "wrong" | "mistake" | "solved";

const SAFE_FALLBACK_FEN = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";

function initChessGame(fenStr: string): Chess {
  try {
    return new Chess(fenStr);
  } catch (err) {
    console.error(`[ExerciseBoard] Invalid FEN "${fenStr}", falling back to safe position:`, err);
    return new Chess(SAFE_FALLBACK_FEN);
  }
}

export function ExerciseBoard({
  exercise,
  onSolved,
  onWrong,
  onMistake,
  resetKey,
}: {
  exercise: LearningExercise;
  onSolved: () => void;
  onWrong: (playedSan: string) => void;
  onMistake?: (playedSan: string) => void;
  resetKey?: string | number;
}) {
  const fen = exercise.position.fen;
  const orientation = exercise.position.orientation ?? "white";
  const expectedMoves = exercise.expectedMoves ?? [];
  const targetSquare = exercise.targetSquare ?? exercise.position.targetSquare;
  const targetSquares = exercise.targetSquares ?? (targetSquare ? [targetSquare] : []);

  const isSquareClickExercise =
    exercise.type === "find-square" ||
    exercise.type === "identify-square" ||
    exercise.type === "board-challenge";

  const gameRef = useRef(initChessGame(fen));
  const [position, setPosition] = useState(fen);
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<BoardExerciseStatus>("idle");
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [clickedSquare, setClickedSquare] = useState<string | null>(null);

  const reset = useCallback(() => {
    gameRef.current = initChessGame(fen);
    setPosition(fen);
    setMoveIndex(0);
    setStatus("idle");
    setLastMove(null);
    setClickedSquare(null);
  }, [fen]);

  useEffect(() => {
    reset();
  }, [reset, resetKey]);

  const handleSquareClickRaw = useCallback(
    (square: string) => {
      if (status === "solved") return;
      setClickedSquare(square);
      const isTarget = targetSquares.includes(square);
      if (isTarget) {
        setStatus("solved");
        onSolved();
      } else {
        setStatus("wrong");
        onWrong(square);
      }
    },
    [onSolved, onWrong, status, targetSquares],
  );

  const legalMovesFrom = useCallback(
    (square: string): Move[] => {
      if (status === "solved" || isSquareClickExercise) return [];
      try {
        return gameRef.current.moves({ square: square as never, verbose: true }) as Move[];
      } catch {
        return [];
      }
    },
    [isSquareClickExercise, status],
  );

  const onMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (status === "solved" || isSquareClickExercise) return false;
      const expectedSan = expectedMoves[moveIndex];
      const game = gameRef.current;

      let played: Move | null = null;
      try {
        played = game.move({ from, to, promotion: promotion ?? "q" }) as Move;
      } catch {
        return false;
      }
      if (!played) return false;

      // Check if player played the explicit "mistake" move in avoid-mistake exercise
      if (exercise.type === "avoid-mistake" && exercise.mistakeMoveSan && played.san === exercise.mistakeMoveSan) {
        game.undo();
        setStatus("mistake");
        onMistake?.(played.san);
        return false;
      }

      // Check if move matches expected SAN
      if (expectedSan && played.san !== expectedSan) {
        game.undo();
        setStatus("wrong");
        onWrong?.(played.san);
        return false;
      }

      setLastMove({ from: played.from, to: played.to });
      setPosition(game.fen());
      setStatus("idle");

      // Check for opponent reply if sequence has more moves
      const nextOpponentMove = expectedMoves[moveIndex + 1];
      if (nextOpponentMove) {
        window.setTimeout(() => {
          try {
            const replyMove = gameRef.current.move(nextOpponentMove) as Move;
            setLastMove({ from: replyMove.from, to: replyMove.to });
            setPosition(gameRef.current.fen());
          } catch {
            /* ignore invalid sequence fallback */
          }
          setMoveIndex(moveIndex + 2);
          if (!expectedMoves[moveIndex + 2]) {
            setStatus("solved");
            onSolved();
          }
        }, 500);
        setMoveIndex(moveIndex + 1);
        return true;
      }

      setMoveIndex(moveIndex + 1);
      setStatus("solved");
      onSolved();
      return true;
    },
    [exercise.mistakeMoveSan, exercise.type, expectedMoves, isSquareClickExercise, moveIndex, onMistake, onSolved, onWrong, status],
  );

  const checkSquare = (() => {
    const game = gameRef.current;
    try {
      if (!game.inCheck()) return null;
      const turn = game.turn();
      for (const row of game.board()) {
        for (const square of row) {
          if (square && square.type === "k" && square.color === turn) return square.square;
        }
      }
    } catch {
      return null;
    }
    return null;
  })();

  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (exercise.position.highlightSquares) {
    for (const sq of exercise.position.highlightSquares) {
      customSquareStyles[sq] = {
        backgroundColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
      };
    }
  }
  if (clickedSquare) {
    const isTarget = targetSquares.includes(clickedSquare);
    customSquareStyles[clickedSquare] = {
      backgroundColor: isTarget
        ? "color-mix(in oklab, var(--emerald-500, #10b981) 60%, transparent)"
        : "color-mix(in oklab, var(--destructive) 60%, transparent)",
    };
  }

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
        onSquareClickRaw={isSquareClickExercise ? handleSquareClickRaw : undefined}
        customSquareStyles={customSquareStyles}
      />
    </div>
  );
}
