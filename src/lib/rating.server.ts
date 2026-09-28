// Trusted server-side rating engine.
//
// Ratings are never writable from the browser (see firestore.rules). This
// module is the only writer: it authenticates the caller's Firebase ID token,
// reads the finished game straight from Firestore, recomputes the Elo change
// itself, and commits both player profiles plus the rating history in a single
// atomic Firestore commit.
//
// It talks to Firestore over the REST API using a Google service account, so it
// runs in the edge runtime without the Node-only firebase-admin SDK.

import {
  ratingChange,
  resultLabel,
  scoreFor,
  STARTING_RATING,
  type RatingRecord,
  type Score,
} from "@/lib/rating";

type ServiceAccount = { client_email: string; private_key: string; project_id: string };

function serviceAccount(): ServiceAccount | null {
  const raw = process.env["FIREBASE_SERVICE_ACCOUNT"];
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (!parsed.client_email || !parsed.private_key) return null;
    return { ...parsed, private_key: parsed.private_key.replace(/\\n/g, "\n") };
  } catch {
    return null;
  }
}

function base64url(input: ArrayBuffer | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(account: ServiceAccount): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(
    JSON.stringify(claim),
  )}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8(account.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsigned),
  );
  const assertion = `${unsigned}.${base64url(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw new Error("Could not authenticate the rating service.");
  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

/** Confirms the caller really is the Firebase user they claim to be. */
async function verifyIdToken(idToken: string): Promise<string> {
  const apiKey = process.env["VITE_FIREBASE_API_KEY"] || process.env["GOOGLE_API_KEY"];
  if (!apiKey) throw new Error("Server is missing the Firebase API key.");
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );
  if (!response.ok) throw new Error("Your session could not be verified.");
  const data = (await response.json()) as { users?: { localId: string }[] };
  const uid = data.users?.[0]?.localId;
  if (!uid) throw new Error("Your session could not be verified.");
  return uid;
}

// --- Firestore REST value helpers -------------------------------------------

type FirestoreValue = Record<string, unknown>;

function num(value: number): FirestoreValue {
  return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
}

function readNumber(value: FirestoreValue | undefined, fallback = 0): number {
  if (!value) return fallback;
  if ("integerValue" in value) return Number(value["integerValue"]);
  if ("doubleValue" in value) return Number(value["doubleValue"]);
  return fallback;
}

function readString(value: FirestoreValue | undefined): string | null {
  return value && "stringValue" in value ? String(value["stringValue"]) : null;
}

function readMap(value: FirestoreValue | undefined): Record<string, FirestoreValue> | null {
  if (!value || !("mapValue" in value)) return null;
  const map = value["mapValue"] as { fields?: Record<string, FirestoreValue> };
  return map.fields ?? null;
}

function readBool(value: FirestoreValue | undefined): boolean {
  return !!value && "booleanValue" in value && value["booleanValue"] === true;
}

function docsBase(projectId: string) {
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

async function getDocument(
  projectId: string,
  token: string,
  path: string,
): Promise<{ name: string; fields?: Record<string, FirestoreValue> } | null> {
  const response = await fetch(`${docsBase(projectId)}/${path}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not read game data.");
  return (await response.json()) as { name: string; fields?: Record<string, FirestoreValue> };
}

function randomId(): string {
  const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let id = "";
  for (const byte of bytes) id += alphabet[byte % alphabet.length];
  return id;
}

export type RatingOutcome = {
  applied: boolean;
  reason?: string;
  changes?: Record<string, RatingRecord>;
};

/**
 * Applies the Elo change for one finished game. Idempotent: the game document
 * is stamped `rated: true` in the same atomic commit, and a second call for the
 * same game is a no-op.
 */
