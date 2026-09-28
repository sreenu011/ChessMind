import { createServerFn } from "@tanstack/react-start";

export const getFirebaseConfig = createServerFn({ method: "GET" }).handler(
  async () => ({
    apiKey: process.env["GOOGLE_API_KEY"] ?? "",
    measurementId: process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"] ?? "",
  }),
);