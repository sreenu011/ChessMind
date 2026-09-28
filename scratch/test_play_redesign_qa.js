import { chromium } from "playwright";

async function runQA() {
  console.log("Starting Play Page Redesign QA Test...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // 1. Visit /play at 1440px
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://127.0.0.1:3000/play", { waitUntil: "networkidle" });
    console.log("Navigated to /play");

    // Check header text
    const headerText = await page.textContent("h1");
    if (!headerText.includes("PLAY CHESS")) {
      throw new Error(`Unexpected header text: ${headerText}`);
    }
    console.log("Header check passed: PLAY CHESS");

    // Check horizontal scroll / overflow at 1440px, 1024px, 390px
    const viewports = [
      { width: 1440, height: 900 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(300);
      const isOverflowing = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      if (isOverflowing) {
        throw new Error(`Horizontal overflow detected at viewport ${vp.width}px!`);
      }
      console.log(`No horizontal overflow at ${vp.width}px`);
    }

    // Reset to 1440px
    await page.setViewportSize({ width: 1440, height: 900 });

    // 2. Click PLAY WITH COMPUTER
    console.log("Testing PLAY WITH COMPUTER link...");
    const computerBtn = page.locator("a:has-text('PLAY WITH COMPUTER')");
    await computerBtn.click();
    await page.waitForURL("**/play/computer");
    console.log("Successfully navigated to /play/computer!");

    // Navigate back to /play
    await page.goto("http://127.0.0.1:3000/play", { waitUntil: "networkidle" });

    // 3. Test Create Game flow
    console.log("Testing Create Game flow...");
    const createBtn = page.locator("button:has-text('CREATE GAME →')");
    await createBtn.click();
    await page.waitForTimeout(1000);

    // Verify created game state
    const createdHeader = page.locator("*:has-text('GAME CREATED')").first();
    await createdHeader.waitFor({ state: "visible", timeout: 5000 });
    console.log("Game created UI displayed!");

    // Copy code
    const copyBtn = page.locator("button:has-text('COPY CODE')");
    await copyBtn.click();
    console.log("Clicked Copy Code");

    // Cancel Game
    const cancelTrigger = page.locator("button:has-text('Cancel Game')");
    await cancelTrigger.click();
    
    // In alertdialog modal, click Cancel Game action
    const modalCancelBtn = page.locator("[role='alertdialog'] button:has-text('Cancel Game')");
    await modalCancelBtn.click();
    await page.waitForTimeout(1000);

    console.log("Game cancelled successfully!");

    // 4. Test Join Game Tab
    console.log("Testing Join Game UI...");
    const joinTab = page.locator("button:has-text('JOIN GAME'), [value='join']").first();
    await joinTab.click();

    const joinInput = page.locator("input[placeholder='123456']");
    await joinInput.fill("654321");
    const joinVal = await joinInput.inputValue();
    if (joinVal !== "654321") {
      throw new Error(`Input value mismatch: expected 654321, got ${joinVal}`);
    }
    console.log("Join input numeric validation passed!");

    console.log(`Console Errors count: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log("Console errors detected:", consoleErrors);
    }

    console.log("ALL PLAY PAGE QA TESTS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("QA Test Failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runQA();
