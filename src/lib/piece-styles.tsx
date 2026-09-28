import type { ReactElement } from "react";
import type { PieceStyleSetting } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";

export type PieceStyleOption = {
  id: PieceStyleSetting;
  name: string;
  description: string;
};

export const PIECE_STYLES: PieceStyleOption[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional Staunton chess piece set with classic details.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek minimalist silhouettes with smooth curves.",
  },
  {
    id: "tournament",
    name: "Tournament",
    description: "High-contrast geometric design for competitive play.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Flat, elegant line-art pieces for clean visualization.",
  },
];

const PIECE_CODES = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];

// ---------------------------------------------------------------------------
// 1. CLASSIC (STAUNTON) PIECES
// ---------------------------------------------------------------------------
function ClassicPiece({ code }: { code: string }): ReactElement {
  const isWhite = code.startsWith("w");
  const type = code[1]?.toUpperCase() ?? "P";

  const fill = isWhite ? "#f8fafc" : "#1e293b";
  const stroke = isWhite ? "#0f172a" : "#cbd5e1";
  const innerFill = isWhite ? "#e2e8f0" : "#0f172a";

  return (
    <svg viewBox="0 0 45 45" className="size-full filter drop-shadow-sm select-none" aria-hidden="true">
      <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {type === "P" && (
          <>
            <path d="M 22.5 9 C 19.5 9 18 11.5 18 14 C 18 16.5 19.5 18 19.5 21 C 16.5 23 14.5 27 14.5 32 L 30.5 32 C 30.5 27 28.5 23 25.5 21 C 25.5 18 27 16.5 27 14 C 27 11.5 25.5 9 22.5 9 Z" />
            <path d="M 13.5 35 L 31.5 35 L 31.5 37 L 13.5 37 Z" fill={innerFill} />
          </>
        )}
        {type === "N" && (
          <>
            <path d="M 22 10 C 16.5 10 13.5 13.5 13.5 18.5 C 13.5 22.5 16 24.5 14.5 28.5 L 13 33 L 32 33 L 30.5 25.5 C 30.5 19.5 33 15.5 28 11.5 Z" />
            <circle cx="19" cy="15" r="1.5" fill={stroke} />
            <path d="M 13 35 L 32 35 L 32 37 L 13 37 Z" fill={innerFill} />
          </>
        )}
        {type === "B" && (
          <>
            <path d="M 22.5 8 C 17.5 8 15.5 13.5 15.5 19.5 C 15.5 24.5 17.5 27 14.5 33 L 30.5 33 C 27.5 27 29.5 24.5 29.5 19.5 C 29.5 13.5 27.5 8 22.5 8 Z" />
            <circle cx="22.5" cy="6.5" r="1.75" fill={stroke} />
            <path d="M 20.5 15 L 24.5 15 M 22.5 13 L 22.5 19" stroke={stroke} strokeWidth="1.25" />
            <path d="M 13.5 35 L 31.5 35 L 31.5 37 L 13.5 37 Z" fill={innerFill} />
          </>
        )}
        {type === "R" && (
          <>
            <path d="M 13.5 12 L 13.5 17 L 16.5 17 L 16.5 14.5 L 20.5 14.5 L 20.5 17 L 24.5 17 L 24.5 14.5 L 28.5 14.5 L 28.5 17 L 31.5 17 L 31.5 12 Z M 15.5 17 L 15.5 27.5 L 13 33 L 32 33 L 29.5 27.5 L 29.5 17 Z" />
            <path d="M 12.5 35 L 32.5 35 L 32.5 37 L 12.5 37 Z" fill={innerFill} />
          </>
        )}
        {type === "Q" && (
          <>
            <path d="M 11.5 14 L 15.5 33 L 29.5 33 L 33.5 14 L 26.5 22.5 L 22.5 10.5 L 18.5 22.5 Z" />
            <circle cx="11.5" cy="12.5" r="1.5" fill={stroke} />
            <circle cx="18.5" cy="10" r="1.5" fill={stroke} />
            <circle cx="22.5" cy="8" r="1.75" fill={stroke} />
            <circle cx="26.5" cy="10" r="1.5" fill={stroke} />
            <circle cx="33.5" cy="12.5" r="1.5" fill={stroke} />
            <path d="M 12.5 35 L 32.5 35 L 32.5 37 L 12.5 37 Z" fill={innerFill} />
          </>
        )}
        {type === "K" && (
          <>
            <path d="M 14.5 16 C 12.5 20.5 12.5 26 12.5 33 L 32.5 33 C 32.5 26 32.5 20.5 30.5 16 C 26.5 13 18.5 13 14.5 16 Z" />
            <path d="M 22.5 6 L 22.5 12.5 M 19.5 9 L 25.5 9" stroke={stroke} strokeWidth="2" />
            <path d="M 12.5 35 L 32.5 35 L 32.5 37 L 12.5 37 Z" fill={innerFill} />
          </>
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 2. MODERN PIECES
// ---------------------------------------------------------------------------
function ModernPiece({ code }: { code: string }): ReactElement {
  const isWhite = code.startsWith("w");
  const type = code[1]?.toUpperCase() ?? "P";

  const fillColor = isWhite ? "#f8fafc" : "#0f172a";
  const strokeColor = isWhite ? "#0f172a" : "#38bdf8";
  const accentColor = isWhite ? "#64748b" : "#94a3b8";

  return (
    <svg viewBox="0 0 45 45" className="size-full filter drop-shadow-sm select-none" aria-hidden="true">
      <g fill={fillColor} stroke={strokeColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {type === "P" && (
          <path d="M 22.5 9 C 19 9 17 12 17 15 C 17 18 19 20 19 23 C 16 25 14 29 14 34 L 31 34 C 31 29 29 25 26 23 C 26 20 28 18 28 15 C 28 12 26 9 22.5 9 Z" />
        )}
        {type === "N" && (
          <path d="M 22 10 C 17 10 14 13 14 18 C 14 22 17 25 15 28 L 13 34 L 32 34 L 30 26 C 30 20 33 16 28 12 Z" />
        )}
        {type === "B" && (
          <>
            <path d="M 22.5 8 C 17.5 8 16 13 16 19 C 16 24 18 27 15 34 L 30 34 C 27 27 29 24 29 19 C 29 13 27.5 8 22.5 8 Z" />
            <circle cx="22.5" cy="7" r="1.5" fill={accentColor} />
          </>
        )}
        {type === "R" && (
          <path d="M 14 12 L 14 17 L 17 17 L 17 14 L 21 14 L 21 17 L 24 17 L 24 14 L 28 14 L 28 17 L 31 17 L 31 12 Z M 16 17 L 16 28 L 13 34 L 32 34 L 29 28 L 29 17 Z" />
        )}
        {type === "Q" && (
          <>
            <path d="M 12 14 L 16 34 L 29 34 L 33 14 L 26 22 L 22.5 10 L 19 22 Z" />
            <circle cx="12" cy="12" r="1.5" fill={accentColor} />
            <circle cx="22.5" cy="8" r="1.5" fill={accentColor} />
            <circle cx="33" cy="12" r="1.5" fill={accentColor} />
          </>
        )}
        {type === "K" && (
          <>
            <path d="M 15 16 C 13 20 13 26 13 34 L 32 34 C 32 26 32 20 30 16 C 26 13 19 13 15 16 Z" />
            <path d="M 22.5 7 L 22.5 13 M 19.5 9.5 L 25.5 9.5" stroke={strokeColor} strokeWidth="2" />
          </>
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 3. TOURNAMENT GEOMETRIC PIECES
// ---------------------------------------------------------------------------
function TournamentPiece({ code }: { code: string }): ReactElement {
  const isWhite = code.startsWith("w");
  const type = code[1]?.toUpperCase() ?? "P";

  const fillColor = isWhite ? "#ffffff" : "#0f172a";
  const strokeColor = isWhite ? "#1e293b" : "#f59e0b";

  return (
    <svg viewBox="0 0 45 45" className="size-full filter drop-shadow-md select-none" aria-hidden="true">
      <g fill={fillColor} stroke={strokeColor} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        {type === "P" && (
          <path d="M 22.5 8 L 17 18 L 19 22 L 14 34 L 31 34 L 26 22 L 28 18 Z" />
        )}
        {type === "N" && (
          <path d="M 15 34 L 15 18 L 22 10 L 30 14 L 26 22 L 30 34 Z" />
        )}
        {type === "B" && (
          <path d="M 22.5 6 L 16 16 L 19 24 L 13 34 L 32 34 L 26 24 L 29 16 Z M 22.5 14 L 22.5 20" />
        )}
        {type === "R" && (
          <path d="M 13 10 L 13 16 L 16 16 L 16 28 L 13 34 L 32 34 L 29 28 L 29 16 L 32 16 L 32 10 L 27 10 L 27 14 L 23 14 L 23 10 Z" />
        )}
        {type === "Q" && (
          <path d="M 12 12 L 17 24 L 14 34 L 31 34 L 28 24 L 33 12 L 26 18 L 22.5 8 L 19 18 Z" />
        )}
        {type === "K" && (
          <>
            <path d="M 22.5 4 L 22.5 10 M 19.5 7 L 25.5 7" strokeWidth="2.5" />
            <path d="M 15 14 L 19 22 L 13 34 L 32 34 L 26 22 L 30 14 Z" />
          </>
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 4. MINIMAL LINE-ART PIECES
// ---------------------------------------------------------------------------
function MinimalPiece({ code }: { code: string }): ReactElement {
  const isWhite = code.startsWith("w");
  const type = code[1]?.toUpperCase() ?? "P";

  const fillColor = isWhite ? "#ffffff" : "#334155";
  const strokeColor = isWhite ? "#475569" : "#cbd5e1";

  return (
    <svg viewBox="0 0 45 45" className="size-full select-none" aria-hidden="true">
      <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {type === "P" && (
          <path d="M 22.5 12 A 4 4 0 1 0 22.5 20 A 4 4 0 1 0 22.5 12 Z M 16 34 L 29 34 L 26 24 L 19 24 Z" />
        )}
        {type === "N" && (
          <path d="M 16 34 L 29 34 L 28 26 C 28 20 31 16 26 12 C 20 10 15 14 15 20 L 22 20 L 16 26 Z" />
        )}
        {type === "B" && (
          <path d="M 22.5 8 L 16 20 L 18 24 L 15 34 L 30 34 L 27 24 L 29 20 Z M 22.5 14 L 22.5 18" />
        )}
        {type === "R" && (
          <path d="M 14 14 L 14 18 L 31 18 L 31 14 Z M 16 18 L 16 28 L 14 34 L 31 34 L 29 28 L 29 18 Z" />
        )}
        {type === "Q" && (
          <path d="M 13 16 L 17 26 L 15 34 L 30 34 L 28 26 L 32 16 L 26 20 L 22.5 10 L 19 20 Z" />
        )}
        {type === "K" && (
          <>
            <path d="M 22.5 6 L 22.5 12 M 19.5 9 L 25.5 9" strokeWidth="2" />
            <path d="M 16 16 L 19 24 L 14 34 L 31 34 L 26 24 L 29 16 Z" />
          </>
        )}
      </g>
    </svg>
  );
}

// Render helper for single piece
export function PieceIcon({ style, code }: { style: PieceStyleSetting; code: string }): ReactElement {
  switch (style) {
    case "modern":
      return <ModernPiece code={code} />;
    case "tournament":
      return <TournamentPiece code={code} />;
    case "minimal":
      return <MinimalPiece code={code} />;
    case "classic":
    default:
      return <ClassicPiece code={code} />;
  }
}

// Return custom piece renderer mapping for react-chessboard
export function getCustomPieces(style: PieceStyleSetting) {
  const pieceMap: Record<string, () => ReactElement> = {};
  for (const code of PIECE_CODES) {
    pieceMap[code] = () => <PieceIcon style={style} code={code} />;
  }
  return pieceMap;
}

// Preview Grid Component showing both White and Black pieces
export function PieceStylePreviewGrid({
  style,
  className = "",
}: {
  style: PieceStyleSetting;
  className?: string;
}) {
  const whitePieces = ["wK", "wQ", "wR", "wB", "wN", "wP"];
  const blackPieces = ["bK", "bQ", "bR", "bB", "bN", "bP"];

  return (
    <div className={cn("space-y-1.5 rounded-lg border border-border/60 bg-muted/40 p-2", className)}>
      <div className="grid grid-cols-6 gap-1 text-center">
        {whitePieces.map((code) => (
          <div
            key={code}
            className="flex aspect-square items-center justify-center rounded bg-card p-1 shadow-2xs border border-border/40"
            title={code}
          >
            <PieceIcon style={style} code={code} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1 text-center">
        {blackPieces.map((code) => (
          <div
            key={code}
            className="flex aspect-square items-center justify-center rounded bg-card p-1 shadow-2xs border border-border/40"
            title={code}
          >
            <PieceIcon style={style} code={code} />
          </div>
        ))}
      </div>
    </div>
  );
}
