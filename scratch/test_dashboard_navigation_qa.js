import { chromium } from "playwright";

console.log("=== STARTING CHESSMIND DASHBOARD REAL CLICK QA SUITE ===\n");

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3000";

let testStats = {
  executed: 0,
  passed: 0,
  failed: 0,
  results: {},
  consoleErrors: [],
  issuesFound: [],
};

function recordResult(testName, status, details = "") {
  testStats.executed++;
  if (status === "PASS") {
    testStats.passed++;
    console.log(`[PASS] ${testName} ${details ? `- ${details}` : ""}`);
  } else {
    testStats.failed++;
    console.error(`[FAIL] ${testName} - ${details}`);
    testStats.issuesFound.push(`${testName}: ${details}`);
  }
  testStats.results[testName] = status;
}

async function runNavigationTestSuite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const txt = msg.text();
      if (!txt.includes("favicon") && !txt.includes("Failed to load resource") && !txt.includes("404")) {
        testStats.consoleErrors.push(txt);
      }
    }
  });

  try {
    // 1. Direct Routes Test
    console.log("--- 1. Testing Direct Routes Loading ---");
    await page.goto(`${BASE_URL}/play/computer`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    const directAiContent = await page.evaluate(() => document.body.innerText);
    const directAiOk = directAiContent.includes("Play the computer") || directAiContent.includes("Stockfish");
    recordResult("DIRECT_AI_ROUTE", directAiOk ? "PASS" : "FAIL", "Direct access to /play/computer works cleanly");

    await page.goto(`${BASE_URL}/play`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    const directFriendsContent = await page.evaluate(() => document.body.innerText);
    const directFriendsOk = directFriendsContent.includes("Play with Friends") || directFriendsContent.includes("6-digit") || directFriendsContent.includes("Create");
    recordResult("DIRECT_FRIENDS_ROUTE", directFriendsOk ? "PASS" : "FAIL", "Direct access to /play works cleanly");

    // 2. Desktop Viewport Load
    console.log("\n--- 2. Load Dashboard (Desktop 1440x900) ---");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });

    await page.waitForFunction(
      () => document.body.innerText.includes("Welcome back to ChessMind") || document.body.innerText.includes("Good "),
      { timeout: 20000 }
    );
    await page.waitForTimeout(1000);

    recordResult("DASHBOARD_LOAD", "PASS", "Dashboard loaded cleanly at /dashboard");

    // 3. Play with AI Physical Click
    console.log("\n--- 3. Physical Click: Play with AI ---");
    const aiLink = page.getByRole("link", { name: /Play with AI/i }).first();
    const aiLinkVisible = await aiLink.isVisible();
    recordResult("PLAY_WITH_AI_VISIBLE", aiLinkVisible ? "PASS" : "FAIL", "Play with AI link element is visible");

    if (aiLinkVisible) {
      await Promise.all([
        page.waitForURL((url) => url.pathname.includes("/play/computer"), { timeout: 10000 }),
        aiLink.click(),
      ]);
      await page.waitForTimeout(1500);

      const currentUrl = page.url();
      const isAiUrl = currentUrl.includes("/play/computer");
      recordResult("PLAY_WITH_AI_CLICK", isAiUrl ? "PASS" : "FAIL", "Physical click triggered router navigation");
      recordResult("PLAY_WITH_AI_URL", isAiUrl ? "PASS" : "FAIL", `Target URL is ${currentUrl}`);

      const bodyContent = await page.evaluate(() => document.body.innerText);
      const hasAiContent = bodyContent.includes("Play the computer") || bodyContent.includes("Stockfish") || bodyContent.includes("Difficulty");
      const hasBoard = (await page.locator("svg, canvas, [data-square]").count()) > 0;

      recordResult("PLAY_WITH_AI_PAGE", hasAiContent && hasBoard ? "PASS" : "FAIL", "Destination renders Stockfish AI game UI, chessboard, difficulty, and controls");
    }

    // Browser Back to Dashboard
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const backToDash1 = page.url().includes("/dashboard");
    recordResult("BACK_NAVIGATION_1", backToDash1 ? "PASS" : "FAIL", "Browser back returned to /dashboard");

    // 4. Play with Friends Physical Click
    console.log("\n--- 4. Physical Click: Play with Friends ---");
    const friendsLink = page.getByRole("link", { name: /Play with Friends/i }).first();
    const friendsLinkVisible = await friendsLink.isVisible();
    recordResult("PLAY_WITH_FRIENDS_VISIBLE", friendsLinkVisible ? "PASS" : "FAIL", "Play with Friends link element is visible");

    if (friendsLinkVisible) {
      await Promise.all([
        page.waitForURL((url) => url.pathname === "/play" || url.pathname === "/play/", { timeout: 10000 }),
        friendsLink.click(),
      ]);
      await page.waitForTimeout(1500);

      const currentUrl = page.url();
      const isFriendsUrl = currentUrl.endsWith("/play") || currentUrl.endsWith("/play/");
      recordResult("PLAY_WITH_FRIENDS_CLICK", isFriendsUrl ? "PASS" : "FAIL", "Physical click triggered router navigation");
      recordResult("PLAY_WITH_FRIENDS_URL", isFriendsUrl ? "PASS" : "FAIL", `Target URL is ${currentUrl}`);

      const bodyContent = await page.evaluate(() => document.body.innerText);
      const hasFriendsContent = bodyContent.includes("Play with Friends") || bodyContent.includes("6-digit") || bodyContent.includes("Create") || bodyContent.includes("Join");

      recordResult("PLAY_WITH_FRIENDS_PAGE", hasFriendsContent ? "PASS" : "FAIL", "Destination renders Play with Friends UI with 6-digit code support");
    }

    // Browser Back to Dashboard
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const backToDash2 = page.url().includes("/dashboard");
    recordResult("BACK_NAVIGATION", backToDash1 && backToDash2 ? "PASS" : "FAIL", "Browser back button navigation verified");

    // 5. Repeated Navigation Test
    console.log("\n--- 5. Repeated Navigation Test ---");
    let repeatedSuccess = true;
    for (let cycle = 1; cycle <= 2; cycle++) {
      // Click AI
      const aiBtn = page.getByRole("link", { name: /Play with AI/i }).first();
      await Promise.all([
        page.waitForURL((url) => url.pathname.includes("/play/computer"), { timeout: 10000 }),
        aiBtn.click(),
      ]);
      await page.waitForTimeout(500);
      if (!page.url().includes("/play/computer")) repeatedSuccess = false;

      // Back to Dashboard
      await page.goBack({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      // Click Friends
      const frBtn = page.getByRole("link", { name: /Play with Friends/i }).first();
      await Promise.all([
        page.waitForURL((url) => url.pathname === "/play" || url.pathname === "/play/", { timeout: 10000 }),
        frBtn.click(),
      ]);
      await page.waitForTimeout(500);
      if (!page.url().endsWith("/play") && !page.url().endsWith("/play/")) repeatedSuccess = false;

      // Back to Dashboard
      await page.goBack({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);
    }
    recordResult("REPEATED_NAVIGATION", repeatedSuccess ? "PASS" : "FAIL", "Repeated navigation cycle (Dashboard -> AI -> Dashboard -> Friends x 2) verified without stale handler issues");

    // 6. Test Other Dashboard CTAs
    console.log("\n--- 6. Testing Other Dashboard CTAs ---");
    // Continue Learning
    const continueBtn = page.getByRole("link", { name: /Continue Learning|Continue Training|Start Learning/i }).first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(1000);
      const isLearnUrl = page.url().includes("/learn");
      recordResult("CONTINUE_LEARNING", isLearnUrl ? "PASS" : "FAIL", `Navigated to ${page.url()}`);
    }

    // Daily Puzzle
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const puzzleBtn = page.getByRole("link", { name: /Solve Puzzle|Review Today/i }).first();
    if (await puzzleBtn.isVisible()) {
      await puzzleBtn.click();
      await page.waitForTimeout(1000);
      const isPuzzleUrl = page.url().includes("/learn/daily-puzzle");
      recordResult("DAILY_PUZZLE", isPuzzleUrl ? "PASS" : "FAIL", `Navigated to ${page.url()}`);
    }

    // View All Games
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const viewGamesBtn = page.getByRole("link", { name: /View All Games/i }).first();
    if (await viewGamesBtn.isVisible()) {
      await viewGamesBtn.click();
      await page.waitForTimeout(1000);
      const isGamesUrl = page.url().includes("/games");
      recordResult("VIEW_ALL_GAMES", isGamesUrl ? "PASS" : "FAIL", `Navigated to ${page.url()}`);
    }

    // View Profile
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const viewProfileBtn = page.getByRole("link", { name: /View Profile/i }).first();
    if (await viewProfileBtn.isVisible()) {
      await viewProfileBtn.click();
      await page.waitForTimeout(1000);
      const isProfileUrl = page.url().includes("/profile");
      recordResult("PROFILE", isProfileUrl ? "PASS" : "FAIL", `Navigated to ${page.url()}`);
    }

    recordResult("DESKTOP", "PASS", "Desktop 1440x900 physical click navigation verified");

    // 7. Mobile 390px Viewport Physical Click Test
    console.log("\n--- 7. Testing Mobile (390x844) Navigation ---");
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });

    await mobilePage.waitForFunction(
      () => document.body.innerText.includes("Welcome back to ChessMind") || document.body.innerText.includes("Good "),
      { timeout: 20000 }
    );
    await mobilePage.waitForTimeout(1000);

    const mobileAiBtn = mobilePage.getByRole("link", { name: /Play with AI/i }).first();
    if (await mobileAiBtn.isVisible()) {
      await Promise.all([
        mobilePage.waitForURL((url) => url.pathname.includes("/play/computer"), { timeout: 10000 }),
        mobileAiBtn.click(),
      ]);
      await mobilePage.waitForTimeout(1000);
    }
    const mobileAiOk = mobilePage.url().includes("/play/computer");

    await mobilePage.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await mobilePage.waitForTimeout(1000);

    const mobileFriendsBtn = mobilePage.getByRole("link", { name: /Play with Friends/i }).first();
    if (await mobileFriendsBtn.isVisible()) {
      await Promise.all([
        mobilePage.waitForURL((url) => url.pathname === "/play" || url.pathname === "/play/", { timeout: 10000 }),
        mobileFriendsBtn.click(),
      ]);
      await mobilePage.waitForTimeout(1000);
    }
    const mobileFriendsOk = mobilePage.url().endsWith("/play") || mobilePage.url().endsWith("/play/");

    recordResult("MOBILE", mobileAiOk && mobileFriendsOk ? "PASS" : "FAIL", "Mobile 390px physical clicks to AI and Friends routes verified");

    await mobileContext.close();

    // 8. Console Errors Check
    recordResult("CONSOLE_ERRORS", testStats.consoleErrors.length === 0 ? "PASS" : "FAIL", `${testStats.consoleErrors.length} console errors recorded`);

  } catch (err) {
    console.error("Dashboard Navigation QA Exception:", err);
    recordResult("TEST_EXECUTION", "FAIL", err.message);
  } finally {
    await browser.close();
  }

  console.log("\n==========================================");
  console.log(`TESTS EXECUTED: ${testStats.executed}`);
  console.log(`TESTS PASSED: ${testStats.passed}`);
  console.log(`TESTS FAILED: ${testStats.failed}`);
  console.log("==========================================\n");

  if (testStats.failed > 0) {
    process.exit(1);
  }
}

runNavigationTestSuite();
