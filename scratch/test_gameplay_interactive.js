import { chromium } from "playwright";

async function main() {
  console.log("Launching Edge to test gameplay, legal move highlights, and piece move animation...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on("console", (msg) => console.log("PAGE:", msg.type(), msg.text()));
    page.on("pageerror", (err) => console.error("PAGE ERROR:", err));

    await page.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(2000);

    // 1. Start the game
    const startBtn = await page.$("button:has-text('START GAME')");
    if (startBtn) {
      console.log("Clicking START GAME...");
      await startBtn.click();
      await page.waitForTimeout(1000);
    }

    const canvas = await page.$("canvas");
    if (!canvas) throw new Error("Canvas element not found");
    const box = await canvas.boundingBox();
    if (!box) throw new Error("Canvas box not found");

    // Click on pawn e2 (Rank 2 is at ~0.72):
    console.log("Clicking pawn on e2...");
    const e2X = box.x + box.width * 0.535;
    const e2Y = box.y + box.height * 0.72;
    await page.mouse.click(e2X, e2Y);
    await page.waitForTimeout(1000);

    await page.screenshot({ path: "scratch/gameplay_selected_e2.png" });
    console.log("Captured scratch/gameplay_selected_e2.png");

    // Click on e4 (Rank 4 is at ~0.58) to make the move!
    console.log("Clicking e4 to make legal move...");
    const e4X = box.x + box.width * 0.535;
    const e4Y = box.y + box.height * 0.58;
    await page.mouse.click(e4X, e4Y);
    await page.waitForTimeout(1500);

    await page.screenshot({ path: "scratch/gameplay_after_move_e4.png" });
    console.log("Captured scratch/gameplay_after_move_e4.png");

    // Wait 3 more seconds for Stockfish engine response
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "scratch/gameplay_engine_response.png" });
    console.log("Captured scratch/gameplay_engine_response.png");

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

main();
