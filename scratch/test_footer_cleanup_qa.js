import { chromium } from "playwright";

async function runTest() {
  console.log("Starting QA test for Footer Cleanup...");
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // 1. Check Public Landing Page Footer
    await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
    console.log("Navigated to /");

    const footer = page.locator("footer");
    const footerLoginLink = footer.locator("a[href='/login']");
    const footerRegisterLink = footer.locator("a[href='/register']");

    const footerLoginCount = await footerLoginLink.count();
    const footerRegisterCount = await footerRegisterLink.count();
    console.log(`Footer Login link count on /: ${footerLoginCount} (expected 0)`);
    console.log(`Footer Register link count on /: ${footerRegisterCount} (expected 0)`);

    if (footerLoginCount > 0 || footerRegisterCount > 0) {
      throw new Error("FAIL: Footer still contains Login or Register link!");
    }

    // Verify footer branding & copyright text present
    const footerText = await footer.innerText();
    console.log("Footer text content:", footerText);
    if (!footerText.includes("ChessMind")) {
      throw new Error("FAIL: Footer branding text missing!");
    }

    // 2. Check Login Page
    await page.goto("http://127.0.0.1:3000/login", { waitUntil: "networkidle" });
    console.log("Navigated to /login (current URL:", page.url(), ")");

    // Verify login page footer does NOT have login/register links
    const loginPageFooterLogin = page.locator("footer a[href='/login']");
    const loginPageFooterRegister = page.locator("footer a[href='/register']");
    if (await loginPageFooterLogin.count() > 0 || await loginPageFooterRegister.count() > 0) {
      throw new Error("FAIL: Login page footer still contains login/register links!");
    }

    // 3. Check Register Page
    await page.goto("http://127.0.0.1:3000/register", { waitUntil: "networkidle" });
    console.log("Navigated to /register (current URL:", page.url(), ")");

    // Verify register page footer does NOT have login/register links
    const registerPageFooterLogin = page.locator("footer a[href='/login']");
    const registerPageFooterRegister = page.locator("footer a[href='/register']");
    if (await registerPageFooterLogin.count() > 0 || await registerPageFooterRegister.count() > 0) {
      throw new Error("FAIL: Register page footer still contains login/register links!");
    }

    // 4. Check Dashboard Page
    await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "networkidle" });
    console.log("Navigated to /dashboard");
    const dashFooterLogin = page.locator("footer a[href='/login']");
    const dashFooterRegister = page.locator("footer a[href='/register']");
    if (await dashFooterLogin.count() > 0 || await dashFooterRegister.count() > 0) {
      throw new Error("FAIL: Dashboard footer contains login or register link!");
    }

    console.log("ALL FOOTER CLEANUP QA CHECKS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("QA Test Failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
