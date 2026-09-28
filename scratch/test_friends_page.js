import { chromium } from "playwright";

async function main() {
  console.log("Testing /play/friends lobby and UI...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on("console", (msg) => console.log("PAGE:", msg.type(), msg.text()));
    page.on("pageerror", (err) => console.error("PAGE ERROR:", err));

    await page.goto("http://localhost:8080/play/friends", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    await page.screenshot({ path: "scratch/play_friends_lobby.png" });
    console.log("Captured scratch/play_friends_lobby.png");

  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

main();
