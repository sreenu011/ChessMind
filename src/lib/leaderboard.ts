import { collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { normalizeUsername } from "@/lib/username";

export interface LeaderboardPlayer {
  id: string;
  username: string;
  avatarId?: string | null;
  photoURL: string | null;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  /** 0-100 percentage, null when no games played. */
  winRate: number | null;
}

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Filter raw user records to keep ONLY canonical user profiles (preventing duplicate usernames).
 */
export function processCanonicalPlayers(
  rawUsers: Array<{ id: string; data: Record<string, unknown> }>,
  reservations: Map<string, string> = new Map(), // normalizedUsername -> reservedUid
): LeaderboardPlayer[] {
  const normalizedGroups = new Map<string, Array<{ id: string; data: Record<string, unknown> }>>();

  // Group user records by normalized username
  for (const user of rawUsers) {
    const rawUsername = typeof user.data["username"] === "string" ? user.data["username"].trim() : "";
    if (!rawUsername) continue; // skip malformed users without username
    const normalized = normalizeUsername(rawUsername);

    if (!normalizedGroups.has(normalized)) {
      normalizedGroups.set(normalized, []);
    }
    normalizedGroups.get(normalized)!.push(user);
  }

  const canonicalPlayers: LeaderboardPlayer[] = [];

  normalizedGroups.forEach((group, normalized) => {
    let canonicalUser = group[0]!;

    // 1. Check if there is an explicit reservation in usernames collection
    const reservedUid = reservations.get(normalized);
    if (reservedUid) {
      const match = group.find((u) => u.id === reservedUid);
      if (match) {
        canonicalUser = match;
      }
    } else if (group.length > 1) {
      // 2. Fallback tie-break for legacy duplicates: highest gamesPlayed, highest rating, or deterministic id
      group.sort((a, b) => {
        const gpA = toNumber(a.data["gamesPlayed"]);
        const gpB = toNumber(b.data["gamesPlayed"]);
        if (gpB !== gpA) return gpB - gpA;

        const ratA = toNumber(a.data["rating"]);
        const ratB = toNumber(b.data["rating"]);
        if (ratB !== ratA) return ratB - ratA;

        return a.id.localeCompare(b.id);
      });
      canonicalUser = group[0]!;
    }

    const data = canonicalUser.data;
    const wins = toNumber(data["wins"]);
    const losses = toNumber(data["losses"]);
    const draws = toNumber(data["draws"]);
    const gamesPlayed = toNumber(data["gamesPlayed"]);
    const username = typeof data["username"] === "string" ? data["username"].trim() : "Unknown";
    const avatarId = typeof data["avatarId"] === "string" ? data["avatarId"] : null;
    const photoURL = typeof data["photoURL"] === "string" ? data["photoURL"] : null;

    canonicalPlayers.push({
      id: canonicalUser.id,
      username,
      avatarId,
      photoURL,
      rating: toNumber(data["rating"]) || 1200,
      gamesPlayed,
      wins,
      losses,
      draws,
      winRate: gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : null,
    });
  });

  // Sort canonical players by rating DESC, gamesPlayed DESC, then UID ASC
  canonicalPlayers.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
    return a.id.localeCompare(b.id);
  });

  return canonicalPlayers;
}

/**
 * Fetch canonical leaderboard players once from Firestore.
 */
export async function fetchLeaderboardPlayers(): Promise<LeaderboardPlayer[]> {
  if (!db) throw new Error("Firebase is not initialized yet.");

  const [usersSnap, usernamesSnap] = await Promise.all([
    getDocs(query(collection(db, "users"), orderBy("rating", "desc"))),
    getDocs(collection(db, "usernames")).catch(() => null),
  ]);

  const reservations = new Map<string, string>();
  if (usernamesSnap) {
    usernamesSnap.docs.forEach((doc) => {
      const data = doc.data();
      if (typeof data["uid"] === "string") {
        reservations.set(doc.id, data["uid"]);
      }
    });
  }

  const rawUsers = usersSnap.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  return processCanonicalPlayers(rawUsers, reservations);
}

/**
 * Subscribe to real-time updates for the canonical leaderboard.
 */
export function subscribeToLeaderboard(
  onUpdate: (players: LeaderboardPlayer[]) => void,
  onError: (err: Error) => void,
): () => void {
  if (!db) {
    onError(new Error("Firebase is not initialized yet."));
    return () => {};
  }

  const usersQuery = query(collection(db, "users"), orderBy("rating", "desc"));
  const usernamesQuery = collection(db, "usernames");

  let rawUsers: Array<{ id: string; data: Record<string, unknown> }> = [];
  const reservations = new Map<string, string>();

  function update() {
    const canonical = processCanonicalPlayers(rawUsers, reservations);
    onUpdate(canonical);
  }

  const unsubUsers = onSnapshot(
    usersQuery,
    (snap) => {
      rawUsers = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
      update();
    },
    (err) => onError(err),
  );

  const unsubUsernames = onSnapshot(
    usernamesQuery,
    (snap) => {
      reservations.clear();
      snap.docs.forEach((d) => {
        const data = d.data();
        if (typeof data["uid"] === "string") {
          reservations.set(d.id, data["uid"]);
        }
      });
      update();
    },
    () => {}, // fallback if usernames read fails
  );

  return () => {
    unsubUsers();
    unsubUsernames();
  };
}
