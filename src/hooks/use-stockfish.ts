import { useCallback, useEffect, useRef, useState } from "react";

export type EngineMove = { from: string; to: string; promotion?: string };

type PendingResolve = (move: EngineMove | null) => void;

/**
 * Talks UCI to a Stockfish web worker served from /engine/stockfish.js.
 * The engine only ever suggests a move — chess.js remains the rules authority.
 */
export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<PendingResolve | null>(null);
  const [ready, setReady] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let worker: Worker;
    try {
      worker = new Worker("/engine/stockfish.js");
    } catch {
      setError("The chess engine could not be started in this browser.");
      return;
    }
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent) => {
      const line = typeof event.data === "string" ? event.data : String(event.data?.data ?? "");
      if (line.startsWith("uciok")) {
        worker.postMessage("isready");
        return;
      }
      if (line.startsWith("readyok")) {
        setReady(true);
        return;
      }
      if (line.startsWith("bestmove")) {
        const token = line.split(/\s+/)[1] ?? "";
        const resolve = pendingRef.current;
        pendingRef.current = null;
        setThinking(false);
        if (!resolve) return;
        if (!token || token === "(none)") {
          resolve(null);
          return;
        }
        const from = token.slice(0, 2);
        const to = token.slice(2, 4);
        const promotion = token.length > 4 ? token.slice(4, 5) : undefined;
        resolve(promotion ? { from, to, promotion } : { from, to });
      }
    };

    worker.onerror = () => setError("The chess engine failed to load.");
    worker.postMessage("uci");

    return () => {
      pendingRef.current?.(null);
      pendingRef.current = null;
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const setSkill = useCallback((skill: number) => {
    workerRef.current?.postMessage(`setoption name Skill Level value ${skill}`);
  }, []);

  const newGame = useCallback(() => {
    pendingRef.current?.(null);
    pendingRef.current = null;
    setThinking(false);
    workerRef.current?.postMessage("stop");
    workerRef.current?.postMessage("ucinewgame");
    workerRef.current?.postMessage("isready");
  }, []);

  const stop = useCallback(() => {
    pendingRef.current?.(null);
    pendingRef.current = null;
    setThinking(false);
    workerRef.current?.postMessage("stop");
  }, []);

  /** Ask the engine for the best move in `fen`. Resolves null if it has none. */
  const bestMove = useCallback(
    (fen: string, options: { depth: number; moveTimeMs: number }): Promise<EngineMove | null> => {
      const worker = workerRef.current;
      if (!worker) return Promise.resolve(null);
      pendingRef.current?.(null);
      setThinking(true);
      return new Promise((resolve) => {
        pendingRef.current = resolve;
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${options.depth} movetime ${options.moveTimeMs}`);
      });
    },
    [],
  );

  return { ready, thinking, error, setSkill, bestMove, newGame, stop };
}
