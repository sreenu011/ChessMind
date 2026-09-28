export type EngineLevel = {
  id: string;
  label: string;
  /** Stockfish "Skill Level" option, 0-20. */
  skill: number;
  depth: number;
  moveTimeMs: number;
  blurb: string;
};

export const ENGINE_LEVELS: EngineLevel[] = [
  { id: "beginner", label: "Beginner", skill: 0, depth: 1, moveTimeMs: 200, blurb: "Learns with you" },
  { id: "easy", label: "Easy", skill: 3, depth: 3, moveTimeMs: 300, blurb: "Casual games" },
  { id: "medium", label: "Medium", skill: 8, depth: 6, moveTimeMs: 600, blurb: "Club level" },
  { id: "hard", label: "Hard", skill: 14, depth: 10, moveTimeMs: 1000, blurb: "Strong play" },
  { id: "expert", label: "Expert", skill: 20, depth: 16, moveTimeMs: 1800, blurb: "Full strength" },
];

export const DEFAULT_ENGINE_LEVEL = ENGINE_LEVELS[1]!;

export function findEngineLevel(id: string): EngineLevel {
  return ENGINE_LEVELS.find((l) => l.id === id) ?? DEFAULT_ENGINE_LEVEL;
}

/** Time controls offered against the computer. */
export const COMPUTER_TIME_CONTROL_IDS = ["1+0", "3+0", "5+0", "10+0"];
