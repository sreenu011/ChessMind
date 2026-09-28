import {
  collection,
  getDocs,
  limit as limitTo,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type RatingHistoryEntry = {
  id: string;
  oldRating: number;
  ratingChange: number;
  newRating: number;
  gameId: string;
  opponentId: string;
  result: "win" | "loss" | "draw";
  timestamp: Timestamp | null;
};

/** Read-only view of a player's rating history (written only by the server). */
export async function fetchRatingHistory(uid: string, max = 20): Promise<RatingHistoryEntry[]> {
  if (!db) return [];
  const ref = collection(db, "ratings", uid, "history");
  const snap = await getDocs(query(ref, orderBy("timestamp", "desc"), limitTo(max)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RatingHistoryEntry, "id">) }));
}
