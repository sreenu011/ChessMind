import { chromium } from "playwright";

async function run() {
  console.log("Starting comprehensive 3D Chessboard QA...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    // 1. Desktop 1440x900 - Unstarted & Started
    console.log("--- Testing Desktop 1440x900 ---");
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page1440.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page1440.waitForSelector("canvas", { timeout: 15000 });
    await page1440.waitForTimeout(2000);
    await page1440.screenshot({ path: "scratch/qa_1440_unstarted.png" });
    console.log("Saved scratch/qa_1440_unstarted.png");

    // Click START GAME
    const startBtn = await page1440.$("button:has-text('START GAME')");
    if (startBtn) {
      await startBtn.click();
      await page1440.waitForTimeout(1000);
    }
    await page1440.screenshot({ path: "scratch/qa_1440_started.png" });
    console.log("Saved scratch/qa_1440_started.png");

    // Click e2 pawn to see legal moves highlight (translucent emerald glow on e3, e4)
    const canvas1440 = await page1440.$("canvas");
    if (canvas1440) {
      const box = await canvas1440.boundingBox();
      if (box) {
        // e2 is index 4 (0..7) in X, index 1 (0..7) in Y from bottom
        const e2X = box.x + box.width * 0.56;
        const e2Y = box.y + box.height * 0.74;
        await page1440.mouse.click(e2X, e2Y);
        await page1440.waitForTimeout(800);
        await page1440.screenshot({ path: "scratch/qa_1440_selected_e2.png" });
        console.log("Saved scratch/qa_1440_selected_e2.png");

        // Move to e4
        const e4X = box.x + box.width * 0.56;
        const e4Y = box.y + box.height * 0.58;
        await page1440.mouse.click(e4X, e4Y);
        await page1440.waitForTimeout(1200);
        await page1440.screenshot({ path: "scratch/qa_1440_after_e4.png" });
        console.log("Saved scratch/qa_1440_after_e4.png");

        // Wait for engine response
        await page1440.waitForTimeout(2500);
        await page1440.screenshot({ path: "scratch/qa_1440_engine_response.png" });
        console.log("Saved scratch/qa_1440_engine_response.png");
      }
    }

    // Test Flip Board
    const flipBtn = await page1440.$("button:has-text('Flip Board')");
    if (flipBtn) {
      console.log("Clicking Flip Board...");
      await flipBtn.click();
      await page1440.waitForTimeout(1200);
      await page1440.screenshot({ path: "scratch/qa_1440_flipped.png" });
      console.log("Saved scratch/qa_1440_flipped.png");
    }

    // 2. Tablet 1024x768
    console.log("--- Testing Tablet 1024x768 ---");
    const page1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    await page1024.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page1024.waitForSelector("canvas", { timeout: 15000 });
    await page1024.waitForTimeout(1500);
    const startBtn1024 = await page1024.$("button:has-text('START GAME')");
    if (startBtn1024) await startBtn1024.click();
    await page1024.waitForTimeout(1000);
    await page1024.screenshot({ path: "scratch/qa_1024_started.png" });
    console.log("Saved scratch/qa_1024_started.png");

    // 3. Mobile 390x844
    console.log("--- Testing Mobile 390x844 ---");
    const page390 = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page390.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page390.waitForSelector("canvas", { timeout: 15000 });
    await page390.waitForTimeout(1500);
    const startBtn390 = await page390.$("button:has-text('START GAME')");
    if (startBtn390) await startBtn390.click();
    await page390.waitForTimeout(1000);
    await page390.screenshot({ path: "scratch/qa_390_started.png" });
    console.log("Saved scratch/qa_390_started.png");

  } catch (err) {
    console.error("QA Error:", err);
  } finally {
    await browser.close();
  }
}

run();
