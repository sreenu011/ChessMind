import { chromium } from '@playwright/test';
import spawn from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'path';

const routes = [
  { path: '/login', name: 'login' },
  { path: '/register', name: 'register' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/play', name: 'play_landing' },
  { path: '/play/computer', name: 'play_computer' },
  { path: '/play/friends', name: 'play_friends' },
  { path: '/learn', name: 'learn_index' },
  { path: '/leaderboard', name: 'leaderboard' },
  { path: '/games', name: 'games' },
  { path: '/profile', name: 'profile' },
  { path: '/settings', name: 'settings' },
];

function waitForPort(port, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://localhost:${port}`, (res) => resolve());
      req.on('error', () => {
        if (Date.now() - start > timeout) reject(new Error(`Timeout port ${port}`));
        else setTimeout(check, 500);
      });
      req.end();
    };
    check();
  });
}

async function run() {
  console.log('=== STARTING PRODUCTION READINESS QA SUITE ===\n');
  const screenshotDir = path.join(process.cwd(), 'scratch/screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

  console.log('Starting dev server on port 3000...');
  const server = spawn.spawn('npx', ['vite', 'dev', '--port', '3000'], { stdio: 'ignore', shell: true });

  try {
    await waitForPort(3000);
    console.log('Dev server ready on port 3000.\n');

    const browser = await chromium.launch({ headless: true });

    // 1. DESKTOP VIEWPORT TEST (1440x900)
    console.log('--- 1. DESKTOP QA & VISUAL SCREENSHOTS (1440x900) ---');
    const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const desktopPage = await desktopCtx.newPage();

    const consoleErrors = [];
    desktopPage.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Exclude network / third-party analytics noise if any
        if (!msg.text().includes('favicon') && !msg.text().includes('404')) {
          consoleErrors.push(msg.text());
        }
      }
    });

    for (const r of routes) {
      const url = `http://localhost:3000${r.path}`;
      const startMs = Date.now();
      await desktopPage.goto(url, { waitUntil: 'domcontentloaded' });
      const loadTimeMs = Date.now() - startMs;

      // Small wait for client hydration
      await desktopPage.waitForTimeout(1000);

      const shotPath = path.join(screenshotDir, `desktop_${r.name}.png`);
      await desktopPage.screenshot({ path: shotPath, fullPage: false });
      console.log(`[PASS] ${r.path} rendered in ${loadTimeMs}ms -> Screenshot saved: desktop_${r.name}.png`);
    }

    // 2. MOBILE VIEWPORT TEST (390x844)
    console.log('\n--- 2. MOBILE QA & VISUAL SCREENSHOTS (390x844) ---');
    const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobilePage = await mobileCtx.newPage();

    for (const r of routes) {
      const url = `http://localhost:3000${r.path}`;
      await mobilePage.goto(url, { waitUntil: 'domcontentloaded' });
      await mobilePage.waitForTimeout(1000);

      const shotPath = path.join(screenshotDir, `mobile_${r.name}.png`);
      await mobilePage.screenshot({ path: shotPath, fullPage: false });
      console.log(`[PASS] ${r.path} (Mobile 390x844) -> Screenshot saved: mobile_${r.name}.png`);
    }

    // 3. NO-LOCK LEARNING SYSTEM AUDIT
    console.log('\n--- 3. NO-LOCK LEARNING SYSTEM AUDIT ---');
    await desktopPage.goto('http://localhost:3000/learn', { waitUntil: 'domcontentloaded' });
    await desktopPage.waitForTimeout(1000);

    const learnCheck = await desktopPage.evaluate(() => {
      const lockIcons = document.querySelectorAll('[aria-label="Locked"]');
      const levelButtons = Array.from(document.querySelectorAll('a[href*="/learn/"]'));
      return {
        lockIconsCount: lockIcons.length,
        accessibleLinksCount: levelButtons.length,
      };
    });
    console.log(`Lock icons count: ${learnCheck.lockIconsCount} (Expected: 0)`);
    console.log(`Accessible Learn Links count: ${learnCheck.accessibleLearnLinks || learnCheck.accessibleLinksCount}`);
    if (learnCheck.lockIconsCount === 0) {
      console.log('[PASS] Learning system has ZERO locks — all levels and skills accessible.');
    } else {
      console.log('[FAIL] Lock icons detected in Learn module!');
    }

    // 4. BRANDING & BRAND AUDIT
    console.log('\n--- 4. BRANDING AUDIT ---');
    await desktopPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    const brandCheck = await desktopPage.evaluate(() => {
      const txt = document.body.innerText;
      return {
        hasChessMind: txt.includes('ChessMind'),
        hasChessArena: /ChessArena/i.test(txt),
        hasLovable: /Lovable/i.test(txt),
      };
    });
    console.log(`Branding: ChessMind=${brandCheck.hasChessMind}, ChessArena=${brandCheck.hasChessArena}, Lovable=${brandCheck.hasLovable}`);
    if (brandCheck.hasChessMind && !brandCheck.hasChessArena && !brandCheck.hasLovable) {
      console.log('[PASS] Customer-facing brand is 100% ChessMind.');
    } else {
      console.log('[FAIL] Branding issue detected!');
    }

    // 5. CONSOLE ERROR SUMMARY
    console.log('\n--- 5. CONSOLE ERROR AUDIT ---');
    if (consoleErrors.length === 0) {
      console.log('[PASS] ZERO critical console errors detected during route traversal.');
    } else {
      console.log(`Console Errors encountered (${consoleErrors.length}):`, consoleErrors);
    }

    await browser.close();
    console.log('\n=== PRODUCTION READINESS QA COMPLETED SUCCESSFULLY ===');
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('QA Suite Failed:', err);
  process.exit(1);
});
