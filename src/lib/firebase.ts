import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, type Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

// Firebase web config values are publishable (safe in client code).
// All client configuration must be statically read from import.meta.env.VITE_FIREBASE_*
// so Vite inlines them into the production client bundle during build.
export const firebaseClientConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export let auth: Auth | null = null;
export let db: Firestore | null = null;
export let analytics: Analytics | null = null;

export async function initializeFirebase(config?: { apiKey?: string; measurementId?: string }) {
  const apiKey = config?.apiKey || firebaseClientConfig.apiKey;
  const measurementId = config?.measurementId || firebaseClientConfig.measurementId;
  const projectId = firebaseClientConfig.projectId;

  if (!apiKey || !projectId) return false;

  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey,
        authDomain: firebaseClientConfig.authDomain,
        projectId,
        storageBucket: firebaseClientConfig.storageBucket,
        messagingSenderId: firebaseClientConfig.messagingSenderId,
        appId: firebaseClientConfig.appId,
        measurementId,
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

  if (measurementId && typeof window !== "undefined" && !isLocalhost && (await isSupported())) {
    try {
      analytics = getAnalytics(app);
    } catch {
      analytics = null;
    }
  }

  return true;
}
