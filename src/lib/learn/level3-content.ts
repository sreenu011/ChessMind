import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: What is a Capture?
export const SKILL_WHAT_IS_CAPTURE: LearningSkill = {
  id: "level-3-what-is-capture",
  title: "1. Capture an Enemy Piece",
  description: "Learn what capturing means: move your piece onto an enemy piece's square to remove it from the board.",
  icon: "⚔️",
  category: "captures",
  difficulty: "beginner",
  prerequisites: [],
  exercises: [
    {
      id: "l3-cap-1-rook",
      type: "capture-piece",
      title: "Rook Captures Pawn",
      explanation: [
        "A capture occurs when your piece moves onto a square occupied by an enemy piece.",
        "The enemy piece is removed from the board!",
        "Capture Black's pawn on d7 with your Rook on d4."
      ],
      position: { fen: "6k1/3p4/8/8/3R4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d7" },
      expectedMoves: ["Rxd7"],
      hints: ["Slide the Rook straight up the d-file.", "Move from d4 to d7 to capture the pawn."],
      feedback: { correct: "Captured! Your Rook removed Black's pawn from the board.", incorrect: "Move the Rook on d4 to d7 to capture the pawn." }
    },
    {
      id: "l3-cap-2-bishop",
      type: "capture-piece",
      title: "Bishop Captures Pawn",
      explanation: ["Capture Black's pawn on f7 with your Bishop on c4."],
      position: { fen: "7k/5p2/8/8/2B5/8/8/K7 w - - 0 1", orientation: "white", targetSquare: "f7" },
      expectedMoves: ["Bxf7"],
      hints: ["Follow the diagonal from c4 to f7.", "Move the Bishop to f7 to capture."],
      feedback: { correct: "Captured! Bishops capture along open diagonal paths.", incorrect: "Move the Bishop on c4 to f7." }
    },
    {
      id: "l3-cap-3-queen",
      type: "capture-piece",
      title: "Queen Captures Rook",
      explanation: ["Capture Black's Rook on d7 with your Queen on d4."],
      position: { fen: "6k1/3r4/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d7" },
      expectedMoves: ["Qxd7"],
      hints: ["Slide the Queen straight up to d7.", "Capture the Rook on d7."],
      feedback: { correct: "Captured! Queens are deadly at capturing undefended pieces.", incorrect: "Move the Queen to d7." }
    },
    {
      id: "l3-cap-4-knight",
      type: "capture-piece",
      title: "Knight Captures Bishop",
      explanation: ["Capture Black's Bishop on f5 with your Knight on d4."],
      position: { fen: "6k1/8/8/5b2/3N4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "f5" },
      expectedMoves: ["Nxf5"],
      hints: ["Leap your Knight to f5.", "Nxf5 captures the Bishop."],
      feedback: { correct: "Captured! Knights leap in L-shapes to capture targets.", incorrect: "Move the Knight to f5." }
    }
  ]
};

// SKILL 2: Rook Captures
export const SKILL_ROOK_CAPTURES: LearningSkill = {
  id: "level-3-rook-captures",
  title: "2. Rook Captures",
  description: "Rooks capture horizontally and vertically, but cannot capture through friendly pieces.",
  icon: "♖",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-what-is-capture"],
  exercises: [
    {
      id: "l3-rook-1-vert",
      type: "capture-piece",
      title: "Vertical Rook Capture",
      explanation: ["Capture Black's pawn on d7 with your Rook on d4."],
      position: { fen: "6k1/3p4/8/8/3R4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d7" },
      expectedMoves: ["Rxd7"],
      hints: ["Slide the Rook straight up to d7."],
      feedback: { correct: "Correct! Vertical Rook capture executed.", incorrect: "Capture the d7 pawn." }
    },
    {
      id: "l3-rook-2-horiz",
      type: "capture-piece",
      title: "Horizontal Rook Capture",
      explanation: ["Capture Black's Knight on h4 with your Rook on d4."],
      position: { fen: "k7/8/8/8/3R3n/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "h4" },
      expectedMoves: ["Rxh4"],
      hints: ["Slide the Rook to the right along rank 4.", "Rxh4 captures the Knight."],
      feedback: { correct: "Correct! Horizontal Rook capture executed.", incorrect: "Move the Rook to h4." }
    },
    {
      id: "l3-rook-3-blocked",
      type: "capture-piece",
      title: "Blocked Path: Cannot Capture Through Pieces",
      explanation: [
        "Your pawn on d6 blocks the d-file! You cannot capture the pawn on d7.",
        "Instead, capture Black's Knight on h4!"
      ],
      position: { fen: "k7/3p4/3P4/8/3R3n/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "h4" },
      expectedMoves: ["Rxh4"],
      hints: ["You cannot jump over d6.", "Slide right to h4 to capture the Knight."],
      feedback: { correct: "Great tactical vision! The blocked pawn forced a horizontal capture.", incorrect: "The d6 pawn blocks your path to d7. Capture on h4 instead!" }
    }
  ]
};

// SKILL 3: Bishop Captures
export const SKILL_BISHOP_CAPTURES: LearningSkill = {
  id: "level-3-bishop-captures",
  title: "3. Bishop Captures",
  description: "Bishops capture along open diagonal paths on the same color square.",
  icon: "♗",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-rook-captures"],
  exercises: [
    {
      id: "l3-bishop-1-f7",
      type: "capture-piece",
      title: "Diagonal Capture on f7",
      explanation: ["Capture Black's pawn on f7 with your Bishop on c4."],
      position: { fen: "7k/5p2/8/8/2B5/8/8/K7 w - - 0 1", orientation: "white", targetSquare: "f7" },
      expectedMoves: ["Bxf7"],
      hints: ["Follow the diagonal to f7."],
      feedback: { correct: "Correct! Bishop captures f7.", incorrect: "Move Bishop to f7." }
    },
    {
      id: "l3-bishop-2-h8",
      type: "capture-piece",
      title: "Long Diagonal Capture on h8",
      explanation: ["Capture Black's Rook on h8 with your Bishop on a1."],
      position: { fen: "4k2r/8/8/8/8/8/8/B3K3 w - - 0 1", orientation: "white", targetSquare: "h8" },
      expectedMoves: ["Bxh8"],
      hints: ["Follow the long diagonal from a1 to h8."],
      feedback: { correct: "Correct! Long diagonal capture on h8.", incorrect: "Move Bishop to h8." }
    },
    {
      id: "l3-bishop-3-dark",
      type: "capture-piece",
      title: "Dark-Squared Diagonal Capture",
      explanation: ["Capture Black's Knight on g5 with your dark-squared Bishop on c1."],
      position: { fen: "4k3/8/8/6n1/8/8/8/2B1K3 w - - 0 1", orientation: "white", targetSquare: "g5" },
      expectedMoves: ["Bxg5"],
      hints: ["Follow the dark diagonal from c1 to g5."],
      feedback: { correct: "Correct! Dark-squared diagonal capture executed.", incorrect: "Move Bishop to g5." }
    }
  ]
};

// SKILL 4: Queen Captures
export const SKILL_QUEEN_CAPTURES: LearningSkill = {
  id: "level-3-queen-captures",
  title: "4. Queen Captures",
  description: "The Queen captures in straight lines (horizontally, vertically, or diagonally).",
  icon: "♕",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-bishop-captures"],
  exercises: [
    {
      id: "l3-queen-1-d7",
      type: "capture-piece",
      title: "Queen Vertical Capture",
      explanation: ["Capture Black's Rook on d7 with your Queen on d4."],
      position: { fen: "6k1/3r4/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d7" },
      expectedMoves: ["Qxd7"],
      hints: ["Slide Queen to d7."],
      feedback: { correct: "Correct! Qxd7 captures the Rook.", incorrect: "Move Queen to d7." }
    },
    {
      id: "l3-queen-2-h8",
      type: "capture-piece",
      title: "Queen Diagonal Capture",
      explanation: ["Capture Black's Bishop on h8 with your Queen on d4."],
      position: { fen: "7b/k7/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "h8" },
      expectedMoves: ["Qxh8"],
      hints: ["Slide Queen diagonally to h8."],
      feedback: { correct: "Correct! Qxh8 captures the Bishop.", incorrect: "Move Queen to h8." }
    },
    {
      id: "l3-queen-3-a4",
      type: "capture-piece",
      title: "Queen Horizontal Capture",
      explanation: ["Capture Black's Knight on a4 with your Queen on d4."],
      position: { fen: "6k1/8/8/8/n2Q4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "a4" },
      expectedMoves: ["Qxa4"],
      hints: ["Slide Queen left to a4."],
      feedback: { correct: "Correct! Qxa4 captures the Knight.", incorrect: "Move Queen to a4." }
    }
  ]
};

// SKILL 5: Knight Captures
export const SKILL_KNIGHT_CAPTURES: LearningSkill = {
  id: "level-3-knight-captures",
  title: "5. Knight Captures",
  description: "Knights can leap over pieces to capture target enemy pieces in an L-shape.",
  icon: "♘",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-queen-captures"],
  exercises: [
    {
      id: "l3-knight-1-f5",
      type: "capture-piece",
      title: "Knight L-Capture",
      explanation: ["Capture Black's Bishop on f5 with your Knight on d4."],
      position: { fen: "6k1/8/8/5b2/3N4/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "f5" },
      expectedMoves: ["Nxf5"],
      hints: ["Leap to f5."],
      feedback: { correct: "Correct! Knight captures f5.", incorrect: "Move Knight to f5." }
    },
    {
      id: "l3-knight-2-jump",
      type: "capture-piece",
      title: "Knight Jumps Over Obstacles to Capture",
      explanation: [
        "Your Knight on d4 is surrounded by pawns!",
        "Leap over your pawns and capture Black's Rook on f5."
      ],
      position: { fen: "6k1/8/8/3P1r2/2PNP3/3P4/8/6K1 w - - 0 1", orientation: "white", targetSquare: "f5" },
      expectedMoves: ["Nxf5"],
      hints: ["Knights ignore surrounding pieces.", "Leap over pawns to f5 to take the Rook."],
      feedback: { correct: "Awesome! Knight jumped over pawns to capture the Rook!", incorrect: "Leap the Knight to f5." }
    }
  ]
};

// SKILL 6: Pawn Captures
export const SKILL_PAWN_CAPTURES: LearningSkill = {
  id: "level-3-pawn-captures",
  title: "6. Pawn Captures",
  description: "Pawns move straight forward, but capture 1 square diagonally forward. They CANNOT capture straight ahead.",
  icon: "♙",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-knight-captures"],
  exercises: [
    {
      id: "l3-pawn-1-exd5",
      type: "capture-piece",
      title: "Pawn Diagonal Capture (Right)",
      explanation: ["Capture Black's pawn on d5 with your pawn on e4."],
      position: { fen: "6k1/8/8/3p4/4P3/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d5" },
      expectedMoves: ["exd5"],
      hints: ["Pawns capture 1 square diagonally forward.", "Take the d5 pawn with exd5."],
      feedback: { correct: "Correct! Pawns capture diagonally.", incorrect: "Take d5 with exd5." }
    },
    {
      id: "l3-pawn-2-exf5",
      type: "capture-piece",
      title: "Pawn Diagonal Capture (Left)",
      explanation: ["Capture Black's pawn on f5 with your pawn on e4."],
      position: { fen: "6k1/8/8/5p2/4P3/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "f5" },
      expectedMoves: ["exf5"],
      hints: ["Take the f5 pawn with exf5."],
      feedback: { correct: "Correct! exf5 captures the pawn.", incorrect: "Take f5 with exf5." }
    },
    {
      id: "l3-pawn-3-blocked",
      type: "capture-piece",
      title: "Blocked Pawns: Cannot Capture Straight Ahead",
      explanation: [
        "Pawns CANNOT capture straight ahead!",
        "Your pawn on e4 is blocked by Black's pawn on e5.",
        "Instead, capture Black's pawn on d5 diagonally!"
      ],
      position: { fen: "6k1/8/8/3pp3/4P3/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d5" },
      expectedMoves: ["exd5"],
      hints: ["You cannot capture e5 directly ahead.", "Capture d5 diagonally with exd5."],
      feedback: { correct: "Great rule mastery! Pawns never capture straight ahead.", incorrect: "You cannot capture e5 ahead! Take d5 with exd5." }
    }
  ]
};

// SKILL 7: King Captures & Safety
export const SKILL_KING_CAPTURES: LearningSkill = {
  id: "level-3-king-captures",
  title: "7. King Captures & Safety",
  description: "The King can capture undefended adjacent pieces, but must NEVER capture a protected piece (moving into check).",
  icon: "♔",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-pawn-captures"],
  exercises: [
    {
      id: "l3-king-1-safe",
      type: "capture-piece",
      title: "Safe King Capture",
      explanation: ["Black's pawn on e5 is completely undefended. Capture it with your King on e4!"],
      position: { fen: "6k1/8/8/4p3/4K3/8/8/8 w - - 0 1", orientation: "white", targetSquare: "e5" },
      expectedMoves: ["Kxe5"],
      hints: ["The e5 pawn has no defenders.", "Capture e5 with your King."],
      feedback: { correct: "Correct! The King captured the undefended pawn.", incorrect: "Move the King to e5 to capture." }
    },
    {
      id: "l3-king-2-protected",
      type: "make-move",
      title: "Protected Piece: King Cannot Move Into Check!",
      explanation: [
        "Black's pawn on e5 is protected by Black's Rook on e8!",
        "Capturing e5 would put your King in check, which is ILLEGAL.",
        "Do NOT capture e5! Step your King safely to d3 instead."
      ],
      position: { fen: "4r1k1/8/8/4p3/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e5", "e8"] },
      expectedMoves: ["Kd3"],
      hints: ["e5 is defended by Black's Rook on e8.", "Capturing e5 is illegal! Move safely to d3."],
      feedback: { correct: "Wise choice! Kings can NEVER move onto a defended square.", incorrect: "Capturing e5 is illegal because it is protected by the Rook on e8! Move to d3." }
    }
  ]
};

// SKILL 8: Free Piece (Undefended)
export const SKILL_FREE_PIECE: LearningSkill = {
  id: "level-3-free-piece",
  title: "8. Free Piece (Undefended)",
  description: "Always look out for hanging/undefended enemy pieces that can be captured safely for free!",
  icon: "🎁",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-king-captures"],
  exercises: [
    {
      id: "l3-free-1-rook",
      type: "capture-piece",
      title: "Win the Free Rook",
      explanation: ["Black's Rook on h5 has no defenders! Capture it with your Queen on d1."],
      position: { fen: "k7/8/8/7r/8/8/8/3Q2K1 w - - 0 1", orientation: "white", targetSquare: "h5" },
      expectedMoves: ["Qxh5"],
      hints: ["Slide Queen to h5 to win the free Rook."],
      feedback: { correct: "Free piece! You won Black's undefended Rook.", incorrect: "Capture the free Rook on h5 with Qxh5." }
    },
    {
      id: "l3-free-2-knight",
      type: "capture-piece",
      title: "Win the Free Knight",
      explanation: ["Black's Knight on h6 is hanging (undefended). Capture it with your Bishop on c1!"],
      position: { fen: "4k3/8/7n/8/8/8/8/2B1K3 w - - 0 1", orientation: "white", targetSquare: "h6" },
      expectedMoves: ["Bxh6"],
      hints: ["Follow the dark diagonal from c1 to h6."],
      feedback: { correct: "Free piece! You captured the hanging Knight on h6.", incorrect: "Capture h6 with Bxh6." }
    }
  ]
};

// SKILL 9: Protected Piece (Defended)
export const SKILL_PROTECTED_PIECE: LearningSkill = {
  id: "level-3-protected-piece",
  title: "9. Protected Piece (Defended)",
  description: "Attacking a piece does NOT mean you should capture it! Capturing a protected piece loses material.",
  icon: "🛡️",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-free-piece"],
  exercises: [
    {
      id: "l3-prot-1-bishop",
      type: "make-move",
      title: "Do Not Trade Queen for a Defended Bishop",
      explanation: [
        "Black's Bishop on d5 is protected by Black's pawn on c6!",
        "Capturing d5 loses your Queen for a minor piece.",
        "Instead of capturing, develop your Knight safely from d2 to f3!"
      ],
      position: { fen: "6k1/8/2p5/3b4/8/8/3N4/3Q1K2 w - - 0 1", orientation: "white", highlightSquares: ["c6", "d5"] },
      expectedMoves: ["Nf3"],
      hints: ["Don't capture d5 (it's defended by c6).", "Play Nf3 instead."],
      feedback: { correct: "Smart decision! Attacking a piece does not mean you must capture it.", incorrect: "Capturing d5 loses your Queen! Develop your Knight to f3 instead." }
    },
    {
      id: "l3-prot-2-rook",
      type: "make-move",
      title: "Avoid Defended Rook Trade",
      explanation: [
        "Black's Rook on e8 is defended by Black's King on f8.",
        "Do not capture e8! Retreat your Rook safely to e3 instead."
      ],
      position: { fen: "4rk2/8/8/8/8/8/8/4R1K1 w - - 0 1", orientation: "white", highlightSquares: ["e8", "f8"] },
      expectedMoves: ["Re3"],
      hints: ["e8 is defended by King f8.", "Retreat your Rook to e3."],
      feedback: { correct: "Great patience! Retreating kept your Rook safe.", incorrect: "Retreat to e3 instead of making an unsafe capture." }
    }
  ]
};

// SKILL 10: Capture Challenge (10 Task Challenge requiring 8/10 to pass)
export const SKILL_CAPTURE_CHALLENGE: LearningSkill = {
  id: "level-3-capture-challenge",
  title: "10. Capture Challenge",
  description: "Final Level 3 Challenge! Execute 10 tactical captures. Score at least 8/10 to master Level 3 and unlock Level 4!",
  icon: "🏆",
  category: "captures",
  difficulty: "beginner",
  prerequisites: ["level-3-protected-piece"],
  exercises: [
    {
      id: "l3-ch-1-rook",
      type: "capture-piece",
      title: "Task 1 of 10: Rook Captures Rook",
      explanation: ["Capture Black's Rook on d8 with your Rook on d1!"],
      position: { fen: "3r1k2/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rxd8+"],
      hints: ["Rxd8+ captures the Rook."],
      feedback: { correct: "Correct!", incorrect: "Rxd8+ captures the Rook." }
    },
    {
      id: "l3-ch-2-bishop",
      type: "capture-piece",
      title: "Task 2 of 10: Bishop Captures f7",
      explanation: ["Capture Black's pawn on f7 with your Bishop on c4!"],
      position: { fen: "4k3/5p2/8/8/2B5/8/8/4K3 w - - 0 1", orientation: "white", targetSquare: "f7" },
      expectedMoves: ["Bxf7+"],
      hints: ["Bxf7+ captures f7."],
      feedback: { correct: "Correct!", incorrect: "Bxf7+ captures f7." }
    },
    {
      id: "l3-ch-3-knight",
      type: "capture-piece",
      title: "Task 3 of 10: Knight Captures e5",
      explanation: ["Capture Black's undefended pawn on e5 with your Knight on f3!"],
      position: { fen: "6k1/8/8/4p3/8/5N2/8/6K1 w - - 0 1", orientation: "white", targetSquare: "e5" },
      expectedMoves: ["Nxe5"],
      hints: ["Nxe5 captures e5."],
      feedback: { correct: "Correct!", incorrect: "Nxe5 captures e5." }
    },
    {
      id: "l3-ch-4-queen",
      type: "capture-piece",
      title: "Task 4 of 10: Queen Captures Queen",
      explanation: ["Capture Black's Queen on d8 with your Queen on d1!"],
      position: { fen: "3q1k2/8/8/8/8/8/8/3Q2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Qxd8+"],
      hints: ["Qxd8+ captures Queen."],
      feedback: { correct: "Correct!", incorrect: "Qxd8+ captures Queen." }
    },
    {
      id: "l3-ch-5-pawn",
      type: "capture-piece",
      title: "Task 5 of 10: Pawn Captures d5",
      explanation: ["Capture Black's pawn on d5 with your pawn on e4!"],
      position: { fen: "6k1/8/8/3p4/4P3/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d5" },
      expectedMoves: ["exd5"],
      hints: ["exd5 captures d5."],
      feedback: { correct: "Correct!", incorrect: "exd5 captures d5." }
    },
    {
      id: "l3-ch-6-king",
      type: "capture-piece",
      title: "Task 6 of 10: King Captures f4",
      explanation: ["Capture Black's undefended pawn on f4 with your King on e3!"],
      position: { fen: "k7/8/8/8/5p2/4K3/8/8 w - - 0 1", orientation: "white", targetSquare: "f4" },
      expectedMoves: ["Kxf4"],
      hints: ["Kxf4 captures f4."],
      feedback: { correct: "Correct!", incorrect: "Kxf4 captures f4." }
    },
    {
      id: "l3-ch-7-knight-jump",
      type: "capture-piece",
      title: "Task 7 of 10: Knight Leaps to f5",
      explanation: ["Leap your Knight on d4 over obstacles and capture Black's Rook on f5!"],
      position: { fen: "6k1/8/8/3P1r2/2PNP3/3P4/8/6K1 w - - 0 1", orientation: "white", targetSquare: "f5" },
      expectedMoves: ["Nxf5"],
      hints: ["Nxf5 captures Rook."],
      feedback: { correct: "Correct!", incorrect: "Nxf5 captures Rook." }
    },
    {
      id: "l3-ch-8-bishop-long",
      type: "capture-piece",
      title: "Task 8 of 10: Bishop Captures h8",
      explanation: ["Capture Black's Rook on h8 with your Bishop on a1!"],
      position: { fen: "4k2r/8/8/8/8/8/8/B3K3 w - - 0 1", orientation: "white", targetSquare: "h8" },
      expectedMoves: ["Bxh8"],
      hints: ["Bxh8 captures h8."],
      feedback: { correct: "Correct!", incorrect: "Bxh8 captures h8." }
    },
    {
      id: "l3-ch-9-free-knight",
      type: "capture-piece",
      title: "Task 9 of 10: Win Free Knight on h4",
      explanation: ["Capture Black's undefended Knight on h4 with your Queen on d4!"],
      position: { fen: "k7/8/8/8/3Q3n/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "h4" },
      expectedMoves: ["Qxh4"],
      hints: ["Qxh4 wins free Knight."],
      feedback: { correct: "Correct!", incorrect: "Qxh4 wins free Knight." }
    },
    {
      id: "l3-ch-10-free-queen",
      type: "capture-piece",
      title: "Task 10 of 10: Win Undefended Queen on e8",
      explanation: ["Capture Black's undefended Queen on e8 with your Rook on e1!"],
      position: { fen: "4qk2/8/8/8/8/8/8/4R1K1 w - - 0 1", orientation: "white", targetSquare: "e8" },
      expectedMoves: ["Rxe8+"],
      hints: ["Rxe8+ captures Queen."],
      feedback: { correct: "Correct!", incorrect: "Rxe8+ captures Queen." }
    }
  ]
};

export const LEVEL_3: LearningLevel = {
  levelNumber: 3,
  title: "Level 3 — Learn Capturing",
  description: "Master capturing enemy pieces, pawn diagonal captures, safe vs protected piece evaluation, and tactical awareness.",
  skills: [
    SKILL_WHAT_IS_CAPTURE,
    SKILL_ROOK_CAPTURES,
    SKILL_BISHOP_CAPTURES,
    SKILL_QUEEN_CAPTURES,
    SKILL_KNIGHT_CAPTURES,
    SKILL_PAWN_CAPTURES,
    SKILL_KING_CAPTURES,
    SKILL_FREE_PIECE,
    SKILL_PROTECTED_PIECE,
    SKILL_CAPTURE_CHALLENGE
  ]
};