export async function applyRatedResult(idToken: string, gameId: string): Promise<RatingOutcome> {
  const account = serviceAccount();
  if (!account) {
    return {
      applied: false,
      reason:
        "Rating updates are not activated yet — the trusted rating service has no credentials.",
    };
  }

  const callerUid = await verifyIdToken(idToken);
  const projectId = account.project_id;
  const token = await accessToken(account);

  const game = await getDocument(projectId, token, `games/${gameId}`);
  if (!game?.fields) return { applied: false, reason: "That game does not exist." };
  const g = game.fields;

  if (readString(g["status"]) !== "finished")
    return { applied: false, reason: "Ratings only change once a game is finished." };
  if (readBool(g["rated"])) return { applied: false, reason: "This game was already rated." };

  const white = readMap(g["white"]);
  const black = readMap(g["black"]);
  const whiteUid = readString(white?.["uid"]);
  const blackUid = readString(black?.["uid"]);
  if (!whiteUid || !blackUid) return { applied: false, reason: "This game never had two players." };
  if (callerUid !== whiteUid && callerUid !== blackUid)
    return { applied: false, reason: "Only the players of a game can submit its result." };

  const result = readMap(g["result"]);
  if (!result) return { applied: false, reason: "This game has no recorded result." };
  const rawWinner = readString(result["winner"]);
  const winner = rawWinner === "w" || rawWinner === "b" ? rawWinner : null;

  const [whiteProfile, blackProfile] = await Promise.all([
    getDocument(projectId, token, `users/${whiteUid}`),
    getDocument(projectId, token, `users/${blackUid}`),
  ]);
  if (!whiteProfile?.fields || !blackProfile?.fields)
    return { applied: false, reason: "A player profile is missing." };

  const stats = (fields: Record<string, FirestoreValue>) => ({
    rating: readNumber(fields["rating"], STARTING_RATING),
    gamesPlayed: readNumber(fields["gamesPlayed"]),
    wins: readNumber(fields["wins"]),
    losses: readNumber(fields["losses"]),
    draws: readNumber(fields["draws"]),
  });

  const w = stats(whiteProfile.fields);
  const b = stats(blackProfile.fields);

  const whiteScore: Score = scoreFor("w", winner);
  const blackScore: Score = scoreFor("b", winner);
  const whiteDelta = ratingChange(w.rating, b.rating, whiteScore, w.gamesPlayed);
  const blackDelta = ratingChange(b.rating, w.rating, blackScore, b.gamesPlayed);

  const timestamp = new Date().toISOString();

  const side = (
    uid: string,
    opponentId: string,
    current: ReturnType<typeof stats>,
    delta: number,
    score: Score,
  ) => {
    const outcome = resultLabel(score);
    const next = {
      rating: current.rating + delta,
      gamesPlayed: current.gamesPlayed + 1,
      wins: current.wins + (outcome === "win" ? 1 : 0),
      losses: current.losses + (outcome === "loss" ? 1 : 0),
      draws: current.draws + (outcome === "draw" ? 1 : 0),
    };
    const record: RatingRecord = {
      oldRating: current.rating,
      ratingChange: delta,
      newRating: next.rating,
      gameId,
      opponentId,
      result: outcome,
    };
    return { uid, next, record };
  };

  const sides = [
    side(whiteUid, blackUid, w, whiteDelta, whiteScore),
    side(blackUid, whiteUid, b, blackDelta, blackScore),
  ];

  const writes: unknown[] = [];

  for (const { uid, next, record } of sides) {
    writes.push({
      update: {
        name: `projects/${projectId}/databases/(default)/documents/users/${uid}`,
        fields: {
          rating: num(next.rating),
          gamesPlayed: num(next.gamesPlayed),
          wins: num(next.wins),
          losses: num(next.losses),
          draws: num(next.draws),
        },
      },
      updateMask: { fieldPaths: ["rating", "gamesPlayed", "wins", "losses", "draws"] },
      currentDocument: { exists: true },
    });
    writes.push({
      update: {
        name: `projects/${projectId}/databases/(default)/documents/ratings/${uid}/history/${randomId()}`,
        fields: {
          oldRating: num(record.oldRating),
          ratingChange: num(record.ratingChange),
          newRating: num(record.newRating),
          gameId: { stringValue: gameId },
          opponentId: { stringValue: record.opponentId },
          result: { stringValue: record.result },
          timestamp: { timestampValue: timestamp },
        },
      },
    });
  }

  // Stamping the game marks it rated; the precondition makes a concurrent
  // double-submit fail instead of double-counting.
  writes.push({
    update: {
      name: `projects/${projectId}/databases/(default)/documents/games/${gameId}`,
      fields: { rated: { booleanValue: true }, ratedAt: { timestampValue: timestamp } },
    },
    updateMask: { fieldPaths: ["rated", "ratedAt"] },
    currentDocument: { updateTime: (game as { updateTime?: string }).updateTime },
  });

  const commit = await fetch(`${docsBase(projectId)}:commit`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ writes }),
  });
  if (!commit.ok) {
    return { applied: false, reason: "The rating update could not be saved. Try again." };
  }

  return {
    applied: true,
    changes: Object.fromEntries(sides.map((s) => [s.uid, s.record])),
  };
}
