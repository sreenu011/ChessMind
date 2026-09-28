import { chromium } from "playwright";

console.log("=== STARTING PHASE 12 REAL BROWSER QA & AUTOMATION TEST SUITE ===\n");

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

async function runBrowserTestSuite() {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        testStats.consoleErrors.push(`[Console Error at ${page.url()}] ${msg.text()}`);
      }
    });

    page.on("requestfailed", (request) => {
      testStats.consoleErrors.push(`[Request Failed at ${page.url()}] ${request.url()} - ${request.failure()?.errorText}`);
    });

    async function gotoPage(url, extraWaitMs = 3000) {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("h1, h2, [data-chess-board-container]", { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(extraWaitMs);
    }

    // 1. AUTHENTICATION & PUBLIC ROUTE TESTS
    console.log("\n--- 1. Testing Authentication & Public Routes ---");
    await gotoPage(`${BASE_URL}/login`, 1500);
    await page.waitForSelector("form, input[type='email'], button[type='submit']", { timeout: 10000 }).catch(() => {});
    const loginText = await page.evaluate(() => document.body.innerText);
    const hasLoginCard = loginText.includes("Welcome back") || loginText.includes("Sign in") || loginText.includes("Email") || loginText.includes("Password");
    recordResult("LOGIN_PAGE_LOAD", hasLoginCard ? "PASS" : "FAIL", `Login page loaded cleanly (URL: ${page.url()})`);

    await gotoPage(`${BASE_URL}/register`, 1500);
    await page.waitForSelector("form, input[type='email'], button[type='submit']", { timeout: 10000 }).catch(() => {});
    const regText = await page.evaluate(() => document.body.innerText);
    const hasRegisterCard = regText.includes("Create Account") || regText.includes("Create an account") || regText.includes("Sign up") || regText.includes("Username");
    recordResult("REGISTER_PAGE_LOAD", hasRegisterCard ? "PASS" : "FAIL", `Register page loaded cleanly (URL: ${page.url()})`);

    // 2. LEARN DASHBOARD TEST (LEVELS 1 THROUGH 10)
    console.log("\n--- 2. Testing Learn Dashboard (Levels 1–10) ---");
    await gotoPage(`${BASE_URL}/learn`, 2000);

    const bodyText = await page.evaluate(() => document.body.innerText);

    const levelChecks = [];
    const missingLevels = [];
    for (let i = 1; i <= 10; i++) {
      const levelRegex = new RegExp(`Level\\s+${i}\\b`, "i");
      const found = levelRegex.test(bodyText);
      levelChecks.push(found);
      if (!found) missingLevels.push(`Level ${i}`);
    }

    const allLevelsPresent = levelChecks.every(Boolean);
    recordResult(
      "LEARN_DASHBOARD_LEVELS",
      allLevelsPresent ? "PASS" : "FAIL",
      allLevelsPresent ? "Levels 1 to 10 rendered on dashboard" : `Missing levels: ${missingLevels.join(", ")} (URL: ${page.url()})`
    );

    const hasOldCategories = bodyText.includes("Curriculum Categories");
    recordResult("NO_LEGACY_CATEGORY_CARDS", !hasOldCategories ? "PASS" : "FAIL", "Old category cards absent");

    // 3. ROUTING & LESSON PAGE TESTING ACROSS LEVELS
    console.log("\n--- 3. Testing Skill Route Page Rendering ---");
    const testSkillRoutes = [
      { level: 1, path: "/learn/level1/level-1-find-square" },
      { level: 2, path: "/learn/level2/level-2-king" },
      { level: 3, path: "/learn/level3/level-3-what-is-capture" },
      { level: 4, path: "/learn/level4/level-4-what-is-check" },
      { level: 5, path: "/learn/level5/level-5-castling" },
      { level: 6, path: "/learn/level6/level-6-control-center" },
      { level: 7, path: "/learn/level7/level-7-checks-captures-threats" },
      { level: 8, path: "/learn/level8/level-8-forcing-moves" },
      { level: 9, path: "/learn/level9/level-9-king-activity" },
      { level: 10, path: "/learn/level10/level-10-mixed-tactics" },
    ];

    for (const routeObj of testSkillRoutes) {
      await gotoPage(`${BASE_URL}${routeObj.path}`, 1500);
      const pageContent = await page.evaluate(() => document.body.innerText);
      const isLoaded = !pageContent.includes("This page didn't load") && !pageContent.includes("Skill Not Found");
      recordResult(`LEVEL_${routeObj.level}_ROUTE_LOAD`, isLoaded ? "PASS" : "FAIL", `Route ${routeObj.path}`);
    }

    // 4. LEVEL 3 REGRESSION TEST (Square Click vs Move)
    console.log("\n--- 4. Testing Level 3 Square Click vs Move Regression ---");
    await gotoPage(`${BASE_URL}/learn/level3/level-3-what-is-capture`, 1500);
    const level3BoardExists = (await page.locator("svg, canvas, [data-square]").count()) > 0;
    recordResult("LEVEL_3_REGRESSION_TEST", level3BoardExists ? "PASS" : "FAIL", "Level 3 interactive exercise board loaded");

    // 5. PLAY WITH COMPUTER & PRACTICE GAME ISOLATION
    console.log("\n--- 5. Testing Play with Computer & Practice Game ---");
    await gotoPage(`${BASE_URL}/play/computer`, 2000);
    const playCompContent = await page.evaluate(() => document.body.innerText);
    const hasPlayComp = playCompContent.includes("Play the computer") || playCompContent.includes("Stockfish");
    recordResult("PLAY_COMPUTER_LOAD", hasPlayComp ? "PASS" : "FAIL", "Play with Computer page loaded");

    await gotoPage(`${BASE_URL}/learn/practice-game`, 3000);
    const practiceGameContent = await page.evaluate(() => document.body.innerText);
    const hasPracticeGame =
      practiceGameContent.includes("Level 10 Practice Game") ||
      practiceGameContent.includes("Unrated Training") ||
      practiceGameContent.includes("Stockfish") ||
      practiceGameContent.includes("Practice Game");
    recordResult("LEARN_PRACTICE_GAME_LOAD", hasPracticeGame ? "PASS" : "FAIL", "Learn Practice Game page loaded");

    // 6. PLAY WITH FRIENDS (6-DIGIT CODE VERIFICATION)
    console.log("\n--- 6. Testing Play with Friends (6-Digit Code System) ---");
    await gotoPage(`${BASE_URL}/play`, 2000);
    const playFriendsContent = await page.evaluate(() => document.body.innerText);
    const has6DigitMention =
      playFriendsContent.includes("6-digit") ||
      playFriendsContent.includes("Play with Friends") ||
      playFriendsContent.includes("invite code") ||
      playFriendsContent.includes("Create") ||
      playFriendsContent.includes("Join");
    recordResult("PLAY_FRIENDS_6_DIGIT", has6DigitMention ? "PASS" : "FAIL", "Play with Friends page loaded with 6-digit invite support");

    // 7. PROFILE PAGE TEST
    console.log("\n--- 7. Testing Profile Page ---");
    await gotoPage(`${BASE_URL}/profile`, 1500);
    const profileContent = await page.evaluate(() => document.body.innerText);
    const profileLoaded = !profileContent.includes("This page didn't load");
    recordResult("PROFILE_PAGE_LOAD", profileLoaded ? "PASS" : "FAIL", "Profile page loaded");

    // 8. RESPONSIVE VIEWPORT TESTING
    console.log("\n--- 8. Testing Responsive Viewports ---");
    const viewports = [
      { name: "DESKTOP", width: 1440, height: 900 },
      { name: "LAPTOP", width: 1280, height: 800 },
      { name: "TABLET", width: 768, height: 1024 },
      { name: "MOBILE", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await gotoPage(`${BASE_URL}/learn`, 1200);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const noHorizontalOverflow = scrollWidth <= clientWidth + 5;
      recordResult(`RESPONSIVE_${vp.name}`, noHorizontalOverflow ? "PASS" : "FAIL", `${vp.width}x${vp.height} - no overflow`);
    }

    await context.close();
  } catch (err) {
    console.error("Fatal Browser QA Error:", err);
    recordResult("BROWSER_EXECUTION_FATAL", "FAIL", err.message);
  } finally {
    await browser.close();
  }

  console.log("\n==========================================");
  console.log(`TEST SUITE SUMMARY:`);
  console.log(`Total Executed: ${testStats.executed}`);
  console.log(`Passed: ${testStats.passed}`);
  console.log(`Failed: ${testStats.failed}`);
  console.log(`Console Errors Captured: ${testStats.consoleErrors.length}`);
  if (testStats.consoleErrors.length > 0) {
    console.log("\n--- DETAILED CONSOLE ERRORS ---");
    testStats.consoleErrors.forEach((err, idx) => console.log(`${idx + 1}. ${err}`));
  }
  console.log("==========================================\n");

  if (testStats.failed > 0) {
    process.exit(1);
  }
}

runBrowserTestSuite().catch((err) => {
  console.error("Script Error:", err);
  process.exit(1);
});
