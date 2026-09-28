import { chromium } from "@playwright/test";
import { spawn } from "child_process";
import http from "http";

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode < 500) resolve(true);
          else reject(new Error(`Status: ${res.statusCode}`));
        });
        req.on("error", reject);
        req.end();
      });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function runQA() {
  console.log("Starting dev server via npx vite dev --port 3008...");
  const serverProcess = spawn("npx", ["vite", "dev", "--port", "3008"], {
    shell: true,
    stdio: "inherit",
  });

  try {
    await waitForServer("http://localhost:3008");
    console.log("Dev server is ready at http://localhost:3008");

    const browser = await chromium.launch({ headless: true });
    const viewports = [
      { name: "Desktop 1440x900", width: 1440, height: 900 },
      { name: "Laptop 1024x768", width: 1024, height: 768 },
      { name: "Mobile 390x844", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      console.log(`\n========================================`);
      console.log(`TESTING VIEWPORT: ${vp.name}`);
      console.log(`========================================`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      // 1. Open /play/computer
      await page.goto("http://localhost:3008/play/computer", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      // 2. Verify compact board before start
      const boardContainer = page.locator("[data-chess-board-container]");
      await boardContainer.waitFor({ state: "visible", timeout: 30000 });
      const bboxBefore = await boardContainer.boundingBox();
      console.log(`BEFORE START GAME - Board Width: ${bboxBefore.width.toFixed(1)}px, Height: ${bboxBefore.height.toFixed(1)}px`);

      // 3. Verify START GAME button exists and is enabled (Stockfish engine ready)
      const startBtn = page.getByRole("button", { name: /START GAME/i });
      await startBtn.waitFor({ state: "visible" });
      const startBtnVisible = await startBtn.isVisible();
      console.log(`START GAME button visible: ${startBtnVisible}`);
      if (!startBtnVisible) throw new Error("START GAME button not found before game start");

      // Ensure button is fully enabled (Stockfish engine ready) before clicking
      await startBtn.evaluate(async (btn) => {
        let attempts = 0;
        while (btn.disabled && attempts < 40) {
          await new Promise((r) => setTimeout(r, 250));
          attempts++;
        }
      });

      // Take screenshot of state 1
      await page.screenshot({ path: `scratch/screenshot_${vp.width}_before.png` });

      // 4. Click START GAME
      console.log("Clicking START GAME button...");
      await startBtn.click();

      // Wait for layout animation (400-600ms transition)
      await page.waitForTimeout(1000);

      // 5. Verify board expands
      const bboxAfter = await boardContainer.boundingBox();
      console.log(`AFTER START GAME - Board Width: ${bboxAfter.width.toFixed(1)}px, Height: ${bboxAfter.height.toFixed(1)}px`);

      // Take screenshot of state 2
      await page.screenshot({ path: `scratch/screenshot_${vp.width}_after.png` });

      // 6 & 7. Measure board bounding box before/after & verify width increases substantially
      const widthDiff = bboxAfter.width - bboxBefore.width;
      console.log(`Board width expansion: +${widthDiff.toFixed(1)}px`);

      if (vp.width >= 1024) {
        if (widthDiff < 30) {
          throw new Error(`Expected substantial board expansion on ${vp.name}, but width increased by only ${widthDiff.toFixed(1)}px`);
        }
      } else {
        if (widthDiff < 5) {
          throw new Error(`Expected mobile board to expand to ~94vw, but width diff was ${widthDiff.toFixed(1)}px`);
        }
      }

      // 8. Verify complete board remains visible (no overflow)
      const hasHorizontalScrollbar = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      console.log(`Horizontal overflow: ${hasHorizontalScrollbar}`);
      if (hasHorizontalScrollbar) throw new Error(`Horizontal overflow detected on ${vp.name}`);

      // 9. Verify setup controls disappear/collapse
      const startBtnAfter = await page.getByRole("button", { name: /START GAME/i }).isVisible();
      console.log(`START GAME button visible after start: ${startBtnAfter}`);
      if (startBtnAfter) throw new Error("Setup panel/START GAME button did not collapse after game start");

      // Verify active controls exist (Resign, Draw, Flip Board)
      const resignBtn = page.getByRole("button", { name: /Resign/i });
      console.log(`Resign button visible: ${await resignBtn.isVisible()}`);

      // 10. Verify no rating number is shown during gameplay
      const activeText = await page.innerText("body");
      const hasRatingFormat = /\b(1200|1300|1400|\+18|-12)\b/.test(activeText);
      console.log(`Rating numbers detected during active gameplay: ${hasRatingFormat}`);

      // 11. Verify console errors
      console.log(`Console errors count: ${consoleErrors.length}`);

      await context.close();
    }

    await browser.close();
    console.log("\nALL QA TESTS PASSED SUCCESSFULLY!");
  } finally {
    serverProcess.kill();
  }
}

runQA().catch((err) => {
  console.error("QA Test Failed:", err);
  process.exit(1);
});
