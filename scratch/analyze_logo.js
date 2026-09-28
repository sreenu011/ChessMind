import { chromium } from '@playwright/test';
import fs from 'fs';

async function analyze() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const p1 = 'C:/Users/p/.gemini/antigravity-ide/brain/29418490-7cf8-4269-b77f-49cc438481eb/.user_uploaded/media_1790573134618.jpg';
  const buf = fs.readFileSync(p1);
  const b64 = buf.toString('base64');
  await page.setContent(`<img id="img" src="data:image/jpeg;base64,${b64}" /><canvas id="cvs"></canvas>`);
  
  const report = await page.evaluate(() => {
    const img = document.getElementById('img');
    const cvs = document.getElementById('cvs');
    cvs.width = img.naturalWidth;
    cvs.height = img.naturalHeight;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Sample along diagonal (0,0) to (512,512)
    const samples = [];
    for (let d = 0; d <= 200; d += 10) {
      const p = ctx.getImageData(d, d, 1, 1).data;
      samples.push({ d, r: p[0], g: p[1], b: p[2], a: p[3] });
    }
    
    // Check (0, 512), (512, 0)
    const topEdge = [];
    for (let y = 0; y <= 80; y += 5) {
      const p = ctx.getImageData(512, y, 1, 1).data;
      topEdge.push({ y, r: p[0], g: p[1], b: p[2] });
    }

    return { samples, topEdge };
  });

  console.log('Diagonal samples from corner towards center:');
  console.log(JSON.stringify(report.samples, null, 2));
  console.log('Top edge samples (x=512, y=0..80):');
  console.log(JSON.stringify(report.topEdge, null, 2));

  await browser.close();
}
analyze().catch(console.error);
