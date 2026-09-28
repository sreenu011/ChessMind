/**
 * Polished, high-performance static fallback visual matching the
 * Midnight Chess Club design system (dark charcoal, warm ivory, bronze gold glow).
 * Renders instantly without waiting for WebGL or Three.js bundle loading.
 */

import { cn } from "@/lib/utils";

export function StaticHeroChessFallback({ isExpanded = false }: { isExpanded?: boolean }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/20 shadow-2xl flex items-center justify-center p-4",
        isExpanded ? "aspect-square" : "h-[280px] sm:h-[340px] lg:h-[400px]"
      )}
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-amber-950/5 to-transparent pointer-events-none" />

      {/* Styled 3D Perspective Canvas Container */}
      <div className={cn("relative w-full flex items-center justify-center [perspective:1000px]", isExpanded ? "max-w-xl h-full" : "max-w-md h-56 sm:h-64")}>
        {/* CSS 3D Chessboard */}
        <div className={cn("relative rounded-lg border-4 border-amber-900/60 bg-slate-950 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] [transform:rotateX(55deg)_rotateZ(-25deg)] transition-transform duration-700 ease-out", isExpanded ? "w-[85%] h-[85%]" : "w-64 h-64 sm:w-72 sm:h-72")}>
          {/* Gold Border Highlight */}
          <div className="absolute inset-0 rounded border border-amber-500/30 pointer-events-none" />

          {/* 8x8 Grid */}
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded overflow-hidden shadow-inner border border-slate-800">
            {Array.from({ length: 64 }).map((_, idx) => {
              const row = Math.floor(idx / 8);
              const col = idx % 8;
              const isDark = (row + col) % 2 === 1;

              // Tactical highlighted squares for visual flair
              const isHighlighted = (row === 3 && col === 7) || (row === 4 && col === 4);

              return (
                <div
                  key={idx}
                  className={`w-full h-full ${
                    isHighlighted
                      ? "bg-amber-500/40 ring-1 ring-amber-400/60"
                      : isDark
                      ? "bg-slate-900"
                      : "bg-amber-100/90"
                  }`}
                />
              );
            })}
          </div>

          {/* Stylized Chess Pieces on the CSS Board */}
          {/* White King */}
          <div className="absolute top-[80%] left-[62%] text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-bold text-2xl sm:text-3xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♔
          </div>
          {/* White Queen - Tactical Highlight */}
          <div className="absolute top-[45%] left-[87%] text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] font-bold text-2xl sm:text-3xl [transform:translate(-50%,-50%)_rotateX(-55deg)] animate-pulse select-none">
            ♕
          </div>
          {/* White Knight */}
          <div className="absolute top-[70%] left-[62%] text-amber-200 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-bold text-2xl sm:text-3xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♘
          </div>
          {/* White Bishop */}
          <div className="absolute top-[60%] left-[50%] text-amber-200 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-bold text-2xl sm:text-3xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♗
          </div>
          {/* Black King */}
          <div className="absolute top-[12%] left-[62%] text-slate-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)] font-bold text-2xl sm:text-3xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♚
          </div>
          {/* Black Knight */}
          <div className="absolute top-[37%] left-[25%] text-slate-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)] font-bold text-2xl sm:text-3xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♞
          </div>
        </div>
      </div>

      {/* Vignette & Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
      <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-2 text-xs text-amber-500/80 font-medium">
        <span className="size-2 rounded-full bg-amber-500 animate-ping" />
        <span>Midnight Chess Club</span>
      </div>
    </div>
  );
}

export function StaticMiniPieceFallback({ type }: { type: "knight" | "rook" }) {
  const isKnight = type === "knight";
  return (
    <div
      className={`size-14 sm:size-16 relative rounded-xl overflow-hidden ${
        isKnight ? "bg-amber-950/20 border-amber-600/30" : "bg-emerald-950/20 border-emerald-600/30"
      } border flex items-center justify-center shadow-inner`}
    >
      <span
        className={`text-3xl font-bold select-none drop-shadow-md transition-transform duration-300 ${
          isKnight ? "text-amber-400" : "text-emerald-400"
        }`}
      >
        {isKnight ? "♞" : "♜"}
      </span>
    </div>
  );
}

export function StaticAuthChessVisual() {
  return (
    <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[480px] overflow-hidden rounded-2xl border border-amber-900/30 bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/20 shadow-2xl flex items-center justify-center p-4">
      {/* Background Ambient Radial Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-amber-950/5 to-transparent pointer-events-none" />

      {/* Styled 3D Perspective Container */}
      <div className="relative w-full max-w-md h-64 sm:h-80 flex items-center justify-center [perspective:1000px]">
        {/* CSS 3D Chessboard */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-xl border-4 border-amber-900/70 bg-slate-950 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.9)] [transform:rotateX(55deg)_rotateZ(-25deg)] transition-transform duration-700 ease-out">
          {/* Gold Inset Frame */}
          <div className="absolute inset-0 rounded-lg border border-amber-500/40 pointer-events-none" />

          {/* 8x8 Board Grid with Dark Green & Ivory Squares */}
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded overflow-hidden shadow-inner border border-amber-950/60">
            {Array.from({ length: 64 }).map((_, idx) => {
              const row = Math.floor(idx / 8);
              const col = idx % 8;
              const isDark = (row + col) % 2 === 1;
              const isHighlighted = (row === 3 && col === 4) || (row === 4 && col === 3);

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: isHighlighted
                      ? "rgba(217, 119, 6, 0.5)"
                      : isDark
                      ? "#31543E"
                      : "#D8C8A5",
                  }}
                  className={`w-full h-full ${
                    isHighlighted ? "ring-1 ring-amber-400/80" : ""
                  }`}
                />
              );
            })}
          </div>

          {/* 3D-Like Chess Pieces Counter-rotated to stand upright */}
          {/* White King (Ivory/Gold) */}
          <div className="absolute top-[82%] left-[56%] text-amber-100 drop-shadow-[0_8px_12px_rgba(0,0,0,0.9)] font-bold text-3xl sm:text-4xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♔
          </div>
          {/* White Queen - Floating with Glow */}
          <div className="absolute top-[48%] left-[43%] text-amber-200 drop-shadow-[0_0_16px_rgba(245,158,11,0.9)] font-bold text-3xl sm:text-4xl [transform:translate(-50%,-50%)_rotateX(-55deg)] animate-pulse select-none">
            ♕
          </div>
          {/* White Knight */}
          <div className="absolute top-[68%] left-[30%] text-amber-100 drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)] font-bold text-3xl sm:text-4xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♘
          </div>
          {/* White Rook */}
          <div className="absolute top-[82%] left-[18%] text-amber-100 drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)] font-bold text-3xl sm:text-4xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♖
          </div>
          {/* Black King */}
          <div className="absolute top-[18%] left-[56%] text-slate-950 drop-shadow-[0_4px_8px_rgba(255,255,255,0.3)] font-bold text-3xl sm:text-4xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♚
          </div>
          {/* Black Knight */}
          <div className="absolute top-[32%] left-[68%] text-slate-950 drop-shadow-[0_4px_8px_rgba(255,255,255,0.3)] font-bold text-3xl sm:text-4xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♞
          </div>
          {/* Black Bishop */}
          <div className="absolute top-[18%] left-[43%] text-slate-950 drop-shadow-[0_4px_8px_rgba(255,255,255,0.3)] font-bold text-3xl sm:text-4xl [transform:translate(-50%,-50%)_rotateX(-55deg)] select-none">
            ♝
          </div>
        </div>
      </div>

      {/* Vignette Overlay & Brand Badge */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
      <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-2 text-xs text-amber-500/90 font-medium font-mono">
        <span className="size-2 rounded-full bg-amber-500 animate-ping" />
        <span>Midnight Chess Club • 3D Tactical Studio</span>
      </div>
    </div>
  );
}
