import { chromium } from "playwright";

async function run() {
  console.log("Launching Edge to capture board visual test...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Capture initial 1440x900 board
    await page.screenshot({ path: "scratch/ref_match_1440_initial.png" });
    console.log("Saved scratch/ref_match_1440_initial.png");

    // Click canvas on e2 to select pawn and see highlights
    const canvas = await page.$("canvas");
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        // e2 is approximately file 4, rank 1 (from bottom)
        const clickX = box.x + box.width * 0.56;
        const clickY = box.y + box.height * 0.72;
        await page.mouse.click(clickX, clickY);
        await page.waitForTimeout(800);
        await page.screenshot({ path: "scratch/ref_match_1440_selected.png" });
        console.log("Saved scratch/ref_match_1440_selected.png");
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
}

run();
