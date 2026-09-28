import * as THREE from "three";
import { getLightWoodTexture, getDarkWoodTexture, getBoardFrameTexture } from "./wood-textures";

/**
 * Photorealistic Materials for ChessMind 3D Chessboard & Staunton Pieces
 * Matched to the reference image:
 * - White Pieces: Warm Ivory / Cream with delicate specular highlights
 * - Black Pieces: Dark Reddish-Brown Mahogany / Espresso Wood (NOT silhouettes!)
 * - Light Wood Squares: Natural Maple / Ivory Wood with vertical grain
 * - Dark Wood Squares: Dark Walnut / Mahogany with vertical grain
 * - Board Frame: Deep Mahogany / Rosewood with satin bevel
 * - Highlights: Translucent Emerald Green for legal moves, Golden Amber for selection, Vivid Crimson for check
 */

// White Pieces: Warm Ivory / Polished Cream Lacquer
export const whitePieceMaterial = new THREE.MeshStandardMaterial({
  color: "#F5EDE2",
  roughness: 0.22,
  metalness: 0.04,
  envMapIntensity: 0.7,
});

// Black Pieces: Rich Dark Reddish-Brown Mahogany / Cherry Wood Lacquer
// Distinctly reddish-brown and warm so pieces never become flat black silhouettes
export const blackPieceMaterial = new THREE.MeshStandardMaterial({
  color: "#522116",
  roughness: 0.22,
  metalness: 0.12,
  envMapIntensity: 0.9,
});

// Light Board Square Material (Warm Maple / Ivory Wood)
export function createLightTileMaterial(): THREE.MeshStandardMaterial {
  const texture = getLightWoodTexture();
  return new THREE.MeshStandardMaterial({
    map: texture,
    color: "#FFFFFF",
    roughness: 0.28,
    metalness: 0.02,
  });
}

// Dark Board Square Material (Medium-Dark Walnut Wood)
export function createDarkTileMaterial(): THREE.MeshStandardMaterial {
  const texture = getDarkWoodTexture();
  return new THREE.MeshStandardMaterial({
    map: texture,
    color: "#FFFFFF",
    roughness: 0.30,
    metalness: 0.04,
  });
}

// Beveled Outer Board Frame Material with engraved coordinates
export function createFrameMaterial(orientation: "white" | "black" = "white"): THREE.MeshStandardMaterial {
  const texture = getBoardFrameTexture(orientation);
  return new THREE.MeshStandardMaterial({
    map: texture,
    color: "#FFFFFF",
    roughness: 0.30,
    metalness: 0.08,
  });
}

// Raised Edge / Bevel Trim Material (Warm Polished Mahogany Wood with bronze sheen)
export function createBevelTrimMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#4A1E15",
    roughness: 0.22,
    metalness: 0.20,
  });
}

// ==========================================
// Interactive Square Highlight Materials
// ==========================================

// Selected Square: Thin Warm Gold / Bronze Outline & Wash
export const selectedTileMaterial = new THREE.MeshStandardMaterial({
  color: "#D97706",
  roughness: 0.2,
  metalness: 0.1,
  emissive: "#B45309",
  emissiveIntensity: 0.6,
  transparent: true,
  opacity: 0.75,
});

// Last Move Square: Subtle Warm Amber Glow
export const lastMoveTileMaterial = new THREE.MeshStandardMaterial({
  color: "#B45309",
  roughness: 0.3,
  emissive: "#78350F",
  emissiveIntensity: 0.35,
  transparent: true,
  opacity: 0.5,
});

// King In Check: Vivid Red / Subtle Glow (keeps piece visible)
export const checkTileMaterial = new THREE.MeshStandardMaterial({
  color: "#DC2626",
  roughness: 0.25,
  emissive: "#991B1B",
  emissiveIntensity: 0.7,
  transparent: true,
  opacity: 0.65,
});

// Legal Move Target Square: Translucent Glowing Emerald Green
// Perfectly matching the green glowing wash in the reference image (h3/h4)
export const legalMoveTileMaterial = new THREE.MeshStandardMaterial({
  color: "#16A34A",
  emissive: "#22C55E",
  emissiveIntensity: 0.92,
  roughness: 0.15,
  transparent: true,
  opacity: 0.72,
});

// Legal Move Capture Ring / Indicator: Clear Green / Bronze Ring
export const legalCaptureTileMaterial = new THREE.MeshStandardMaterial({
  color: "#22C55E",
  emissive: "#16A34A",
  emissiveIntensity: 0.85,
  roughness: 0.15,
  transparent: true,
  opacity: 0.85,
});
