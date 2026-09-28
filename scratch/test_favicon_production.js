import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

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

const assetPaths = [
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
];

function waitForPort(port, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://localhost:${port}`, (res) => {
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Timeout waiting for port ${port}`));
        } else {
          setTimeout(check, 500);
        }
      });
      req.end();
    };
    check();
  });
}

async function run() {
  const port = 4173;
  console.log(`Starting preview server on port ${port}...`);
  const server = spawn('npx', ['vite', 'preview', '--port', String(port)], {
    shell: true,
    stdio: 'pipe',
  });

  server.stdout?.on('data', (d) => console.log('[Server stdout]:', d.toString().trim()));
  server.stderr?.on('data', (d) => console.error('[Server stderr]:', d.toString().trim()));

  try {
    await waitForPort(port);
    console.log(`Preview server is active on http://localhost:${port}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    let failedRequests = [];
    page.on('response', (res) => {
      if (res.status() >= 400 && res.url().includes('favicon')) {
        failedRequests.push(`${res.status()}: ${res.url()}`);
      }
    });

    console.log('\n--- VERIFYING STATIC FAVICON ASSET ENDPOINTS ---');
    for (const assetPath of assetPaths) {
      const url = `http://localhost:${port}${assetPath}`;
      const res = await page.goto(url);
      const status = res.status();
      const contentType = res.headers()['content-type'];
      const body = await res.body();
      console.log(`✓ ${assetPath} -> Status: ${status}, Content-Type: ${contentType}, Size: ${body.length} bytes`);
      if (status !== 200) {
        throw new Error(`Failed to load ${assetPath}: status ${status}`);
      }
      if (body.length === 0) {
        throw new Error(`Asset ${assetPath} returned empty response`);
      }
    }

    console.log('\n--- VERIFYING SVG EMBEDDED CONTENT ---');
    const svgRes = await page.goto(`http://localhost:${port}/favicon.svg`);
    const svgText = await svgRes.text();
    if (!svgText.includes('data:image/png;base64,')) {
      throw new Error('SVG does not contain embedded high quality source image!');
    }
    console.log('✓ favicon.svg contains exact source data image representation.');

    console.log('\n--- VERIFYING ALL ROUTES AND HEAD ICON LINKS ---');
    for (const route of routes) {
      const targetUrl = `http://localhost:${port}${route}`;
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);

      const iconLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel*="icon"]'));
        return links.map((l) => ({
          rel: l.getAttribute('rel'),
          href: l.getAttribute('href'),
          sizes: l.getAttribute('sizes'),
          type: l.getAttribute('type'),
        }));
      });

      const manifestLink = await page.evaluate(() => {
        const l = document.querySelector('link[rel="manifest"]');
        return l ? l.getAttribute('href') : null;
      });

      console.log(`\nRoute: ${route}`);
      console.log(`  Title: "${await page.title()}"`);
      console.log(`  Manifest: ${manifestLink}`);
      console.log(`  Icon links count: ${iconLinks.length}`);
      for (const link of iconLinks) {
        console.log(`    - rel="${link.rel}" href="${link.href}" sizes="${link.sizes || 'n/a'}" type="${link.type || 'n/a'}"`);
      }

      // Check required links
      const hrefs = iconLinks.map((l) => l.href);
      const hasSvg = hrefs.some((h) => h?.includes('/favicon.svg'));
      const has32 = hrefs.some((h) => h?.includes('/favicon-32x32.png'));
      const has16 = hrefs.some((h) => h?.includes('/favicon-16x16.png'));
      const hasIco = hrefs.some((h) => h?.includes('/favicon.ico'));
      const hasApple = hrefs.some((h) => h?.includes('/apple-touch-icon.png'));

      if (!hasSvg || !has32 || !has16 || !hasIco || !hasApple) {
        throw new Error(`Route ${route} is missing required favicon link tags! Present: ${JSON.stringify(hrefs)}`);
      }

      // Check no Vite or React icons
      const hasObsolete = hrefs.some((h) => h?.includes('vite') || h?.includes('react'));
      if (hasObsolete) {
        throw new Error(`Route ${route} has obsolete vite/react icon links: ${JSON.stringify(hrefs)}`);
      }
    }

    console.log('\n--- VERIFYING NO FAILED FAVICON REQUESTS ---');
    if (failedRequests.length > 0) {
      throw new Error(`Failed favicon requests detected: ${JSON.stringify(failedRequests)}`);
    } else {
      console.log('✓ 0 failed favicon requests across all visited routes!');
    }

    // Take screenshot of browser rendering favicon
    await page.goto(`http://localhost:${port}/`);
    await page.screenshot({ path: path.join(process.cwd(), 'scratch/preview_home_verified.png') });
    console.log('✓ Captured home page screenshot to scratch/preview_home_verified.png');

    await browser.close();
    console.log('\n🎉 ALL FAVICON TESTS PASSED PERFECTLY!');
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
