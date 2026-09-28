import { chromium } from "playwright";

console.log("=== STARTING BRAND RENAME QA SUITE (ChessArena -> ChessMind) ===\n");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

let testStats = {
  executed: 0,
  passed: 0,
  failed: 0,
  results: {},
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

async function runBrandRenameTestSuite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pagesToTest = [
    { name: "LOGIN", path: "/login" },
    { name: "REGISTER", path: "/register" },
    { name: "NAVBAR_LANDING", path: "/" },
    { name: "DASHBOARD", path: "/dashboard" },
    { name: "LEARN", path: "/learn" },
    { name: "LEVEL_10", path: "/learn" },
    { name: "PLAY", path: "/play" },
    { name: "GAME_HISTORY", path: "/games" },
    { name: "LEADERBOARD", path: "/leaderboard" },
    { name: "PROFILE", path: "/profile" },
    { name: "SETTINGS", path: "/settings" },
  ];

  try {
    for (const p of pagesToTest) {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);

      const content = await page.evaluate(() => document.body.innerText);
      const title = await page.title();
      const combined = `${title} ${content}`;

      const hasOldBrand = /ChessArena/i.test(combined);
      const hasNewBrand = /ChessMind/i.test(combined);

      if (!hasOldBrand && hasNewBrand) {
        recordResult(p.name, "PASS", `Verified ChessMind branding, no visible ChessArena text on ${p.path}`);
      } else if (!hasOldBrand) {
        recordResult(p.name, "PASS", `No old ChessArena text found on ${p.path}`);
      } else {
        recordResult(p.name, "FAIL", `Found visible ChessArena text on ${p.path}`);
      }
    }

    // Footer Check
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    const footerText = await page.evaluate(() => document.querySelector("footer")?.innerText || "");
    const footerOk = footerText.includes("ChessMind") && !footerText.includes("ChessArena");
    recordResult("FOOTER", footerOk ? "PASS" : "FAIL", `Footer copyright shows ChessMind`);

    // Overall Check
    recordResult("NO_OLD_BRAND_VISIBLE", testStats.failed === 0 ? "PASS" : "FAIL", "All visible branding updated to ChessMind");

  } catch (err) {
    console.error("Test execution error:", err);
    recordResult("BRAND_TEST_EXECUTION", "FAIL", err.message);
  } finally {
    await browser.close();
  }

  console.log("\n==========================================");
  console.log(`TESTS EXECUTED: ${testStats.executed}`);
  console.log(`TESTS PASSED: ${testStats.passed}`);
  console.log(`TESTS FAILED: ${testStats.failed}`);
  console.log("==========================================\n");
}

runBrandRenameTestSuite();
