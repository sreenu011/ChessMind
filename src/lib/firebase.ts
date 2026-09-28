import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

// Firebase web config values are publishable (safe in client code).
// Fill these in with your Firebase project's web app config, or provide them
// through VITE_FIREBASE_* environment variables.
function getEnv(key: string): string {
  try {
    if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key] as string;
    }
  } catch {
    // fallback
  }
  return (typeof process !== "undefined" && process.env ? process.env[key] : "") ?? "";
}

export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let analytics: Analytics | null = null;

export async function initializeFirebase(config: { apiKey: string; measurementId: string }) {
  const projectId = getEnv("VITE_FIREBASE_PROJECT_ID");
  if (!config.apiKey || !projectId) return false;

  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: config.apiKey,
        authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
        projectId,
        storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
        messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
        appId: getEnv("VITE_FIREBASE_APP_ID"),
        measurementId: config.measurementId,
      });

  auth = getAuth(app);
  // Auto-detect long polling so real-time listeners still work on networks
  // that block WebChannel streams (corporate proxies, some mobile networks).
  try {
    db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    db = getFirestore(app);
  }
  await setPersistence(auth, browserLocalPersistence);

  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("192.168."));

  if (config.measurementId && typeof window !== "undefined" && !isLocalhost && (await isSupported())) {
    try {
      analytics = getAnalytics(app);
    } catch {
      analytics = null;
    }
  }

  return true;
}
