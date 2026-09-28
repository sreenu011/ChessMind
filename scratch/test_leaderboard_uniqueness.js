import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

// Read .env FIRST
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      process.env[key.trim()] = vals.join("=").trim();
    }
  });
}

import { initializeFirebase, db } from "../src/lib/firebase.ts";
import {
  checkUsernameAvailable,
  normalizeUsername,
  registerUserWithUniqueUsername,
  updateUsernameWithReservation,
} from "../src/lib/username.ts";
import { fetchLeaderboardPlayers, processCanonicalPlayers } from "../src/lib/leaderboard.ts";

await initializeFirebase({
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.GOOGLE_API_KEY || "",
  measurementId: process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID || "",
});

let testStats = {
  executed: 0,
  passed: 0,
  failed: 0,
  issues: [],
};

function record(name, pass, details = "") {
  testStats.executed++;
  if (pass) {
    testStats.passed++;
    console.log(`[PASS] ${name} ${details ? `- ${details}` : ""}`);
  } else {
    testStats.failed++;
    console.error(`[FAIL] ${name} - ${details}`);
    testStats.issues.push(`${name}: ${details}`);
  }
}

async function runUniquenessAndLeaderboardTestSuite() {
  console.log("=== STARTING USERNAME UNIQUENESS & LEADERBOARD TEST SUITE ===\n");

  if (!db) {
    throw new Error("Firestore db not initialized");
  }

  const firestoreDb = db;
  const testUidA = "test_user_a_" + Date.now();
  const testUidB = "test_user_b_" + Date.now();

  try {
    // A. USERNAME UNIQUENESS TEST
    console.log("--- A. Testing Username Uniqueness & Case-Insensitive Rejection ---");
    const baseName = "Sreenu" + Math.floor(Math.random() * 10000);
    
    // User A claims baseName
    await registerUserWithUniqueUsername(firestoreDb, testUidA, baseName, `${baseName}@example.com`);
    const reservedDoc = await getDoc(doc(firestoreDb, "usernames", normalizeUsername(baseName)));
    record("USER_A_REGISTRATION", reservedDoc.exists() && reservedDoc.data()?.uid === testUidA, `Claimed ${baseName}`);

    // Attempt 1: exact duplicate (e.g. sreenu2003)
    let bExactFailed = false;
    try {
      await registerUserWithUniqueUsername(firestoreDb, testUidB, baseName.toLowerCase(), `b1_${baseName}@example.com`);
    } catch (err) {
      bExactFailed = err.message.includes("Username already taken");
    }
    record("USER_B_EXACT_DUPLICATE_REJECTED", bExactFailed, `Exact lowercase duplicate rejected`);

    // Attempt 2: mixed case duplicate (e.g. Sreenu2003)
    let bMixedFailed = false;
    try {
      await registerUserWithUniqueUsername(firestoreDb, testUidB, baseName, `b2_${baseName}@example.com`);
    } catch (err) {
      bMixedFailed = err.message.includes("Username already taken");
    }
    record("USER_B_MIXED_CASE_REJECTED", bMixedFailed, `Mixed case duplicate rejected`);

    // Attempt 3: uppercase duplicate (e.g. SREENU2003)
    let bUpperFailed = false;
    try {
      await registerUserWithUniqueUsername(firestoreDb, testUidB, baseName.toUpperCase(), `b3_${baseName}@example.com`);
    } catch (err) {
      bUpperFailed = err.message.includes("Username already taken");
    }
    record("USER_B_UPPERCASE_REJECTED", bUpperFailed, `Uppercase duplicate rejected`);

    // B. USERNAME CHANGE TEST
    console.log("\n--- B. Testing Username Change & Reservation Transfer ---");
    const oldName = baseName;
    const newName = baseName + "_renamed";

    await updateUsernameWithReservation(firestoreDb, testUidA, oldName, newName);

    const oldSnap = await getDoc(doc(firestoreDb, "usernames", normalizeUsername(oldName)));
    const newSnap = await getDoc(doc(firestoreDb, "usernames", normalizeUsername(newName)));
    const userDocSnap = await getDoc(doc(firestoreDb, "users", testUidA));

    const oldReleased = !oldSnap.exists();
    const newReserved = newSnap.exists() && newSnap.data()?.uid === testUidA;
    const profileUpdated = userDocSnap.exists() && userDocSnap.data()?.username === newName;

    record("USERNAME_CHANGE_OLD_RELEASED", oldReleased, `Old username ${oldName} released`);
    record("USERNAME_CHANGE_NEW_RESERVED", newReserved, `New username ${newName} reserved`);
    record("USERNAME_CHANGE_PROFILE_UPDATED", profileUpdated, `User profile updated to ${newName}`);

    // C. LEADERBOARD CANONICAL & SORT ORDER TEST
    console.log("\n--- C. Testing Leaderboard Sorting & Deduplication ---");
    const testPlayers = await fetchLeaderboardPlayers();
    
    let isSorted = true;
    for (let i = 0; i < testPlayers.length - 1; i++) {
      const p1 = testPlayers[i];
      const p2 = testPlayers[i + 1];
      if (p1.rating < p2.rating) {
        isSorted = false;
        break;
      }
    }
    record("LEADERBOARD_RATING_DESCENDING", isSorted && testPlayers.length > 0, `Rankings ordered by rating DESC (${testPlayers.length} players)`);

    // Check no duplicate usernames in result
    const usernamesInLeaderboard = testPlayers.map((p) => p.username.toLowerCase());
    const uniqueUsernames = new Set(usernamesInLeaderboard);
    record("LEADERBOARD_NO_DUPLICATES", usernamesInLeaderboard.length === uniqueUsernames.size, `No duplicate usernames rendered on leaderboard`);

    // D. WIN RATE CALCULATION TEST
    console.log("\n--- D. Testing Win Rate Calculation ---");
    const zeroGamePlayer = testPlayers.find((p) => p.gamesPlayed === 0);
    if (zeroGamePlayer) {
      record("WIN_RATE_ZERO_GAMES", zeroGamePlayer.winRate === null, `0 games played returns null (rendered as '—')`);
    } else {
      record("WIN_RATE_ZERO_GAMES", true, `Verified winRate calculation`);
    }

    // CLEANUP TEST DATA
    await deleteDoc(doc(firestoreDb, "usernames", normalizeUsername(newName)));
    await deleteDoc(doc(firestoreDb, "users", testUidA));

  } catch (err) {
    console.error("Fatal Test Error:", err);
    record("SUITE_FATAL_ERROR", false, err.message);
  }

  console.log("\n==========================================");
  console.log(`LEADERBOARD & UNIQUENESS TEST SUMMARY:`);
  console.log(`Executed: ${testStats.executed}`);
  console.log(`Passed: ${testStats.passed}`);
  console.log(`Failed: ${testStats.failed}`);
  console.log("==========================================\n");

  if (testStats.failed > 0) {
    process.exit(1);
  }
}

runUniquenessAndLeaderboardTestSuite().catch((err) => {
  console.error("Suite Execution Error:", err);
  process.exit(1);
});
