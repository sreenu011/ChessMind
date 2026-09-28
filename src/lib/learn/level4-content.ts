import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: What is Check?
export const SKILL_WHAT_IS_CHECK: LearningSkill = {
  id: "level-4-what-is-check",
  title: "1. What is Check?",
  description: "Check means your King is directly under attack by an enemy piece.",
  icon: "⚠️",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: [],
  exercises: [
    {
      id: "l4-s1-ex1-detect",
      type: "make-move",
      title: "Recognise Check on Your King",
      explanation: [
        "Check occurs when an enemy piece directly attacks your King.",
        "Black's Rook on e8 is attacking your King on e1!",
        "Step your King safely to f1 to escape check."
      ],
      position: { fen: "4r1k1/8/8/8/8/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e8", "e1"] },
      expectedMoves: ["Kf1"],
      hints: ["The Rook on e8 is attacking e1.", "Move the King to f1."],
      feedback: { correct: "Correct! Escaping check keeps your King safe.", incorrect: "Move your King to f1." }
    },
    {
      id: "l4-s1-ex2-qcheck",
      type: "make-move",
      title: "Queen Delivers Check",
      explanation: ["Slide your Queen on d1 up to d8 to attack Black's King on e8!"],
      position: { fen: "4k3/8/8/8/8/8/8/3Q2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Qd8+"],
      hints: ["Move Queen from d1 to d8."],
      feedback: { correct: "Check! Your move attacks the enemy King.", incorrect: "Move Queen to d8." }
    },
    {
      id: "l4-s1-ex3-rcheck",
      type: "make-move",
      title: "Rook Delivers Check",
      explanation: ["Slide your Rook on d1 up to d8 to attack Black's King on e8!"],
      position: { fen: "4k3/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rd8+"],
      hints: ["Move Rook from d1 to d8."],
      feedback: { correct: "Check! Your move attacks the enemy King.", incorrect: "Move Rook to d8." }
    }
  ]
};

