import { chromium } from '@playwright/test';
import fs from 'fs';

async function findGoldBorder() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const p1 = 'C:/Users/p/.gemini/antigravity-ide/brain/29418490-7cf8-4269-b77f-49cc438481eb/.user_uploaded/media_1790573134618.jpg';
  const buf = fs.readFileSync(p1);
  const b64 = buf.toString('base64');
  await page.setContent(`<img id="img" src="data:image/jpeg;base64,${b64}" /><canvas id="cvs"></canvas>`);
  
  const bbox = await page.evaluate(() => {
    const img = document.getElementById('img');
    const cvs = document.getElementById('cvs');
    cvs.width = img.naturalWidth;
    cvs.height = img.naturalHeight;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, 1024, 1024).data;

    let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
    // Consider pixel non-black if r > 20 or g > 20 or b > 20
    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        const idx = (y * 1024 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        if (r > 25 || g > 25 || b > 25) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    return { minX, maxX, minY, maxY };
  });

  console.log('Bounding box of non-black content:', bbox);
  await browser.close();
}
findGoldBorder().catch(console.error);
