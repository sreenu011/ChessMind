const { Chess } = require("chess.js");

const testCases = [
  // Skill 1: What is Check?
  { name: "l4-s1-ex1-detect", fen: "4r1k1/8/8/8/8/8/8/4K3 w - - 0 1", move: { from: "e1", to: "f1" }, expectedSan: "Kf1" },
  { name: "l4-s1-ex2-qcheck", fen: "4k3/8/8/8/8/8/8/3Q2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Qd8+" },
  { name: "l4-s1-ex3-rcheck", fen: "4k3/8/8/8/8/8/8/3R2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Rd8+" },

  // Skill 2: Give Check
  { name: "l4-s2-ex1-queen", fen: "4k3/8/8/8/3Q4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "e5" }, expectedSan: "Qe5+" },
  { name: "l4-s2-ex2-rook", fen: "4k3/8/8/8/3R4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "e4" }, expectedSan: "Re4+" },
  { name: "l4-s2-ex3-bishop", fen: "5k2/8/8/2B5/8/8/8/6K1 w - - 0 1", move: { from: "c5", to: "e7" }, expectedSan: "Be7+" },
  { name: "l4-s2-ex4-knight", fen: "4k3/8/8/3N4/8/8/8/6K1 w - - 0 1", move: { from: "d5", to: "f6" }, expectedSan: "Nf6+" },

  // Skill 3: How to Escape Check
  { name: "l4-s3-ex1-intro", fen: "4r3/7k/8/8/8/8/8/4K3 w - - 0 1", move: { from: "e1", to: "f1" }, expectedSan: "Kf1" },
  { name: "l4-s3-ex2-choice", fen: "4q3/7k/8/8/8/8/8/4K3 w - - 0 1", move: { from: "e1", to: "d1" }, expectedSan: "Kd1" },

  // Skill 4: Move the King Out of Check
  { name: "l4-s4-ex1-safe-square", fen: "4r1k1/8/8/8/4K3/8/8/8 w - - 0 1", move: { from: "e4", to: "d4" }, expectedSan: "Kd4" },
  { name: "l4-s4-ex2-attacked-square", fen: "4r1k1/8/8/3p4/4K3/8/8/8 w - - 0 1", move: { from: "e4", to: "f3" }, expectedSan: "Kf3" },

  // Skill 5: Capture the Checking Piece
  { name: "l4-s5-ex1-safe-capture", fen: "7k/8/8/4r3/4K3/8/8/8 w - - 0 1", move: { from: "e4", to: "e5" }, expectedSan: "Kxe5" },
  { name: "l4-s5-ex2-protected-checking-piece", fen: "4r2k/8/8/4r3/4K3/8/8/8 w - - 0 1", move: { from: "e4", to: "d3" }, expectedSan: "Kd3" },

  // Skill 6: Block the Check
  { name: "l4-s6-ex1-block-rook", fen: "4r3/7k/8/8/8/8/R7/4K3 w - - 0 1", move: { from: "a2", to: "e2" }, expectedSan: "Re2" },
  { name: "l4-s6-ex2-block-bishop", fen: "7k/8/8/8/7b/8/6P1/4K3 w - - 0 1", move: { from: "g2", to: "g3" }, expectedSan: "g3" },
  { name: "l4-s6-ex3-knight-cannot-be-blocked", fen: "7k/8/8/8/8/5n2/8/4K3 w - - 0 1", move: { from: "e1", to: "d1" }, expectedSan: "Kd1" },

  // Skill 7: Double Check
  { name: "l4-s7-ex1-double-check", fen: "4r2k/8/8/8/7b/8/8/4K3 w - - 0 1", move: { from: "e1", to: "f1" }, expectedSan: "Kf1" },

  // Skill 8: What is Checkmate?
  { name: "l4-s8-ex1-qe7", fen: "4k3/8/4K3/8/7Q/8/8/8 w - - 0 1", move: { from: "h4", to: "e7" }, expectedSan: "Qe7#" },
  { name: "l4-s8-ex2-backrank", fen: "6k1/5ppp/8/8/8/8/8/3Q2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Qd8#" },

  // Skill 9: Check or Checkmate?
  { name: "l4-s9-ex1-check-only", fen: "4k3/8/8/8/8/8/8/3R2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Rd8+" },
  { name: "l4-s9-ex2-checkmate", fen: "3r2k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Rxd8#" },

  // Skill 10: Checkmate Challenge
  { name: "l4-ch-1", fen: "6k1/5ppp/8/8/8/8/8/3Q2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Qd8#" },
  { name: "l4-ch-2", fen: "3r2k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Rxd8#" },
  { name: "l4-ch-3", fen: "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1", move: { from: "h5", to: "f7" }, expectedSan: "Qxf7#" },
  { name: "l4-ch-4", fen: "k7/8/1K6/8/8/8/8/Q7 w - - 0 1", move: { from: "a1", to: "a7" }, expectedSan: "Qa7#" },
  { name: "l4-ch-5", fen: "4k3/8/4K3/8/7Q/8/8/8 w - - 0 1", move: { from: "h4", to: "e7" }, expectedSan: "Qe7#" },
  { name: "l4-ch-6", fen: "5k2/8/8/8/8/8/8/2B1K3 w - - 0 1", move: { from: "c1", to: "h6" }, expectedSan: "Bh6+" },
  { name: "l4-ch-7", fen: "4r3/7k/8/8/8/8/8/4K3 w - - 0 1", move: { from: "e1", to: "f1" }, expectedSan: "Kf1" },
  { name: "l4-ch-8", fen: "4r3/7k/8/8/8/8/R7/4K3 w - - 0 1", move: { from: "a2", to: "e2" }, expectedSan: "Re2" },
  { name: "l4-ch-9", fen: "7k/8/8/8/8/8/4r3/4K3 w - - 0 1", move: { from: "e1", to: "e2" }, expectedSan: "Kxe2" },
  { name: "l4-ch-10", fen: "3r1k2/8/8/8/8/8/8/3R2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Rxd8+" },
];

let failed = 0;
for (const tc of testCases) {
  try {
    const game = new Chess(tc.fen);
    const played = game.move({ from: tc.move.from, to: tc.move.to, promotion: "q" });
    if (!played) {
      console.error(`[FAIL] ${tc.name}: Move ${tc.move.from}-${tc.move.to} returned null`);
      failed++;
    } else if (played.san !== tc.expectedSan) {
      console.error(`[FAIL] ${tc.name}: Generated SAN '${played.san}', expected '${tc.expectedSan}'`);
      failed++;
    } else {
      console.log(`[PASS] ${tc.name}: ${played.san}`);
    }
  } catch (err) {
    console.error(`[FAIL] ${tc.name}: Throws error: ${err.message}`);
    failed++;
  }
}

console.log(`\nPhase 5 Level 4 Test Results: ${testCases.length - failed} / ${testCases.length} passed.`);
