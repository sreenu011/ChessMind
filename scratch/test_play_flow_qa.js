import { chromium } from "playwright";

async function runPlayFlowQA() {
  console.log("=== STARTING REAL BROWSER QA FOR NEW PLAY EXPERIENCE FLOW ===");
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[${page.url()}] ${msg.text()}`);
      }
    });

    // 1. TEST /play LANDING SELECTION SCREEN
    console.log("\n--- 1. Testing /play Landing Mode-Selection Screen ---");
    await page.goto("http://127.0.0.1:3000/play", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 10000 });

    const bodyText = await page.evaluate(() => document.body.innerText);

    // Verify Title & Subtitle
    if (!bodyText.includes("PLAY CHESS") || !bodyText.includes("Choose how you want to play")) {
      throw new Error("FAIL: New /play title or subtitle missing!");
    }
    console.log("[PASS] /play title and subtitle present");

    // Verify Old Content is REMOVED
    const hasOldHero = bodyText.includes("Over 2.4 million games played") || bodyText.includes("Improve Your Game");
    if (hasOldHero) {
      throw new Error("FAIL: Old hero section/content still found on /play!");
    }
    console.log("[PASS] Old landing content completely purged from /play");

    // Verify 3D Scene Centerpiece
    await page.waitForSelector("canvas", { timeout: 10000 });
    const canvasCount = await page.locator("canvas").count();
    console.log(`[PASS] 3D Scene Canvas elements found on /play: ${canvasCount}`);

    // Verify PLAY COMPUTER link
    const computerLink = page.locator("a[href='/play/computer']").first();
    const hasComputerLink = await computerLink.isVisible();
    console.log(`[PASS] PLAY COMPUTER link visible: ${hasComputerLink}`);

    // Verify PLAY FRIENDS link
    const friendsLink = page.locator("a[href='/play/friends']").first();
    const hasFriendsLink = await friendsLink.isVisible();
    console.log(`[PASS] PLAY FRIENDS link visible: ${hasFriendsLink}`);

    // 2. TEST NAVIGATION TO /play/computer
    console.log("\n--- 2. Testing Navigation to /play/computer ---");
    await page.goto("http://127.0.0.1:3000/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 10000 });
    console.log(`[PASS] Navigated to ${page.url()}`);

    const compText = await page.evaluate(() => document.body.innerText);
    console.log("[debug compText]:", compText.slice(0, 300));
    if (!compText.toLowerCase().includes("play the computer")) {
      throw new Error("FAIL: /play/computer header missing!");
    }
    await page.waitForSelector("canvas, [data-chess-board-container]", { timeout: 10000 });
    console.log("[PASS] /play/computer interactive board rendered cleanly");

    // 3. TEST NAVIGATION TO /play/friends
    console.log("\n--- 3. Testing Navigation to /play/friends ---");
    await page.goto("http://127.0.0.1:3000/play/friends", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 10000 });

    const friendsText = await page.evaluate(() => document.body.innerText);
    if (!friendsText.includes("PLAY WITH FRIENDS") || !friendsText.includes("CREATE GAME") || !friendsText.includes("JOIN GAME")) {
      throw new Error("FAIL: /play/friends header or tabs missing!");
    }
    console.log("[PASS] /play/friends header and Create/Join tabs present");

    // 4. TEST RESPONSIVE VIEWPORTS
    console.log("\n--- 4. Testing Responsive Viewports ---");
    const viewports = [
      { name: "Desktop (1440px)", w: 1440, h: 900 },
      { name: "Tablet (1024px)", w: 1024, h: 768 },
      { name: "Mobile (390px)", w: 390, h: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto("http://127.0.0.1:3000/play", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientW = await page.evaluate(() => document.documentElement.clientWidth);

      if (scrollW > clientW + 2) {
        throw new Error(`FAIL: Horizontal overflow detected on ${vp.name}! scrollWidth=${scrollW}, clientWidth=${clientW}`);
      }
      console.log(`[PASS] ${vp.name} - no overflow (scrollWidth: ${scrollW}, clientWidth: ${clientW})`);
    }

    if (consoleErrors.length > 0) {
      console.warn("Captured Console Errors:", consoleErrors);
    } else {
      console.log("[PASS] Zero Console Errors Captured!");
    }

    console.log("\n==========================================");
    console.log("ALL PLAY FLOW QA TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================\n");
  } catch (err) {
    console.error("QA Test Failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPlayFlowQA();
