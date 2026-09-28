import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SOURCE_PATH = 'C:/Users/p/.gemini/antigravity-ide/brain/29418490-7cf8-4269-b77f-49cc438481eb/.user_uploaded/media_1790573134618.jpg';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function createIco(images) {
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

async function generateAssets() {
  const sourceBuffer = fs.readFileSync(SOURCE_PATH);
  const base64Source = sourceBuffer.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64Source}`;

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

  async function resize(targetWidth, targetHeight = targetWidth) {
    const pngDataUrl = await page.evaluate(({ tw, th }) => {
      const img = document.getElementById('source');
      const canvas = document.getElementById('canvas');
      canvas.width = tw;
      canvas.height = th;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, tw, th);
      ctx.drawImage(img, 0, 0, tw, th);
      return canvas.toDataURL('image/png');
    }, { tw: targetWidth, th: targetHeight });

    const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  // 1. Generate public/logo.png (512x512 is optimal for web performance & retina displays up to 4x)
  const logoBuf = await resize(512);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'logo.png'), logoBuf);
  console.log(`Generated public/logo.png (${logoBuf.length} bytes, 512x512)`);

  // 2. Generate 1024x1024 icon
  const icon1024Buf = await resize(1024);
  console.log(`1024x1024 png size: ${icon1024Buf.length} bytes`);

  // 3. Generate icon-512x512.png
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512x512.png'), logoBuf);
  console.log('Updated public/icon-512x512.png');

  // 4. Generate icon-192x192.png
  const icon192Buf = await resize(192);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192x192.png'), icon192Buf);
  console.log('Updated public/icon-192x192.png');

  // 5. Generate apple-touch-icon.png (180x180)
  const appleTouchBuf = await resize(180);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'), appleTouchBuf);
  console.log('Updated public/apple-touch-icon.png');

  // 6. Generate favicon-48x48.png
  const fav48Buf = await resize(48);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-48x48.png'), fav48Buf);
  console.log('Updated public/favicon-48x48.png');

  // 7. Generate favicon-32x32.png
  const fav32Buf = await resize(32);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), fav32Buf);
  console.log('Updated public/favicon-32x32.png');

  // 8. Generate favicon-16x16.png
  const fav16Buf = await resize(16);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-16x16.png'), fav16Buf);
  console.log('Updated public/favicon-16x16.png');

  // 9. Generate multi-resolution favicon.ico
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: fav16Buf },
    { width: 32, height: 32, buffer: fav32Buf },
    { width: 48, height: 48, buffer: fav48Buf },
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log(`Updated public/favicon.ico (${icoBuffer.length} bytes)`);

  // 10. Generate favicon.svg embedding the logo PNG
  const logoBase64 = logoBuf.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,${logoBase64}" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent, 'utf8');
  console.log('Updated public/favicon.svg');

  await browser.close();
  console.log('All logo and favicon assets successfully generated!');
}

generateAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
