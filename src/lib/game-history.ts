import { Timestamp, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { GameDoc } from "@/lib/games";
import { fetchRatingHistory } from "@/lib/rating-history";
import { findTimeControl } from "@/lib/time-controls";

export type PlayedGame = {
  id: string;
  color: "w" | "b";
  opponent: string; // Alias for backward compatibility
  opponentUsername: string;
  opponentUid: string;
  opponentRating: number | null;
  userRating: number | null;
  result: "win" | "loss" | "draw";
  reason: string;
  status: "finished";
  timeControlId: string;
  baseMs: number;
  incrementMs: number;
  moveCount: number;
  rated: boolean;
  ratingChange: number | null;
  playedAt: Date | null;
  gameDoc: GameDoc;
};

export interface GameHistoryFilters {
  resultFilter?: "all" | "win" | "loss" | "draw" | undefined;
  typeFilter?: "all" | "rated" | "training" | undefined;
  colorFilter?: "all" | "w" | "b" | undefined;
  timeControlFilter?: "all" | "bullet" | "blitz" | "rapid" | "custom" | undefined;
  dateFilter?: "all" | "today" | "this_week" | "this_month" | undefined;
  searchQuery?: string | undefined;
}

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value && typeof value === "object" && "seconds" in value && typeof (value as { seconds: number }).seconds === "number") {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
}

function computeOutcome(game: GameDoc, color: "w" | "b"): "win" | "loss" | "draw" {
  const winner = game.result?.winner ?? null;
  if (!winner) return "draw";
  return winner === color ? "win" : "loss";
}

export function formatResultReason(
  result: { status?: string; reason?: string; winner?: "w" | "b" | null } | null | undefined,
  userOutcome: "win" | "loss" | "draw",
): string {
  if (!result) return "Game ended";

  const { status, reason } = result;

  if (userOutcome === "win") {
    if (status === "checkmate") return "Victory by Checkmate";
    if (status === "resigned") return "Victory by Resignation";
    if (status === "timeout") return "Victory on Time";
    if (reason && reason !== "finished") return reason;
    return "Victory";
  }

  if (userOutcome === "loss") {
    if (status === "checkmate") return "Defeat by Checkmate";
    if (status === "resigned") return "Defeat by Resignation";
    if (status === "timeout") return "Defeat on Time";
    if (reason && reason !== "finished") return reason;
    return "Defeat";
  }

  // Draw
  if (status === "stalemate") return "Draw by Stalemate";
  if (status === "draw") return "Draw by Agreement";
  if (reason && reason !== "finished") return reason;
  return "Draw";
}

/** Convert a raw GameDoc into a canonical PlayedGame for a target user UID. */
export function formatPlayedGame(game: GameDoc, uid: string, ratingChangeMap: Map<string, number> = new Map()): PlayedGame | null {
  if (game.status !== "finished" || !game.result) return null;

  const isWhite = game.white?.uid === uid;
  const isBlack = game.black?.uid === uid;
  if (!isWhite && !isBlack) return null;

  const color: "w" | "b" = isWhite ? "w" : "b";
  const userPlayer = isWhite ? game.white : game.black;
  const opponentPlayer = isWhite ? game.black : game.white;
  const opponentName = opponentPlayer?.username ?? "Unknown Player";

  const isUnratedControl =
    game.rated === false ||
    game.timeControlId === "training" ||
    game.timeControlId === "unrated" ||
    game.id.startsWith("training_") ||
    game.id.startsWith("practice_") ||
    game.id.startsWith("computer_");

  const isRated = !isUnratedControl && (game.rated === true || game.timeControlId !== "training");

  const playedAt = toDate(game.lastMoveAt) ?? toDate(game.createdAt);
  const outcome = computeOutcome(game, color);

  return {
    id: game.id,
    color,
    opponent: opponentName,
    opponentUsername: opponentName,
    opponentUid: opponentPlayer?.uid ?? "",
    opponentRating: opponentPlayer?.rating ?? null,
    userRating: userPlayer?.rating ?? null,
    result: outcome,
    reason: formatResultReason(game.result, outcome),
    status: "finished",
    timeControlId: game.timeControlId,
    baseMs: game.baseMs,
    incrementMs: game.incrementMs,
    moveCount: game.moves?.length ?? 0,
    rated: isRated,
    ratingChange: ratingChangeMap.get(game.id) ?? null,
    playedAt,
    gameDoc: game,
  };
}

/**
 * Filter and search canonical PlayedGame records in memory.
 */
