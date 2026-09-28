import { lazy, Suspense, useEffect, useState } from "react";
import { StaticHeroChessFallback } from "./static-chess-fallback";
import {
  getDevicePerformanceTier,
  isReducedMotionPreferred,
  isWebGLAvailable,
  markTiming,
  measureTiming,
} from "./webgl-utils";

// Lazy-load heavy Three.js Canvas component so main dashboard UI renders immediately
const LazyHero3DCanvas = lazy(() =>
  import("./hero-3d-canvas").then((m) => ({ default: m.Hero3DCanvas }))
);

export function HeroChessScene() {
  const [canRender3D, setCanRender3D] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    markTiming("Dashboard_UI_Rendered");

    // Check device tier, WebGL availability, and user motion preference
    const tier = getDevicePerformanceTier();
    const webglOk = isWebGLAvailable();
    const reducedMotion = isReducedMotionPreferred();

    setIsMobile(tier === "mobile");

    // Do NOT initialize full 3D scene if WebGL unsupported or reduced motion requested
    if (!webglOk || reducedMotion) {
      console.log(`[Dashboard 3D] Using static fallback (WebGL: ${webglOk}, ReducedMotion: ${reducedMotion})`);
      return;
    }

    const frameId = requestAnimationFrame(() => {
      console.log("[HeroChessScene debug] setCanRender3D(true) called");
      setCanRender3D(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const handle3DCanvasCreated = () => {
    setWebglReady(true);
    measureTiming("3D_Scene_Initialized", "Dashboard_UI_Rendered");
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[400px] overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/20 shadow-2xl">
      {/* 1. Immediate High-Performance Static Fallback */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          webglReady ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <StaticHeroChessFallback />
      </div>

      {/* 2. Progressive 3D Canvas Layer */}
      {canRender3D && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            webglReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <Suspense fallback={null}>
            <LazyHero3DCanvas isMobile={isMobile} onCreated={handle3DCanvasCreated} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
