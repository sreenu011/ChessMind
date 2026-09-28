import { useEffect, useMemo, useState } from "react";
import { Chessboard, type PieceDropHandlerArgs, type SquareHandlerArgs } from "react-chessboard";
import type { Move } from "chess.js";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/settings-context";
import { getCustomPieces } from "@/lib/piece-styles";
import { ChessBoard3DInteractive } from "./chessboard-3d-interactive";
import { isWebGLAvailable } from "@/components/dashboard-3d/webgl-utils";
import { Box, Layers, Maximize2, Minimize2 } from "lucide-react";

export type ChessBoardProps = {
  fen: string;
  boardOrientation?: "white" | "black";
  /** Returns true when the move was accepted. */
  onMove: (from: string, to: string, promotion?: string) => boolean;
  legalMovesFrom: (square: string) => Move[];
  lastMove?: { from: string; to: string } | null;
  checkSquare?: string | null;
  interactive?: boolean;
  className?: string;
  onSquareClickRaw?: ((square: string) => void) | undefined;
  customSquareStyles?: Record<string, React.CSSProperties> | undefined;
  topClockMs?: number | undefined;
  bottomClockMs?: number | undefined;
  activeClock?: "w" | "b" | null | undefined;
  isExpanded?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  boardMode?: "3d" | "2d";
  onBoardModeChange?: (mode: "3d" | "2d") => void;
  showEmbeddedControls?: boolean;
};

const PROMOTION_PIECES = [
  { value: "q", label: "Queen" },
  { value: "r", label: "Rook" },
  { value: "b", label: "Bishop" },
  { value: "n", label: "Knight" },
] as const;

