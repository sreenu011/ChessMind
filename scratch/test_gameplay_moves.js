import { chromium } from "playwright";

async function run() {
  console.log("Launching Edge to test gameplay moves and highlights...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(1500);

    // 1. Click START GAME
    const startBtn = await page.$("button:has-text('START GAME')");
    if (startBtn) {
      console.log("Clicking START GAME...");
      await startBtn.click();
      await page.waitForTimeout(1000);
    }

    // Capture board right after start (expanded board!)
    await page.screenshot({ path: "scratch/gameplay_expanded_started.png" });
    console.log("Saved scratch/gameplay_expanded_started.png");

    const canvas = await page.$("canvas");
    if (!canvas) throw new Error("Canvas not found");
    const box = await canvas.boundingBox();
    if (!box) throw new Error("Canvas bounding box not found");

    // Click e2 to select white pawn
    // Canvas center is (box.x + box.width * 0.5, box.y + box.height * 0.5)
    // Board is 8x8 squares.
    // In our camera view, e2 is file index 4 (0=a, 1=b, 2=c, 3=d, 4=e, 5=f, 6=g, 7=h)
    // and rank index 1 (0=rank 1, 1=rank 2).
    // Let's click on square e2:
    const e2X = box.x + box.width * 0.56;
    const e2Y = box.y + box.height * 0.74;

    console.log(`Clicking e2 at (${e2X}, ${e2Y})...`);
    await page.mouse.click(e2X, e2Y);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "scratch/gameplay_selected_e2.png" });
    console.log("Saved scratch/gameplay_selected_e2.png");

    // Click e4 to make the move
    const e4X = box.x + box.width * 0.56;
    const e4Y = box.y + box.height * 0.59;
    console.log(`Clicking e4 at (${e4X}, ${e4Y})...`);
    await page.mouse.click(e4X, e4Y);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "scratch/gameplay_after_move_e4.png" });
    console.log("Saved scratch/gameplay_after_move_e4.png");

    // Wait for Stockfish engine response
    await page.waitForTimeout(2500);
    await page.screenshot({ path: "scratch/gameplay_engine_responded.png" });
    console.log("Saved scratch/gameplay_engine_responded.png");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
}

run();
