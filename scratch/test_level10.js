import { Chess } from "chess.js";
import { LEVEL_10 } from "../src/lib/learn/level10-content.ts";

console.log("=== LEVEL 10 FEN, SAN AND MULTI-MOVE VARIATION VALIDATION ===\n");

let totalExercises = 0;
let totalFensValidated = 0;
let totalSansValidated = 0;
let errors = [];

for (const skill of LEVEL_10.skills) {
  console.log(`Skill: ${skill.title} (${skill.id}) - ${skill.exercises.length} exercises`);
  
  for (const ex of skill.exercises) {
    totalExercises++;
    const fen = ex.position?.fen;

    if (!fen) {
      errors.push(`Exercise ${ex.id}: Missing FEN position`);
      continue;
    }

    let chess;
    try {
      chess = new Chess(fen);
      totalFensValidated++;
    } catch (err) {
      errors.push(`Exercise ${ex.id}: Invalid FEN "${fen}" - ${err.message}`);
      continue;
    }

    // Verify both kings are present
    const boardStr = chess.fen().split(" ")[0];
    if (!boardStr.includes("K") || !boardStr.includes("k")) {
      errors.push(`Exercise ${ex.id}: FEN missing one or both kings - "${fen}"`);
    }

    if (!ex.expectedMoves || ex.expectedMoves.length === 0) {
      errors.push(`Exercise ${ex.id}: No expectedMoves defined`);
      continue;
    }

    // Test plays on chess instance clone
    let game = new Chess(fen);
    for (let i = 0; i < ex.expectedMoves.length; i++) {
      const moveSan = ex.expectedMoves[i];
      try {
        const result = game.move(moveSan);
        if (!result) {
          errors.push(`Exercise ${ex.id}: Move #${i + 1} "${moveSan}" is illegal in position "${game.fen()}"`);
          break;
        }
        totalSansValidated++;
      } catch (err) {
        errors.push(`Exercise ${ex.id}: Move #${i + 1} "${moveSan}" threw error in position "${game.fen()}" - ${err.message}`);
        break;
      }
    }
  }
  console.log("");
}

console.log("==========================================");
console.log(`Total Exercises Tested: ${totalExercises}`);
console.log(`Total FENs Validated: ${totalFensValidated}`);
console.log(`Total SAN Moves Validated: ${totalSansValidated}`);

if (errors.length > 0) {
  console.error(`\nFAILED WITH ${errors.length} ERRORS:`);
  errors.forEach((err, idx) => console.error(`${idx + 1}. ${err}`));
  process.exit(1);
} else {
  console.log("RESULT: ALL LEVEL 10 FENS, SANS AND MULTI-MOVE SEQUENCES PASSED CLEANLY!\n");
  process.exit(0);
}