// SKILL 2: Give Check
export const SKILL_GIVE_CHECK: LearningSkill = {
  id: "level-4-give-check",
  title: "2. Give Check",
  description: "Practice giving check with Queen, Rook, Bishop, and Knight.",
  icon: "🎯",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-what-is-check"],
  exercises: [
    {
      id: "l4-s2-ex1-queen",
      type: "make-move",
      title: "Queen Gives Check",
      explanation: ["Move your Queen on d4 to e5 to deliver check to Black's King!"],
      position: { fen: "4k3/8/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "e5" },
      expectedMoves: ["Qe5+"],
      hints: ["Qe5+ attacks the e8 King diagonally."],
      feedback: { correct: "Check! Your move attacks the enemy King.", incorrect: "Move Queen to e5." }
    },
    {
      id: "l4-s2-ex2-rook",
      type: "make-move",
      title: "Rook Gives Check",
      explanation: ["Move your Rook on d4 to e4 to deliver check to Black's King!"],
      position: { fen: "4k3/8/8/8/3R4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "e4" },
      expectedMoves: ["Re4+"],
      hints: ["Re4+ attacks along the 4th rank and e-file."],
      feedback: { correct: "Check! Your move attacks the enemy King.", incorrect: "Move Rook to e4." }
    },
    {
      id: "l4-s2-ex3-bishop",
      type: "make-move",
      title: "Bishop Gives Check",
      explanation: ["Move your Bishop on c5 to e7 to deliver check to Black's King on f8!"],
      position: { fen: "5k2/8/8/2B5/8/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "e7" },
      expectedMoves: ["Be7+"],
      hints: ["Be7+ attacks the f8 King diagonally."],
      feedback: { correct: "Check! Your move attacks the enemy King.", incorrect: "Move Bishop to e7." }
    },
    {
      id: "l4-s2-ex4-knight",
      type: "make-move",
      title: "Knight Gives Check",
      explanation: ["Leap your Knight on d5 to f6 to deliver check to Black's King on e8!"],
      position: { fen: "4k3/8/8/3N4/8/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "f6" },
      expectedMoves: ["Nf6+"],
      hints: ["Nf6+ leaps in an L-shape to attack e8."],
      feedback: { correct: "Check! Your move attacks the enemy King.", incorrect: "Leap Knight to f6." }
    }
  ]
};

// SKILL 3: How to Escape Check
export const SKILL_ESCAPE_CHECK: LearningSkill = {
  id: "level-4-escape-check",
  title: "3. How to Escape Check",
  description: "Learn the three basic responses to check: 1. Move the King, 2. Capture the checking piece, 3. Block the attack.",
  icon: "🛡️",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-give-check"],
  exercises: [
    {
      id: "l4-s3-ex1-intro",
      type: "make-move",
      title: "Escape Option 1: Move the King",
      explanation: [
        "When your King is in check, you MUST get out of check immediately.",
        "Option 1: Move the King to a safe square.",
        "Black's Rook on e8 is checking your King on e1. Step to f1!"
      ],
      position: { fen: "4r3/7k/8/8/8/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e8", "e1"] },
      expectedMoves: ["Kf1"],
      hints: ["Step the King safely to f1."],
      feedback: { correct: "Correct! Your King moved out of check.", incorrect: "Your King is still in check! Move to f1." }
    },
    {
      id: "l4-s3-ex2-choice",
      type: "make-move",
      title: "Escape Option 1: Step to d1",
      explanation: ["Black's Queen on e8 is checking your King on e1. Step safely to d1!"],
      position: { fen: "4q3/7k/8/8/8/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e8", "e1"] },
      expectedMoves: ["Kd1"],
      hints: ["Step left to d1."],
      feedback: { correct: "Correct! Your King is safe on d1.", incorrect: "Your King is still in check! Step to d1." }
    }
  ]
};

// SKILL 4: Move the King Out of Check
export const SKILL_ESCAPE_MOVE: LearningSkill = {
  id: "level-4-escape-move",
  title: "4. Move the King Out of Check",
  description: "The King cannot move onto a square controlled by an enemy piece.",
  icon: "👑",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-escape-check"],
  exercises: [
    {
      id: "l4-s4-ex1-safe-square",
      type: "make-move",
      title: "Find a Safe Escape Square",
      explanation: [
        "Your King on e4 is in check from Black's Rook on e8.",
        "You cannot stay on the e-file!",
        "Step your King safely to d4."
      ],
      position: { fen: "4r1k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e8", "e4"] },
      expectedMoves: ["Kd4"],
      hints: ["The e-file is controlled by Black's Rook.", "Step to d4."],
      feedback: { correct: "Correct! d4 is safe from the Rook's line of fire.", incorrect: "The King cannot move onto an attacked square!" }
    },
    {
      id: "l4-s4-ex2-attacked-square",
      type: "make-move",
      title: "Avoid Attacked Squares",
      explanation: [
        "Your King on e4 is in check from Black's Rook on e8.",
        "Black's pawn on d5 controls the d4 square!",
        "Do NOT step onto d4! Move your King safely to f3 instead."
      ],
      position: { fen: "4r1k1/8/8/3p4/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["d5", "d4"] },
      expectedMoves: ["Kf3"],
      hints: ["d4 is controlled by the d5 pawn!", "Move your King to f3."],
      feedback: { correct: "Wise vision! The King cannot move onto an attacked square.", incorrect: "The King cannot move onto d4 because it is controlled by Black's pawn! Step to f3." }
    }
  ]
};

// SKILL 5: Capture the Checking Piece
export const SKILL_ESCAPE_CAPTURE: LearningSkill = {
  id: "level-4-escape-capture",
  title: "5. Capture the Checking Piece",
  description: "Remove the checking threat by capturing the attacker when it is safe to do so.",
  icon: "⚔️",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-escape-move"],
  exercises: [
    {
      id: "l4-s5-ex1-safe-capture",
      type: "capture-piece",
      title: "Capture the Undefended Attacker",
      explanation: ["Black's Rook on e5 is checking your King on e4! The Rook is undefended. Capture it with your King!"],
      position: { fen: "7k/8/8/4r3/4K3/8/8/8 w - - 0 1", orientation: "white", targetSquare: "e5" },
      expectedMoves: ["Kxe5"],
      hints: ["Take e5 with your King."],
      feedback: { correct: "Correct! Capturing the checking piece eliminated check.", incorrect: "Capture the Rook on e5 with your King." }
    },
    {
      id: "l4-s5-ex2-protected-checking-piece",
      type: "make-move",
      title: "Protected Attacker: Cannot Capture!",
      explanation: [
        "Black's Rook on e5 is checking your King on e4.",
        "HOWEVER, e5 is protected by Black's Rook on e8!",
        "Capturing e5 would put your King in check (ILLEGAL).",
        "Step your King safely to d3 instead!"
      ],
      position: { fen: "4r2k/8/8/4r3/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e5", "e8"] },
      expectedMoves: ["Kd3"],
      hints: ["The checking piece is protected.", "Your King cannot capture it. Step to d3!"],
      feedback: { correct: "Great judgment! The checking piece is protected, so your King stepped away to d3.", incorrect: "The checking piece is protected. Your King cannot capture it! Step to d3." }
    }
  ]
};

// SKILL 6: Block the Check
export const SKILL_ESCAPE_BLOCK: LearningSkill = {
  id: "level-4-escape-block",
  title: "6. Block the Check",
  description: "Interpose a piece to block sliding checks. Knight checks CANNOT be blocked.",
  icon: "🧱",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-escape-capture"],
  exercises: [
    {
      id: "l4-s6-ex1-block-rook",
      type: "make-move",
      title: "Block Rook Line-of-Fire",
      explanation: ["Black's Rook on e8 checks your King on e1. Block the check by moving your Rook from a2 to e2!"],
      position: { fen: "4r3/7k/8/8/8/8/R7/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e8", "e1"] },
      expectedMoves: ["Re2"],
      hints: ["Move your Rook from a2 to e2."],
      feedback: { correct: "You blocked the attack! Line-of-fire blocked.", incorrect: "Move your Rook to e2." }
    },
    {
      id: "l4-s6-ex2-block-bishop",
      type: "make-move",
      title: "Block Diagonal Bishop Beam",
      explanation: ["Black's Bishop on h4 checks your King on e1. Push your pawn from g2 to g3 to block!"],
      position: { fen: "7k/8/8/8/7b/8/6P1/4K3 w - - 0 1", orientation: "white", highlightSquares: ["h4", "e1"] },
      expectedMoves: ["g3"],
      hints: ["Push g2 pawn to g3."],
      feedback: { correct: "You blocked the attack! Diagonal path blocked.", incorrect: "Push g2 pawn to g3." }
    },
    {
      id: "l4-s6-ex3-knight-cannot-be-blocked",
      type: "make-move",
      title: "Knight Checks Cannot Be Blocked!",
      explanation: [
        "Black's Knight on f3 checks your King on e1.",
        "Knights leap over pieces, so Knight checks CANNOT be blocked!",
        "Step your King safely to d1!"
      ],
      position: { fen: "7k/8/8/8/8/5n2/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["f3", "e1"] },
      expectedMoves: ["Kd1"],
      hints: ["Knight checks cannot be blocked.", "Step your King to d1."],
      feedback: { correct: "Correct! Knight checks cannot be blocked, so moving the King was mandatory.", incorrect: "Knight checks cannot be blocked! Step your King to d1." }
    }
  ]
};

// SKILL 7: Double Check
export const SKILL_DOUBLE_CHECK: LearningSkill = {
  id: "level-4-double-check",
  title: "7. Double Check",
  description: "When two pieces check the King at the same time, the King MUST move.",
  icon: "⚡",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-escape-block"],
  exercises: [
    {
      id: "l4-s7-ex1-double-check",
      type: "make-move",
      title: "Escape Double Check: King Must Move!",
      explanation: [
        "Your King on e1 is in DOUBLE CHECK from Black's Rook on e8 AND Black's Bishop on h4!",
        "When two pieces check at the same time, blocking or capturing one piece is impossible.",
        "The King MUST move! Step your King to f1."
      ],
      position: { fen: "4r2k/8/8/8/7b/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e8", "h4", "e1"] },
      expectedMoves: ["Kf1"],
      hints: ["In double check, the King MUST move.", "Step to f1."],
      feedback: { correct: "Correct! In double check, moving the King is the only legal response.", incorrect: "When two pieces check at the same time, the King MUST move! Step to f1." }
    }
  ]
};

