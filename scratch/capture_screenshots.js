import { chromium } from "playwright";

async function captureScreenshots() {
  console.log("Capturing screenshots of redesigned 3D Playable Board...");
  const browser = await chromium.launch({ headless: true });

  try {
    // 1440px Desktop
    const context1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page1440 = await context1440.newPage();
    await page1440.goto("http://127.0.0.1:3000/play/computer", { waitUntil: "domcontentloaded" });
    await page1440.waitForSelector("canvas, [data-chess-board-container]", { timeout: 10000 });
    await page1440.waitForTimeout(2000);
    await page1440.screenshot({ path: "scratch/board_redesign_1440.png", fullPage: true });
    console.log("Captured 1440px screenshot: scratch/board_redesign_1440.png");

    // 390px Mobile
    const context390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page390 = await context390.newPage();
    await page390.goto("http://127.0.0.1:3000/play/computer", { waitUntil: "domcontentloaded" });
    await page390.waitForSelector("canvas, [data-chess-board-container]", { timeout: 10000 });
    await page390.waitForTimeout(2000);
    await page390.screenshot({ path: "scratch/board_redesign_390.png", fullPage: true });
    console.log("Captured 390px screenshot: scratch/board_redesign_390.png");

  } catch (err) {
    console.error("Screenshot error:", err);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
