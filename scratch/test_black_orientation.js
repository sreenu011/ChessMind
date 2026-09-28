import { chromium } from "playwright";

async function main() {
  console.log("Testing Black Orientation (Player as Black)...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on("console", (msg) => console.log("PAGE:", msg.type(), msg.text()));
    page.on("pageerror", (err) => console.error("PAGE ERROR:", err));

    await page.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(1500);

    // Select Black in Your Color dropdown
    const colorSelect = await page.$("button[role='combobox']");
    if (colorSelect) {
      await colorSelect.click();
      await page.waitForTimeout(500);
      const blackOption = await page.$("[role='option']:has-text('Black')");
      if (blackOption) {
        await blackOption.click();
        await page.waitForTimeout(500);
      }
    }

    // Start Game as Black
    const startBtn = await page.$("button:has-text('START GAME')");
    if (startBtn) {
      await startBtn.click();
      await page.waitForTimeout(2000);
    }

    await page.screenshot({ path: "scratch/board_black_orientation.png" });
    console.log("Captured scratch/board_black_orientation.png");

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

main();
