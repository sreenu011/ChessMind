/**
 * Utility functions for WebGL detection, device performance tiering,
 * and rendering performance timing.
 */

let webglSupportedCache: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  if (webglSupportedCache !== null) return webglSupportedCache;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("experimental-webgl", { failIfMajorPerformanceCaveat: false });
    
    webglSupportedCache = !!(gl && gl instanceof WebGLRenderingContext);
    return webglSupportedCache;
  } catch (e) {
    webglSupportedCache = false;
    return false;
  }
}

export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type PerformanceTier = "mobile" | "tablet" | "desktop";

export function getDevicePerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return "mobile";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

const timingMarkers: Record<string, number> = {};

export function markTiming(label: string) {
  if (typeof window === "undefined") return;
  const now = performance.now();
  timingMarkers[label] = now;
  if (process.env["NODE_ENV"] === "development") {
    console.log(`[Dashboard Performance] ${label}: ${now.toFixed(1)}ms`);
  }
}

export function measureTiming(label: string, startLabel: string) {
  if (typeof window === "undefined") return;
  const end = performance.now();
  const start = timingMarkers[startLabel] ?? 0;
  const duration = end - start;
  if (process.env["NODE_ENV"] === "development") {
    console.log(`[Dashboard Performance] ${label} elapsed: ${duration.toFixed(1)}ms`);
  }
  return duration;
}
