import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SOURCE_IMAGE_PATH = 'C:\\Users\\p\\.gemini\\antigravity-ide\\brain\\243a55af-01ca-40e7-a25d-02e6610d4b14\\.user_uploaded\\media_1790534110468.png';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function createIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 for icon
  header.writeUInt16LE(count, 4); // count

  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
}

async function run() {
  if (!fs.existsSync(SOURCE_IMAGE_PATH)) {
    throw new Error('Source image not found at ' + SOURCE_IMAGE_PATH);
  }

  const sourceBuffer = fs.readFileSync(SOURCE_IMAGE_PATH);
  const base64Source = sourceBuffer.toString('base64');
  const dataUri = `data:image/png;base64,${base64Source}`;

  console.log(`Source image size: ${sourceBuffer.length} bytes`);

  // Generate SVG with exact base64 source representation
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="${dataUri}" width="512" height="512" />
</svg>
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent, 'utf8');
  console.log('Created public/favicon.svg');

  // Copy exact 512x512 original to public
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512x512.png'), sourceBuffer);
  console.log('Created public/icon-512x512.png');

  // Launch headless browser to generate crisp raster assets via canvas
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: transparent; }
        </style>
      </head>
      <body>
        <img id="source" src="${dataUri}" />
        <canvas id="canvas"></canvas>
      </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForSelector('#source');

  // Function to resize via canvas with high quality
  async function resize(size) {
    const pngDataUrl = await page.evaluate((targetSize) => {
      const img = document.getElementById('source');
      const canvas = document.getElementById('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.drawImage(img, 0, 0, targetSize, targetSize);
      return canvas.toDataURL('image/png');
    }, size);

    const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  const buf16 = await resize(16);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-16x16.png'), buf16);
  console.log('Created public/favicon-16x16.png');

  const buf32 = await resize(32);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), buf32);
  console.log('Created public/favicon-32x32.png');

  const buf48 = await resize(48);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-48x48.png'), buf48);
  console.log('Created public/favicon-48x48.png');

  const buf180 = await resize(180);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), buf180);
  console.log('Created public/apple-touch-icon.png');

  const buf192 = await resize(192);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192x192.png'), buf192);
  console.log('Created public/icon-192x192.png');

  // Create favicon.ico containing 16x16, 32x32, and 48x48
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: buf16 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 48, height: 48, buffer: buf48 },
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log(`Created public/favicon.ico (${icoBuffer.length} bytes, 16x16 + 32x32 + 48x48)`);

  await browser.close();
  console.log('All favicon assets generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
