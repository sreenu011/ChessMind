import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ChessPiece3D, type PieceColor, type PieceType } from "@/components/dashboard-3d/chess-pieces-3d";
import { StaticHeroChessFallback } from "@/components/dashboard-3d/static-chess-fallback";
import { isWebGLAvailable, getDevicePerformanceTier } from "@/components/dashboard-3d/webgl-utils";
import {
  createLightTileMaterial,
  createDarkTileMaterial,
  createFrameMaterial,
  createBevelTrimMaterial,
  selectedTileMaterial,
  lastMoveTileMaterial,
  checkTileMaterial,
  legalMoveTileMaterial,
  legalCaptureTileMaterial,
} from "@/components/dashboard-3d/chess-materials";
import { formatClock } from "@/lib/time-controls";
import { cn } from "@/lib/utils";

export interface ChessBoard3DInteractiveProps {
  fen: string;
  boardOrientation?: "white" | "black" | undefined;
  onMove?: ((from: string, to: string, promotion?: string) => boolean | void) | undefined;
  legalMovesFrom?: ((square: string) => Array<{ to: string; flags: string }>) | undefined;
  lastMove?: { from: string; to: string } | null | undefined;
  checkSquare?: string | null | undefined;
  interactive?: boolean | undefined;
  topClockMs?: number | undefined;
  bottomClockMs?: number | undefined;
  activeClock?: "w" | "b" | null | undefined;
  isExpanded?: boolean | undefined;
  isFullscreen?: boolean | undefined;
  showOverlayClocks?: boolean | undefined;
}

// Convert square string e.g. "e4" to 3D position [x, 0.08, z]
export function squareTo3DPos(square: string, orientation: "white" | "black" = "white"): [number, number, number] {
  const file = square.charCodeAt(0) - 97; // a=0 .. h=7
  const rank = parseInt(square[1]!, 10) - 1; // 1=0 .. 8=7

  let col = file;
  let row = 7 - rank;

  if (orientation === "black") {
    col = 7 - file;
    row = rank;
  }

  const x = col - 3.5;
  const z = row - 3.5;

  return [x, 0.08, z];
}

// Convert 3D grid [col, row] back to square e.g. "e4"
export function gridToSquare(col: number, row: number, orientation: "white" | "black" = "white"): string {
  let file = col;
  let rank = 7 - row;

  if (orientation === "black") {
    file = 7 - col;
    rank = row;
  }

  const fileChar = String.fromCharCode(97 + file);
  const rankChar = String(rank + 1);

  return `${fileChar}${rankChar}`;
}

export function pos3DToSquare(x: number, z: number, orientation: "white" | "black" = "white"): string | null {
  const col = Math.round(x + 3.5);
  const row = Math.round(z + 3.5);

  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  return gridToSquare(col, row, orientation);
}

// Parse FEN into map of square -> piece info
function parseFen(fen: string): Map<string, { type: PieceType; color: PieceColor }> {
  const pieces = new Map<string, { type: PieceType; color: PieceColor }>();
  const fenBoard = fen.split(" ")[0] ?? "";
  const rows = fenBoard.split("/");

  const pieceTypeMap: Record<string, PieceType> = {
    p: "pawn",
    r: "rook",
    n: "knight",
    b: "bishop",
    q: "queen",
    k: "king",
  };

  rows.forEach((rowStr, rIdx) => {
    let cIdx = 0;
    for (const char of rowStr) {
      if (/\d/.test(char)) {
        cIdx += parseInt(char, 10);
      } else {
        const isWhite = char === char.toUpperCase();
        const type = pieceTypeMap[char.toLowerCase()];
        if (type) {
          const square = gridToSquare(cIdx, rIdx, "white");
          pieces.set(square, { type, color: isWhite ? "white" : "black" });
        }
        cIdx++;
      }
    }
  });

  return pieces;
}

// Reusable Tile & Frame Geometries
const tileGeometry = new THREE.BoxGeometry(0.98, 0.08, 0.98);
const frameBaseGeometry = new THREE.BoxGeometry(9.4, 0.38, 9.4);
const frameTopGeometry = new THREE.BoxGeometry(8.02, 0.09, 8.02);
const squareOverlayGeometry = new THREE.PlaneGeometry(0.97, 0.97);
const captureRingGeometry = new THREE.CylinderGeometry(0.44, 0.44, 0.03, 24);