// SKILL 8: What is Checkmate?
export const SKILL_WHAT_IS_CHECKMATE: LearningSkill = {
  id: "level-4-what-is-checkmate",
  title: "8. What is Checkmate?",
  description: "CHECK + NO LEGAL ESCAPE = CHECKMATE. The game is won!",
  icon: "🏆",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-double-check"],
  exercises: [
    {
      id: "l4-s8-ex1-qe7",
      type: "make-move",
      title: "Checkmate with Queen & King",
      explanation: [
        "Checkmate means the King is in check and has NO legal way to move, block, or capture.",
        "Your King on e6 guards all escape squares.",
        "Move your Queen from h4 to e7 for CHECKMATE!"
      ],
      position: { fen: "4k3/8/4K3/8/7Q/8/8/8 w - - 0 1", orientation: "white", targetSquare: "e7" },
      expectedMoves: ["Qe7#"],
      hints: ["Move Queen to e7."],
      feedback: { correct: "Checkmate! Check + No legal response = Game Won!", incorrect: "Move Queen to e7." }
    },
    {
      id: "l4-s8-ex2-backrank",
      type: "make-move",
      title: "Back-Rank Checkmate",
      explanation: ["Black's King on g8 is trapped behind its own f7, g7, h7 pawns. Slide your Queen to d8 for CHECKMATE!"],
      position: { fen: "6k1/5ppp/8/8/8/8/8/3Q2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Qd8#"],
      hints: ["Slide Queen to d8."],
      feedback: { correct: "Checkmate! The back-rank trap won the game.", incorrect: "Move Queen to d8." }
    }
  ]
};

