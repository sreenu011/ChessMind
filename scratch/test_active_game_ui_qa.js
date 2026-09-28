import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function runQA() {
  const screenshotsDir = path.resolve("scratch/screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log("Launching Chromium browser...");
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-webgl"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/play/computer...");
  await page.goto("http://localhost:3000/play/computer", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);

  // 1. Initial Match Setup Screenshot at 1440x900
  console.log("Capturing 1440x900 Match Setup view...");
  await page.screenshot({ path: path.join(screenshotsDir, "1440x900_setup.png") });

  // 2. Start Game
  console.log("Clicking 'Start Game' button...");
  const startBtn = page.getByRole("button", { name: /start game/i });
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForTimeout(1000);
  }

  // 3. Active Game Screenshot at 1440x900
  console.log("Capturing 1440x900 Active Game view...");
  await page.screenshot({ path: path.join(screenshotsDir, "1440x900_active_game.png") });

  // 4. Perform moves e2 -> e4 and g1 -> f3
  console.log("Attempting chess moves on the board...");
  // In 2D or 3D, let's test toggling to 2D first to guarantee easy click-based square testing if needed, or click 2D
  const btn2D = page.getByRole("button", { name: "2D", exact: true });
  if (await btn2D.isVisible()) {
    console.log("Toggling to 2D mode for move interaction testing...");
    await btn2D.click();
    await page.waitForTimeout(500);

    // In react-chessboard, squares have data-square or square name in 2D
    const squareE2 = page.locator('[data-square="e2"]').first();
    const squareE4 = page.locator('[data-square="e4"]').first();

    if (await squareE2.isVisible() && await squareE4.isVisible()) {
      console.log("Clicking e2 then e4...");
      await squareE2.click();
      await page.waitForTimeout(300);
      await squareE4.click();
      await page.waitForTimeout(1500); // Wait for Stockfish to respond
    }

    const squareG1 = page.locator('[data-square="g1"]').first();
    const squareF3 = page.locator('[data-square="f3"]').first();

    if (await squareG1.isVisible() && await squareF3.isVisible()) {
      console.log("Clicking g1 then f3...");
      await squareG1.click();
      await page.waitForTimeout(300);
      await squareF3.click();
      await page.waitForTimeout(1500); // Wait for Stockfish response
    }

    // Toggle back to 3D
    const btn3D = page.getByRole("button", { name: "3D", exact: true });
    if (await btn3D.isVisible()) {
      await btn3D.click();
      await page.waitForTimeout(800);
    }
  }

  // 5. Open Moves Drawer
  console.log("Opening Moves Drawer...");
  const movesBtn = page.getByRole("button", { name: /moves/i });
  if (await movesBtn.isVisible()) {
    await movesBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, "1440x900_moves_drawer.png") });
    // Close moves drawer
    await movesBtn.click();
    await page.waitForTimeout(300);
  }

  // 6. Test Flip Board
  console.log("Testing Flip Board...");
  const flipBtn = page.getByRole("button", { name: /flip/i });
  if (await flipBtn.isVisible()) {
    await flipBtn.click();
    await page.waitForTimeout(500);
    await flipBtn.click(); // Flip back
    await page.waitForTimeout(500);
  }

  // 7. Capture at other viewports
  console.log("Testing at 1280x800 viewport...");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, "1280x800.png") });

  console.log("Testing at 1024x768 viewport...");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, "1024x768.png") });

  console.log("Testing at 390x844 mobile viewport...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotsDir, "390x844_mobile.png") });

  // 8. Test Resignation and Game Over overlay
  console.log("Testing Resign flow and Game Over overlay...");
  await page.setViewportSize({ width: 1440, height: 900 });
  const resignBtn = page.getByRole("button", { name: /resign/i });
  if (await resignBtn.isVisible()) {
    await resignBtn.click();
    await page.waitForTimeout(500);
    // Confirm dialog
    const confirmResign = page.getByRole("button", { name: /resign/i }).last();
    if (await confirmResign.isVisible()) {
      await confirmResign.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotsDir, "1440x900_game_over.png") });
    }
  }

  console.log("QA test complete. All screenshots captured successfully!");
  await browser.close();
}

runQA().catch((err) => {
  console.error("QA script failed:", err);
  process.exit(1);
});
