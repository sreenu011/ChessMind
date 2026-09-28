import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", (msg) => console.log(`[Browser Console ${msg.type()}]:`, msg.text()));

  await page.goto("http://127.0.0.1:3000/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const evalRes = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return {
      hasWindow: typeof window !== "undefined",
      innerWidth: window.innerWidth,
      webglContext: !!gl,
      canvasElementsCount: document.querySelectorAll("canvas").length,
    };
  });

  console.log("Evaluation result:", evalRes);
  await browser.close();
}

main();
