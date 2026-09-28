import { createServerFn } from "@tanstack/react-start";

export const getFirebaseConfig = createServerFn({ method: "GET" }).handler(async () => {
  const matchingKeys = Object.keys(process.env).filter(
    (k) => k.includes("FIREBASE") || k.includes("VITE") || k.includes("GOOGLE"),
  );
  return {
    apiKey: process.env["VITE_FIREBASE_API_KEY"] ?? process.env["GOOGLE_API_KEY"] ?? "",
    measurementId:
      process.env["VITE_FIREBASE_MEASUREMENT_ID"] ??
      process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"] ??
      "",
    vercelEnv: process.env["VERCEL_ENV"] ?? process.env["NODE_ENV"] ?? "",
    availableKeys: matchingKeys,
    keyLengths: matchingKeys.map((k) => ({
      key: k,
      len: process.env[k]?.length,
      type: typeof process.env[k],
    })),
  };
});
