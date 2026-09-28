import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// Read .env manually
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

export async function findDuplicateUsernames() {
  console.log("=== SCANNING FIRESTORE USERS FOR DUPLICATE USERNAMES ===\n");
  
  const snapshot = await getDocs(collection(db, "users"));
  console.log(`Total user documents found: ${snapshot.docs.length}`);

  const userMap = new Map(); // normalizedUsername -> array of user records

  snapshot.docs.forEach((docSnap) => {
    const data = docSnap.data();
    const rawUsername = data.username || "Unknown";
    const normalized = rawUsername.trim().toLowerCase();
    
    const record = {
      uid: docSnap.id,
      username: rawUsername,
      normalizedUsername: normalized,
      rating: data.rating ?? 1200,
      gamesPlayed: data.gamesPlayed ?? 0,
      wins: data.wins ?? 0,
      losses: data.losses ?? 0,
      draws: data.draws ?? 0,
      createdAt: data.createdAt ? data.createdAt.toDate?.() || data.createdAt : null,
    };

    if (!userMap.has(normalized)) {
      userMap.set(normalized, []);
    }
    userMap.get(normalized).push(record);
  });

  const duplicates = [];
  let duplicateUserCount = 0;

  userMap.forEach((records, normalized) => {
    if (records.length > 1) {
      duplicates.push({ normalized, records });
      duplicateUserCount += (records.length - 1);
    }
  });

  console.log("\n--------------------------------------------------");
  console.log(`DUPLICATE USERNAMES FOUND: ${duplicates.length} unique usernames with duplicates (${duplicateUserCount} excess accounts)`);
  console.log("--------------------------------------------------\n");

  if (duplicates.length === 0) {
    console.log("No duplicate usernames found in Firestore!");
  } else {
    duplicates.forEach((item, index) => {
      console.log(`[${index + 1}] Normalized Username: "${item.normalized}" (Count: ${item.records.length})`);
      item.records.forEach((rec, rIdx) => {
        console.log(`    - Account #${rIdx + 1}:`);
        console.log(`        UID: ${rec.uid}`);
        console.log(`        Display Username: ${rec.username}`);
        console.log(`        Rating: ${rec.rating}`);
        console.log(`        Games Played: ${rec.gamesPlayed} (W: ${rec.wins} / L: ${rec.losses} / D: ${rec.draws})`);
      });
      console.log("");
    });
  }

  return { totalUsers: snapshot.docs.length, duplicateGroups: duplicates, duplicateUserCount };
}

findDuplicateUsernames().catch((err) => {
  console.error("Error finding duplicate usernames:", err);
  process.exit(1);
});
