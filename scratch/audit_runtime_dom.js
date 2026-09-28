import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import http from 'http';

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
  console.log('Starting preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    stdio: 'ignore',
    shell: true,
  });

  try {
    await waitForPort(4173);
    console.log('Preview server ready on port 4173.');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const results = [];

    for (const route of routes) {
      const targetUrl = `http://localhost:4173${route}`;
      console.log(`Auditing ${route}...`);
      
      try {
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 15000 });
      } catch (e) {
        // Fallback wait if networkidle times out
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
      }

      // Small extra wait for dynamic rendering
      await page.waitForTimeout(1000);

      const pageAudit = await page.evaluate(() => {
        const issues = [];

        // 1. Text nodes containing "Lovable"
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.textContent && node.textContent.toLowerCase().includes('lovable')) {
            issues.push({
              type: 'visible_text',
              text: node.textContent.trim(),
              parentTag: node.parentElement ? node.parentElement.tagName : 'UNKNOWN',
            });
          }
        }

        // 2. Elements with href/src containing "lovable"
        const linksAndMedia = Array.from(document.querySelectorAll('[href], [src]'));
        for (const el of linksAndMedia) {
          const href = el.getAttribute('href') || '';
          const src = el.getAttribute('src') || '';
          if (href.toLowerCase().includes('lovable') || src.toLowerCase().includes('lovable')) {
            issues.push({
              type: 'attribute_link_or_media',
              tag: el.tagName,
              href,
              src,
              text: (el.innerText || '').trim(),
            });
          }
        }

        // 3. Fixed / sticky / floating badge inspection
        const allElements = Array.from(document.querySelectorAll('*'));
        const floatingBadges = [];
        for (const el of allElements) {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky' || style.position === 'absolute') {
            const txt = (el.innerText || '').toLowerCase();
            const idOrClass = (el.id + ' ' + el.className).toLowerCase();
            if (txt.includes('lovable') || idOrClass.includes('lovable')) {
              floatingBadges.push({
                tag: el.tagName,
                position: style.position,
                id: el.id,
                className: el.className,
                text: (el.innerText || '').trim(),
              });
            }
          }
        }
        if (floatingBadges.length > 0) {
          issues.push({ type: 'floating_badges', badges: floatingBadges });
        }

        // 4. Check iframe tags
        const iframes = Array.from(document.querySelectorAll('iframe'));
        const lovableIframes = iframes.filter((f) => (f.src || '').toLowerCase().includes('lovable'));
        if (lovableIframes.length > 0) {
          issues.push({
            type: 'iframes',
            sources: lovableIframes.map((f) => f.src),
          });
        }

        // 5. Check window globals
        const windowGlobals = {
          hasLovableEvents: typeof window.__lovableEvents !== 'undefined',
          hasLovableReportRuntimeError: typeof window.__lovableReportRuntimeError !== 'undefined',
        };

        return {
          issues,
          windowGlobals,
          title: document.title,
        };
      });

      results.push({
        route,
        title: pageAudit.title,
        issuesCount: pageAudit.issues.length,
        issues: pageAudit.issues,
        windowGlobals: pageAudit.windowGlobals,
      });
    }

    await browser.close();
    console.log('--- AUDIT RESULTS JSON ---');
    console.log(JSON.stringify(results, null, 2));
  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
