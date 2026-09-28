import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function testTransparency() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const p1 = 'C:/Users/p/.gemini/antigravity-ide/brain/29418490-7cf8-4269-b77f-49cc438481eb/.user_uploaded/media_1790573134618.jpg';
  const buf = fs.readFileSync(p1);
  const b64 = buf.toString('base64');
  
  await page.setContent(`<img id="img" src="data:image/jpeg;base64,${b64}" /><canvas id="cvs"></canvas>`);
  
  const pngDataUrl = await page.evaluate(() => {
    const img = document.getElementById('img');
    const cvs = document.getElementById('cvs');
    cvs.width = 1024;
    cvs.height = 1024;
    const ctx = cvs.getContext('2d');
    ctx.drawImage(img, 0, 0, 1024, 1024);
    
    // Flood fill corners from 4 corners
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    
    const visited = new Uint8Array(1024 * 1024);
    const queue = [];
    
    function addPoint(x, y) {
      if (x < 0 || x >= 1024 || y < 0 || y >= 1024) return;
      const idx = y * 1024 + x;
      if (visited[idx]) return;
      
      const pIdx = idx * 4;
      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];
      
      // Stop flood fill at the gold border (where brightness or color is high)
      // The outer margin is pure black (r < 15, g < 15, b < 15)
      if (r < 25 && g < 25 && b < 25) {
        visited[idx] = 1;
        queue.push((y << 12) | x);
      }
    }
    
    // Start from 4 corners
    addPoint(0, 0);
    addPoint(1023, 0);
    addPoint(0, 1023);
    addPoint(1023, 1023);
    
    let head = 0;
    while (head < queue.length) {
      const val = queue[head++];
      const x = val & 0xFFF;
      const y = val >> 12;
      
      addPoint(x + 1, y);
      addPoint(x - 1, y);
      addPoint(x, y + 1);
      addPoint(x, y - 1);
    }
    
    console.log('Flooded outer pixels count:', queue.length);
    
    // Make visited outer black pixels transparent with slight antialiasing
    for (let i = 0; i < 1024 * 1024; i++) {
      if (visited[i]) {
        data[i * 4 + 3] = 0;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    return cvs.toDataURL('image/png');
  });

  const base64Data = pngDataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync('scratch/test_transparent_logo.png', Buffer.from(base64Data, 'base64'));
  console.log('Saved scratch/test_transparent_logo.png');

  await browser.close();
}
testTransparency().catch(console.error);
