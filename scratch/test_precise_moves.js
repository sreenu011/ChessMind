import { chromium } from "playwright";

async function run() {
  console.log("Launching Edge for precise 3D moves testing...");
  const browser = await chromium.launch({ channel: "msedge", headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto("http://localhost:8080/play/computer", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(1500);

    // 1. Click START GAME
    const startBtn = await page.$("button:has-text('START GAME')");
    if (startBtn) {
      console.log("Clicking START GAME...");
      await startBtn.click();
      await page.waitForTimeout(1000);
    }

    // Helper function in page to get exact screen pixel for any chess square
    const getSquarePixel = async (sq) => {
      return await page.evaluate((square) => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();

        // Calculate 3D pos
        const file = square.charCodeAt(0) - 97; // a=0..7
        const rank = parseInt(square[1], 10) - 1; // 1=0..7
        const col = file;
        const row = 7 - rank;
        const x3d = col - 3.5;
        const z3d = row - 3.5;
        const y3d = 0.08;

        // Use R3F camera if accessible or compute via projection
        // @react-three/fiber attaches __r3f
        const r3f = canvas.__r3f;
        if (r3f && r3f.root) {
          const state = r3f.root.getState();
          const cam = state.camera;
          const THREE = window.THREE || state.raycaster?.constructor?.prototype ? cam.constructor : null;
          // clone and project
          const v = cam.position.clone ? cam.position.clone() : { x: 0, y: 0, z: 0 };
          // vector
          const vec = new cam.position.constructor(x3d, y3d, z3d);
          vec.project(cam);
          const screenX = rect.left + ((vec.x + 1) / 2) * rect.width;
          const screenY = rect.top + ((1 - vec.y) / 2) * rect.height;
          return { x: screenX, y: screenY };
        }

        // Fallback estimate
        const screenX = rect.left + rect.width * (0.16 + (col / 7) * 0.68);
        const screenY = rect.top + rect.height * (0.30 + (row / 7) * 0.58);
        return { x: screenX, y: screenY };
      }, sq);
    };

    // 2. Select e2
    const e2 = await getSquarePixel("e2");
    console.log("Square e2 pixel:", e2);
    await page.mouse.click(e2.x, e2.y);
    await page.waitForTimeout(800);
    await page.screenshot({ path: "scratch/test_move_selected_e2.png" });
    console.log("Saved scratch/test_move_selected_e2.png");

    // 3. Move to e4
    const e4 = await getSquarePixel("e4");
    console.log("Square e4 pixel:", e4);
    await page.mouse.click(e4.x, e4.y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: "scratch/test_move_played_e4.png" });
    console.log("Saved scratch/test_move_played_e4.png");

    // 4. Wait for engine response
    await page.waitForTimeout(3000);
    await page.screenshot({ path: "scratch/test_move_engine_turn.png" });
    console.log("Saved scratch/test_move_engine_turn.png");

    // 5. Select g1 knight and move to f3
    const g1 = await getSquarePixel("g1");
    console.log("Square g1 pixel:", g1);
    await page.mouse.click(g1.x, g1.y);
    await page.waitForTimeout(800);
    await page.screenshot({ path: "scratch/test_move_selected_g1.png" });
    console.log("Saved scratch/test_move_selected_g1.png");

    const f3 = await getSquarePixel("f3");
    console.log("Square f3 pixel:", f3);
    await page.mouse.click(f3.x, f3.y);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: "scratch/test_move_played_f3.png" });
    console.log("Saved scratch/test_move_played_f3.png");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
}

run();
