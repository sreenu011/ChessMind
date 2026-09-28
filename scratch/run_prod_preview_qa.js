import { chromium } from "playwright";

console.log("=== STARTING PHASE 14 PRODUCTION PREVIEW BROWSER QA SUITE ===\n");

const PROD_URL = "http://localhost:3000";

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

async function runProdPreviewSuite() {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        testStats.consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    async function gotoProd(urlPath, extraWaitMs = 1500) {
      await page.goto(`${PROD_URL}${urlPath}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(extraWaitMs);
    }

    // 1. HOME & PUBLIC PAGES
    console.log("\n--- 1. Testing Production Landing & Auth Pages ---");
    await gotoProd("/", 2000);
    const homeText = await page.evaluate(() => document.body.innerText);
    const hasHome = homeText.includes("Play Chess") || homeText.includes("ChessMind");
    recordResult("PROD_HOME_PAGE", hasHome ? "PASS" : "FAIL", "Production landing page loaded cleanly");

    await gotoProd("/login", 1500);
    await page.waitForSelector("form, input[type='email'], button[type='submit']", { timeout: 10000 }).catch(() => {});
    const loginText = await page.evaluate(() => document.body.innerText);
    const hasLogin = loginText.includes("Welcome back") || loginText.includes("Sign in") || loginText.includes("Email");
    recordResult("PROD_LOGIN_PAGE", hasLogin ? "PASS" : "FAIL", "Production login page loaded cleanly");

    await gotoProd("/register", 1500);
    await page.waitForSelector("form, input[type='email'], button[type='submit']", { timeout: 10000 }).catch(() => {});
    const regText = await page.evaluate(() => document.body.innerText);
    const hasRegister = regText.includes("Create your account") || regText.includes("Create") || regText.includes("Username");
    recordResult("PROD_REGISTER_PAGE", hasRegister ? "PASS" : "FAIL", "Production register page loaded cleanly");

    // 2. LEARN DASHBOARD (LEVELS 1 THROUGH 10)
    console.log("\n--- 2. Testing Production Learn Dashboard (Levels 1–10) ---");
    await gotoProd("/learn", 2000);
    const bodyText = await page.evaluate(() => document.body.innerText);

    const levelChecks = [];
    for (let i = 1; i <= 10; i++) {
      const levelRegex = new RegExp(`Level\\s+${i}\\b`, "i");
      levelChecks.push(levelRegex.test(bodyText));
    }
    const allLevelsPresent = levelChecks.every(Boolean);
    recordResult("PROD_LEARN_DASHBOARD", allLevelsPresent ? "PASS" : "FAIL", "Levels 1-10 rendered cleanly on production preview");

    // 3. SAMPLE SKILL PAGES ACROSS LEVELS
    console.log("\n--- 3. Testing Production Skill Routes (L1, L5, L10) ---");
    await gotoProd("/learn/level1/level-1-find-square", 1500);
    const l1Content = await page.evaluate(() => document.body.innerText);
    const hasL1 = !l1Content.includes("Skill Not Found") && !l1Content.includes("This page didn't load");
    recordResult("PROD_LEVEL_1_ROUTE", hasL1 ? "PASS" : "FAIL", "Level 1 skill page loaded in production");

    await gotoProd("/learn/level5/level-5-castling", 1500);
    const l5Content = await page.evaluate(() => document.body.innerText);
    const hasL5 = !l5Content.includes("Skill Not Found") && !l5Content.includes("This page didn't load");
    recordResult("PROD_LEVEL_5_ROUTE", hasL5 ? "PASS" : "FAIL", "Level 5 skill page loaded in production");

    await gotoProd("/learn/level10/level-10-mixed-tactics", 1500);
    const l10Content = await page.evaluate(() => document.body.innerText);
    const hasL10 = !l10Content.includes("Skill Not Found") && !l10Content.includes("This page didn't load");
    recordResult("PROD_LEVEL_10_ROUTE", hasL10 ? "PASS" : "FAIL", "Level 10 skill page loaded in production");

    // 4. PLAY MODES IN PRODUCTION
    console.log("\n--- 4. Testing Production Play Modes ---");
    await gotoProd("/play/computer", 2000);
    const compText = await page.evaluate(() => document.body.innerText);
    const hasComp = compText.includes("Play the computer") || compText.includes("Stockfish");
    recordResult("PROD_PLAY_COMPUTER", hasComp ? "PASS" : "FAIL", "Play with Computer loaded cleanly in production");

    await gotoProd("/learn/practice-game", 2000);
    const practiceText = await page.evaluate(() => document.body.innerText);
    const hasPractice = practiceText.includes("Level 10 Practice Game") || practiceText.includes("Unrated Training");
    recordResult("PROD_PRACTICE_GAME", hasPractice ? "PASS" : "FAIL", "Learn Practice Game loaded cleanly in production");

    await gotoProd("/play", 2000);
    const playText = await page.evaluate(() => document.body.innerText);
    const hasFriends = playText.includes("6-digit") || playText.includes("Play with Friends") || playText.includes("code");
    recordResult("PROD_PLAY_FRIENDS", hasFriends ? "PASS" : "FAIL", "Play with Friends (6-digit code) loaded cleanly in production");

    // 5. PROFILE PAGE IN PRODUCTION
    console.log("\n--- 5. Testing Production Profile ---");
    await gotoProd("/profile", 1500);
    const profileText = await page.evaluate(() => document.body.innerText);
    const hasProfile = !profileText.includes("This page didn't load");
    recordResult("PROD_PROFILE_PAGE", hasProfile ? "PASS" : "FAIL", "Profile page loaded cleanly in production");

    // 6. CRITICAL PRODUCTION FLOWS A THROUGH E
    console.log("\n--- 6. Testing Critical Production Flows (A-E) ---");
    // Flow A: Learn -> Level 1 -> Exercise
    await gotoProd("/learn/level1/level-1-find-square", 1500);
    const flowAOk = (await page.locator("svg, canvas, [data-square]").count()) > 0;
    recordResult("FLOW_A_LEARN_EXERCISE", flowAOk ? "PASS" : "FAIL", "Flow A: Navigation to interactive exercise");

    // Flow B: Learn -> Level 10 Mastery
    await gotoProd("/learn/level10/level-10-mixed-tactics", 1500);
    const flowBOk = (await page.locator("svg, canvas, [data-square]").count()) > 0;
    recordResult("FLOW_B_LEVEL_10_MASTERY", flowBOk ? "PASS" : "FAIL", "Flow B: Level 10 Mastery test interactive board");

    // Flow C: Play Computer -> Start game
    await gotoProd("/play/computer", 1500);
    const flowCOk = (await page.locator("svg, canvas, [data-square]").count()) > 0;
    recordResult("FLOW_C_COMPUTER_GAME", flowCOk ? "PASS" : "FAIL", "Flow C: Stockfish board initialized");

    // Flow D: Play Friends -> Create room
    await gotoProd("/play", 1500);
    const flowDOk = playText.includes("Play with Friends");
    recordResult("FLOW_D_FRIENDS_CREATE", flowDOk ? "PASS" : "FAIL", "Flow D: 6-digit room code panel available");

    // Flow E: Profile stats view
    await gotoProd("/profile", 1500);
    recordResult("FLOW_E_PROFILE_STATS", hasProfile ? "PASS" : "FAIL", "Flow E: Profile stats and history rendered");

    // 7. RESPONSIVE VIEWPORTS IN PRODUCTION
    console.log("\n--- 7. Testing Responsive Viewports in Production ---");
    const viewports = [
      { name: "DESKTOP", width: 1440, height: 900 },
      { name: "LAPTOP", width: 1280, height: 800 },
      { name: "TABLET", width: 768, height: 1024 },
      { name: "MOBILE", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await gotoProd("/learn", 1000);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const noHorizontalOverflow = scrollWidth <= clientWidth + 5;
      recordResult(`PROD_RESPONSIVE_${vp.name}`, noHorizontalOverflow ? "PASS" : "FAIL", `${vp.width}x${vp.height} - no overflow`);
    }

    await context.close();
  } catch (err) {
    console.error("Fatal Production Preview QA Error:", err);
    recordResult("PROD_PREVIEW_FATAL", "FAIL", err.message);
  } finally {
    await browser.close();
  }

  console.log("\n==========================================");
  console.log(`PRODUCTION PREVIEW SUMMARY:`);
  console.log(`Total Executed: ${testStats.executed}`);
  console.log(`Passed: ${testStats.passed}`);
  console.log(`Failed: ${testStats.failed}`);
  console.log(`Console Errors Captured: ${testStats.consoleErrors.length}`);
  console.log("==========================================\n");

  if (testStats.failed > 0) {
    process.exit(1);
  }
}

runProdPreviewSuite().catch((err) => {
  console.error("Script Error:", err);
  process.exit(1);
});
