import { Chess } from "chess.js";
import { LEVEL_6 } from "../src/lib/learn/level6-content.js";

let passed = true;
let totalExercises = 0;
let fenCount = 0;
let moveValidationCount = 0;

console.log("=== LEVEL 6 FEN AND SAN VALIDATION ===");

for (const skill of LEVEL_6.skills) {
  console.log(`\nSkill: ${skill.title} (${skill.id}) - ${skill.exercises.length} exercises`);
  for (const ex of skill.exercises) {
    totalExercises++;
    const fen = ex.position.fen;
    if (!fen) {
      console.error(`❌ [FAIL] Exercise "${ex.id}" missing FEN.`);
      passed = false;
      continue;
    }

    // Check King presence
    if (!fen.includes("K") || !fen.includes("k")) {
      console.error(`❌ [FAIL] Exercise "${ex.id}" FEN missing King: ${fen}`);
      passed = false;
    }

    // Validate FEN with chess.js
    let chess;
    try {
      chess = new Chess(fen);
      fenCount++;
    } catch (err) {
      console.error(`❌ [FAIL] Exercise "${ex.id}" invalid FEN: ${fen}`, err);
      passed = false;
      continue;
    }

    // Validate expectedMoves
    if (ex.expectedMoves && ex.expectedMoves.length > 0) {
      const tempChess = new Chess(fen);
      for (const san of ex.expectedMoves) {
        try {
          const move = tempChess.move(san);
          if (!move) {
            console.error(`❌ [FAIL] Exercise "${ex.id}" illegal SAN move "${san}" in FEN "${tempChess.fen()}"`);
            passed = false;
            break;
          }
          moveValidationCount++;
        } catch (e) {
          console.error(`❌ [FAIL] Exercise "${ex.id}" invalid SAN "${san}": ${e.message}`);
          passed = false;
          break;
        }
      }
    }

    // Validate targetSquare if find-square
    if (ex.type === "find-square" || ex.type === "identify-square") {
      if (!ex.targetSquare && (!ex.targetSquares || ex.targetSquares.length === 0)) {
        console.error(`❌ [FAIL] Square click exercise "${ex.id}" missing targetSquare(s).`);
        passed = false;
      }
    }

    // Validate choice options SANs
    if (ex.options) {
      for (const opt of ex.options) {
        if (opt.moveSan) {
          try {
            const tempChess = new Chess(fen);
            const move = tempChess.move(opt.moveSan);
            if (!move) {
              console.error(`❌ [FAIL] Exercise "${ex.id}" option "${opt.id}" illegal SAN "${opt.moveSan}"`);
              passed = false;
            } else {
              moveValidationCount++;
            }
          } catch (e) {
            console.error(`❌ [FAIL] Exercise "${ex.id}" option "${opt.id}" SAN error: ${e.message}`);
            passed = false;
          }
        }
      }
    }
  }
}

console.log("\n==========================================");
console.log(`Total Exercises Tested: ${totalExercises}`);
console.log(`Total FENs Validated: ${fenCount}`);
console.log(`Total SAN Moves Validated: ${moveValidationCount}`);
if (passed) {
  console.log("RESULT: ALL LEVEL 6 FENS AND SANS PASSED CLEANLY!");
} else {
  console.log("RESULT: SOME VALIDATIONS FAILED!");
  process.exit(1);
}
