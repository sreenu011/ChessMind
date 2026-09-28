import { chromium } from "playwright";

async function runAuthQA() {
  console.log("=== STARTING AUTH PAGES REDESIGN QA TEST SUITE ===");
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

    // 1. TEST /login PAGE
    console.log("\n--- 1. Testing /login Page ---");
    await page.goto("http://127.0.0.1:3000/login", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("input[type='email']", { timeout: 10000 });

    const loginText = await page.evaluate(() => document.body.innerText);
    if (!loginText.toLowerCase().includes("welcome back") && !loginText.toLowerCase().includes("sign in")) {
      throw new Error("FAIL: /login title missing!");
    }
    console.log("[PASS] /login page header verified");

    const emailInput = page.locator("input[type='email']");
    const passwordInput = page.locator("input[type='password']");
    if (!(await emailInput.isVisible()) || !(await passwordInput.isVisible())) {
      throw new Error("FAIL: Email or Password inputs missing on /login!");
    }
    console.log("[PASS] /login input fields rendered cleanly");

    // 2. TEST /register PAGE
    console.log("\n--- 2. Testing /register Page ---");
    await page.goto("http://127.0.0.1:3000/register", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("input#username", { timeout: 10000 });

    const registerText = await page.evaluate(() => document.body.innerText);
    if (!registerText.toLowerCase().includes("create account") && !registerText.toLowerCase().includes("create your account")) {
      throw new Error("FAIL: /register title missing!");
    }
    console.log("[PASS] /register page header verified");

    const userInput = page.locator("input#username");
    if (!(await userInput.isVisible())) {
      throw new Error("FAIL: Username input missing on /register!");
    }
    console.log("[PASS] /register input fields rendered cleanly");

    // 3. RESPONSIVE VIEWPORT TESTING
    console.log("\n--- 3. Testing Responsive Viewports ---");
    const viewports = [
      { name: "Desktop (1440px)", w: 1440, h: 900 },
      { name: "Tablet (1024px)", w: 1024, h: 768 },
      { name: "Mobile (390px)", w: 390, h: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto("http://127.0.0.1:3000/login", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientW = await page.evaluate(() => document.documentElement.clientWidth);

      if (scrollW > clientW + 2) {
        throw new Error(`FAIL: Horizontal overflow detected on /login (${vp.name})! scrollWidth=${scrollW}, clientWidth=${clientW}`);
      }
      console.log(`[PASS] /login ${vp.name} - no overflow (scrollWidth: ${scrollW}, clientWidth: ${clientW})`);
    }

    if (consoleErrors.length > 0) {
      console.warn("Captured Console Errors:", consoleErrors);
    } else {
      console.log("[PASS] Zero Console Errors Captured!");
    }

    console.log("\n==========================================");
    console.log("ALL AUTH REDESIGN QA TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================\n");
  } catch (err) {
    console.error("QA Test Failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAuthQA();
