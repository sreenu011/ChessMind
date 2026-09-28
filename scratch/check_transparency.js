import { chromium } from '@playwright/test';
import fs from 'fs';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const buf = fs.readFileSync('scratch/test_transparent_logo.png');
  const b64 = buf.toString('base64');
  await page.setContent(`<img id="img" src="data:image/png;base64,${b64}" /><canvas id="cvs"></canvas>`);
  const res = await page.evaluate(() => {
    const img = document.getElementById('img');
    const cvs = document.getElementById('cvs');
    cvs.width = 1024;
    cvs.height = 1024;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, 1024, 1024).data;
    let transparentInCenter = 0;
    let opaqueInside = 0;
    for (let y = 100; y < 900; y++) {
      for (let x = 100; x < 900; x++) {
        const a = data[(y * 1024 + x) * 4 + 3];
        if (a === 0) transparentInCenter++;
        else opaqueInside++;
      }
    }
    const c00 = [data[0], data[1], data[2], data[3]];
    const cCenter = [data[(512 * 1024 + 512) * 4], data[(512 * 1024 + 512) * 4 + 1], data[(512 * 1024 + 512) * 4 + 2], data[(512 * 1024 + 512) * 4 + 3]];
    return { transparentInCenter, opaqueInside, cornerAlpha: c00, centerData: cCenter };
  });
  console.log(res);
  await browser.close();
}
check().catch(console.error);
