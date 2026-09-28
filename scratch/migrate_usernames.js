import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, writeBatch } from "firebase/firestore";

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

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function migrateUsernames() {
  console.log("=== STARTING USERNAME RESERVATION MIGRATION ===\n");

  const snapshot = await getDocs(collection(db, "users"));
  console.log(`Total user documents in 'users': ${snapshot.docs.length}`);

  const userMap = new Map();

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const rawUsername = typeof data.username === "string" && data.username.trim() ? data.username.trim() : "Unknown";
    const normalized = rawUsername.toLowerCase();

    const record = {
      uid: docSnap.id,
      username: rawUsername,
      normalized,
      rating: data.rating ?? 1200,
      gamesPlayed: data.gamesPlayed ?? 0,
      createdAtSeconds: data.createdAt?.seconds ?? 9999999999,
    };

    if (!userMap.has(normalized)) {
      userMap.set(normalized, []);
    }
    userMap.get(normalized).push(record);
  });

  const batch = writeBatch(db);
  let createdCount = 0;
  let duplicateCount = 0;

  userMap.forEach((records, normalized) => {
    // Sort records to pick canonical: 1) gamesPlayed desc, 2) rating desc, 3) createdAtSeconds asc, 4) uid asc
    records.sort((a, b) => {
      if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (a.createdAtSeconds !== b.createdAtSeconds) return a.createdAtSeconds - b.createdAtSeconds;
      return a.uid.localeCompare(b.uid);
    });

    const canonical = records[0];
    const usernameRef = doc(db, "usernames", normalized);

    batch.set(usernameRef, {
      uid: canonical.uid,
      username: canonical.username,
    });
    createdCount++;

    if (records.length > 1) {
      duplicateCount += (records.length - 1);
      console.log(`[Duplicate Resolved] Normalized: "${normalized}" -> Canonical UID: ${canonical.uid} ("${canonical.username}")`);
      for (let i = 1; i < records.length; i++) {
        console.log(`                     Duplicate Account preserving data: ${records[i].uid}`);
      }
    }
  });

  await batch.commit();

  console.log("\n--------------------------------------------------");
  console.log(`MIGRATION COMPLETE:`);
  console.log(`Unique Username Reservations Created in 'usernames': ${createdCount}`);
  console.log(`Duplicate Accounts Safe-Kept (Preserved in 'users'): ${duplicateCount}`);
  console.log("--------------------------------------------------\n");

  return { createdCount, duplicateCount };
}

migrateUsernames().catch((err) => {
  console.error("Migration Error:", err);
  process.exit(1);
});
