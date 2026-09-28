import { createServerFn } from "@tanstack/react-start";

export const getFirebaseConfig = createServerFn({ method: "GET" }).handler(async () => ({
  apiKey: process.env["VITE_FIREBASE_API_KEY"] ?? process.env["GOOGLE_API_KEY"] ?? "",
  measurementId:
    process.env["VITE_FIREBASE_MEASUREMENT_ID"] ??
    process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"] ??
    "",
}));
