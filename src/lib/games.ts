import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { baseMs, findTimeControl, incrementMs, type TimeControl } from "@/lib/time-controls";

export type GamePlayer = {
  uid: string;
  username: string;
  rating: number;
};

export type GameResultDoc = {
  status: "checkmate" | "stalemate" | "draw" | "resigned" | "timeout";
  winner: "w" | "b" | null;
  reason: string;
};

export type GameDoc = {
  id: string;
  inviteCode?: string;
  status: "waiting" | "active" | "finished" | "cancelled";
  createdBy: string;
  createdAt?: Timestamp | null;
  timeControlId: string;
  baseMs: number;
  incrementMs: number;
  white: GamePlayer | null;
  black: GamePlayer | null;
  fen: string;
  turn: "w" | "b";
  moves: { from: string; to: string; promotion?: string; san: string }[];
  lastMove: { from: string; to: string } | null;
  whiteTimeMs: number;
  blackTimeMs: number;
  lastMoveAt: Timestamp | null;
  drawOffer: "w" | "b" | null;
  result: GameResultDoc | null;
  /** Set only by the trusted server rating engine once Elo has been applied. */
  rated?: boolean;
  presence: Record<string, Timestamp | null>;
};

export const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function requireDb() {
  if (!db) throw new Error("Firebase is not ready yet.");
  return db;
}

export function gameRef(gameId: string) {
  return doc(requireDb(), "games", gameId);
}

function randomId() {
  const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  let id = "";
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) id += alphabet[byte % alphabet.length];
  return id;
}

export function generateRandom6DigitCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += (bytes[i]! % 10).toString();
  }
  return code;
}

export async function generateUniqueGameCode(): Promise<string> {
  if (!db) throw new Error("Firebase is not ready yet.");
  const gamesRef = collection(db, "games");
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRandom6DigitCode();
    const q = query(gamesRef, where("inviteCode", "==", code), where("status", "==", "waiting"));
    const snap = await getDocs(q);
    if (snap.empty) {
      return code;
    }
  }
  throw new Error("Unable to generate a unique 6-digit game code. Please try again.");
}

export async function createGame(
  creator: GamePlayer,
  timeControl: TimeControl,
  creatorColor: "w" | "b" = "w",
): Promise<{ gameId: string; inviteCode: string }> {
  const id = randomId();
  const inviteCode = await generateUniqueGameCode();
  const initial = {
    id,
    inviteCode,
    status: "waiting",
    createdBy: creator.uid,
    timeControlId: timeControl.id,
    baseMs: baseMs(timeControl),
    incrementMs: incrementMs(timeControl),
    white: creatorColor === "w" ? creator : null,
    black: creatorColor === "b" ? creator : null,
    fen: STARTING_FEN,
    turn: "w",
    moves: [],
    lastMove: null,
    whiteTimeMs: baseMs(timeControl),
    blackTimeMs: baseMs(timeControl),
    lastMoveAt: null,
    drawOffer: null,
    result: null,
    presence: {},
    createdAt: serverTimestamp(),
  };
  await setDoc(gameRef(id), initial);
  return { gameId: id, inviteCode };
}

/** Waiting invites stop being joinable after this long. */
export const WAITING_GAME_TTL_MS = 30 * 60 * 1000;

export function isWaitingExpired(game: GameDoc) {
  if (game.status !== "waiting" || !game.createdAt) return false;
  return Date.now() - game.createdAt.toMillis() > WAITING_GAME_TTL_MS;
}

/** Search Firestore for a waiting game by 6-digit code with full validation. */
export async function findGameByInviteCode(code: string, currentUid: string): Promise<GameDoc> {
  if (!db) throw new Error("Firebase is not ready yet.");
  const trimmed = code.trim();
  if (!/^\d{6}$/.test(trimmed)) {
    throw new Error("Enter a valid 6-digit game code.");
  }

  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("inviteCode", "==", trimmed));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("Game not found. Check the code and try again.");
  }

  const docs = snap.docs.map((d) => d.data() as GameDoc);
  const waitingDoc = docs.find((g) => g.status === "waiting") ?? docs[0]!;

  if (waitingDoc.status === "cancelled") {
    throw new Error("This game is no longer available.");
  }
  if (waitingDoc.status === "finished") {
    throw new Error("This game has already ended.");
  }
  if (waitingDoc.status === "active" || (waitingDoc.white && waitingDoc.black)) {
    throw new Error("This game already has two players.");
  }
  if (isWaitingExpired(waitingDoc)) {
    throw new Error("This game invite has expired.");
  }
  if (waitingDoc.white?.uid === currentUid) {
    throw new Error("You cannot join your own game.");
  }

  return waitingDoc;
}

