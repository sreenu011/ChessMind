export type TimeControl = {
  id: string;
  label: string;
  category: "Bullet" | "Blitz" | "Rapid";
  baseMinutes: number;
  incrementSeconds: number;
};

export const TIME_CONTROLS: TimeControl[] = [
  { id: "1+0", label: "1+0", category: "Bullet", baseMinutes: 1, incrementSeconds: 0 },
  { id: "2+1", label: "2+1", category: "Bullet", baseMinutes: 2, incrementSeconds: 1 },
  { id: "3+0", label: "3+0", category: "Blitz", baseMinutes: 3, incrementSeconds: 0 },
  { id: "5+0", label: "5+0", category: "Blitz", baseMinutes: 5, incrementSeconds: 0 },
  { id: "5+3", label: "5+3", category: "Blitz", baseMinutes: 5, incrementSeconds: 3 },
  { id: "10+0", label: "10+0", category: "Rapid", baseMinutes: 10, incrementSeconds: 0 },
  { id: "10+5", label: "10+5", category: "Rapid", baseMinutes: 10, incrementSeconds: 5 },
];

export const DEFAULT_TIME_CONTROL = TIME_CONTROLS[3]!; // 5+0

export function findTimeControl(id: string): TimeControl {
  return TIME_CONTROLS.find((tc) => tc.id === id) ?? DEFAULT_TIME_CONTROL;
}

export function formatTimeControlLabel(id: string, baseMsVal?: number, incrementMsVal?: number): string {
  const tc = TIME_CONTROLS.find((t) => t.id === id);
  if (tc) return tc.label;

  if (id === "training" || id === "unrated") {
    return "Training";
  }

  if (typeof baseMsVal === "number" && typeof incrementMsVal === "number") {
    const baseMinutes = Math.floor(baseMsVal / 60_000);
    const incSeconds = Math.floor(incrementMsVal / 1000);
    return `${baseMinutes}+${incSeconds}`;
  }

  return id;
}

export function getTimeControlCategory(id: string, baseMsVal?: number): "bullet" | "blitz" | "rapid" | "custom" {
  const tc = TIME_CONTROLS.find((t) => t.id === id);
  if (tc) return tc.category.toLowerCase() as "bullet" | "blitz" | "rapid";

  if (typeof baseMsVal === "number") {
    const baseMinutes = baseMsVal / 60_000;
    if (baseMinutes < 3) return "bullet";
    if (baseMinutes < 10) return "blitz";
    if (baseMinutes >= 10) return "rapid";
  }

  return "custom";
}

export function baseMs(tc: TimeControl) {
  return tc.baseMinutes * 60_000;
}

export function incrementMs(tc: TimeControl) {
  return tc.incrementSeconds * 1000;
}

/** mm:ss, or m:ss.t under ten seconds. */
export function formatClock(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (clamped < 10_000) {
    const tenths = Math.floor((clamped % 1000) / 100);
    return `${minutes}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
