const { Chess } = require("chess.js");
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function loadTsModule(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const exports = {};
  const module = { exports };
  const fn = new Function("exports", "module", "require", result.outputText);
  fn(exports, module, require);
  return module.exports;
}

try {
  const level1 = loadTsModule(path.join(__dirname, "../src/lib/learn/level1-content.ts"));
  const level2 = loadTsModule(path.join(__dirname, "../src/lib/learn/level2-content.ts"));
  const level3 = loadTsModule(path.join(__dirname, "../src/lib/learn/level3-content.ts"));
  const level4 = loadTsModule(path.join(__dirname, "../src/lib/learn/level4-content.ts"));
  const level5 = loadTsModule(path.join(__dirname, "../src/lib/learn/level5-content.ts"));

  const levels = [
    { num: 1, data: level1.LEVEL_1 },
    { num: 2, data: level2.LEVEL_2 },
    { num: 3, data: level3.LEVEL_3 },
    { num: 4, data: level4.LEVEL_4 },
    { num: 5, data: level5.LEVEL_5 },
  ];

  console.log("=== CURRICULUM AUDIT REPORT ===");
  const allSkillIds = new Set();
  const allExerciseIds = new Set();
  let totalExercises = 0;
  let invalidFENs = 0;

  for (const levelObj of levels) {
    const lvl = levelObj.data;
    console.log(`\nLEVEL ${lvl.levelNumber}: ${lvl.title} (${lvl.skills.length} skills)`);
    
    lvl.skills.forEach((skill, sIdx) => {
      console.log(`  Skill ${sIdx + 1}:`);
      console.log(`    ID: ${skill.id}`);
      console.log(`    Title: ${skill.title}`);
      console.log(`    Exercises: ${skill.exercises ? skill.exercises.length : 0}`);
      console.log(`    Route: /learn/level${lvl.levelNumber}/${skill.id}`);

      if (!skill.id) console.error(`    [ERROR] Missing skill.id at Level ${lvl.levelNumber} skill ${sIdx}`);
      if (allSkillIds.has(skill.id)) console.error(`    [ERROR] Duplicate skill.id: ${skill.id}`);
      allSkillIds.add(skill.id);

      if (!skill.exercises || skill.exercises.length === 0) {
        console.error(`    [ERROR] Skill ${skill.id} has empty exercises array!`);
      } else {
        skill.exercises.forEach((ex, eIdx) => {
          totalExercises++;
          if (!ex.id) console.error(`      [ERROR] Exercise at index ${eIdx} missing id`);
          if (allExerciseIds.has(ex.id)) console.error(`      [ERROR] Duplicate exercise.id: ${ex.id}`);
          allExerciseIds.add(ex.id);

          // Test FEN with chess.js
          if (ex.position && ex.position.fen) {
            try {
              new Chess(ex.position.fen);
            } catch (err) {
              invalidFENs++;
              console.error(`      [ERROR] Exercise ${ex.id} (${ex.title}) INVALID FEN "${ex.position.fen}": ${err.message}`);
            }
          } else {
            console.error(`      [ERROR] Exercise ${ex.id} missing position.fen`);
          }
        });
      }
    });
  }

  console.log("\n==========================================");
  console.log(`Total Skills Checked: ${allSkillIds.size}`);
  console.log(`Total Exercises Checked: ${totalExercises}`);
  console.log(`Invalid FENs Found: ${invalidFENs}`);
  console.log("==========================================");

} catch (e) {
  console.error("Audit script failed:", e);
}
