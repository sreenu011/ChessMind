import { useCallback, useEffect, useRef, useState } from "react";

export type ClockColor = "w" | "b";

type Options = {
  baseMs: number;
  incrementMs: number;
  onFlag?: (color: ClockColor) => void;
};

/**
 * Local visual countdown. Nothing here touches the network — multiplayer games
 * reconcile against stored timestamps instead of per-second writes.
 */
export function useChessClock({ baseMs, incrementMs, onFlag }: Options) {
  const [times, setTimes] = useState<Record<ClockColor, number>>({ w: baseMs, b: baseMs });
  const [active, setActive] = useState<ClockColor | null>(null);
  const lastTick = useRef(0);
  const flagged = useRef(false);
  const onFlagRef = useRef(onFlag);
  onFlagRef.current = onFlag;

  // Re-arm whenever the configured time control changes.
  useEffect(() => {
    flagged.current = false;
    setActive(null);
    setTimes({ w: baseMs, b: baseMs });
  }, [baseMs]);

  useEffect(() => {
    if (!active) return;
    lastTick.current = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick.current;
      lastTick.current = now;
      setTimes((prev) => {
        const remaining = Math.max(0, prev[active] - delta);
        if (remaining === 0 && !flagged.current) {
          flagged.current = true;
          setActive(null);
          onFlagRef.current?.(active);
        }
        return { ...prev, [active]: remaining };
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [active]);

  const start = useCallback((color: ClockColor) => {
    if (flagged.current) return;
    setActive(color);
  }, []);

  const pause = useCallback(() => setActive(null), []);

  /** A move by `mover` completed: stop their clock, add increment, run the opponent's. */
  const switchTurn = useCallback(
    (mover: ClockColor) => {
      if (flagged.current) return;
      setTimes((prev) => ({ ...prev, [mover]: prev[mover] + incrementMs }));
      setActive(mover === "w" ? "b" : "w");
    },
    [incrementMs],
  );

  const reset = useCallback(() => {
    flagged.current = false;
    setActive(null);
    setTimes({ w: baseMs, b: baseMs });
  }, [baseMs]);

  return { times, active, start, pause, switchTurn, reset, setTimes };
}
