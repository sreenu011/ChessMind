import { chromium } from "playwright";

async function runTest() {
  console.log("Starting QA test for Piece Style Preview Grid...");
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // 1. Open Settings Page
    await page.goto("http://127.0.0.1:3000/settings", { waitUntil: "domcontentloaded" });
    console.log("Navigated to /settings");

    // 2. Click Chess Board category in sidebar
    const boardCategoryBtn = page.locator("button:has-text('Chess Board')").first();
    await boardCategoryBtn.click();
    console.log("Clicked 'Chess Board' category");

    // 3. Piece Style section is visible
    const pieceStyleHeader = page.locator("text=Piece Style").first();
    console.log("Piece Style section visible:", await pieceStyleHeader.isVisible());

    // 4. Verify Classic & Tournament style cards are visible
    const classicCard = page.locator("button[aria-label='Select Classic piece style']");
    const tournamentCard = page.locator("button[aria-label='Select Tournament piece style']");
    console.log("Classic style card visible:", await classicCard.isVisible());
    console.log("Tournament style card visible:", await tournamentCard.isVisible());

    // 5. Inspect rendered text for illegal strings ("svg", "Tournamentsvg", etc.)
    const settingsBodyText = await page.locator("#chessboard").innerText();
    console.log("Checking visible text for illegal raw SVG strings...");
    if (settingsBodyText.includes("Tournamentsvg") || settingsBodyText.includes("ClassicSVG") || settingsBodyText.includes("<svg>")) {
      throw new Error("FAIL: Raw SVG text found in rendered Settings page!");
    }

    // Check SVG piece elements in preview grid
    const svgElementsCount = await page.locator("#chessboard svg").count();
    console.log(`Rendered SVG piece elements count in preview cards: ${svgElementsCount}`);
    if (svgElementsCount < 12) {
      throw new Error("FAIL: Preview piece SVG elements missing!");
    }

    // 6. Select Classic style
    await classicCard.click();
    console.log("Clicked Classic style card");
    await page.waitForTimeout(500);

    // Verify selected state
    const classicPressed = await classicCard.getAttribute("aria-pressed");
    console.log("Classic card aria-pressed state:", classicPressed);
    if (classicPressed !== "true") {
      throw new Error("FAIL: Classic card does not have active/selected state!");
    }

    // 7. Open a Chessboard page (/play/computer) to verify board updates
    await page.goto("http://127.0.0.1:3000/play/computer", { waitUntil: "domcontentloaded" });
    console.log("Navigated to /play/computer");

    const boardContainer = page.locator("[data-chess-board-container]");
    console.log("Chessboard container visible:", await boardContainer.isVisible());
    const boardStyleAttr = await boardContainer.getAttribute("data-piece-style");
    console.log("Board data-piece-style attribute:", boardStyleAttr);

    if (boardStyleAttr !== "classic") {
      throw new Error(`FAIL: Chessboard did not apply Classic style! Found: ${boardStyleAttr}`);
    }

    // 8. Go back to Settings and select Tournament style
    await page.goto("http://127.0.0.1:3000/settings", { waitUntil: "domcontentloaded" });
    await page.locator("button:has-text('Chess Board')").first().click();
    await tournamentCard.click();
    console.log("Clicked Tournament style card");
    await page.waitForTimeout(500);

    // 9. Verify persistence after reload
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("button:has-text('Chess Board')").first().click();
    const tournamentPressed = await tournamentCard.getAttribute("aria-pressed");
    console.log("Tournament card aria-pressed after reload:", tournamentPressed);

    if (tournamentPressed !== "true") {
      throw new Error("FAIL: Piece style setting did not persist after page reload!");
    }

    // 10. Check board piece style after changing to Tournament
    await page.goto("http://127.0.0.1:3000/play/computer", { waitUntil: "domcontentloaded" });
    const boardStyleAttr2 = await page.locator("[data-chess-board-container]").getAttribute("data-piece-style");
    console.log("Board data-piece-style attribute after selecting Tournament:", boardStyleAttr2);

    if (boardStyleAttr2 !== "tournament") {
      throw new Error(`FAIL: Board piece style did not change to Tournament! Found: ${boardStyleAttr2}`);
    }

    // 11. Mobile Viewport Check (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:3000/settings", { waitUntil: "domcontentloaded" });
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile Viewport (390px) - scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);

    if (scrollWidth > clientWidth) {
      throw new Error("FAIL: Horizontal overflow detected on mobile!");
    }

    console.log("ALL PIECE STYLE QA CHECKS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("QA Test Failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
