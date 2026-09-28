const { Chess } = require("chess.js");

const testCases = [
  // Skill 1
  { name: "l3-cap-1-rook", fen: "6k1/3p4/8/8/3R4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "d7" }, expectedSan: "Rxd7" },
  { name: "l3-cap-2-bishop", fen: "7k/5p2/8/8/2B5/8/8/K7 w - - 0 1", move: { from: "c4", to: "f7" }, expectedSan: "Bxf7" },
  { name: "l3-cap-3-queen", fen: "6k1/3r4/8/8/3Q4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "d7" }, expectedSan: "Qxd7" },
  { name: "l3-cap-4-knight", fen: "6k1/8/8/5b2/3N4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "f5" }, expectedSan: "Nxf5" },

  // Skill 2
  { name: "l3-rook-1-vert", fen: "6k1/3p4/8/8/3R4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "d7" }, expectedSan: "Rxd7" },
  { name: "l3-rook-2-horiz", fen: "k7/8/8/8/3R3n/8/8/6K1 w - - 0 1", move: { from: "d4", to: "h4" }, expectedSan: "Rxh4" },
  { name: "l3-rook-3-blocked", fen: "k7/3p4/3P4/8/3R3n/8/8/6K1 w - - 0 1", move: { from: "d4", to: "h4" }, expectedSan: "Rxh4" },

  // Skill 3
  { name: "l3-bishop-1-f7", fen: "7k/5p2/8/8/2B5/8/8/K7 w - - 0 1", move: { from: "c4", to: "f7" }, expectedSan: "Bxf7" },
  { name: "l3-bishop-2-h8", fen: "4k2r/8/8/8/8/8/8/B3K3 w - - 0 1", move: { from: "a1", to: "h8" }, expectedSan: "Bxh8" },
  { name: "l3-bishop-3-dark", fen: "4k3/8/8/6n1/8/8/8/2B1K3 w - - 0 1", move: { from: "c1", to: "g5" }, expectedSan: "Bxg5" },

  // Skill 4
  { name: "l3-queen-1-d7", fen: "6k1/3r4/8/8/3Q4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "d7" }, expectedSan: "Qxd7" },
  { name: "l3-queen-2-h8", fen: "k6b/8/8/8/3Q4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "h8" }, expectedSan: "Qxh8" },
  { name: "l3-queen-3-a4", fen: "6k1/8/8/8/n2Q4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "a4" }, expectedSan: "Qxa4" },

  // Skill 5
  { name: "l3-knight-1-f5", fen: "6k1/8/8/5b2/3N4/8/8/6K1 w - - 0 1", move: { from: "d4", to: "f5" }, expectedSan: "Nxf5" },
  { name: "l3-knight-2-jump", fen: "6k1/8/8/3P1r2/2PNP3/3P4/8/6K1 w - - 0 1", move: { from: "d4", to: "f5" }, expectedSan: "Nxf5" },

  // Skill 6
  { name: "l3-pawn-1-exd5", fen: "6k1/8/8/3p4/4P3/8/8/6K1 w - - 0 1", move: { from: "e4", to: "d5" }, expectedSan: "exd5" },
  { name: "l3-pawn-2-exf5", fen: "6k1/8/8/5p2/4P3/8/8/6K1 w - - 0 1", move: { from: "e4", to: "f5" }, expectedSan: "exf5" },
  { name: "l3-pawn-3-blocked", fen: "6k1/8/8/3pp3/4P3/8/8/6K1 w - - 0 1", move: { from: "e4", to: "d5" }, expectedSan: "exd5" },

  // Skill 7
  { name: "l3-king-1-safe", fen: "6k1/8/8/4p3/4K3/8/8/8 w - - 0 1", move: { from: "e4", to: "e5" }, expectedSan: "Kxe5" },
  { name: "l3-king-2-protected", fen: "4r1k1/8/8/4p3/4K3/8/8/8 w - - 0 1", move: { from: "e4", to: "d4" }, expectedSan: "Kd4" },

  // Skill 8
  { name: "l3-free-1-rook", fen: "k7/8/8/7r/8/8/8/3Q2K1 w - - 0 1", move: { from: "d1", to: "h5" }, expectedSan: "Qxh5" },
  { name: "l3-free-2-knight", fen: "4k3/8/7n/8/8/8/8/2B1K3 w - - 0 1", move: { from: "c1", to: "h6" }, expectedSan: "Bxh6" },

  // Skill 9
  { name: "l3-prot-1-bishop", fen: "6k1/8/2p5/3b4/8/8/3N4/3Q1K2 w - - 0 1", move: { from: "d2", to: "f3" }, expectedSan: "Nf3" },
  { name: "l3-prot-2-rook", fen: "4rk2/8/8/8/8/8/8/4R1K1 w - - 0 1", move: { from: "e1", to: "e3" }, expectedSan: "Re3" },

  // Skill 10
  { name: "l3-ch-1-rook", fen: "3r1k2/8/8/8/8/8/8/3R2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Rxd8+" },
  { name: "l3-ch-2-bishop", fen: "4k3/5p2/8/8/2B5/8/8/4K3 w - - 0 1", move: { from: "c4", to: "f7" }, expectedSan: "Bxf7+" },
  { name: "l3-ch-3-knight", fen: "6k1/8/8/4p3/8/5N2/8/6K1 w - - 0 1", move: { from: "f3", to: "e5" }, expectedSan: "Nxe5" },
  { name: "l3-ch-4-queen", fen: "3q1k2/8/8/8/8/8/8/3Q2K1 w - - 0 1", move: { from: "d1", to: "d8" }, expectedSan: "Qxd8+" },
  { name: "l3-ch-5-pawn", fen: "6k1/8/8/3p4/4P3/8/8/6K1 w - - 0 1", move: { from: "e4", to: "d5" }, expectedSan: "exd5" },
  { name: "l3-ch-6-king", fen: "k7/8/8/8/5p2/4K3/8/8 w - - 0 1", move: { from: "e3", to: "f4" }, expectedSan: "Kxf4" },
  { name: "l3-ch-7-knight-jump", fen: "6k1/8/8/3P1r2/2PNP3/3P4/8/6K1 w - - 0 1", move: { from: "d4", to: "f5" }, expectedSan: "Nxf5" },
  { name: "l3-ch-8-bishop-long", fen: "4k2r/8/8/8/8/8/8/B3K3 w - - 0 1", move: { from: "a1", to: "h8" }, expectedSan: "Bxh8" },
  { name: "l3-ch-9-free-knight", fen: "k7/8/8/8/3Q3n/8/8/6K1 w - - 0 1", move: { from: "d4", to: "h4" }, expectedSan: "Qxh4" },
  { name: "l3-ch-10-free-queen", fen: "4qk2/8/8/8/8/8/8/4R1K1 w - - 0 1", move: { from: "e1", to: "e8" }, expectedSan: "Rxe8+" },
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

console.log(`\nResults: ${testCases.length - failed} / ${testCases.length} passed.`);
