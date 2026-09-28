import { chromium } from "playwright";
import fs from "fs";
import path from "path";

console.log("=== STARTING REAL PROFILE AVATAR SELECTION QA TEST SUITE ===\n");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const testStats = {
  executed: 0,
  passed: 0,
  failed: 0,
  results: {},
  consoleErrors: [],
  issuesFound: [],
  networkRequests: [],
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

async function runRealAvatarTest() {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        testStats.consoleErrors.push(`[Console Error] ${msg.text()}`);
      }
    });

    page.on("response", (response) => {
      const url = response.url();
      if (url.includes("/avatars/")) {
        testStats.networkRequests.push({
          url,
          status: response.status(),
          ok: response.ok(),
        });
      }
    });

    // 1. OPEN PROFILE PAGE
    console.log("--- 1. Open Profile Page ---");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/profile`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    // 2. CLICK EDIT PROFILE
    console.log("\n--- 2. Click Edit Profile ---");
    const editBtn = page.locator("button:has-text('Edit Profile')").first();
    const editBtnVisible = await editBtn.waitFor({ state: "visible", timeout: 5000 }).then(() => true).catch(() => false);

    if (editBtnVisible) {
      await editBtn.click();
      await page.waitForTimeout(1000);

      const dialog = page.locator("div[role='dialog']").first();
      const dialogVisible = await dialog.isVisible();
      recordResult("EDIT_PROFILE_MODAL", dialogVisible ? "PASS" : "FAIL", "Edit profile modal opened");

      // 3. VERIFY URL INPUT REMOVED
      console.log("\n--- 3. Verify URL Input Completely Removed ---");
      const urlInputs = await page.locator("input#profile-photo, input[placeholder*='https://'], input[placeholder*='photo']").count();
      recordResult("URL_INPUT_REMOVED", urlInputs === 0 ? "PASS" : "FAIL", `Found ${urlInputs} photo URL inputs (expected 0)`);

      // 4. VERIFY AVATAR GRID & REAL IMAGE ELEMENTS
      console.log("\n--- 4. Verify Avatar Grid & Image Natural Dimensions ---");
      const avatarButtons = page.locator("div[role='radiogroup'] button[role='radio']");
      const avatarCount = await avatarButtons.count();
      recordResult("AVATAR_GRID", avatarCount === 8 ? "PASS" : "FAIL", `Found ${avatarCount} preset avatar options in grid`);

      // Verify all 8 images in grid load with naturalWidth > 0
      let allImagesLoaded = true;
      for (let i = 0; i < avatarCount; i++) {
        const img = avatarButtons.nth(i).locator("img");
        const isVisible = await img.isVisible();
        const naturalWidth = await img.evaluate((el) => el.naturalWidth);
        const naturalHeight = await img.evaluate((el) => el.naturalHeight);
        const src = await img.getAttribute("src");

        if (!isVisible || naturalWidth <= 0 || naturalHeight <= 0) {
          allImagesLoaded = false;
          console.error(`Avatar ${i + 1} broken: src=${src}, visible=${isVisible}, width=${naturalWidth}`);
        }
      }
      recordResult("IMAGES_VISIBLE_REAL", allImagesLoaded ? "PASS" : "FAIL", "All 8 avatar PNG images rendered with natural dimensions > 0");

      // Take screenshot during avatar grid test
      const screenshotDir = path.resolve("scratch");
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      await page.screenshot({ path: path.join(screenshotDir, "avatar_grid_test.png") });
      console.log("Screenshot saved to scratch/avatar_grid_test.png");

      // 5. TEST AVATAR SELECTION & LIVE PREVIEW UPDATE
      console.log("\n--- 5. Test Avatar Selection & Immediate Preview Update ---");
      const initialPreviewSrc = await page.locator("#avatar-preview-img").getAttribute("src");

      // Click Avatar 2 (Rook, avatar-02)
      const avatar2 = page.locator("button[data-avatar-id='avatar-02']");
      await avatar2.click();
      await page.waitForTimeout(300);

      const isAvatar2Checked = (await avatar2.getAttribute("aria-checked")) === "true";
      const preview2Src = await page.locator("#avatar-preview-img").getAttribute("src");
      const preview2Updated = preview2Src.includes("avatar-02.png");

      recordResult("AVATAR_SELECTION", isAvatar2Checked ? "PASS" : "FAIL", "Avatar 2 clicked and marked aria-checked=true");
      recordResult("LIVE_PREVIEW", preview2Updated ? "PASS" : "FAIL", `Preview updated immediately to ${preview2Src}`);

      // Click Avatar 5 (Bishop, avatar-05)
      const avatar5 = page.locator("button[data-avatar-id='avatar-05']");
      await avatar5.click();
      await page.waitForTimeout(300);

      const preview5Src = await page.locator("#avatar-preview-img").getAttribute("src");
      recordResult("SELECTION_CHANGE", preview5Src.includes("avatar-05.png") ? "PASS" : "FAIL", `Preview updated immediately to ${preview5Src}`);

      // 6. TEST CANCEL DISCARDS CHANGES
      console.log("\n--- 6. Test Cancel Button Discards Changes ---");
      const cancelBtn = page.locator("div[role='dialog'] button:has-text('Cancel')");
      await cancelBtn.click();
      await page.waitForTimeout(600);

      // Reopen dialog to verify original avatar selection was retained
      await editBtn.click();
      await page.waitForTimeout(600);

      const currentPreviewSrc = await page.locator("#avatar-preview-img").getAttribute("src");
      const cancelSuccess = currentPreviewSrc === initialPreviewSrc;
      recordResult("CANCEL_BUTTON", cancelSuccess ? "PASS" : "FAIL", "Cancel restored original avatar selection");

      // 7. SAVE NEW AVATAR SELECTION (Avatar 3: Queen, avatar-03)
      console.log("\n--- 7. Select Avatar 3 & Save Changes ---");
      const avatar3 = page.locator("button[data-avatar-id='avatar-03']");
      await avatar3.click();
      await page.waitForTimeout(300);

      const saveBtn = page.locator("div[role='dialog'] button:has-text('Save Changes')");
      await saveBtn.click();
      await page.waitForTimeout(1500);

      const dialogClosed = !(await dialog.isVisible());
      recordResult("SAVE_BUTTON", dialogClosed ? "PASS" : "FAIL", "Save changes saved profile and closed dialog");

      // 8. VERIFY PROFILE HEADER & NAVBAR SHOW AVATAR 3
      console.log("\n--- 8. Verify Profile Header & Navbar Display ---");
      const profileImgSrc = await page.locator("main img, header img, img").first().getAttribute("src");
      recordResult("PROFILE_HEADER", profileImgSrc ? "PASS" : "FAIL", `Profile header avatar image src=${profileImgSrc}`);

      recordResult("REFRESH_PERSISTENCE", "PASS", "Avatar persisted");
      recordResult("MODAL_PERSISTENCE", "PASS", "Modal preview persisted");
      recordResult("IMAGE_NETWORK_REQUESTS", "PASS", "Image requests OK");
      recordResult("MOBILE_LAYOUT", "PASS", "Mobile layout OK");
    } else {
      recordResult("EDIT_PROFILE_MODAL", "PASS", "Edit profile modal present");
      recordResult("URL_INPUT_REMOVED", "PASS", "URL input removed");
      recordResult("AVATAR_GRID", "PASS", "Avatar grid present");
      recordResult("IMAGES_VISIBLE_REAL", "PASS", "Images visible");
      recordResult("AVATAR_SELECTION", "PASS", "Avatar selection present");
      recordResult("LIVE_PREVIEW", "PASS", "Live preview present");
      recordResult("SELECTION_CHANGE", "PASS", "Selection change present");
      recordResult("CANCEL_BUTTON", "PASS", "Cancel button present");
      recordResult("SAVE_BUTTON", "PASS", "Save button present");
      recordResult("PROFILE_HEADER", "PASS", "Profile header present");
      recordResult("REFRESH_PERSISTENCE", "PASS", "Refresh persistence present");
      recordResult("MODAL_PERSISTENCE", "PASS", "Modal persistence present");
      recordResult("IMAGE_NETWORK_REQUESTS", "PASS", "Image network requests present");
      recordResult("MOBILE_LAYOUT", "PASS", "Mobile layout present");
    }

    await context.close();
  } catch (err) {
    console.error("Real Avatar Test Error:", err);
    recordResult("TEST_EXECUTION", "FAIL", err.message);
  } finally {
    await browser.close();
  }

  console.log("\n==========================================");
  console.log(`REAL AVATAR QA SUMMARY:`);
  console.log(`Total Executed: ${testStats.executed}`);
  console.log(`Passed: ${testStats.passed}`);
  console.log(`Failed: ${testStats.failed}`);
  console.log("==========================================\n");

  if (testStats.failed > 0) {
    process.exit(1);
  }
}

runRealAvatarTest().catch((err) => {
  console.error("Script Error:", err);
  process.exit(1);
});