interface AnimatedPieceProps {
  id: string;
  square: string;
  type: PieceType;
  color: PieceColor;
  orientation: "white" | "black";
  isSelected: boolean;
  isDragging: boolean;
  dragPos: [number, number, number] | null;
  onSelect: (sq: string) => void;
  onPointerDown: (sq: string, e: any) => void;
}

function AnimatedPieceItem({
  square,
  type,
  color,
  orientation,
  isSelected,
  isDragging,
  dragPos,
  onSelect,
  onPointerDown,
}: AnimatedPieceProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const currentPosRef = useRef<[number, number, number]>(squareTo3DPos(square, orientation));
  const targetPos = useMemo(() => squareTo3DPos(square, orientation), [square, orientation]);

  // Smooth ease-out animation between squares
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isDragging && dragPos) {
      groupRef.current.position.set(dragPos[0], dragPos[1], dragPos[2]);
      return;
    }

    const curr = currentPosRef.current;
    const destX = targetPos[0];
    const destZ = targetPos[2];
    const destY = targetPos[1];

    const dx = destX - curr[0];
    const dz = destZ - curr[2];
    const distXZ = Math.sqrt(dx * dx + dz * dz);

    if (distXZ > 0.005) {
      const speed = Math.max(12, distXZ * 16);
      const step = Math.min(1, speed * delta);
      curr[0] += dx * step;
      curr[2] += dz * step;
      // Arc slightly upward during movement
      const arc = Math.sin(Math.min(Math.PI, (1 - distXZ / 2) * Math.PI)) * 0.18;
      curr[1] = destY + Math.max(0, arc);
    } else {
      curr[0] = destX;
      curr[1] = destY;
      curr[2] = destZ;
    }

    groupRef.current.position.set(curr[0], curr[1], curr[2]);
  });

  return (
    <group
      ref={groupRef}
      position={targetPos}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown(square, e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(square);
      }}
    >
      <ChessPiece3D
        type={type}
        color={color}
        square={square}
        scale={0.92}
        isFeatured={isSelected}
        boardOrientation={orientation}
      />
    </group>
  );
}

