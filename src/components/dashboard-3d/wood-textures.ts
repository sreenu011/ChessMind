import * as THREE from "three";

/**
 * Procedural Wood Textures Generator for Photorealistic Chessboard
 * Generates lightweight, high-fidelity canvas textures for:
 * 1. Warm Maple / Ivory Light Wood squares (with vertical grain & subtle pores)
 * 2. Dark Walnut / Mahogany Dark Wood squares (with rich reddish-brown wood fibers)
 * 3. Deep Mahogany / Rosewood Beveled Frame
 * 
 * Zero network request overhead, instant in-memory generation, perfect 60fps performance.
 */

// Cached textures to prevent duplicate allocations
let cachedLightWoodTexture: THREE.CanvasTexture | null = null;
let cachedDarkWoodTexture: THREE.CanvasTexture | null = null;
let cachedFrameWoodTexture: THREE.CanvasTexture | null = null;

function createNoise(ctx: CanvasRenderingContext2D, width: number, height: number, opacity: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 255 * opacity;
    data[i] = Math.min(255, Math.max(0, data[i]! + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1]! + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2]! + grain));
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Generate Maple / Ivory Light Wood Texture with vertical grain
 */
export function getLightWoodTexture(): THREE.CanvasTexture {
  if (cachedLightWoodTexture) return cachedLightWoodTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Base warm natural maple / cream tone matching reference
    ctx.fillStyle = "#DFCFAF";
    ctx.fillRect(0, 0, 512, 512);

    // Natural vertical grain bands
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0.0, "rgba(215, 198, 168, 0.45)");
    grad.addColorStop(0.2, "rgba(235, 222, 196, 0.6)");
    grad.addColorStop(0.4, "rgba(208, 190, 158, 0.5)");
    grad.addColorStop(0.65, "rgba(240, 228, 206, 0.55)");
    grad.addColorStop(0.85, "rgba(218, 202, 172, 0.5)");
    grad.addColorStop(1.0, "rgba(225, 210, 182, 0.45)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Fine organic vertical grain lines
    ctx.strokeStyle = "rgba(165, 142, 108, 0.15)";
    ctx.lineWidth = 1.0;
    for (let x = 0; x < 512; x += 3 + Math.random() * 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      const wave = (Math.random() - 0.5) * 5;
      ctx.bezierCurveTo(x + wave, 170, x - wave, 340, x + (Math.random() - 0.5) * 3, 512);
      ctx.stroke();
    }

    // Secondary subtle grain streaks
    ctx.strokeStyle = "rgba(135, 112, 82, 0.09)";
    ctx.lineWidth = 1.6;
    for (let x = 0; x < 512; x += 7 + Math.random() * 11) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + (Math.random() - 0.5) * 6, 512);
      ctx.stroke();
    }

    // Micro-pores
    createNoise(ctx, 512, 512, 0.03);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedLightWoodTexture = texture;
  return texture;
}

/**
 * Generate Medium-Dark Walnut Wood Texture with rich vertical grain
 * (Warm walnut wood tone, NOT pure black, matching reference image)
 */
export function getDarkWoodTexture(): THREE.CanvasTexture {
  if (cachedDarkWoodTexture) return cachedDarkWoodTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Rich medium-dark walnut base tone (calibrated to reference image)
    ctx.fillStyle = "#462D1E";
    ctx.fillRect(0, 0, 512, 512);

    // Vertical walnut wood grain bands
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0.0, "rgba(58, 35, 22, 0.55)");
    grad.addColorStop(0.2, "rgba(82, 52, 34, 0.65)");
    grad.addColorStop(0.45, "rgba(52, 31, 19, 0.6)");
    grad.addColorStop(0.7, "rgba(88, 56, 38, 0.6)");
    grad.addColorStop(0.88, "rgba(64, 40, 26, 0.55)");
    grad.addColorStop(1.0, "rgba(54, 33, 21, 0.5)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Deep walnut grain lines
    ctx.strokeStyle = "rgba(38, 22, 13, 0.4)";
    ctx.lineWidth = 1.2;
    for (let x = 0; x < 512; x += 4 + Math.random() * 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      const wave = (Math.random() - 0.5) * 6;
      ctx.bezierCurveTo(x + wave, 160, x - wave, 350, x + (Math.random() - 0.5) * 5, 512);
      ctx.stroke();
    }

    // Warm reddish-amber grain highlights
    ctx.strokeStyle = "rgba(115, 72, 48, 0.28)";
    ctx.lineWidth = 2.0;
    for (let x = 0; x < 512; x += 9 + Math.random() * 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + (Math.random() - 0.5) * 4, 512);
      ctx.stroke();
    }

    // Wood micro-grain
    createNoise(ctx, 512, 512, 0.035);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  cachedDarkWoodTexture = texture;
  return texture;
}

/**
 * Generate Mahogany / Rosewood Outer Frame Texture with crisp engraved coordinates
 */
export function getBoardFrameTexture(orientation: "white" | "black" = "white"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Deep reddish-brown mahogany base matching reference frame
    ctx.fillStyle = "#381710";
    ctx.fillRect(0, 0, 1024, 1024);

    // Warm mahogany wood gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0.0, "rgba(50, 20, 14, 0.6)");
    grad.addColorStop(0.25, "rgba(72, 32, 22, 0.55)");
    grad.addColorStop(0.5, "rgba(46, 18, 12, 0.7)");
    grad.addColorStop(0.75, "rgba(68, 30, 20, 0.55)");
    grad.addColorStop(1.0, "rgba(52, 22, 15, 0.6)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine wood grain lines
    ctx.strokeStyle = "rgba(25, 8, 5, 0.4)";
    ctx.lineWidth = 1.4;
    for (let x = 0; x < 1024; x += 6 + Math.random() * 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + (Math.random() - 0.5) * 6, 1024);
      ctx.stroke();
    }

    createNoise(ctx, 1024, 1024, 0.025);

    // 2. Bevel border line (golden bronze trim inlay)
    // Board playing field occupies the central 85.1% (from 76px to 948px)
    const margin = 76;
    const playSize = 1024 - margin * 2;
    const sqSize = playSize / 8;

    // Golden bronze bevel rim
    ctx.strokeStyle = "rgba(180, 125, 45, 0.75)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(margin - 1, margin - 1, playSize + 2, playSize + 2);

    // Inner subtle highlight line
    ctx.strokeStyle = "rgba(225, 175, 75, 0.35)";
    ctx.lineWidth = 1.0;
    ctx.strokeRect(margin - 2, margin - 2, playSize + 4, playSize + 4);

    // 3. Crisp coordinates along the border matching reference
    ctx.font = "bold 23px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif";
    ctx.fillStyle = "#EAE0D5";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    const files = orientation === "white"
      ? ["a", "b", "c", "d", "e", "f", "g", "h"]
      : ["h", "g", "f", "e", "d", "c", "b", "a"];
    const ranks = orientation === "white"
      ? ["8", "7", "6", "5", "4", "3", "2", "1"]
      : ["1", "2", "3", "4", "5", "6", "7", "8"];

    // File coordinates along the bottom frame margin
    const bottomY = 1024 - margin / 2 + 1;
    files.forEach((fileChar, i) => {
      const centerX = margin + i * sqSize + sqSize / 2;
      ctx.fillText(fileChar, centerX, bottomY);
    });

    // Rank coordinates along the left frame margin
    const leftX = margin / 2 - 1;
    ranks.forEach((rankChar, i) => {
      const centerY = margin + i * sqSize + sqSize / 2;
      ctx.fillText(rankChar, leftX, centerY);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
