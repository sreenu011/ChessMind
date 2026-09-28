import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: Castling (Kingside & Queenside)
export const SKILL_CASTLING: LearningSkill = {
  id: "level-5-castling",
  title: "1. Castling (Kingside & Queenside)",
  description: "Learn how to castle to protect your King and activate your Rook in a single move.",
  icon: "🏰",
  category: "special-moves",
  difficulty: "beginner",
  prerequisites: [],
  exercises: [
    {
      id: "l5-cast-1-kingside",
      type: "make-move",
      title: "Kingside Castling (O-O)",
      explanation: [
        "Castling is the only move in chess where TWO pieces move in the same turn!",
        "The King moves 2 squares towards the Rook (e1 to g1), and the Rook hops over to f1.",
        "Castle Kingside by moving your King from e1 to g1!"
      ],
      position: { fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", orientation: "white", highlightSquares: ["e1", "g1"] },
      expectedMoves: ["O-O"],
      hints: ["Move your King 2 squares right to g1.", "Castling automatically moves your Rook to f1."],
      feedback: { correct: "Correct! Kingside castling (O-O) completed.", incorrect: "Move your King to g1 to castle Kingside." }
    },
    {
      id: "l5-cast-2-queenside",
      type: "make-move",
      title: "Queenside Castling (O-O-O)",
      explanation: [
        "Queenside castling moves the King 2 squares left to c1, and the a1 Rook hops to d1.",
        "Castle Queenside by moving your King from e1 to c1!"
      ],
      position: { fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", orientation: "white", highlightSquares: ["e1", "c1"] },
      expectedMoves: ["O-O-O"],
      hints: ["Move your King 2 squares left to c1.", "Queenside castling automatically moves the Rook to d1."],
      feedback: { correct: "Correct! Queenside castling (O-O-O) completed.", incorrect: "Move your King to c1 to castle Queenside." }
    }
  ]
};

// SKILL 2: En Passant
export const SKILL_EN_PASSANT: LearningSkill = {
  id: "level-5-en-passant",
  title: "2. En Passant",
  description: "Learn the special pawn capture rule: capture an enemy pawn 'in passing' right after its 2-square leap.",
  icon: "♟️",
  category: "special-moves",
  difficulty: "beginner",
  prerequisites: ["level-5-castling"],
  exercises: [
    {
      id: "l5-ep-1-capture",
      type: "capture-piece",
      title: "En Passant Pawn Capture",
      explanation: [
        "When an enemy pawn leaps 2 squares and lands next to your pawn, you can capture it 'in passing'!",
        "Black just played d7-d5. Capture Black's pawn en passant by moving your e5 pawn diagonally to d6!"
      ],
      position: { fen: "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3", orientation: "white", targetSquare: "d6" },
      expectedMoves: ["exd6"],
      hints: ["Move your e5 pawn diagonally to d6.", "exd6 captures the d5 pawn en passant."],
      feedback: { correct: "Awesome! En passant capture executed successfully.", incorrect: "Move your e5 pawn to d6 to capture en passant." }
    }
  ]
};

// SKILL 3: Pawn Promotion
export const SKILL_PAWN_PROMOTION: LearningSkill = {
  id: "level-5-promotion",
  title: "3. Pawn Promotion",
  description: "When a pawn reaches the 8th rank, it promotes into a Queen, Rook, Bishop, or Knight!",
  icon: "👑",
  category: "special-moves",
  difficulty: "beginner",
  prerequisites: ["level-5-en-passant"],
  exercises: [
    {
      id: "l5-prom-1-queen",
      type: "make-move",
      title: "Promote Pawn to Queen",
      explanation: [
        "Push your pawn on e7 to e8 to promote it into a powerful Queen!",
        "Select Queen when the promotion pop-up appears."
      ],
      position: { fen: "4k3/4P3/8/8/8/8/8/4K3 w - - 0 1", orientation: "white", targetSquare: "e8" },
      expectedMoves: ["e8=Q+"],
      hints: ["Push pawn to e8 and choose Queen."],
      feedback: { correct: "Promoted! Your pawn became a powerful Queen.", incorrect: "Push pawn to e8 and promote to Queen." }
    }
  ]
};

// SKILL 4: Tactics — The Fork
export const SKILL_FORK: LearningSkill = {
  id: "level-5-fork",
  title: "4. Tactics — The Fork",
  description: "A fork occurs when one piece attacks TWO enemy pieces at the same time!",
  icon: "🍴",
  category: "tactics",
  difficulty: "intermediate",
  prerequisites: ["level-5-promotion"],
  exercises: [
    {
      id: "l5-fork-1-knight",
      type: "make-move",
      title: "Knight Family Fork",
      explanation: [
        "Leap your Knight on d4 to c6 to attack BOTH Black's King on e7 and Black's Rook on a7 at the same time!"
      ],
      position: { fen: "r3k3/8/8/8/3N4/8/8/4K3 w - - 0 1", orientation: "white", targetSquare: "c6" },
      expectedMoves: ["Nc6+"],
      hints: ["Leap Knight to c6.", "Nc6+ forks King e7 and Rook a7!"],
      feedback: { correct: "Fork! The Knight attacks both King and Rook simultaneously.", incorrect: "Leap Knight to c6." }
    }
  ]
};

// SKILL 5: Tactics — The Pin
export const SKILL_PIN: LearningSkill = {
  id: "level-5-pin",
  title: "5. Tactics — The Pin",
  description: "A pin restricts an enemy piece from moving because a more valuable piece lies behind it!",
  icon: "📌",
  category: "tactics",
  difficulty: "intermediate",
  prerequisites: ["level-5-fork"],
  exercises: [
    {
      id: "l5-pin-1-bishop",
      type: "make-move",
      title: "Pin the Knight to the King",
      explanation: [
        "Move your Bishop on c1 to g5 to pin Black's Knight on f6 against Black's King on e7!"
      ],
      position: { fen: "4k3/4n3/8/8/8/8/8/2B1K3 w - - 0 1", orientation: "white", targetSquare: "g5" },
      expectedMoves: ["Bg5"],
      hints: ["Slide Bishop to g5."],
      feedback: { correct: "Pin! The Knight cannot move without exposing the King.", incorrect: "Move Bishop to g5." }
    }
  ]
};

// SKILL 6: Tactics — The Skewer
export const SKILL_SKEWER: LearningSkill = {
  id: "level-5-skewer",
  title: "6. Tactics — The Skewer",
  description: "A skewer attacks a valuable piece directly, forcing it to move and exposing a target behind it!",
  icon: "🗡️",
  category: "tactics",
  difficulty: "intermediate",
  prerequisites: ["level-5-pin"],
  exercises: [
    {
      id: "l5-skewer-1-rook",
      type: "make-move",
      title: "Rook Skewer",
      explanation: [
        "Slide your Rook on d1 to d8 to attack Black's King on e8. When the King moves, you win the Rook on h8!"
      ],
      position: { fen: "4k2r/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rd8+"],
      hints: ["Move Rook to d8+."],
      feedback: { correct: "Skewer! The King must move, exposing the Rook behind it.", incorrect: "Move Rook to d8+." }
    }
  ]
};

// SKILL 7: Special Moves & Tactics Challenge
export const SKILL_TACTICS_CHALLENGE: LearningSkill = {
  id: "level-5-tactics-challenge",
  title: "7. Special Moves & Tactics Challenge",
  description: "Final Level 5 Challenge! Execute 5 tactical and special move exercises to master Level 5!",
  icon: "🏆",
  category: "tactics",
  difficulty: "intermediate",
  prerequisites: ["level-5-skewer"],
  exercises: [
    {
      id: "l5-ch-1-castle",
      type: "make-move",
      title: "Task 1 of 5: Castle Kingside",
      explanation: ["Castle Kingside with White!"],
      position: { fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", orientation: "white" },
      expectedMoves: ["O-O"],
      hints: ["Move King to g1."],
      feedback: { correct: "Correct!", incorrect: "Move King to g1." }
    },
    {
      id: "l5-ch-2-ep",
      type: "capture-piece",
      title: "Task 2 of 5: En Passant Capture",
      explanation: ["Capture d5 en passant with your e5 pawn!"],
      position: { fen: "rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3", orientation: "white", targetSquare: "d6" },
      expectedMoves: ["exd6"],
      hints: ["Move e5 pawn to d6."],
      feedback: { correct: "Correct!", incorrect: "Move e5 pawn to d6." }
    },
    {
      id: "l5-ch-3-prom",
      type: "make-move",
      title: "Task 3 of 5: Promote to Queen",
      explanation: ["Promote your e7 pawn to a Queen on e8!"],
      position: { fen: "4k3/4P3/8/8/8/8/8/4K3 w - - 0 1", orientation: "white", targetSquare: "e8" },
      expectedMoves: ["e8=Q+"],
      hints: ["Push pawn to e8."],
      feedback: { correct: "Correct!", incorrect: "Push pawn to e8." }
    },
    {
      id: "l5-ch-4-fork",
      type: "make-move",
      title: "Task 4 of 5: Knight Fork on c6",
      explanation: ["Fork Black's King and Rook with Nc6+!"],
      position: { fen: "r3k3/8/8/8/3N4/8/8/4K3 w - - 0 1", orientation: "white", targetSquare: "c6" },
      expectedMoves: ["Nc6+"],
      hints: ["Move Knight to c6."],
      feedback: { correct: "Correct!", incorrect: "Move Knight to c6." }
    },
    {
      id: "l5-ch-5-skewer",
      type: "make-move",
      title: "Task 5 of 5: Rook Skewer on d8",
      explanation: ["Deliver check on d8 with your Rook to skewer the King!"],
      position: { fen: "4k2r/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", targetSquare: "d8" },
      expectedMoves: ["Rd8+"],
      hints: ["Move Rook to d8+."],
      feedback: { correct: "Correct!", incorrect: "Move Rook to d8+." }
    }
  ]
};

export const LEVEL_5: LearningLevel = {
  levelNumber: 5,
  title: "Level 5 — Special Moves & Tactics",
  description: "Master castling, en passant, pawn promotion, knight forks, bishop pins, and rook skewers.",
  skills: [
    SKILL_CASTLING,
    SKILL_EN_PASSANT,
    SKILL_PAWN_PROMOTION,
    SKILL_FORK,
    SKILL_PIN,
    SKILL_SKEWER,
    SKILL_TACTICS_CHALLENGE
  ]
};
