export const player = {
  name: "Alex Novak",
  username: "knightrider",
  rating: 1482,
  peakRating: 1531,
  joined: "March 2024",
  gamesPlayed: 214,
  wins: 118,
  losses: 74,
  draws: 22,
};

export const winPercentage = Math.round((player.wins / player.gamesPlayed) * 100);

export type GameRecord = {
  id: string;
  opponent: string;
  opponentRating: number;
  result: "Win" | "Loss" | "Draw";
  moves: number;
  timeControl: string;
  ratingChange: number;
  played: string;
};

export const recentGames: GameRecord[] = [];

export const leaderboard = [
  { rank: 1, name: "magnus_jr", rating: 2731, country: "NO", games: 1840, winRate: 71 },
  { rank: 2, name: "tactic_titan", rating: 2688, country: "IN", games: 1522, winRate: 69 },
  { rank: 3, name: "silent_rook", rating: 2604, country: "US", games: 2103, winRate: 66 },
  { rank: 4, name: "endgame_ella", rating: 2571, country: "DE", games: 1288, winRate: 64 },
  { rank: 5, name: "zugzwang", rating: 2540, country: "AR", games: 975, winRate: 63 },
  { rank: 6, name: "openingbook", rating: 2498, country: "FR", games: 1642, winRate: 61 },
  { rank: 7, name: "pawnstorm88", rating: 2455, country: "ES", games: 1187, winRate: 60 },
  { rank: 8, name: "knightrider", rating: 2411, country: "GB", games: 214, winRate: 55 },
];
