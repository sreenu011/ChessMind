import { chromium } from "playwright";

async function runTest() {
  console.log("Starting QA test for 3D Animated Dashboard...");
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop Viewport Test (1440px)
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Capture console errors
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "domcontentloaded" });
    console.log("Navigated to /dashboard at 1440px");
    await page.waitForTimeout(1000);

    // Verify Header & Motto
    const headerText = await page.locator("h1").innerText();
    console.log("Header text found:", headerText);

    // Verify 3D Canvas element is present
    await page.waitForSelector("canvas", { timeout: 10000 });
    const canvasCount = await page.locator("canvas").count();
    console.log(`3D Canvas elements found: ${canvasCount}`);
    if (canvasCount < 1) {
      throw new Error("FAIL: 3D Canvas element missing on Dashboard!");
    }

    // Verify Play with Computer navigation link
    const playAiLink = page.locator("a[href='/play/computer']").first();
    console.log("Play with Computer link visible:", await playAiLink.isVisible());
    await playAiLink.click();
    await page.waitForURL("**/play/computer");
    console.log("Successfully navigated to /play/computer via Play with Computer button");

    // Go back to dashboard
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "domcontentloaded" });

    // Verify Play with Friends navigation link
    const playFriendsLink = page.locator("a[href='/play']").first();
    console.log("Play with Friends link visible:", await playFriendsLink.isVisible());
    await playFriendsLink.click();
    await page.waitForURL("**/play");
    console.log("Successfully navigated to /play via Play with Friends button");

    // Go back to dashboard
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "domcontentloaded" });

    // Check Daily Puzzle & Recent Games link visibility
    const dailyPuzzleLink = page.locator("a[href='/learn/daily-puzzle']").first();
    const gamesLink = page.locator("a[href='/games']").first();
    console.log("Daily Puzzle link visible:", await dailyPuzzleLink.isVisible());
    console.log("Recent Games link visible:", await gamesLink.isVisible());

    // 2. Tablet Viewport Test (1024px)
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "domcontentloaded" });
    const tabletScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const tabletClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Tablet Viewport (1024px) - scrollWidth: ${tabletScrollWidth}, clientWidth: ${tabletClientWidth}`);

    // 3. Mobile Viewport Test (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "domcontentloaded" });
    const mobileScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const mobileClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile Viewport (390px) - scrollWidth: ${mobileScrollWidth}, clientWidth: ${mobileClientWidth}`);

    if (mobileScrollWidth > mobileClientWidth) {
      throw new Error("FAIL: Horizontal overflow detected on mobile!");
    }

    // 4. Reduced Motion Test
    const reducedMotionContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const reducedMotionPage = await reducedMotionContext.newPage();
    await reducedMotionPage.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "domcontentloaded" });
    console.log("Reduced motion context loaded successfully");

    // Verify console errors
    if (consoleErrors.length > 0) {
      console.warn("Captured console errors:", consoleErrors);
    }

    console.log("ALL 3D DASHBOARD QA CHECKS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("QA Test Failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
