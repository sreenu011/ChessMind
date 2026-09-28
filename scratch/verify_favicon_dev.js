import { chromium } from '@playwright/test';
import spawn from 'child_process';
import http from 'http';

const routes = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/play',
  '/play/computer',
  '/play/friends',
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
  console.log('Starting dev server on port 3000...');
  const server = spawn.spawn('npx', ['vite', 'dev', '--port', '3000'], {
    stdio: 'ignore',
    shell: true,
  });

  try {
    await waitForPort(3000);
    console.log('Dev server ready on port 3000.');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Verify asset endpoints return HTTP 200
    const assetUrls = [
      'http://localhost:3000/favicon.svg',
      'http://localhost:3000/favicon.ico',
      'http://localhost:3000/favicon-32x32.png',
      'http://localhost:3000/favicon-16x16.png',
      'http://localhost:3000/apple-touch-icon.png',
      'http://localhost:3000/site.webmanifest',
    ];

    console.log('--- ASSET HTTP STATUS CHECKS ---');
    for (const url of assetUrls) {
      const res = await page.goto(url);
      console.log(`${url} -> HTTP ${res.status()} (${res.headers()['content-type']})`);
    }

    // 2. Verify HTML head link tags across requested routes
    console.log('--- ROUTE FAVICON HEAD LINK CHECKS ---');
    for (const route of routes) {
      const targetUrl = `http://localhost:3000${route}`;
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
      const favicons = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel*="icon"], link[rel="manifest"]'));
        return links.map((l) => ({
          rel: l.getAttribute('rel'),
          href: l.getAttribute('href'),
          type: l.getAttribute('type'),
        }));
      });
      console.log(`Route ${route}:`, JSON.stringify(favicons, null, 2));
    }

    await browser.close();
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