export function filterPlayedGames(games: PlayedGame[], filters: GameHistoryFilters): PlayedGame[] {
  let result = [...games];

  // 1. Result filter
  if (filters.resultFilter && filters.resultFilter !== "all") {
    result = result.filter((g) => g.result === filters.resultFilter);
  }

  // 2. Type filter
  if (filters.typeFilter && filters.typeFilter !== "all") {
    if (filters.typeFilter === "rated") {
      result = result.filter((g) => g.rated);
    } else if (filters.typeFilter === "training") {
      result = result.filter((g) => !g.rated);
    }
  }

  // 3. Color filter
  if (filters.colorFilter && filters.colorFilter !== "all") {
    result = result.filter((g) => g.color === filters.colorFilter);
  }

  // 4. Time control filter
  if (filters.timeControlFilter && filters.timeControlFilter !== "all") {
    result = result.filter((g) => {
      const tc = findTimeControl(g.timeControlId);
      const cat = (tc ? tc.category : "Custom").toLowerCase();
      if (filters.timeControlFilter === "custom") {
        return cat !== "bullet" && cat !== "blitz" && cat !== "rapid";
      }
      return cat === filters.timeControlFilter;
    });
  }

  // 5. Date filter
  if (filters.dateFilter && filters.dateFilter !== "all") {
    const now = new Date();
    result = result.filter((g) => {
      if (!g.playedAt) return false;
      const diffMs = now.getTime() - g.playedAt.getTime();
      if (filters.dateFilter === "today") {
        return g.playedAt.toDateString() === now.toDateString();
      }
      if (filters.dateFilter === "this_week") {
        return diffMs <= 7 * 24 * 60 * 60 * 1000;
      }
      if (filters.dateFilter === "this_month") {
        return diffMs <= 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }

  // 6. Search query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.trim().toLowerCase();
    result = result.filter((g) => g.opponentUsername.toLowerCase().includes(q));
  }

  return result;
}

/**
 * Fetch all finished games for a player from Firestore, deduplicated by gameId, sorted newest first.
 */
export async function fetchPlayerGames(uid: string, maxLimit = 100): Promise<PlayedGame[]> {
  if (!db) return [];
  const gamesColl = collection(db, "games");

  const [asWhiteSnap, asBlackSnap, ratings] = await Promise.all([
    getDocs(query(gamesColl, where("white.uid", "==", uid))),
    getDocs(query(gamesColl, where("black.uid", "==", uid))),
    fetchRatingHistory(uid, 100).catch(() => []),
  ]);

  const ratingChangeMap = new Map(ratings.map((r) => [r.gameId, r.ratingChange]));
  const gameMap = new Map<string, PlayedGame>();

  for (const docSnap of [...asWhiteSnap.docs, ...asBlackSnap.docs]) {
    if (gameMap.has(docSnap.id)) continue;
    const game = docSnap.data() as GameDoc;
    const played = formatPlayedGame(game, uid, ratingChangeMap);
    if (played) {
      gameMap.set(docSnap.id, played);
    }
  }

  const list = Array.from(gameMap.values());

  // Sort newest first
  list.sort((a, b) => (b.playedAt?.getTime() ?? 0) - (a.playedAt?.getTime() ?? 0));

  return list.slice(0, maxLimit);
}

/**
 * Subscribe to real-time finished games for a player.
 */
export function subscribeToPlayerGames(
  uid: string,
  onUpdate: (games: PlayedGame[]) => void,
  onError: (err: Error) => void,
): () => void {
  if (!db) {
    onError(new Error("Firebase is not initialized yet."));
    return () => {};
  }

  const gamesColl = collection(db, "games");
  const qWhite = query(gamesColl, where("white.uid", "==", uid));
  const qBlack = query(gamesColl, where("black.uid", "==", uid));

  const gameMap = new Map<string, GameDoc>();
  let ratingChangeMap = new Map<string, number>();

  // Pre-fetch rating history for Elo changes
  fetchRatingHistory(uid, 100)
    .then((ratings) => {
      ratingChangeMap = new Map(ratings.map((r) => [r.gameId, r.ratingChange]));
      emit();
    })
    .catch(() => {});

  function emit() {
    const list: PlayedGame[] = [];
    gameMap.forEach((g) => {
      const p = formatPlayedGame(g, uid, ratingChangeMap);
      if (p) list.push(p);
    });
    list.sort((a, b) => (b.playedAt?.getTime() ?? 0) - (a.playedAt?.getTime() ?? 0));
    onUpdate(list);
  }

  const unsubWhite = onSnapshot(
    qWhite,
    (snap) => {
      snap.docs.forEach((d) => gameMap.set(d.id, d.data() as GameDoc));
      emit();
    },
    (err) => onError(err),
  );

  const unsubBlack = onSnapshot(
    qBlack,
    (snap) => {
      snap.docs.forEach((d) => gameMap.set(d.id, d.data() as GameDoc));
      emit();
    },
    (err) => onError(err),
  );

  return () => {
    unsubWhite();
    unsubBlack();
  };
}
