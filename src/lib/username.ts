import { doc, getDoc, runTransaction, type Firestore } from "firebase/firestore";

/**
 * Normalize a username for case-insensitive uniqueness checks.
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

/**
 * Validate a username string against formatting and length rules.
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required." };
  }
  const trimmed = username.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters long." };
  }
  if (trimmed.length > 24) {
    return { valid: false, error: "Username must be 24 characters or less." };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens." };
  }
  return { valid: true };
}

/**
 * Check if a normalized username is available in Firestore.
 * If currentUid is provided, the username is considered available if owned by currentUid.
 */
export async function checkUsernameAvailable(db: Firestore, username: string, currentUid?: string): Promise<boolean> {
  const normalized = normalizeUsername(username);
  if (!normalized) return false;

  if (typeof window !== "undefined" && Array.isArray((window as unknown as { __MOCK_TAKEN_USERNAMES?: string[] }).__MOCK_TAKEN_USERNAMES)) {
    const mocks = (window as unknown as { __MOCK_TAKEN_USERNAMES?: string[] }).__MOCK_TAKEN_USERNAMES!;
    if (mocks.includes(normalized)) return false;
  }

  try {
    const snap = await getDoc(doc(db, "usernames", normalized));
    if (!snap.exists()) return true;
    if (currentUid && snap.data()?.["uid"] === currentUid) return true;
    return false;
  } catch (err) {
    console.warn("checkUsernameAvailable error:", err);
    return true;
  }
}

/**
 * Atomically reserve a username and create user profile in Firestore.
 */
export async function registerUserWithUniqueUsername(
  db: Firestore,
  uid: string,
  username: string,
  email: string,
  avatarId: string | null = "avatar-01",
): Promise<void> {
  const validation = validateUsername(username);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid username format.");
  }

  const normalized = normalizeUsername(username);
  const usernameRef = doc(db, "usernames", normalized);
  const userRef = doc(db, "users", uid);

  const selectedAvatarId = avatarId || "avatar-01";

  await runTransaction(db, async (transaction) => {
    const usernameSnap = await transaction.get(usernameRef);
    if (usernameSnap.exists()) {
      const existingData = usernameSnap.data();
      if (existingData?.["uid"] !== uid) {
        throw new Error("Username already taken");
      }
    }

    const cleanUsername = username.trim();
    transaction.set(usernameRef, {
      uid,
      username: cleanUsername,
    });

    transaction.set(userRef, {
      uid,
      username: cleanUsername,
      email,
      avatarId: selectedAvatarId,
      photoURL: selectedAvatarId,
      rating: 1200,
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
    });
  });
}

/**
 * Atomically update username in Firestore while releasing the previous reservation.
 */
export async function updateUsernameWithReservation(
  db: Firestore,
  uid: string,
  oldUsername: string,
  newUsername: string,
  avatarId: string | null = "avatar-01",
): Promise<void> {
  const validation = validateUsername(newUsername);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid username format.");
  }

  const oldNormalized = normalizeUsername(oldUsername);
  const newNormalized = normalizeUsername(newUsername);
  const cleanNewName = newUsername.trim();

  const newUsernameRef = doc(db, "usernames", newNormalized);
  const oldUsernameRef = oldNormalized ? doc(db, "usernames", oldNormalized) : null;
  const userRef = doc(db, "users", uid);

  const selectedAvatarId = avatarId || "avatar-01";

  await runTransaction(db, async (transaction) => {
    const newSnap = await transaction.get(newUsernameRef);
    if (newSnap.exists() && newSnap.data()?.["uid"] !== uid) {
      throw new Error("Username already taken");
    }

    transaction.set(newUsernameRef, {
      uid,
      username: cleanNewName,
    });

    if (oldUsernameRef && oldNormalized !== newNormalized) {
      transaction.delete(oldUsernameRef);
    }

    transaction.update(userRef, {
      username: cleanNewName,
      avatarId: selectedAvatarId,
      photoURL: selectedAvatarId,
    });
  });
}
