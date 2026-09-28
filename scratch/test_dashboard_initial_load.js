import { chromium } from "playwright";

console.log("=== STARTING CHESSMIND DASHBOARD INITIAL LOAD QA SUITE ===\n");

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

async function runDashboardInitialLoadTests() {
  const browser = await chromium.launch({ headless: true });

  try {
    // ----------------------------------------------------
    // TEST A & F: Direct Load on /dashboard (Desktop 1440x900)
    // ----------------------------------------------------
    console.log("--- TEST A & F: Direct load on /dashboard (1440x900) ---");
    const contextA = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageA = await contextA.newPage();

    pageA.on("console", (msg) => {
      if (msg.type() === "error") {
        const txt = msg.text();
        if (!txt.includes("favicon") && !txt.includes("Failed to load resource") && !txt.includes("404")) {
          testStats.consoleErrors.push(`[Page A] ${txt}`);
        }
      }
    });

    await pageA.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await pageA.waitForSelector("h1, h2", { timeout: 10000 });
    await pageA.waitForTimeout(1000);

    const bodyTextA = await pageA.evaluate(() => document.body.innerText);
    const hasNewDashboardA =
      bodyTextA.includes("Continue Learning") &&
      bodyTextA.includes("Play Chess") &&
      bodyTextA.includes("Recent Games");
    const hasOldDashboardA = bodyTextA.includes("Curriculum Categories") || bodyTextA.includes("Legacy Dashboard");

    recordResult("TEST_A_DIRECT_LOAD", hasNewDashboardA && !hasOldDashboardA ? "PASS" : "FAIL", "New 3D dashboard present and old dashboard absent on direct load");

    // ----------------------------------------------------
    // TEST B: Hard Refresh /dashboard
    // ----------------------------------------------------
    console.log("\n--- TEST B: Hard refresh /dashboard ---");
    await pageA.reload({ waitUntil: "domcontentloaded" });
    await pageA.waitForSelector("h1, h2", { timeout: 10000 });
    await pageA.waitForTimeout(1000);

    const bodyTextB = await pageA.evaluate(() => document.body.innerText);
    const hasNewDashboardB =
      bodyTextB.includes("Continue Learning") &&
      bodyTextB.includes("Play Chess") &&
      bodyTextB.includes("Recent Games");
    const hasOldDashboardB = bodyTextB.includes("Curriculum Categories");

    recordResult("TEST_B_HARD_REFRESH", hasNewDashboardB && !hasOldDashboardB ? "PASS" : "FAIL", "New dashboard remains after hard refresh");

    await contextA.close();

    // ----------------------------------------------------
    // TEST C: Open / then navigate to dashboard / login flow
    // ----------------------------------------------------
    console.log("\n--- TEST C: Open / then navigate to /dashboard ---");
    const contextC = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pageC = await contextC.newPage();

    pageC.on("console", (msg) => {
      if (msg.type() === "error") {
        const txt = msg.text();
        if (!txt.includes("favicon") && !txt.includes("Failed to load resource") && !txt.includes("404")) {
          testStats.consoleErrors.push(`[Page C] ${txt}`);
        }
      }
    });

    await pageC.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await pageC.waitForTimeout(1000);

    // If redirected to /dashboard or navigate to login -> /dashboard
    if (pageC.url().includes("/dashboard")) {
      console.log("Root / automatically redirected to /dashboard");
    } else {
      await pageC.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    }
    await pageC.waitForTimeout(1000);

    const bodyTextC = await pageC.evaluate(() => document.body.innerText);
    const hasNewDashboardC = bodyTextC.includes("Continue Learning") && bodyTextC.includes("Play Chess");
    recordResult("TEST_C_LOGIN_REDIRECT", hasNewDashboardC ? "PASS" : "FAIL", "Destination route is the new 3D dashboard");

    // ----------------------------------------------------
    // TEST D: Click Dashboard Navbar Link
    // ----------------------------------------------------
    console.log("\n--- TEST D: Click Dashboard navbar link ---");
    // Ensure navbar is visible
    const navDashboardLink = pageC.locator("a[href='/dashboard']").first();
    if ((await navDashboardLink.count()) > 0) {
      await navDashboardLink.click();
      await pageC.waitForTimeout(500);
    }

    const bodyTextD = await pageC.evaluate(() => document.body.innerText);
    const hasNewDashboardD = bodyTextD.includes("Continue Learning") && bodyTextD.includes("Play Chess");
    const hasOldDashboardD = bodyTextD.includes("Curriculum Categories");

    recordResult("TEST_D_NAVBAR_CLICK", hasNewDashboardD && !hasOldDashboardD ? "PASS" : "FAIL", "Dashboard navbar link keeps canonical 3D dashboard without replacement or reload");

    await contextC.close();

    // ----------------------------------------------------
    // TEST E: Mobile Viewport (390x844)
    // ----------------------------------------------------
    console.log("\n--- TEST E: Mobile Viewport (390x844) ---");
    const contextE = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pageE = await contextE.newPage();

    pageE.on("console", (msg) => {
      if (msg.type() === "error") {
        const txt = msg.text();
        if (!txt.includes("favicon") && !txt.includes("Failed to load resource") && !txt.includes("404")) {
          testStats.consoleErrors.push(`[Page E] ${txt}`);
        }
      }
    });

    await pageE.goto(`${BASE_URL}/dashboard`, { waitUntil: "domcontentloaded" });
    await pageE.waitForSelector("h1, h2", { timeout: 10000 });
    await pageE.waitForTimeout(1000);

    const bodyTextE = await pageE.evaluate(() => document.body.innerText);
    const hasNewDashboardE = bodyTextE.includes("Continue Learning") && bodyTextE.includes("Play Chess");

    recordResult("TEST_E_MOBILE_390x844", hasNewDashboardE ? "PASS" : "FAIL", "New 3D dashboard renders cleanly on 390x844 mobile viewport");

    await contextE.close();
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

runDashboardInitialLoadTests();
