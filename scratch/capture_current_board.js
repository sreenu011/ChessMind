import { chromium } from '@playwright/test';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://127.0.0.1:8080/play/computer', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'scratch/current_play_computer_1440.png' });
  console.log('Saved scratch/current_play_computer_1440.png');

  await browser.close();
}
capture().catch(console.error);