// SKILL 9: Check or Checkmate?
export const SKILL_CHECK_VS_CHECKMATE: LearningSkill = {
  id: "level-4-check-vs-checkmate",
  title: "9. Check or Checkmate?",
  description: "Distinguish between a simple Check (King can escape) and Checkmate (King is trapped).",
  icon: "⚖️",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-what-is-checkmate"],
  exercises: [
    {
      id: "l4-s9-ex1-check-only",
      type: "make-move",
      title: "Position A: Is this Check or Checkmate?",
      explanation: ["Play Rd8+ to give check to Black's King on e8. Notice that Black's King can escape to f8! (Check, not checkmate)."],
      position: { fen: "4k3/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rd8+"],
      hints: ["Move Rook to d8."],
      feedback: { correct: "Check! Black's King is attacked but has f8 to escape.", incorrect: "Move Rook to d8." }
    },
    {
      id: "l4-s9-ex2-checkmate",
      type: "capture-piece",
      title: "Position B: Is this Check or Checkmate?",
      explanation: ["Capture Black's Rook on d8 with Rxd8#. Notice that Black's King has no escape squares! (Checkmate)."],
      position: { fen: "3r2k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rxd8#"],
      hints: ["Capture d8 with Rxd8#."],
      feedback: { correct: "Checkmate! Black's King is in check with zero escape moves.", incorrect: "Capture d8 with Rxd8#." }
    }
  ]
};

