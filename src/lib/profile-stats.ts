import type { PlayedGame } from "@/lib/game-history";
import type { RatingHistoryEntry } from "@/lib/rating-history";
import type { LearningProgress } from "@/lib/learn/progress";
import { CATEGORIES, LESSONS } from "@/lib/learn/content";
import { STARTING_RATING } from "@/lib/rating";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

/** Longest run of consecutive wins in the player's finished games (oldest first). */
export function longestWinStreak(games: PlayedGame[]): number {
  const oldestFirst = [...games].sort(
    (a, b) => (a.playedAt?.getTime() ?? 0) - (b.playedAt?.getTime() ?? 0),
  );
  let best = 0;
  let run = 0;
  for (const g of oldestFirst) {
    run = g.result === "win" ? run + 1 : 0;
    if (run > best) best = run;
  }
  return best;
}

export function peakRating(current: number, history: RatingHistoryEntry[]): number {
  return history.reduce(
    (max, h) => Math.max(max, h.newRating, h.oldRating),
    Math.max(current, STARTING_RATING),
  );
}

/** Achievements are derived only from data that actually exists in Firestore. */
export function buildAchievements(
  games: PlayedGame[],
  wins: number,
  gamesPlayed: number,
  progress: LearningProgress,
): Achievement[] {
  const puzzles = progress.puzzlesSolved.length + progress.dailyPuzzlesSolved.length;
  const checkmated = games.some(
    (g) => g.result === "win" && /checkmate/i.test(g.reason ?? ""),
  );
  return [
    {
      id: "first-game",
      title: "First Game",
      description: "Play your first chess game.",
      unlocked: gamesPlayed >= 1 || games.length >= 1,
    },
    { id: "first-win", title: "First Win", description: "Win your first game.", unlocked: wins >= 1 },
    {
      id: "checkmate",
      title: "Checkmate",
      description: "Deliver your first checkmate.",
      unlocked: checkmated,
    },
    {
      id: "puzzle-solver",
      title: "Puzzle Solver",
      description: "Solve your first chess puzzle.",
      unlocked: puzzles >= 1,
    },
    {
      id: "streak-5",
      title: "5 Game Streak",
      description: "Win 5 games in a row.",
      unlocked: longestWinStreak(games) >= 5,
    },
    {
      id: "games-100",
      title: "100 Games",
      description: "Complete 100 games.",
      unlocked: gamesPlayed >= 100,
    },
  ];
}

export type CategoryProgress = {
  id: string;
  title: string;
  done: number;
  total: number;
  percent: number;
};

const PROFILE_CATEGORY_IDS = ["basics", "tactics", "openings", "endgame"] as const;

export function learningByCategory(progress: LearningProgress): CategoryProgress[] {
  return PROFILE_CATEGORY_IDS.map((id) => {
    const category = CATEGORIES.find((c) => c.id === id);
    const lessonIds = category?.lessonIds ?? LESSONS.filter((l) => l.category === id).map((l) => l.id);
    const total = lessonIds.length;
    const done = lessonIds.filter((l) => progress.completedLessons.includes(l)).length;
    return {
      id,
      title: category?.title ?? id,
      done,
      total,
      percent: total ? Math.round((done / total) * 100) : 0,
    };
  });
}

/** Learning level combines lessons completed with rated experience. */
export function chessLevel(
  progress: LearningProgress,
  rating: number,
  gamesPlayed: number,
): "Beginner" | "Intermediate" | "Advanced" | "Expert" {
  const lessons = progress.completedLessons.length;
  if (lessons >= 20 && rating >= 1800 && gamesPlayed >= 50) return "Expert";
  if (lessons >= 12 && rating >= 1500 && gamesPlayed >= 20) return "Advanced";
  if (lessons >= 5 || (rating >= 1300 && gamesPlayed >= 5)) return "Intermediate";
  return "Beginner";
}
