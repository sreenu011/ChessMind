import { useRef } from "react";
import * as THREE from "three";
import { StauntonGeometries } from "./staunton-geometries";
import { whitePieceMaterial, blackPieceMaterial } from "./chess-materials";

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type PieceColor = "white" | "black";

export interface Piece3DProps {
  type: PieceType;
  color: PieceColor;
  square?: string | undefined;
  position?: [number, number, number] | undefined;
  rotation?: [number, number, number] | undefined;
  scale?: number | undefined;
  isAnimated?: boolean | undefined;
  isFeatured?: boolean | undefined;
  boardOrientation?: "white" | "black" | undefined;
}

const mitreSlitMaterial = new THREE.MeshStandardMaterial({
  color: "#200E08",
  roughness: 0.85,
});

export function ChessPiece3D({
  type,
  color,
  square,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  isFeatured = false,
  boardOrientation = "white",
}: Piece3DProps) {
  const meshRef = useRef<THREE.Group>(null!);
  const isWhite = color === "white";
  const material = isWhite ? whitePieceMaterial : blackPieceMaterial;

  // Knight faces forward towards opponent's side, angled inward towards center files
  const isFlipped = boardOrientation === "black";
  const fileIdx = square ? square.charCodeAt(0) - 97 : 1;
  const inwardAngle = fileIdx < 4 ? -0.32 : 0.32;
  const baseAngle = isFlipped
    ? (isWhite ? -Math.PI / 2 : Math.PI / 2)
    : (isWhite ? Math.PI / 2 : -Math.PI / 2);
  const knightYRotation = baseAngle + (isWhite ? inwardAngle : -inwardAngle);

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {type === "pawn" && (
        <mesh
          geometry={StauntonGeometries.pawn}
          material={material}
          castShadow
          receiveShadow
        />
      )}

      {type === "rook" && (
        <group>
          <mesh
            geometry={StauntonGeometries.rookBase}
            material={material}
            castShadow
            receiveShadow
          />
          {/* 4 Castle Turret Merlons (Embrasures) */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
            const r = 0.22;
            const mx = Math.cos(angle) * r;
            const mz = Math.sin(angle) * r;
            return (
              <mesh
                key={idx}
                position={[mx, 0.91, mz]}
                rotation={[0, -angle, 0]}
                material={material}
                castShadow
              >
                <boxGeometry args={[0.07, 0.08, 0.12]} />
              </mesh>
            );
          })}
        </group>
      )}

      {type === "knight" && (
        <group rotation={[0, knightYRotation, 0]}>
          <mesh
            geometry={StauntonGeometries.knightPedestal}
            material={material}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={StauntonGeometries.knightHorse}
            material={material}
            castShadow
            receiveShadow
          />
        </group>
      )}

      {type === "bishop" && (
        <group>
          <mesh
            geometry={StauntonGeometries.bishop}
            material={material}
            castShadow
            receiveShadow
          />
          {/* Mitre Angled Slit / Cutout Accent */}
          <mesh
            position={[0.08, 0.92, 0.08]}
            rotation={[0.3, Math.PI / 4, 0]}
            material={mitreSlitMaterial}
          >
            <boxGeometry args={[0.02, 0.14, 0.08]} />
          </mesh>
        </group>
      )}

      {type === "queen" && (
        <group>
          <mesh
            geometry={StauntonGeometries.queen}
            material={material}
            castShadow
            receiveShadow
          />
          {/* 8 Crown Points / Pearls along coronet rim */}
          {Array.from({ length: 8 }).map((_, idx) => {
            const angle = (idx * Math.PI) / 4;
            const r = 0.25;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * r, 1.05, Math.sin(angle) * r]}
                material={material}
              >
                <sphereGeometry args={[0.025, 8, 8]} />
              </mesh>
            );
          })}
        </group>
      )}

      {type === "king" && (
        <group>
          <mesh
            geometry={StauntonGeometries.kingBody}
            material={material}
            castShadow
            receiveShadow
          />
          {/* Royal Cross Pattee Finial */}
          <group position={[0, 1.25, 0]}>
            {/* Center Finial Orb */}
            <mesh position={[0, 0.02, 0]} material={material}>
              <sphereGeometry args={[0.045, 10, 10]} />
            </mesh>
            {/* Vertical Bar */}
            <mesh position={[0, 0.10, 0]} material={material} castShadow>
              <boxGeometry args={[0.05, 0.15, 0.04]} />
            </mesh>
            {/* Horizontal Bar */}
            <mesh position={[0, 0.12, 0]} material={material} castShadow>
              <boxGeometry args={[0.13, 0.045, 0.04]} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
