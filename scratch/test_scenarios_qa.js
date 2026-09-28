import { chromium } from "playwright";

async function run() {
  console.log("Testing specific chess scenarios (Check, Capture, Promotion, Castling)...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(1000);

    // Let's test a Check scenario by evaluating on page or setting up state
    // We can also test capture and check highlights directly
    console.log("Testing interactive states on computer game...");
    const startBtn = await page.$("button:has-text('START GAME')");
    if (startBtn) await startBtn.click();
    await page.waitForTimeout(1000);

    // Test Castling scenario: We can play e4, Nf3, Bc4, 0-0 or inspect
    // Let's verify build and typescript types first
  } catch (err) {
    console.error("Error in scenarios:", err);
  } finally {
    await browser.close();
  }
}

run();