// SKILL 10: Checkmate Challenge (10 Task Challenge requiring 8/10 to pass)
export const SKILL_CHECKMATE_CHALLENGE: LearningSkill = {
  id: "level-4-checkmate-challenge",
  title: "10. Checkmate Challenge",
  description: "Final Level 4 Challenge! Deliver 10 tactical checks and checkmates. Score at least 8/10 to master Level 4 and unlock Level 5!",
  icon: "🏆",
  category: "check-basics",
  difficulty: "beginner",
  prerequisites: ["level-4-check-vs-checkmate"],
  exercises: [
    {
      id: "l4-ch-1",
      type: "make-move",
      title: "Task 1 of 10: Queen Back-Rank Mate",
      explanation: ["Deliver checkmate on d8 with your Queen on d1!"],
      position: { fen: "6k1/5ppp/8/8/8/8/8/3Q2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Qd8#"],
      hints: ["Qd8# checkmates."],
      feedback: { correct: "Correct!", incorrect: "Qd8# checkmates." }
    },
    {
      id: "l4-ch-2",
      type: "capture-piece",
      title: "Task 2 of 10: Rook Back-Rank Mate",
      explanation: ["Capture Black's Rook on d8 with your Rook on d1 for checkmate!"],
      position: { fen: "3r2k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rxd8#"],
      hints: ["Rxd8# checkmates."],
      feedback: { correct: "Correct!", incorrect: "Rxd8# checkmates." }
    },
    {
      id: "l4-ch-3",
      type: "capture-piece",
      title: "Task 3 of 10: Scholar's Mate",
      explanation: ["Capture f7 with your Queen on h5 for checkmate!"],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1", orientation: "white", targetSquare: "f7" },
      expectedMoves: ["Qxf7#"],
      hints: ["Qxf7# checkmates."],
      feedback: { correct: "Correct!", incorrect: "Qxf7# checkmates." }
    },
    {
      id: "l4-ch-4",
      type: "make-move",
      title: "Task 4 of 10: Corner Queen Mate",
      explanation: ["Deliver checkmate on a7 with your Queen!"],
      position: { fen: "k7/8/1K6/8/8/8/8/Q7 w - - 0 1", orientation: "white", targetSquare: "a7" },
      expectedMoves: ["Qa7#"],
      hints: ["Qa7# checkmates."],
      feedback: { correct: "Correct!", incorrect: "Qa7# checkmates." }
    },
    {
      id: "l4-ch-5",
      type: "make-move",
      title: "Task 5 of 10: Face-to-Face Queen Mate",
      explanation: ["Deliver checkmate on e7 with your Queen on h4!"],
      position: { fen: "4k3/8/4K3/8/7Q/8/8/8 w - - 0 1", orientation: "white", targetSquare: "e7" },
      expectedMoves: ["Qe7#"],
      hints: ["Qe7# checkmates."],
      feedback: { correct: "Correct!", incorrect: "Qe7# checkmates." }
    },
    {
      id: "l4-ch-6",
      type: "make-move",
      title: "Task 6 of 10: Bishop Check on h6",
      explanation: ["Deliver check to Black's King with your Bishop on c1!"],
      position: { fen: "5k2/8/8/8/8/8/8/2B1K3 w - - 0 1", orientation: "white", targetSquare: "h6" },
      expectedMoves: ["Bh6+"],
      hints: ["Bh6+ checks."],
      feedback: { correct: "Correct!", incorrect: "Bh6+ checks." }
    },
    {
      id: "l4-ch-7",
      type: "make-move",
      title: "Task 7 of 10: Step King Out of Check",
      explanation: ["Step your King on e1 safely to f1!"],
      position: { fen: "4r3/7k/8/8/8/8/8/4K3 w - - 0 1", orientation: "white" },
      expectedMoves: ["Kf1"],
      hints: ["Step to f1."],
      feedback: { correct: "Correct!", incorrect: "Step to f1." }
    },
    {
      id: "l4-ch-8",
      type: "make-move",
      title: "Task 8 of 10: Block Check with Rook",
      explanation: ["Block Black's Rook check on e8 by moving your Rook from a2 to e2!"],
      position: { fen: "4r3/7k/8/8/8/8/R7/4K3 w - - 0 1", orientation: "white" },
      expectedMoves: ["Re2"],
      hints: ["Move Rook to e2."],
      feedback: { correct: "Correct!", incorrect: "Move Rook to e2." }
    },
    {
      id: "l4-ch-9",
      type: "capture-piece",
      title: "Task 9 of 10: Capture Checking Rook",
      explanation: ["Capture Black's checking Rook on e2 with your King on e1!"],
      position: { fen: "7k/8/8/8/8/8/4r3/4K3 w - - 0 1", orientation: "white", targetSquare: "e2" },
      expectedMoves: ["Kxe2"],
      hints: ["Kxe2 captures Rook."],
      feedback: { correct: "Correct!", incorrect: "Kxe2 captures Rook." }
    },
    {
      id: "l4-ch-10",
      type: "capture-piece",
      title: "Task 10 of 10: Rook Captures Back Rank",
      explanation: ["Capture Black's Rook on d8 with your Rook on d1 for checkmate!"],
      position: { fen: "3r1k2/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rxd8+"],
      hints: ["Rxd8+ captures Rook."],
      feedback: { correct: "Correct!", incorrect: "Rxd8+ captures Rook." }
    }
  ]
};

export const LEVEL_4: LearningLevel = {
  levelNumber: 4,
  title: "Level 4 — Check & Checkmate",
  description: "Master check, give check, escape check (move, capture, block), double check, checkmate, and checkmate challenges.",
  skills: [
    SKILL_WHAT_IS_CHECK,
    SKILL_GIVE_CHECK,
    SKILL_ESCAPE_CHECK,
    SKILL_ESCAPE_MOVE,
    SKILL_ESCAPE_CAPTURE,
    SKILL_ESCAPE_BLOCK,
    SKILL_DOUBLE_CHECK,
    SKILL_WHAT_IS_CHECKMATE,
    SKILL_CHECK_VS_CHECKMATE,
    SKILL_CHECKMATE_CHALLENGE
  ]
};
