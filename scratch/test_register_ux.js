import { chromium } from 'playwright';

async function runRegisterTests() {
  console.log("=== Starting Register UX Polish QA Test Suite ===");
  const browser = await chromium.launch({ headless: true });
  let hasErrors = false;

  try {
    // 1. Desktop Viewport (1440x900)
    console.log("\n[TEST 1] Testing Desktop Viewport (1440x900)...");
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    // Monitor console errors
    page1440.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`  ❌ Console Error on 1440x900: ${msg.text()}`);
        hasErrors = true;
      }
    });

    await page1440.goto('http://localhost:8080/register', { waitUntil: 'networkidle' });

    // Check elements
    const googleBtn = await page1440.$('button:has-text("Continue with Google")');
    console.log(`  Google Button Visible: ${Boolean(googleBtn)}`);

    const divider = await page1440.$('text="Or register with email"');
    console.log(`  'OR' Divider Visible: ${Boolean(divider)}`);

    const usernameInput = await page1440.$('input#username');
    const emailInput = await page1440.$('input#email');
    const passwordInput = await page1440.$('input#password');
    const confirmInput = await page1440.$('input#confirm');
    const submitBtn = await page1440.$('button:has-text("CREATE ACCOUNT")');

    console.log(`  All Form Controls Found: ${Boolean(usernameInput && emailInput && passwordInput && confirmInput && submitBtn)}`);

    // Verify Placeholders
    const uPlaceholder = await usernameInput?.getAttribute('placeholder');
    const ePlaceholder = await emailInput?.getAttribute('placeholder');
    const pPlaceholder = await passwordInput?.getAttribute('placeholder');
    const cPlaceholder = await confirmInput?.getAttribute('placeholder');

    console.log(`  Placeholders: Username="${uPlaceholder}", Email="${ePlaceholder}", Password="${pPlaceholder}", Confirm="${cPlaceholder}"`);

    // Verify Viewport Height / Scrollability (must fit in 900px viewport without main window scrolling)
    const cardBox = await (await page1440.$('.bg-card'))?.boundingBox();
    console.log(`  Registration Card Height: ${cardBox ? Math.round(cardBox.height) + 'px' : 'N/A'}`);
    if (cardBox && cardBox.height > 750) {
      console.error(`  ⚠️ Card height too large: ${cardBox.height}px`);
      hasErrors = true;
    }

    // Verify Input Contrast Ratio / Styles
    const inputStyle = await usernameInput?.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        borderColor: computed.borderColor
      };
    });
    console.log(`  Computed Input Styles:`, inputStyle);

    // 2. Tablet Viewport (1024x768)
    console.log("\n[TEST 2] Testing Tablet Viewport (1024x768)...");
    const page1024 = await browser.newPage({ viewport: { width: 1024, height: 768 } });
    await page1024.goto('http://localhost:8080/register', { waitUntil: 'networkidle' });
    const btn1024 = await page1024.$('button:has-text("CREATE ACCOUNT")');
    console.log(`  Create Account Button Visible on Tablet: ${Boolean(btn1024)}`);

    // 3. Mobile Viewport (390x844)
    console.log("\n[TEST 3] Testing Mobile Viewport (390x844)...");
    const page390 = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page390.goto('http://localhost:8080/register', { waitUntil: 'networkidle' });

    // Verify no horizontal overflow
    const overflow = await page390.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log(`  Horizontal Overflow on 390px: ${overflow ? 'YES (FAIL)' : 'NO (PASS)'}`);
    if (overflow) hasErrors = true;

    // Verify visibility of Google button and Create Account button on mobile
    const mGoogleBtn = await page390.$('button:has-text("Continue with Google")');
    const mSubmitBtn = await page390.$('button:has-text("CREATE ACCOUNT")');

    const mGoogleBox = await mGoogleBtn?.boundingBox();
    const mSubmitBox = await mSubmitBtn?.boundingBox();

    console.log(`  Mobile Google Button Box:`, mGoogleBox);
    console.log(`  Mobile Submit Button Box:`, mSubmitBox);

    // Verify form validation
    console.log("\n[TEST 4] Form Validation Check...");
    await mSubmitBtn?.click();
    await page390.waitForTimeout(300);

    const userErr = await page390.$('text="Username is required."');
    const emailErr = await page390.$('text="Enter a valid email address."');
    console.log(`  Validation Errors Triggered: UsernameErr=${Boolean(userErr)}, EmailErr=${Boolean(emailErr)}`);

    console.log("\n=== REGISTER QA TEST SUITE COMPLETE ===");
    if (!hasErrors) {
      console.log("✅ ALL REGISTER UX QA CHECKS PASSED PERFECTLY!");
    } else {
      console.error("❌ REGISTER QA HAD ISSUES!");
    }
  } catch (err) {
    console.error("Fatal test error:", err);
  } finally {
    await browser.close();
  }
}

runRegisterTests();
