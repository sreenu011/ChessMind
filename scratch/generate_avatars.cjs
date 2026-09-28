const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const avatars = [
  {
    filename: "avatar-01.png",
    name: "Knight",
    bg1: "#10b981",
    bg2: "#047857",
    icon: `<path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/>`
  },
  {
    filename: "avatar-02.png",
    name: "Rook",
    bg1: "#3b82f6",
    bg2: "#1d4ed8",
    icon: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`
  },
  {
    filename: "avatar-03.png",
    name: "Queen",
    bg1: "#a855f7",
    bg2: "#6b21a8",
    icon: `<path d="M11.562 3.256a2 2 0 0 1 2.876 0l1.503 1.503a2 2 0 0 0 1.414.586h2.126a2 2 0 0 1 2 2v2.126a2 2 0 0 0 .586 1.414l1.503 1.503a2 2 0 0 1 0 2.876l-1.503 1.503a2 2 0 0 0-.586 1.414v2.126a2 2 0 0 1-2 2h-2.126a2 2 0 0 0-1.414.586l-1.503 1.503a2 2 0 0 1-2.876 0l-1.503-1.503a2 2 0 0 0-1.414-.586H6.626a2 2 0 0 1-2-2v-2.126a2 2 0 0 0-.586-1.414L2.537 13.56a2 2 0 0 1 0-2.876l1.503-1.503a2 2 0 0 0 .586-1.414V5.641a2 2 0 0 1 2-2h2.126a2 2 0 0 0 1.414-.586l1.503-1.503z"/>`
  },
  {
    filename: "avatar-04.png",
    name: "King",
    bg1: "#f59e0b",
    bg2: "#b45309",
    icon: `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>`
  },
  {
    filename: "avatar-05.png",
    name: "Bishop",
    bg1: "#06b6d4",
    bg2: "#0e7490",
    icon: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`
  },
  {
    filename: "avatar-06.png",
    name: "Pawn",
    bg1: "#f43f5e",
    bg2: "#be123c",
    icon: `<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>`
  },
  {
    filename: "avatar-07.png",
    name: "Grandmaster",
    bg1: "#8b5cf6",
    bg2: "#4c1d95",
    icon: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`
  },
  {
    filename: "avatar-08.png",
    name: "Engine",
    bg1: "#64748b",
    bg2: "#334155",
    icon: `<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="8.5" cy="16" r="1.5"/><circle cx="15.5" cy="16" r="1.5"/><path d="M12 2v4M8 4v2M16 4v2"/>`
  }
];

async function generate() {
  const outDir = path.resolve("public/avatars");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 256, height: 256 });

  for (const item of avatars) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 256px;
      height: 256px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, ${item.bg1}, ${item.bg2});
      border-radius: 50%;
      overflow: hidden;
    }
    svg {
      width: 140px;
      height: 140px;
      stroke: #ffffff;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
    }
  </style>
</head>
<body>
  <svg viewBox="0 0 24 24">
    ${item.icon}
  </svg>
</body>
</html>`;

    await page.setContent(html);
    const filePath = path.join(outDir, item.filename);
    await page.screenshot({ path: filePath, omitBackground: true });
    console.log(`Generated ${filePath}`);
  }

  await browser.close();
  console.log("All avatar PNG images generated successfully.");
}

generate().catch((err) => {
  console.error("Error generating avatars:", err);
  process.exit(1);
});