/** Joins a game by its 6-digit invite code. */
export async function joinGameByCode(code: string, player: GamePlayer): Promise<string> {
  const game = await findGameByInviteCode(code, player.uid);
  await joinGame(game.id, player);
  return game.id;
}

/** The host cancels their own game while it is still waiting. */
export async function cancelGame(gameId: string) {
  await updateDoc(gameRef(gameId), { status: "cancelled" });
}

/** Joins a waiting game as the free colour. No-ops when already seated. */
export async function joinGame(gameId: string, player: GamePlayer) {
  const snap = await getDoc(gameRef(gameId));
  if (!snap.exists()) throw new Error("This game no longer exists.");
  const game = snap.data() as GameDoc;
  if (game.white?.uid === player.uid || game.black?.uid === player.uid) return;
  if (game.status !== "waiting") throw new Error("This game is already full.");
  const seat = game.white ? "black" : "white";
  await updateDoc(gameRef(gameId), {
    [seat]: player,
    status: "active",
    lastMoveAt: serverTimestamp(),
  });
}

export async function pushMove(
  gameId: string,
  move: { from: string; to: string; promotion?: string; san: string },
  next: { fen: string; turn: "w" | "b"; whiteTimeMs: number; blackTimeMs: number; result: GameResultDoc | null },
  moves: GameDoc["moves"],
) {
  await updateDoc(gameRef(gameId), {
    moves,
    fen: next.fen,
    turn: next.turn,
    lastMove: { from: move.from, to: move.to },
    whiteTimeMs: next.whiteTimeMs,
    blackTimeMs: next.blackTimeMs,
    lastMoveAt: serverTimestamp(),
    drawOffer: null,
    ...(next.result ? { result: next.result, status: "finished" } : {}),
  });
}

export async function finishGame(gameId: string, result: GameResultDoc) {
  await updateDoc(gameRef(gameId), { result, status: "finished", drawOffer: null, lastMoveAt: serverTimestamp() });
}

export async function setDrawOffer(gameId: string, color: "w" | "b" | null) {
  await updateDoc(gameRef(gameId), { drawOffer: color });
}

export async function touchPresence(gameId: string, color: "w" | "b") {
  await updateDoc(gameRef(gameId), { [`presence.${color}`]: serverTimestamp() });
}

export function subscribeToGame(
  gameId: string,
  onData: (game: GameDoc | null, fromCache: boolean) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    gameRef(gameId),
    { includeMetadataChanges: true },
    (snap) => onData(snap.exists() ? (snap.data() as GameDoc) : null, snap.metadata.fromCache),
    (error) => onError(error as Error),
  );
}

export const DEMO_GAME_DOC: GameDoc = {
  id: "demo_game",
  status: "finished",
  createdBy: "demo_white",
  createdAt: null,
  timeControlId: "10+0",
  baseMs: 600000,
  incrementMs: 0,
  white: { uid: "demo_white", username: "GrandmasterFlash", rating: 1500 },
  black: { uid: "demo_black", username: "TacticalWizard", rating: 1480 },
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  turn: "w",
  moves: [
    { from: "e2", to: "e4", san: "e4" },
    { from: "e7", to: "e5", san: "e5" },
    { from: "g1", to: "f3", san: "Nf3" },
    { from: "b8", to: "c6", san: "Nc6" },
    { from: "f1", to: "b5", san: "Bb5" },
    { from: "a7", to: "a6", san: "a6" },
    { from: "b5", to: "a4", san: "Ba4" },
    { from: "g8", to: "f6", san: "Nf6" },
    { from: "e1", to: "g1", san: "O-O" },
    { from: "f8", to: "e7", san: "Be7" },
  ],
  lastMove: { from: "f8", to: "e7" },
  whiteTimeMs: 580000,
  blackTimeMs: 565000,
  lastMoveAt: null,
  drawOffer: null,
  result: { status: "checkmate", winner: "w", reason: "Checkmate" },
  rated: true,
  presence: {},
};

export async function fetchGame(gameId: string): Promise<GameDoc | null> {
  if (gameId === "demo_game") return DEMO_GAME_DOC;
  const snap = await getDoc(gameRef(gameId));
  return snap.exists() ? (snap.data() as GameDoc) : null;
}

export function timeControlOf(game: GameDoc) {
  return findTimeControl(game.timeControlId);
}
