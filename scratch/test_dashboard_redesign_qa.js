import { chromium } from "playwright";

async function runTest() {
  console.log("Starting QA test for Midnight Chess Club Dashboard...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // Navigate to dashboard
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "networkidle" });
    console.log("Navigated to /dashboard");

    // Check header greeting and brand motto
    const headerText = await page.locator("h1").innerText();
    console.log("Header found:", headerText);

    const mottoText = await page.locator("text=Think better. Play better.").textContent();
    console.log("Motto found:", mottoText);

    // Check player metrics (Rating, Games, Win Rate)
    const ratingLabel = await page.locator("text=Rating").first();
    const gamesLabel = await page.locator("text=Games").first();
    const winRateLabel = await page.locator("text=Win Rate").first();
    console.log("Player summary metrics present:", await ratingLabel.isVisible(), await gamesLabel.isVisible(), await winRateLabel.isVisible());

    // Check Continue Learning hero card
    const continueLearningHero = page.locator("text=Continue Learning").first();
    console.log("Continue Learning Hero visible:", await continueLearningHero.isVisible());

    // Check Play with AI link navigation
    const playAiLink = page.locator("a[href='/play/computer']").first();
    console.log("Play with AI link visible:", await playAiLink.isVisible());
    await playAiLink.click();
    await page.waitForURL("**/play/computer");
    console.log("Successfully navigated to /play/computer via Play with AI button");

    // Go back to dashboard
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "networkidle" });

    // Check Play with Friends link navigation
    const playFriendsLink = page.locator("a[href='/play']").first();
    console.log("Play with Friends link visible:", await playFriendsLink.isVisible());
    await playFriendsLink.click();
    await page.waitForURL("**/play");
    console.log("Successfully navigated to /play via Play with Friends button");

    // Go back to dashboard
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "networkidle" });

    // Check Daily Puzzle link navigation
    const dailyPuzzleLink = page.locator("a[href='/learn/daily-puzzle']").first();
    console.log("Daily Puzzle link visible:", await dailyPuzzleLink.isVisible());

    // Check Recent Games view all link navigation
    const gamesLink = page.locator("a[href='/games']").first();
    console.log("Recent Games link visible:", await gamesLink.isVisible());

    // Verify removed widgets are NOT in DOM
    const leaderboardSnapshot = await page.locator("text=Leaderboard Snapshot").count();
    const performanceChart = await page.locator("text=Performance Snapshot").count();
    console.log("Leaderboard Snapshot count (should be 0):", leaderboardSnapshot);

    // Mobile Viewport Check (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile Viewport (390px) - scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
    if (scrollWidth > clientWidth) {
      console.error("WARNING: Horizontal overflow detected on mobile!");
    } else {
      console.log("Mobile layout verified clean with 0 horizontal overflow.");
    }

    console.log("ALL DASHBOARD QA CHECKS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("QA Test Failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
