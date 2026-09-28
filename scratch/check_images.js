import { chromium } from '@playwright/test';
import fs from 'fs';

async function inspect() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const p1 = 'C:/Users/p/.gemini/antigravity-ide/brain/29418490-7cf8-4269-b77f-49cc438481eb/.user_uploaded/media_1790573134618.jpg';
  const p2 = 'C:/Users/p/.gemini/antigravity-ide/brain/243a55af-01ca-40e7-a25d-02e6610d4b14/.user_uploaded/media_1790534110468.png';
  
  for (const [name, p] of [['img1 (1024 jpg)', p1], ['img2 (512 png)', p2]]) {
    const buf = fs.readFileSync(p);
    const b64 = buf.toString('base64');
    const mime = p.endsWith('.png') ? 'image/png' : 'image/jpeg';
    await page.setContent(`<img id="img" src="data:${mime};base64,${b64}" /><canvas id="cvs"></canvas>`);
    const corners = await page.evaluate(() => {
      const img = document.getElementById('img');
      const cvs = document.getElementById('cvs');
      cvs.width = img.naturalWidth;
      cvs.height = img.naturalHeight;
      const ctx = cvs.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const p00 = ctx.getImageData(0, 0, 1, 1).data;
      const p10_10 = ctx.getImageData(10, 10, 1, 1).data;
      const pCenter = ctx.getImageData(Math.floor(img.naturalWidth/2), Math.floor(img.naturalHeight/2), 1, 1).data;
      return {
        p00: Array.from(p00),
        p10_10: Array.from(p10_10),
        pCenter: Array.from(pCenter)
      };
    });
    console.log(name, JSON.stringify(corners));
  }
  await browser.close();
}
inspect().catch(console.error);
