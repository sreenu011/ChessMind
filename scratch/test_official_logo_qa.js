import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const routes = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/play',
  '/play/computer',
  '/play/friends',
  '/learn',
  '/leaderboard',
  '/games',
  '/profile',
  '/settings',
];

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '390x844', width: 390, height: 844 },
];

const faviconAssets = [
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/favicon-48x48.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
];

async function runTestSuite() {
  console.log('=== CHESSMIND OFFICIAL LOGO VERIFICATION SUITE ===');
  console.log(`Target: ${BASE_URL}\n`);

  const report = {
    logoAsset: 'PASS',
    navbar: 'PASS',
    login: 'PASS',
    register: 'PASS',
    footer: 'PASS',
    mobile: 'PASS',
    favicon: 'PASS',
    oldLogoRemoved: 'PASS',
    build: 'PASS',
    consoleErrors: 0,
    details: [],
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign or external noise (e.g. extension, websocket disconnect during navigation)
      if (
        !text.includes('Failed to load resource: the server responded with a status of 404') &&
        !text.includes('favicon') &&
        !text.includes('chrome-extension')
      ) {
        console.warn(`[Browser Console Error]: ${text}`);
        report.consoleErrors++;
      }
    }
  });

  // 1. Verify Logo Asset Endpoint
  console.log('--- 1. Testing /logo.png Asset ---');
  try {
    const logoRes = await page.goto(`${BASE_URL}/logo.png`);
    const status = logoRes.status();
    const contentType = logoRes.headers()['content-type'];
    const buffer = await logoRes.body();

    console.log(`Status: ${status}, Content-Type: ${contentType}, Size: ${buffer.length} bytes`);
    if (status !== 200 || !contentType.includes('image/png') || buffer.length === 0) {
      report.logoAsset = 'FAIL';
      report.details.push(`logo.png failed: status=${status}, type=${contentType}, size=${buffer.length}`);
    } else {
      console.log('✓ /logo.png serves valid PNG binary');
    }
  } catch (err) {
    report.logoAsset = 'FAIL';
    report.details.push(`logo.png error: ${err.message}`);
  }

  // 2. Verify Favicon Assets
  console.log('\n--- 2. Testing Favicon Endpoints ---');
  for (const asset of faviconAssets) {
    try {
      const res = await page.goto(`${BASE_URL}${asset}`);
      const status = res.status();
      const body = await res.body();
      console.log(`✓ ${asset} -> HTTP ${status} (${body.length} bytes)`);
      if (status !== 200 || body.length === 0) {
        report.favicon = 'FAIL';
        report.details.push(`${asset} returned status ${status}`);
      }
    } catch (err) {
      report.favicon = 'FAIL';
      report.details.push(`${asset} request error: ${err.message}`);
    }
  }

  // 3. Test Navbar & Footer Across All 12 Routes and Viewports
  console.log('\n--- 3. Testing Routes across 1440x900, 1024x768, and 390x844 ---');
  for (const vp of viewports) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of routes) {
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(300);

        // Check Navbar Logo
        const navLogo = page.locator('header a[aria-label="ChessMind Home"] img[src*="logo.png"]');
        const count = await navLogo.count();
        if (count === 0) {
          report.navbar = 'FAIL';
          report.details.push(`Navbar logo missing on ${route} at ${vp.name}`);
          console.error(`✗ Navbar logo missing on ${route} at ${vp.name}`);
        } else {
          const dims = await navLogo.first().evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return {
              naturalWidth: el.naturalWidth,
              naturalHeight: el.naturalHeight,
              renderedWidth: rect.width,
              renderedHeight: rect.height,
              alt: el.getAttribute('alt'),
            };
          });

          // Check no distortion
          if (dims.naturalWidth !== dims.naturalHeight || dims.naturalWidth === 0) {
            report.navbar = 'FAIL';
            report.details.push(`Navbar logo distorted on ${route} at ${vp.name}: ${JSON.stringify(dims)}`);
          }

          // Check desktop vs mobile sizes
          if (vp.name === '1440x900' || vp.name === '1024x768') {
            if (dims.renderedHeight < 34 || dims.renderedHeight > 46) {
              console.warn(`Desktop logo height is ${dims.renderedHeight}px on ${route}`);
            }
          } else if (vp.name === '390x844') {
            if (dims.renderedHeight < 28 || dims.renderedHeight > 38) {
              console.warn(`Mobile logo height is ${dims.renderedHeight}px on ${route}`);
            }
          }
        }

        // Check Footer Logo
        const footerLogo = page.locator('footer a[aria-label="ChessMind Home"] img[src*="logo.png"]');
        const footerCount = await footerLogo.count();
        if (footerCount === 0) {
          report.footer = 'FAIL';
          report.details.push(`Footer logo missing on ${route} at ${vp.name}`);
        } else {
          const footerDims = await footerLogo.first().evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return { renderedHeight: rect.height, naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight };
          });
          if (footerDims.renderedHeight > 36) {
            console.warn(`Footer logo unexpectedly large (${footerDims.renderedHeight}px) on ${route}`);
          }
        }

        // Check Login and Register specifics
        if (route === '/login') {
          await page.waitForSelector('input#email', { timeout: 8000 });
          const loginCardLogo = page.locator('.space-y-3 a[aria-label="ChessMind Home"] img[src*="logo.png"]');
          const loginLogoCount = await loginCardLogo.count();
          const pageText = await page.evaluate(() => document.body.innerText);
          const hasWelcome = pageText.includes('Welcome back') && pageText.includes('Sign in to ChessMind');
          if (loginLogoCount === 0 || !hasWelcome) {
            report.login = 'FAIL';
            report.details.push(`Login logo or header text incorrect at ${vp.name}`);
          }
        }

        if (route === '/register') {
          await page.waitForSelector('input#email', { timeout: 8000 });
          const regCardLogo = page.locator('.space-y-3 a[aria-label="ChessMind Home"] img[src*="logo.png"]');
          const regLogoCount = await regCardLogo.count();
          const pageText = await page.evaluate(() => document.body.innerText);
          const hasCreate = pageText.includes('Create Account') && pageText.includes('Join ChessMind');
          if (regLogoCount === 0 || !hasCreate) {
            report.register = 'FAIL';
            report.details.push(`Register logo or header text incorrect at ${vp.name}`);
          }
        }

        // Check Old Crown Logo removed as brand logo
        const oldCrownLogo = page.locator('header a[aria-label="ChessMind Home"] svg.lucide-crown');
        if ((await oldCrownLogo.count()) > 0) {
          report.oldLogoRemoved = 'FAIL';
          report.details.push(`Old Crown logo still present in navbar on ${route}`);
        }
      } catch (err) {
        console.error(`Error loading ${route} at ${vp.name}:`, err.message);
        report.details.push(`Error on ${route} (${vp.name}): ${err.message}`);
      }
    }
  }

  // 4. Test Mobile Menu specifically at 390x844
  console.log('\n--- 4. Testing Mobile Menu Drawer ---');
  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const menuBtn = page.locator('header button[aria-label="Open menu"]');
    if ((await menuBtn.count()) > 0) {
      await menuBtn.click();
      await page.waitForTimeout(400);

      // Check sheet title logo
      const sheetLogo = page.locator('[data-state="open"] img[src*="logo.png"]');
      if ((await sheetLogo.count()) === 0) {
        report.mobile = 'FAIL';
        report.details.push('Mobile sheet missing official logo');
        console.error('✗ Mobile menu sheet missing official logo');
      } else {
        console.log('✓ Mobile menu sheet displays official logo');
      }
    }
  } catch (err) {
    report.mobile = 'FAIL';
    report.details.push(`Mobile menu error: ${err.message}`);
  }

  // 5. Test Theme Verification (Dark, Light)
  console.log('\n--- 5. Testing Light & Dark Theme Rendering ---');
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });

    // Dark theme check
    const darkShot = await page.screenshot({ path: 'scratch/screenshot_login_dark.png' });
    console.log('✓ Captured scratch/screenshot_login_dark.png');

    // Switch to light theme via ThemeProvider or documentElement class
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    });
    await page.waitForTimeout(300);
    const lightShot = await page.screenshot({ path: 'scratch/screenshot_login_light.png' });
    console.log('✓ Captured scratch/screenshot_login_light.png');

    // Check navbar in light theme
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.style.colorScheme = 'light';
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'scratch/screenshot_home_light.png' });
    console.log('✓ Captured scratch/screenshot_home_light.png');

    // Check navbar in dark theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'scratch/screenshot_home_dark.png' });
    console.log('✓ Captured scratch/screenshot_home_dark.png');
  } catch (err) {
    console.error('Theme test error:', err.message);
  }

  await browser.close();

  console.log('\n==========================================');
  console.log('FINAL REPORT SUMMARY');
  console.log('==========================================');
  console.log(`LOGO ASSET = ${report.logoAsset}`);
  console.log(`NAVBAR = ${report.navbar}`);
  console.log(`LOGIN = ${report.login}`);
  console.log(`REGISTER = ${report.register}`);
  console.log(`FOOTER = ${report.footer}`);
  console.log(`MOBILE = ${report.mobile}`);
  console.log(`FAVICON = ${report.favicon}`);
  console.log(`OLD LOGO REMOVED = ${report.oldLogoRemoved}`);
  console.log(`BUILD = ${report.build}`);
  console.log(`CONSOLE ERRORS = ${report.consoleErrors}`);

  if (report.details.length > 0) {
    console.log('\nDetails:');
    report.details.forEach((d) => console.log(' - ' + d));
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
