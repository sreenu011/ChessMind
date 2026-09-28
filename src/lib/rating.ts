// Pure Elo maths. No Firebase imports here so both the browser (for previews
// and explanations) and trusted server code can share exactly the same rules.

export const STARTING_RATING = 1200;

export type Score = 1 | 0 | 0.5;

export type RatingRecord = {
  oldRating: number;
  ratingChange: number;
  newRating: number;
  gameId: string;
  opponentId: string;
  result: "win" | "loss" | "draw";
};

/** Probability that `rating` scores a point against `opponentRating`. */
export function expectedScore(rating: number, opponentRating: number): number {
  return 1 / (1 + 10 ** ((opponentRating - rating) / 400));
}

/**
 * Development K-factor: provisional players move fast, established and
 * high-rated players move slowly.
 */
export function kFactor(rating: number, gamesPlayed: number): number {
  if (gamesPlayed < 30) return 40;
  if (rating >= 2400) return 10;
  return 20;
}

export function ratingChange(
  rating: number,
  opponentRating: number,
  score: Score,
  gamesPlayed: number,
): number {
  const k = kFactor(rating, gamesPlayed);
  return Math.round(k * (score - expectedScore(rating, opponentRating)));
}

export function scoreFor(color: "w" | "b", winner: "w" | "b" | null): Score {
  if (winner === null) return 0.5;
  return winner === color ? 1 : 0;
}

export function resultLabel(score: Score): "win" | "loss" | "draw" {
  return score === 1 ? "win" : score === 0 ? "loss" : "draw";
}

export function winPercentage(wins: number, gamesPlayed: number): number {
  return gamesPlayed ? Math.round((wins / gamesPlayed) * 100) : 0;
}

export function formatChange(change: number): string {
  return change > 0 ? `+${change}` : `${change}`;
}
