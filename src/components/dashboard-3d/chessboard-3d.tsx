import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ChessPiece3D } from "./chess-pieces-3d";
import {
  createLightTileMaterial,
  createDarkTileMaterial,
  createFrameMaterial,
  createBevelTrimMaterial,
} from "./chess-materials";

interface Chessboard3DProps {
  isMobile?: boolean;
}

const tileGeometry = new THREE.BoxGeometry(0.98, 0.08, 0.98);
const frameGeometry = new THREE.BoxGeometry(9.4, 0.38, 9.4);
const borderGeometry = new THREE.BoxGeometry(8.02, 0.09, 8.02);

// Meaningful tactical chess position setup
const piecePositions: Array<{
  type: "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
  color: "white" | "black";
  pos: [number, number, number];
  isAnimated?: boolean;
  isFeatured?: boolean;
}> = [
  // White Pieces
  { type: "king", color: "white", pos: [1.5, 0.2, 3.5] },
  { type: "rook", color: "white", pos: [0.5, 0.2, 3.5], isAnimated: true },
  { type: "queen", color: "white", pos: [3.5, 0.2, -0.5], isFeatured: true },
  { type: "knight", color: "white", pos: [1.5, 0.2, 1.5], isAnimated: true },
  { type: "bishop", color: "white", pos: [0.5, 0.2, 0.5] },
  { type: "pawn", color: "white", pos: [-3.5, 0.2, 2.5] },
  { type: "pawn", color: "white", pos: [-2.5, 0.2, 2.5] },
  { type: "pawn", color: "white", pos: [-0.5, 0.2, 1.5] },
  { type: "pawn", color: "white", pos: [0.5, 0.2, 2.5] },
  { type: "pawn", color: "white", pos: [1.5, 0.2, 2.5] },
  { type: "pawn", color: "white", pos: [2.5, 0.2, 2.5] },

  // Black Pieces
  { type: "king", color: "black", pos: [1.5, 0.2, -3.5] },
  { type: "rook", color: "black", pos: [0.5, 0.2, -3.5] },
  { type: "queen", color: "black", pos: [-0.5, 0.2, -3.5] },
  { type: "knight", color: "black", pos: [-1.5, 0.2, -1.5] },
  { type: "bishop", color: "black", pos: [2.5, 0.2, -3.5] },
  { type: "pawn", color: "black", pos: [-3.5, 0.2, -2.5] },
  { type: "pawn", color: "black", pos: [-2.5, 0.2, -2.5] },
  { type: "pawn", color: "black", pos: [0.5, 0.2, -0.5] },
  { type: "pawn", color: "black", pos: [1.5, 0.2, -2.5] },
  { type: "pawn", color: "black", pos: [2.5, 0.2, -2.5] },
];

export function Chessboard3D({ isMobile = false }: Chessboard3DProps) {
  const groupRef = useRef<THREE.Group>(null!);

  // Mouse Parallax Effect on Desktop only
  useFrame((state) => {
    if (!groupRef.current || isMobile) return;

    const targetRotX = 0.45 + state.pointer.y * 0.06;
    const targetRotY = -0.3 + state.pointer.x * 0.1;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
  });

  const lightTileMat = useMemo(() => createLightTileMaterial(), []);
  const darkTileMat = useMemo(() => createDarkTileMaterial(), []);
  const frameMat = useMemo(() => createFrameMaterial("white"), []);
  const bevelTrimMat = useMemo(() => createBevelTrimMaterial(), []);

  // Calculate instanced matrices for 32 dark & 32 light tiles
  const { darkMatrices, lightMatrices } = useMemo(() => {
    const darks: THREE.Matrix4[] = [];
    const lights: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 === 1;
        const x = col - 3.5;
        const z = row - 3.5;

        dummy.position.set(x, 0.05, z);
        dummy.updateMatrix();

        if (isDark) {
          darks.push(dummy.matrix.clone());
        } else {
          lights.push(dummy.matrix.clone());
        }
      }
    }
    return { darkMatrices: darks, lightMatrices: lights };
  }, []);

  return (
    <group ref={groupRef} rotation={[0.42, -0.25, 0]} position={[0, -0.5, 0]}>
      {/* Board Base Frame */}
      <mesh position={[0, -0.18, 0]} geometry={frameGeometry} material={frameMat} receiveShadow />

      {/* Gold/Bronze Bevel Trim */}
      <mesh position={[0, 0.015, 0]} geometry={borderGeometry} material={bevelTrimMat} />

      {/* Instanced Dark Tiles */}
      <InstancedTiles matrices={darkMatrices} material={darkTileMat} />

      {/* Instanced Light Tiles */}
      <InstancedTiles matrices={lightMatrices} material={lightTileMat} />

      {/* Render Optimized 3D Chess Pieces */}
      {piecePositions.map((p, idx) => (
        <ChessPiece3D
          key={idx}
          type={p.type}
          color={p.color}
          position={p.pos}
          isAnimated={!isMobile && p.isAnimated}
          isFeatured={!isMobile && p.isFeatured}
          scale={0.85}
        />
      ))}
    </group>
  );
}

function InstancedTiles({ matrices, material }: { matrices: THREE.Matrix4[]; material: THREE.Material }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  useMemo(() => {
    // Set initial instance matrices on mount
    setTimeout(() => {
      if (!meshRef.current) return;
      matrices.forEach((mat, idx) => {
        meshRef.current.setMatrixAt(idx, mat);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }, 0);
  }, [matrices]);

  return <instancedMesh ref={meshRef} args={[tileGeometry, material, matrices.length]} receiveShadow />;
}
