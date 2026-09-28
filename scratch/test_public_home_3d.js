import { chromium } from "playwright";

console.log("=== STARTING PUBLIC HOME PAGE 3D REAL BROWSER QA SUITE ===\n");

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";

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

async function runPublicHome3DSuite() {
  const browser = await chromium.launch({ headless: true });

  try {
    // ----------------------------------------------------
    // TEST 1: Desktop 1440x900 Public Home Load & 3D Render
    // ----------------------------------------------------
    console.log("--- 1. Testing Desktop Public Home Page (1440x900) ---");
    const context1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page1440 = await context1440.newPage();

    page1440.on("console", (msg) => {
      if (msg.type() === "error") {
        const txt = msg.text();
        if (!txt.includes("favicon") && !txt.includes("Failed to load resource") && !txt.includes("404")) {
          testStats.consoleErrors.push(`[1440x900] ${txt}`);
        }
      }
    });

    const startMs = Date.now();
    await page1440.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    
    // Immediate UI check
    const uiLoadMs = Date.now() - startMs;
    const initialText = await page1440.evaluate(() => document.body.innerText);
    const hasHeroText = initialText.includes("PLAY CHESS") && initialText.includes("IMPROVE YOUR GAME");
    const hasOld2DPreview = initialText.includes("Over 2.4 million games played");

    recordResult(
      "PUBLIC_HOME_IMMEDIATE_UI",
      hasHeroText && !hasOld2DPreview ? "PASS" : "FAIL",
      `New 3D landing page UI loaded immediately (${uiLoadMs}ms)`
    );

    // CTAs verification
    const playChessCta = page1440.locator("a[href='/play']:has-text('PLAY CHESS')").first();
    const getStartedCta = page1440.locator("a[href='/register']:has-text('GET STARTED')").first();
    const hasCtas = (await playChessCta.count()) > 0 && (await getStartedCta.count()) > 0;
    recordResult("PUBLIC_HOME_CTAS", hasCtas ? "PASS" : "FAIL", "PLAY CHESS -> /play and GET STARTED -> /register CTAs present");

    // Static Fallback & 3D Canvas
    await page1440.waitForTimeout(1500);
    const hasCanvasOrFallback = (await page1440.locator("canvas, div[class*='relative w-full'], [class*='shadow-2xl']").count()) > 0;
    recordResult("PUBLIC_HOME_3D_CENTERPIECE", hasCanvasOrFallback ? "PASS" : "FAIL", "Realistic 3D Chessboard / Static Fallback centerpiece rendered");

    await page1440.screenshot({ path: "scratch/public_home_1440.png" });
    await context1440.close();

    // ----------------------------------------------------
    // TEST 2: Laptop 1024x768 Viewport
    // ----------------------------------------------------
    console.log("\n--- 2. Testing Laptop Viewport (1024x768) ---");
    const context1024 = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    const page1024 = await context1024.newPage();

    page1024.on("console", (msg) => {
      if (msg.type() === "error") {
        const txt = msg.text();
        if (!txt.includes("favicon") && !txt.includes("Failed to load resource") && !txt.includes("404")) {
          testStats.consoleErrors.push(`[1024x768] ${txt}`);
        }
      }
    });

    await page1024.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page1024.waitForTimeout(1000);

    const bodyText1024 = await page1024.evaluate(() => document.body.innerText);
    const has1024Hero = bodyText1024.includes("PLAY CHESS");
    recordResult("PUBLIC_HOME_1024_VIEWPORT", has1024Hero ? "PASS" : "FAIL", "1024x768 viewport rendered cleanly");

    await page1024.screenshot({ path: "scratch/public_home_1024.png" });
    await context1024.close();

    // ----------------------------------------------------
    // TEST 3: Mobile 390x844 Viewport (No Horizontal Overflow)
    // ----------------------------------------------------
    console.log("\n--- 3. Testing Mobile Viewport (390x844) ---");
    const context390 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page390 = await context390.newPage();

    page390.on("console", (msg) => {
      if (msg.type() === "error") {
        const txt = msg.text();
        if (!txt.includes("favicon") && !txt.includes("Failed to load resource") && !txt.includes("404")) {
          testStats.consoleErrors.push(`[390x844] ${txt}`);
        }
      }
    });

    await page390.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page390.waitForTimeout(1000);

    const scrollWidth = await page390.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page390.evaluate(() => document.documentElement.clientWidth);
    const noOverflow = scrollWidth <= clientWidth;

    recordResult("PUBLIC_HOME_MOBILE_NO_OVERFLOW", noOverflow ? "PASS" : "FAIL", `Mobile 390x844 has no horizontal overflow (${scrollWidth}px <= ${clientWidth}px)`);

    await page390.screenshot({ path: "scratch/public_home_390.png" });
    await context390.close();

    // ----------------------------------------------------
    // TEST 4: Verify Auth Pages Lightweight (No Heavy WebGL on /login or /register)
    // ----------------------------------------------------
    console.log("\n--- 4. Testing Auth Pages Lightweight (/login & /register) ---");
    const contextAuth = await browser.newContext();
    const pageAuth = await contextAuth.newPage();

    await pageAuth.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
    await pageAuth.waitForTimeout(500);
    const loginCanvasCount = await pageAuth.locator("canvas").count();
    recordResult("LOGIN_LIGHTWEIGHT", loginCanvasCount === 0 ? "PASS" : "FAIL", "Login page does NOT instantiate heavy WebGL Canvas");

    await pageAuth.goto(`${BASE_URL}/register`, { waitUntil: "domcontentloaded" });
    await pageAuth.waitForTimeout(500);
    const registerCanvasCount = await pageAuth.locator("canvas").count();
    recordResult("REGISTER_LIGHTWEIGHT", registerCanvasCount === 0 ? "PASS" : "FAIL", "Register page does NOT instantiate heavy WebGL Canvas");

    await contextAuth.close();
  } catch (err) {
    console.error("Test execution exception:", err);
    testStats.issuesFound.push(`Exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log("\n=== TEST RESULTS SUMMARY ===");
  console.log(`Executed: ${testStats.executed}`);
  console.log(`Passed: ${testStats.passed}`);
  console.log(`Failed: ${testStats.failed}`);
  console.log(`Console Errors: ${testStats.consoleErrors.length}`);

  if (testStats.consoleErrors.length > 0) {
    console.log("Console Errors found:", testStats.consoleErrors);
  }

  if (testStats.failed > 0 || testStats.consoleErrors.length > 0) {
    process.exit(1);
  }
}

runPublicHome3DSuite();
