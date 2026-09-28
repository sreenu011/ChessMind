import { chromium } from "playwright";

async function main() {
  console.log("Launching Edge browser to capture screenshots...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    // 1. 1440x900 Desktop
    console.log("Navigating to /play/computer at 1440x900...");
    const ctx1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page1440 = await ctx1440.newPage();
    page1440.on("console", (msg) => console.log("PAGE LOG:", msg.type(), msg.text()));
    page1440.on("pageerror", (err) => console.error("PAGE ERROR:", err));
    await page1440.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page1440.waitForSelector("canvas", { timeout: 15000 });
    // Wait for textures and 3D scene to fully render
    await page1440.waitForTimeout(3000);
    await page1440.screenshot({ path: "scratch/board_1440.png" });
    console.log("Saved scratch/board_1440.png");

    // Click on a piece (e.g. pawn on e2 or e4) to see legal moves and highlights
    // Let's also capture an interactive state
    // First, start game if not started:
    const startBtn = await page1440.$("button:has-text('START GAME')");
    if (startBtn) {
      console.log("Clicking START GAME...");
      await startBtn.click();
      await page1440.waitForTimeout(1000);
    }

    // Click on canvas to select e2 pawn (center-right area near front)
    // Board canvas bounding box
    const canvas = await page1440.$("canvas");
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        // e2 is file 4 (index 4 of 0-7), rank 1 (from bottom)
        // Click near center bottom of board
        const clickX = box.x + box.width * 0.55;
        const clickY = box.y + box.height * 0.68;
        await page1440.mouse.click(clickX, clickY);
        await page1440.waitForTimeout(1000);
        await page1440.screenshot({ path: "scratch/board_selected_1440.png" });
        console.log("Saved scratch/board_selected_1440.png");
      }
    }

    // 2. 1024x768 Tablet
    console.log("Navigating to /play/computer at 1024x768...");
    const ctx1024 = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    const page1024 = await ctx1024.newPage();
    await page1024.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page1024.waitForSelector("canvas", { timeout: 15000 });
    await page1024.waitForTimeout(2500);
    await page1024.screenshot({ path: "scratch/board_1024.png" });
    console.log("Saved scratch/board_1024.png");

    // 3. 390x844 Mobile
    console.log("Navigating to /play/computer at 390x844...");
    const ctx390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page390 = await ctx390.newPage();
    await page390.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page390.waitForSelector("canvas", { timeout: 15000 });
    await page390.waitForTimeout(2500);
    await page390.screenshot({ path: "scratch/board_390.png" });
    console.log("Saved scratch/board_390.png");

  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

main();
