import { useCallback, useMemo, useRef, useState } from "react";
import { Chess, type Color, type Move, type Square } from "chess.js";

export type GameStatus = "playing" | "checkmate" | "stalemate" | "draw" | "resigned" | "timeout";

export type GameResult = {
  status: Exclude<GameStatus, "playing">;
  /** Winning colour, or null for a drawn game. */
  winner: Color | null;
  reason: string;
};

export type ChessGameState = {
  fen: string;
  turn: Color;
  history: Move[];
  lastMove: Move | null;
  inCheck: boolean;
  isGameOver: boolean;
  result: GameResult | null;
};

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function drawReason(game: Chess): string {
  if (game.isStalemate()) return "Stalemate — no legal moves left.";
  if (game.isInsufficientMaterial()) return "Draw by insufficient material.";
  if (game.isThreefoldRepetition()) return "Draw by threefold repetition.";
  return "Draw by the fifty-move rule.";
}

function readResult(game: Chess): GameResult | null {
  if (!game.isGameOver()) return null;
  if (game.isCheckmate()) {
    const winner: Color = game.turn() === "w" ? "b" : "w";
    return {
      status: "checkmate",
      winner,
      reason: `Checkmate — ${winner === "w" ? "White" : "Black"} delivers mate.`,
    };
  }
  if (game.isStalemate()) {
    return { status: "stalemate", winner: null, reason: drawReason(game) };
  }
  return { status: "draw", winner: null, reason: drawReason(game) };
}

function snapshot(game: Chess, resigned: GameResult | null): ChessGameState {
  const history = game.history({ verbose: true }) as Move[];
  return {
    fen: game.fen(),
    turn: game.turn(),
    history,
    lastMove: history.length ? history[history.length - 1]! : null,
    inCheck: game.inCheck(),
    isGameOver: resigned !== null || game.isGameOver(),
    result: resigned ?? readResult(game),
  };
}

export function useChessGame(initialFen: string = STARTING_FEN) {
  const gameRef = useRef(new Chess(initialFen));
  const [resigned, setResigned] = useState<GameResult | null>(null);
  const [state, setState] = useState<ChessGameState>(() => snapshot(gameRef.current, null));

  const sync = useCallback((resignation: GameResult | null) => {
    setState(snapshot(gameRef.current, resignation));
  }, []);

  /** Attempts a move; chess.js validates legality. Returns true when played. */
  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (state.isGameOver) return false;
      try {
        const move = gameRef.current.move({
          from,
          to,
          ...(promotion ? { promotion } : {}),
        });
        if (!move) return false;
      } catch {
        return false;
      }
      sync(null);
      return true;
    },
    [state.isGameOver, sync],
  );

  const legalMovesFrom = useCallback(
    (square: string): Move[] => {
      if (state.isGameOver) return [];
      try {
        return gameRef.current.moves({ square: square as Square, verbose: true }) as Move[];
      } catch {
        return [];
      }
    },
    [state.isGameOver, state.fen],
  );

  const reset = useCallback(() => {
    gameRef.current = new Chess(initialFen);
    setResigned(null);
    setState(snapshot(gameRef.current, null));
  }, [initialFen]);

  const undo = useCallback(() => {
    if (resigned) setResigned(null);
    gameRef.current.undo();
    sync(null);
  }, [resigned, sync]);

  const resign = useCallback(
    (color: Color) => {
      if (state.isGameOver) return;
      const winner: Color = color === "w" ? "b" : "w";
      const result: GameResult = {
        status: "resigned",
        winner,
        reason: `${color === "w" ? "White" : "Black"} resigned.`,
      };
      setResigned(result);
      sync(result);
    },
    [state.isGameOver, sync],
  );

  const offerDraw = useCallback(() => {
    if (state.isGameOver) return;
    const result: GameResult = { status: "draw", winner: null, reason: "Draw agreed." };
    setResigned(result);
    sync(result);
  }, [state.isGameOver, sync]);

  /** A player's clock hit zero — the opponent wins on time. */
  const flag = useCallback(
    (color: Color) => {
      if (state.isGameOver) return;
      const winner: Color = color === "w" ? "b" : "w";
      const result: GameResult = {
        status: "timeout",
        winner,
        reason: `${winner === "w" ? "White" : "Black"} wins on time.`,
      };
      setResigned(result);
      sync(result);
    },
    [state.isGameOver, sync],
  );

  /** Square of the king that is currently in check, if any. */
  const checkSquare = useMemo(() => {
    if (!state.inCheck) return null;
    for (const row of gameRef.current.board()) {
      for (const cell of row) {
        if (cell && cell.type === "k" && cell.color === state.turn) return cell.square as string;
      }
    }
    return null;
  }, [state.inCheck, state.turn, state.fen]);

  return { ...state, checkSquare, makeMove, legalMovesFrom, reset, undo, resign, offerDraw, flag };
}