// Scene Interaction Manager for Click & Drag-and-Drop
function ChessBoardScene({
  fen,
  boardOrientation = "white",
  onMove,
  legalMovesFrom,
  lastMove,
  checkSquare,
  interactive,
  onPromotionRequired,
}: ChessBoard3DInteractiveProps & {
  onPromotionRequired: (from: string, to: string) => void;
}) {
  const { camera, raycaster, gl } = useThree();
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggingSquare, setDraggingSquare] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<[number, number, number] | null>(null);

  const pieces = useMemo(() => parseFen(fen), [fen]);
  const lightTileMat = useMemo(() => createLightTileMaterial(), []);
  const darkTileMat = useMemo(() => createDarkTileMaterial(), []);
  const frameMat = useMemo(() => createFrameMaterial(boardOrientation), [boardOrientation]);
  const bevelTrimMat = useMemo(() => createBevelTrimMaterial(), []);

  // Compute legal destination squares for selected piece
  const legalTargets = useMemo(() => {
    if (!selectedSquare || !legalMovesFrom) return new Set<string>();
    const moves = legalMovesFrom(selectedSquare);
    return new Set(moves.map((m) => m.to));
  }, [selectedSquare, legalMovesFrom]);

  // Execute move helper
  const tryMakeMove = useCallback(
    (from: string, to: string) => {
      const piece = pieces.get(from);
      const targetRank = to[1];
      if (piece?.type === "pawn" && (targetRank === "8" || targetRank === "1")) {
        onPromotionRequired(from, to);
        return;
      }

      const success = onMove?.(from, to);
      if (success !== false) {
        setSelectedSquare(null);
        setDraggingSquare(null);
        setDragPosition(null);
      }
    },
    [pieces, onMove, onPromotionRequired]
  );

  const handleSquareClick = useCallback(
    (sq: string) => {
      if (!interactive) return;

      if (selectedSquare === sq) {
        setSelectedSquare(null);
        return;
      }

      if (selectedSquare) {
        if (legalTargets.has(sq)) {
          tryMakeMove(selectedSquare, sq);
          return;
        }
      }

      const pieceAtClick = pieces.get(sq);
      if (pieceAtClick) {
        const turn = fen.split(" ")[1];
        const pieceColorChar = pieceAtClick.color === "white" ? "w" : "b";
        if (pieceColorChar === turn) {
          setSelectedSquare(sq);
          return;
        }
      }

      setSelectedSquare(null);
    },
    [interactive, selectedSquare, legalTargets, pieces, fen, tryMakeMove]
  );

  // Drag and Drop pointer handling
  const handlePiecePointerDown = useCallback(
    (sq: string, e: any) => {
      if (!interactive) return;
      const piece = pieces.get(sq);
      if (!piece) return;

      const turn = fen.split(" ")[1];
      const pieceColorChar = piece.color === "white" ? "w" : "b";
      if (pieceColorChar !== turn) {
        // Opponent piece: If we have a piece selected and it's a legal capture, move!
        if (selectedSquare && legalTargets.has(sq)) {
          tryMakeMove(selectedSquare, sq);
        }
        return;
      }

      setSelectedSquare(sq);
      setDraggingSquare(sq);
      const initialPos = squareTo3DPos(sq, boardOrientation);
      setDragPosition([initialPos[0], 0.35, initialPos[2]]);
    },
    [interactive, pieces, fen, selectedSquare, legalTargets, boardOrientation, tryMakeMove]
  );

  // Window pointer move and up events for drag-and-drop
  useEffect(() => {
    if (!draggingSquare) return;

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.2);
    const planeIntersect = new THREE.Vector3();

    const handlePointerMove = (evt: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      if (raycaster.ray.intersectPlane(plane, planeIntersect)) {
        setDragPosition([planeIntersect.x, 0.35, planeIntersect.z]);
      }
    };

    const handlePointerUp = () => {
      if (dragPosition && draggingSquare) {
        const targetSq = pos3DToSquare(dragPosition[0], dragPosition[2], boardOrientation);
        if (targetSq && targetSq !== draggingSquare && legalTargets.has(targetSq)) {
          tryMakeMove(draggingSquare, targetSq);
        }
      }
      setDraggingSquare(null);
      setDragPosition(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingSquare, dragPosition, boardOrientation, legalTargets, camera, gl.domElement, raycaster, tryMakeMove]);

  return (
    <group position={[0, -0.3, 0]}>
      {/* Physical Board Base Frame with Engraved Coordinates */}
      <mesh position={[0, -0.2, 0]} geometry={frameBaseGeometry} material={frameMat} receiveShadow />
      <mesh position={[0, 0.012, 0]} geometry={frameTopGeometry} material={bevelTrimMat} />

      {/* 64 Wood Playing Surface Tiles */}
      {Array.from({ length: 8 }).map((_, rIdx) =>
        Array.from({ length: 8 }).map((_, cIdx) => {
          const sq = gridToSquare(cIdx, rIdx, boardOrientation);
          const isDark = (rIdx + cIdx) % 2 === 1;
          const [x, , z] = squareTo3DPos(sq, boardOrientation);

          const isSelected = selectedSquare === sq;
          const isTarget = legalTargets.has(sq);
          const isLastMoveFrom = lastMove?.from === sq;
          const isLastMoveTo = lastMove?.to === sq;
          const isCheck = checkSquare === sq;

          const baseTileMat = isDark ? darkTileMat : lightTileMat;

          return (
            <group
              key={sq}
              position={[x, 0.05, z]}
              onClick={(e) => {
                e.stopPropagation();
                handleSquareClick(sq);
              }}
            >
              {/* Base physical wood tile preserving maple/walnut grain */}
              <mesh
                geometry={tileGeometry}
                material={baseTileMat}
                receiveShadow
                onClick={(e) => {
                  e.stopPropagation();
                  handleSquareClick(sq);
                }}
              />

              {/* King in Check subtle crimson red glow overlay */}
              {isCheck && (
                <mesh
                  position={[0, 0.042, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  geometry={squareOverlayGeometry}
                  material={checkTileMaterial}
                />
              )}

              {/* Selected Square subtle bronze glow overlay */}
              {isSelected && (
                <mesh
                  position={[0, 0.043, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  geometry={squareOverlayGeometry}
                  material={selectedTileMaterial}
                />
              )}

              {/* Last Move soft warm amber highlight */}
              {!isSelected && !isCheck && (isLastMoveFrom || isLastMoveTo) && (
                <mesh
                  position={[0, 0.041, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  geometry={squareOverlayGeometry}
                  material={lastMoveTileMaterial}
                />
              )}

              {/* Luminous Green Glow on Legal Move Empty Squares (matches reference h3/h4) */}
              {isTarget && !pieces.has(sq) && (
                <mesh
                  position={[0, 0.044, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  geometry={squareOverlayGeometry}
                  material={legalMoveTileMaterial}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSquareClick(sq);
                  }}
                />
              )}

              {/* Capture Highlight Ring Around Enemy Piece */}
              {isTarget && pieces.has(sq) && (
                <mesh
                  position={[0, 0.045, 0]}
                  geometry={captureRingGeometry}
                  material={legalCaptureTileMaterial}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSquareClick(sq);
                  }}
                />
              )}
            </group>
          );
        })
      )}

      {/* Render 3D Staunton Pieces */}
      {Array.from(pieces.entries()).map(([sq, pInfo]) => {
        const isSelected = selectedSquare === sq;
        const isDragging = draggingSquare === sq;

        return (
          <AnimatedPieceItem
            key={sq}
            id={sq}
            square={sq}
            type={pInfo.type}
            color={pInfo.color}
            orientation={boardOrientation ?? "white"}
            isSelected={isSelected}
            isDragging={isDragging}
            dragPos={isDragging ? dragPosition : null}
            onSelect={handleSquareClick}
            onPointerDown={handlePiecePointerDown}
          />
        );
      })}
    </group>
  );
}

function CameraRig({ isMobile, isExpanded, isFullscreen }: { isMobile: boolean; isExpanded?: boolean; isFullscreen?: boolean }) {
  const { camera } = useThree();
  useEffect(() => {
    // High-angled photographic camera perspective (approx 71 degrees above board plane)
    // Board is centered, complete board visible, full coordinates visible, top clocks space preserved
    const camY = isMobile ? (isExpanded ? 18.0 : 17.4) : (isFullscreen ? 17.5 : isExpanded ? 17.8 : 17.2);
    const camZ = isMobile ? (isExpanded ? 6.2 : 6.0) : (isFullscreen ? 6.0 : isExpanded ? 6.1 : 5.9);
    const fov = isMobile ? (isExpanded ? 34 : 32) : (isFullscreen ? 30 : isExpanded ? 30 : 29);

    camera.position.set(0, camY, camZ);
    camera.lookAt(0, -0.3, -0.22);
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, isExpanded, isFullscreen]);

  return null;
}

export function ChessBoard3DInteractive({
  fen,
  boardOrientation = "white",
  onMove,
  legalMovesFrom,
  lastMove,
  checkSquare,
  interactive = true,
  topClockMs,
  bottomClockMs,
  activeClock,
  isExpanded = false,
  isFullscreen = false,
  showOverlayClocks = false,
}: ChessBoard3DInteractiveProps) {
  const tier = useMemo(() => getDevicePerformanceTier(), []);
  const webglAvailable = useMemo(() => isWebGLAvailable(), []);
  const [promotionPending, setPromotionPending] = useState<{ from: string; to: string } | null>(null);

  const handlePromotionSelect = (promo: "q" | "r" | "b" | "n") => {
    if (promotionPending && onMove) {
      onMove(promotionPending.from, promotionPending.to, promo);
    }
    setPromotionPending(null);
  };

  if (!webglAvailable) {
    return <StaticHeroChessFallback isExpanded={isExpanded} />;
  }

  const isWhiteOrientation = boardOrientation !== "black";
  const topColorChar = isWhiteOrientation ? "b" : "w";
  const bottomColorChar = isWhiteOrientation ? "w" : "b";

  const topIsActive = activeClock === topColorChar;
  const bottomIsActive = activeClock === bottomColorChar;

  const displayTopClock = formatClock(topClockMs ?? 300000);
  const displayBottomClock = formatClock(bottomClockMs ?? 300000);

  return (
    <div
      className="relative w-full aspect-square overflow-hidden rounded-2xl border border-stone-800/60 bg-[#1D1F23] shadow-2xl mx-auto select-none transition-[width,max-width] duration-500 ease-in-out"
      style={{ width: "100%", maxWidth: "100%" }}
    >
      {/* Studio Backdrop Gradient matching photographic reference */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2C2E33]/60 via-[#1E2024]/85 to-[#131416] pointer-events-none" />

      {/* Dual Digital Clocks directly above board top border — matching reference */}
      {showOverlayClocks && (
        <div className="absolute top-2 sm:top-2.5 inset-x-0 flex flex-col items-center pointer-events-none z-10 select-none">
          <div className="relative w-full max-w-[360px] flex items-center justify-center gap-8 sm:gap-14 px-6">
            {/* Subtle horizontal dividing line matching reference */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/15" />

            {/* Left / Top Player Clock */}
            <div
              className={cn(
                "relative z-10 px-2 py-0.5 font-digital text-xl sm:text-2xl font-bold tracking-widest transition-all duration-200",
                topIsActive
                  ? "text-[#00FF55] drop-shadow-[0_0_12px_rgba(0,255,85,0.85)] scale-105"
                  : "text-[#FF9500] drop-shadow-[0_0_8px_rgba(255,149,0,0.55)] opacity-95"
              )}
            >
              {displayTopClock}
            </div>

            {/* Right / Bottom Player Clock */}
            <div
              className={cn(
                "relative z-10 px-2 py-0.5 font-digital text-xl sm:text-2xl font-bold tracking-widest transition-all duration-200",
                bottomIsActive
                  ? "text-[#00FF55] drop-shadow-[0_0_12px_rgba(0,255,85,0.85)] scale-105"
                  : "text-[#FF9500] drop-shadow-[0_0_8px_rgba(255,149,0,0.55)] opacity-95"
              )}
            >
              {displayBottomClock}
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<StaticHeroChessFallback isExpanded={isExpanded} />}>
        <Canvas
          camera={{
            position: [0, 17.5, 6.0],
            fov: 30,
          }}
          dpr={[1, 1.5]}
          gl={{
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            failIfMajorPerformanceCaveat: false,
          }}
          shadows
        >
          <CameraRig isMobile={tier === "mobile"} isExpanded={isExpanded} isFullscreen={isFullscreen} />
          {/* Warm Studio Lighting System matching the reference image */}
          {/* Soft warm ambient lighting */}
          <ambientLight intensity={1.15} color="#FFF8ED" />

          {/* Warm Key Light casting soft contact shadows */}
          <directionalLight
            position={[4.0, 14.0, 6.0]}
            intensity={1.55}
            color="#FFF4DC"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={25}
            shadow-camera-left={-5.5}
            shadow-camera-right={5.5}
            shadow-camera-top={5.5}
            shadow-camera-bottom={-5.5}
            shadow-bias={-0.0003}
            shadow-radius={2}
          />

          {/* Soft Neutral Fill Light to illuminate wood board surface */}
          <directionalLight position={[-5.0, 9.5, -3.0]} intensity={0.6} color="#E4EDF7" />

          {/* Warm Golden/Amber Rim Light (illuminates Dark Mahogany Pieces against the back ranks) */}
          <pointLight position={[0, 8.5, -6.5]} intensity={1.25} color="#FFA534" distance={25} />

          {/* Gentle front bounce light for piece face details */}
          <directionalLight position={[0, 4.0, 8.0]} intensity={0.35} color="#FFEEDD" />

          <ChessBoardScene
            fen={fen}
            boardOrientation={boardOrientation}
            onMove={onMove}
            legalMovesFrom={legalMovesFrom}
            lastMove={lastMove}
            checkSquare={checkSquare}
            interactive={interactive}
            onPromotionRequired={(from, to) => setPromotionPending({ from, to })}
          />
        </Canvas>
      </Suspense>

      {/* Promotion Dialog Overlay (Cleanly rendered outside Canvas in DOM) */}
      {promotionPending && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-amber-600/40 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-foreground">Promote Pawn</h3>
            <p className="text-xs text-muted-foreground">Select a piece to promote your pawn:</p>
            <div className="grid grid-cols-4 gap-3 pt-2">
              {[
                { type: "q", label: "♕ Queen" },
                { type: "r", label: "♖ Rook" },
                { type: "b", label: "♗ Bishop" },
                { type: "n", label: "♘ Knight" },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => handlePromotionSelect(item.type as any)}
                  className="p-3 rounded-xl border border-amber-600/30 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500 text-amber-400 font-bold text-lg transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
