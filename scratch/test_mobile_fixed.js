import { chromium } from "playwright";

async function run() {
  console.log("Capturing 390x844 mobile viewport...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(1500);

    // Initial state on mobile
    await page.screenshot({ path: "scratch/qa_390_initial_fixed.png" });
    console.log("Saved scratch/qa_390_initial_fixed.png");

    // Click START GAME
    const startBtn = await page.$("button:has-text('START GAME')");
    if (startBtn) {
      await startBtn.click();
      await page.waitForTimeout(1000);
    }

    // Scroll board into view if needed
    const board = await page.$("[data-chess-board-container]");
    if (board) {
      await board.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: "scratch/qa_390_started_fixed.png" });
    console.log("Saved scratch/qa_390_started_fixed.png");

  } catch (err) {
    console.error("Mobile QA Error:", err);
  } finally {
    await browser.close();
  }
}

run();
