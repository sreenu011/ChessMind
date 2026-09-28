import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const screenshotsDir = "C:\\Users\\p\\.gemini\\antigravity-cli\\brain\\80ce1f75-272e-431e-9f04-8a19255e3468\\scratch";

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { width: 1440, height: 900, name: "desktop-1440x900" },
    { width: 1024, height: 768, name: "tablet-1024x768" },
    { width: 390, height: 844, name: "mobile-390x844" },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`[Browser Error ${vp.name}]:`, msg.text());
      }
    });

    console.log(`Navigating to http://localhost:8081/play/computer (${vp.name})...`);
    await page.goto("http://localhost:8081/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);

    const beforePath = path.join(screenshotsDir, `${vp.name}-before-start.png`);
    await page.screenshot({ path: beforePath, fullPage: false });
    console.log(`Saved screenshot: ${beforePath}`);

    const startBtn = page.locator('button:has-text("START GAME")');
    if (await startBtn.count() > 0) {
      await startBtn.scrollIntoViewIfNeeded();
      await startBtn.click();
      await page.waitForTimeout(2500);

      // Scroll back up to top so board is in view for screenshot
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      const afterPath = path.join(screenshotsDir, `${vp.name}-after-start.png`);
      await page.screenshot({ path: afterPath, fullPage: false });
      console.log(`Saved screenshot: ${afterPath}`);
    } else {
      console.log(`Start button not found for ${vp.name}`);
    }

    await context.close();
  }

  await browser.close();
  console.log("Screenshot capturing complete!");
}

capture().catch((err) => {
  console.error("Error in capture script:", err);
  process.exit(1);
});