export function ChessBoard({
  fen,
  boardOrientation: explicitOrientation,
  onMove,
  legalMovesFrom,
  lastMove,
  checkSquare,
  interactive = true,
  className,
  onSquareClickRaw,
  customSquareStyles,
  topClockMs,
  bottomClockMs,
  activeClock,
  isExpanded = false,
  isFullscreen = false,
  onToggleFullscreen,
  boardMode: externalBoardMode,
  onBoardModeChange,
  showEmbeddedControls = false,
}: ChessBoardProps) {
  const { settings } = useSettings();
  const [selected, setSelected] = useState<string | null>(null);
  const [options, setOptions] = useState<Move[]>([]);
  const [promotion, setPromotion] = useState<{ from: string; to: string } | null>(null);

  const hasWebGL = useMemo(() => isWebGLAvailable(), []);
  const [internalBoardMode, setInternalBoardMode] = useState<"3d" | "2d">(() => (hasWebGL ? "3d" : "2d"));
  const boardMode = externalBoardMode ?? internalBoardMode;
  const setBoardMode = onBoardModeChange ?? setInternalBoardMode;

  // Determine board orientation based on setting & prop
  const effectiveOrientation: "white" | "black" =
    settings.boardOrientation === "white"
      ? "white"
      : settings.boardOrientation === "black"
        ? "black"
        : explicitOrientation ?? "white";

  useEffect(() => {
    setSelected(null);
    setOptions([]);
  }, [fen, effectiveOrientation]);

  function select(square: string) {
    const moves = legalMovesFrom(square);
    if (moves.length === 0) {
      setSelected(null);
      setOptions([]);
      return false;
    }
    setSelected(square);
    setOptions(moves);
    return true;
  }

  function attempt(from: string, to: string) {
    const move = legalMovesFrom(from).find((m) => m.to === to);
    if (!move) return false;
    if (move.flags.includes("p")) {
      if (settings.autoPromotion === "queen") {
        return onMove(from, to, "q");
      }
      setPromotion({ from, to });
      return true;
    }
    return onMove(from, to);
  }

  function handleSquareClick({ square }: SquareHandlerArgs) {
    if (!interactive) return;
    if (onSquareClickRaw) {
      onSquareClickRaw(square);
      return;
    }
    if (selected === square) {
      setSelected(null);
      setOptions([]);
      return;
    }
    if (selected && options.some((m) => m.to === square)) {
      if (attempt(selected, square)) {
        setSelected(null);
        setOptions([]);
        return;
      }
    }
    select(square);
  }

  function handlePieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    if (!interactive || !targetSquare) return false;
    const played = attempt(sourceSquare, targetSquare);
    if (played) {
      setSelected(null);
      setOptions([]);
    }
    return played;
  }

  const squareStyles: Record<string, React.CSSProperties> = { ...customSquareStyles };

  if (settings.showLastMove && lastMove) {
    const highlight = { backgroundColor: "color-mix(in oklab, var(--primary) 38%, transparent)" };
    squareStyles[lastMove.from] = { ...highlight, ...squareStyles[lastMove.from] };
    squareStyles[lastMove.to] = { ...highlight, ...squareStyles[lastMove.to] };
  }

  if (settings.showCheckHighlight && checkSquare) {
    squareStyles[checkSquare] = {
      ...squareStyles[checkSquare],
      background: "radial-gradient(circle, var(--destructive) 0%, transparent 72%)",
    };
  }

  if (selected) {
    squareStyles[selected] = {
      ...squareStyles[selected],
      backgroundColor: "color-mix(in oklab, var(--primary) 55%, transparent)",
    };
  }

  if (settings.showLegalMoves) {
    for (const move of options) {
      const isCapture = move.flags.includes("c") || move.flags.includes("e");
      squareStyles[move.to] = {
        ...squareStyles[move.to],
        background: isCapture
          ? "radial-gradient(circle, transparent 56%, color-mix(in oklab, var(--primary) 60%, transparent) 58%)"
          : "radial-gradient(circle, color-mix(in oklab, var(--primary) 70%, transparent) 22%, transparent 24%)",
      };
    }
  }

  const customPieces = getCustomPieces(settings.pieceStyle);
  const boardWidth = "100%";
  const boardMaxWidth = "100%";

  return (
    <div
      className={cn("mx-auto w-full relative transition-[width,max-width] duration-500 ease-in-out", className)}
      style={{ width: boardWidth, maxWidth: boardMaxWidth }}
      data-chess-board-container
      data-piece-style={settings.pieceStyle}
      data-show-coordinates={settings.showCoordinates ? "true" : "false"}
      data-show-legal-moves={settings.showLegalMoves ? "true" : "false"}
      data-show-last-move={settings.showLastMove ? "true" : "false"}
      data-show-check-highlight={settings.showCheckHighlight ? "true" : "false"}
    >
      {/* 2D / 3D Mode & Fullscreen Toggle Bar (Optional) */}
      {showEmbeddedControls && (
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Box className="size-3.5 text-amber-500" /> {boardMode === "3d" ? "3D Interactive View" : "2D Classic View"}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {hasWebGL && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBoardMode(boardMode === "3d" ? "2d" : "3d")}
                className="h-7 text-xs font-medium text-amber-500 hover:text-amber-400 gap-1.5 px-2"
              >
                <Layers className="size-3.5" />
                <span className="hidden sm:inline">Switch to</span> {boardMode === "3d" ? "2D" : "3D"}
              </Button>
            )}
            {onToggleFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen"}
                className="h-7 text-xs font-medium text-amber-500 hover:text-amber-400 gap-1.5 px-2"
              >
                {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                <span>{isFullscreen ? "Exit Fullscreen" : "Full Screen"}</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Render 3D or 2D Board */}
      {boardMode === "3d" && hasWebGL ? (
        <ChessBoard3DInteractive
          fen={fen}
          boardOrientation={effectiveOrientation}
          onMove={onMove}
          legalMovesFrom={legalMovesFrom}
          lastMove={lastMove}
          checkSquare={checkSquare}
          interactive={interactive}
          topClockMs={topClockMs}
          bottomClockMs={bottomClockMs}
          activeClock={activeClock}
          isExpanded={isExpanded}
          isFullscreen={isFullscreen}
        />
      ) : (
        <div className="aspect-square w-full overflow-hidden rounded-xl border border-border/60 shadow-lg [&>div]:size-full">
          <Chessboard
            options={{
              id: "chessmind-board",
              position: fen,
              boardOrientation: effectiveOrientation,
              allowDragging: interactive,
              animationDurationInMs: settings.boardAnimation ? 200 : 0,
              showNotation: settings.showCoordinates,
              ...(customPieces ? { pieces: customPieces } : {}),
              squareStyles,
              lightSquareStyle: { backgroundColor: "var(--board-light)" },
              darkSquareStyle: { backgroundColor: "var(--board-dark)" },
              darkSquareNotationStyle: { color: "var(--board-light)" },
              lightSquareNotationStyle: { color: "var(--board-dark)" },
              onSquareClick: handleSquareClick,
              onPieceDrop: handlePieceDrop,
            }}
          />
        </div>
      )}

      <Dialog open={promotion !== null} onOpenChange={(open) => !open && setPromotion(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Promote your pawn</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            {PROMOTION_PIECES.map((piece) => (
              <Button
                key={piece.value}
                variant="outline"
                className="h-16 text-base font-semibold"
                onClick={() => {
                  if (promotion) onMove(promotion.from, promotion.to, piece.value);
                  setPromotion(null);
                }}
              >
                {piece.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
