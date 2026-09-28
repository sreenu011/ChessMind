import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: Learn the King
export const SKILL_KING: LearningSkill = {
  id: "level-2-king",
  title: "1. Learn the King",
  description: "The King is the most important piece. It moves exactly 1 square in any direction.",
  icon: "♔",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: [],
  exercises: [
    {
      id: "l2-king-1-d5",
      type: "make-move",
      title: "King to d5",
      explanation: [
        "The King moves 1 square in any direction: up, down, sideways, or diagonally.",
        "Move the White King from e4 to d5."
      ],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["Kd5"],
      hints: ["The King on e4 can move one square diagonally to d5.", "Click the King on e4 and move it to d5."],
      feedback: { correct: "Correct! The King stepped 1 square diagonally to d5.", incorrect: "The King moves one square. Move from e4 to d5." }
    },
    {
      id: "l2-king-2-e5",
      type: "make-move",
      title: "King to e5",
      explanation: ["Move the King 1 square straight forward to e5."],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Ke5"],
      hints: ["Move the King up 1 square to e5."],
      feedback: { correct: "Correct! The King stepped forward to e5.", incorrect: "Move the King 1 square straight up to e5." }
    },
    {
      id: "l2-king-3-f5",
      type: "make-move",
      title: "King to f5",
      explanation: ["Move the King 1 square diagonally up-right to f5."],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Kf5"],
      hints: ["Move the King diagonally to f5."],
      feedback: { correct: "Correct! King to f5.", incorrect: "Move the King to f5." }
    },
    {
      id: "l2-king-4-d4",
      type: "make-move",
      title: "King to d4",
      explanation: ["Move the King 1 square sideways left to d4."],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Kd4"],
      hints: ["Move 1 square to the left to d4."],
      feedback: { correct: "Correct! King to d4.", incorrect: "Move the King 1 square left to d4." }
    },
    {
      id: "l2-king-5-f4",
      type: "make-move",
      title: "King to f4",
      explanation: ["Move the King 1 square sideways right to f4."],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Kf4"],
      hints: ["Move 1 square to the right to f4."],
      feedback: { correct: "Correct! King to f4.", incorrect: "Move the King 1 square right to f4." }
    },
    {
      id: "l2-king-6-d3",
      type: "make-move",
      title: "King to d3",
      explanation: ["Move the King 1 square diagonally down-left to d3."],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Kd3"],
      hints: ["Move 1 square down-left to d3."],
      feedback: { correct: "Correct! King to d3.", incorrect: "Move the King diagonally down to d3." }
    },
    {
      id: "l2-king-7-e3",
      type: "make-move",
      title: "King to e3",
      explanation: ["Move the King 1 square straight down to e3."],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Ke3"],
      hints: ["Move 1 square straight down to e3."],
      feedback: { correct: "Correct! King to e3.", incorrect: "Move the King straight down to e3." }
    },
    {
      id: "l2-king-8-f3",
      type: "make-move",
      title: "King to f3",
      explanation: ["Move the King 1 square diagonally down-right to f3."],
      position: { fen: "6k1/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Kf3"],
      hints: ["Move 1 square down-right to f3."],
      feedback: { correct: "Mastered! The King moves 1 square in all 8 directions!", incorrect: "Move the King to f3." }
    }
  ]
};

// SKILL 2: Learn the Rook
export const SKILL_ROOK: LearningSkill = {
  id: "level-2-rook",
  title: "2. Learn the Rook",
  description: "The Rook moves any number of squares horizontally or vertically, but cannot jump over pieces.",
  icon: "♖",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: ["level-2-king"],
  exercises: [
    {
      id: "l2-rook-1-d8",
      type: "make-move",
      title: "Rook Vertical Slide",
      explanation: [
        "The Rook moves as far as it wants straight forward, backward, or sideways.",
        "Move the Rook on d4 all the way up to d8."
      ],
      position: { fen: "6k1/8/8/8/3R4/8/8/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "d8"] },
      expectedMoves: ["Rd8+"],
      hints: ["Slide the Rook straight up the d-file to d8."],
      feedback: { correct: "Correct! The Rook slid all the way to d8.", incorrect: "Slide the Rook on d4 up to d8." }
    },
    {
      id: "l2-rook-2-a4",
      type: "make-move",
      title: "Rook Horizontal Slide Left",
      explanation: ["Slide the Rook on d4 left along rank 4 to a4."],
      position: { fen: "6k1/8/8/8/3R4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Ra4"],
      hints: ["Slide the Rook along the 4th rank to the left corner a4."],
      feedback: { correct: "Correct! Rook to a4.", incorrect: "Move the Rook left to a4." }
    },
    {
      id: "l2-rook-3-h4",
      type: "make-move",
      title: "Rook Horizontal Slide Right",
      explanation: ["Slide the Rook on d4 right along rank 4 to h4."],
      position: { fen: "6k1/8/8/8/3R4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Rh4"],
      hints: ["Slide the Rook right to h4."],
      feedback: { correct: "Correct! Rook to h4.", incorrect: "Move the Rook right to h4." }
    },
    {
      id: "l2-rook-4-blocked",
      type: "make-move",
      title: "Blocked Rook: Avoid Obstacles",
      explanation: [
        "Rooks cannot jump over friendly pieces!",
        "Your pawn on d6 blocks the d-file. Instead, slide your Rook to h4."
      ],
      position: { fen: "6k1/8/3P4/8/3R4/8/8/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d6"] },
      expectedMoves: ["Rh4"],
      hints: ["You cannot move to d8 because d6 is blocked.", "Move the Rook horizontally to h4 instead."],
      feedback: { correct: "Great understanding! The pawn blocked the d-file so you moved to h4.", incorrect: "The d6 pawn blocks your path! Move horizontally to h4." }
    }
  ]
};

// SKILL 3: Learn the Bishop
export const SKILL_BISHOP: LearningSkill = {
  id: "level-2-bishop",
  title: "3. Learn the Bishop",
  description: "The Bishop moves diagonally any number of squares. It always stays on the same color square.",
  icon: "♗",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: ["level-2-rook"],
  exercises: [
    {
      id: "l2-bishop-1-g7",
      type: "make-move",
      title: "Bishop Diagonal Up-Right",
      explanation: [
        "The Bishop moves along diagonal paths.",
        "Move the light-squared Bishop on d4 up-right to g7."
      ],
      position: { fen: "6k1/8/8/8/3B4/8/8/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "g7"] },
      expectedMoves: ["Bg7"],
      hints: ["Slide the Bishop diagonally along the light squares to g7."],
      feedback: { correct: "Correct! The Bishop slid diagonally to g7.", incorrect: "Move the Bishop along its diagonal to g7." }
    },
    {
      id: "l2-bishop-2-a1",
      type: "make-move",
      title: "Bishop Diagonal Down-Left",
      explanation: ["Move the Bishop on d4 down-left to a1."],
      position: { fen: "6k1/8/8/8/3B4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Ba1"],
      hints: ["Slide the Bishop down-left to the a1 corner."],
      feedback: { correct: "Correct! Bishop to a1.", incorrect: "Move the Bishop to a1." }
    },
    {
      id: "l2-bishop-3-dark",
      type: "make-move",
      title: "Dark-Squared Bishop",
      explanation: [
        "Dark-squared Bishops can only travel on dark squares!",
        "Move the dark-squared Bishop on c1 to f4."
      ],
      position: { fen: "6k1/8/8/8/8/8/8/2B1K3 w - - 0 1", orientation: "white" },
      expectedMoves: ["Bf4"],
      hints: ["Follow the dark diagonal from c1 to f4."],
      feedback: { correct: "Correct! The dark-squared Bishop stays on dark squares.", incorrect: "Move the Bishop to f4." }
    },
    {
      id: "l2-bishop-4-blocked",
      type: "make-move",
      title: "Blocked Bishop",
      explanation: [
        "Bishops cannot jump over pieces.",
        "Move the Bishop on c1 along the open diagonal to a3."
      ],
      position: { fen: "6k1/8/8/8/8/8/3P4/2B1K3 w - - 0 1", orientation: "white" },
      expectedMoves: ["Ba3"],
      hints: ["The pawn on d2 blocks the right diagonal.", "Move left along the open diagonal to a3."],
      feedback: { correct: "Excellent! You took the open diagonal to a3.", incorrect: "Move the Bishop to a3." }
    }
  ]
};

// SKILL 4: Learn the Queen
export const SKILL_QUEEN: LearningSkill = {
  id: "level-2-queen",
  title: "4. Learn the Queen",
  description: "The Queen is the most powerful piece. It combines the movement of the Rook and Bishop!",
  icon: "♕",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: ["level-2-bishop"],
  exercises: [
    {
      id: "l2-queen-1-d8",
      type: "make-move",
      title: "Queen Moves Like a Rook (Vertical)",
      explanation: ["Move the Queen on d4 straight up to d8."],
      position: { fen: "6k1/8/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Qd8+"],
      hints: ["Slide the Queen straight up to d8."],
      feedback: { correct: "Correct! Queen moved vertically like a Rook.", incorrect: "Move the Queen to d8." }
    },
    {
      id: "l2-queen-2-h4",
      type: "make-move",
      title: "Queen Moves Like a Rook (Horizontal)",
      explanation: ["Move the Queen on d4 straight right to h4."],
      position: { fen: "6k1/8/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Qh4"],
      hints: ["Slide the Queen right to h4."],
      feedback: { correct: "Correct! Queen moved horizontally like a Rook.", incorrect: "Move the Queen to h4." }
    },
    {
      id: "l2-queen-3-h8",
      type: "make-move",
      title: "Queen Moves Like a Bishop (Diagonal Up)",
      explanation: ["Move the Queen on d4 diagonally up-right to h8."],
      position: { fen: "6k1/8/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Qh8+"],
      hints: ["Slide the Queen diagonally to h8."],
      feedback: { correct: "Correct! Queen moved diagonally like a Bishop.", incorrect: "Move the Queen to h8." }
    },
    {
      id: "l2-queen-4-a1",
      type: "make-move",
      title: "Queen Moves Like a Bishop (Diagonal Down)",
      explanation: ["Move the Queen on d4 diagonally down-left to a1."],
      position: { fen: "6k1/8/8/8/3Q4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Qa1"],
      hints: ["Slide the Queen down-left to a1."],
      feedback: { correct: "Mastered! The Queen is unstoppable with Rook + Bishop powers!", incorrect: "Move the Queen to a1." }
    }
  ]
};

// SKILL 5: Learn the Knight
export const SKILL_KNIGHT: LearningSkill = {
  id: "level-2-knight",
  title: "5. Learn the Knight",
  description: "Knights move in an 'L' shape (2 squares + 1 square) and can jump over all pieces!",
  icon: "♘",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: ["level-2-queen"],
  exercises: [
    {
      id: "l2-knight-1-f5",
      type: "make-move",
      title: "Knight L-Hop to f5",
      explanation: ["Move the Knight on d4 in an L-shape to f5."],
      position: { fen: "6k1/8/8/8/3N4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Nf5"],
      hints: ["Go 2 squares right, 1 square up to f5."],
      feedback: { correct: "Correct! Knight to f5.", incorrect: "Move the Knight to f5." }
    },
    {
      id: "l2-knight-2-f3",
      type: "make-move",
      title: "Knight L-Hop to f3",
      explanation: ["Move the Knight on d4 to f3."],
      position: { fen: "6k1/8/8/8/3N4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Nf3"],
      hints: ["Go 2 squares right, 1 square down to f3."],
      feedback: { correct: "Correct! Knight to f3.", incorrect: "Move the Knight to f3." }
    },
    {
      id: "l2-knight-3-b5",
      type: "make-move",
      title: "Knight L-Hop to b5",
      explanation: ["Move the Knight on d4 to b5."],
      position: { fen: "6k1/8/8/8/3N4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Nb5"],
      hints: ["Go 2 squares left, 1 square up to b5."],
      feedback: { correct: "Correct! Knight to b5.", incorrect: "Move the Knight to b5." }
    },
    {
      id: "l2-knight-4-jump",
      type: "make-move",
      title: "Knight Jumps Over Pieces!",
      explanation: [
        "Your Knight on d4 is surrounded by blocking pawns!",
        "Because Knights can leap over obstacles, jump over the pawns and land on f5!"
      ],
      position: { fen: "6k1/8/8/3P4/2PNP3/3P4/8/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d5", "c4", "e4", "d3"] },
      expectedMoves: ["Nf5"],
      hints: ["Knights ignore surrounding pieces.", "Leap over the pawns to f5."],
      feedback: { correct: "Awesome! Knights are the only pieces that leap over obstacles!", incorrect: "Jump the Knight over the pawns to f5." }
    }
  ]
};

// SKILL 6: Learn the Pawn
export const SKILL_PAWN: LearningSkill = {
  id: "level-2-pawn",
  title: "6. Learn the Pawn",
  description: "Pawns move forward 1 square (or 2 on first move) and capture 1 square diagonally.",
  icon: "♙",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: ["level-2-knight"],
  exercises: [
    {
      id: "l2-pawn-1-e3",
      type: "make-move",
      title: "Pawn Single Step",
      explanation: ["Move the White Pawn on e2 forward 1 square to e3."],
      position: { fen: "6k1/8/8/8/8/8/4P3/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["e3"],
      hints: ["Push the pawn 1 square to e3."],
      feedback: { correct: "Correct! Pawns move 1 square forward.", incorrect: "Move the pawn to e3." }
    },
    {
      id: "l2-pawn-2-e4",
      type: "make-move",
      title: "Pawn Double Step",
      explanation: [
        "From its starting rank, a pawn can leap 2 squares forward!",
        "Move the White Pawn on e2 two squares forward to e4."
      ],
      position: { fen: "6k1/8/8/8/8/8/4P3/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["e4"],
      hints: ["Push the pawn 2 squares to e4."],
      feedback: { correct: "Great! The initial 2-square pawn leap saves time in the opening.", incorrect: "Move the pawn 2 squares to e4." }
    },
    {
      id: "l2-pawn-3-capture",
      type: "capture-piece",
      title: "Pawn Diagonal Capture",
      explanation: [
        "Pawns move straight, but capture 1 square diagonally forward!",
        "Capture Black's pawn on d5 using your pawn on e4."
      ],
      position: { fen: "6k1/8/8/3p4/4P3/8/8/6K1 w - - 0 1", orientation: "white", targetSquare: "d5" },
      expectedMoves: ["exd5"],
      hints: ["Pawns capture diagonally.", "Take the d5 pawn with exd5."],
      feedback: { correct: "Spot on! Pawns move straight but capture diagonally.", incorrect: "Capture the d5 pawn with exd5." }
    },
    {
      id: "l2-pawn-4-black",
      type: "make-move",
      title: "Black Pawn Direction",
      explanation: [
        "Black pawns move down towards rank 1!",
        "Move the Black Pawn on e7 down two squares to e5."
      ],
      position: { fen: "6k1/4p3/8/8/8/8/8/6K1 b - - 0 1", orientation: "black" },
      expectedMoves: ["e5"],
      hints: ["Black pawns push down towards rank 1.", "Move the e7 pawn to e5."],
      feedback: { correct: "Mastered! Black pawns march down towards rank 1.", incorrect: "Move the Black pawn to e5." }
    }
  ]
};

// SKILL 7: Mixed Piece Challenge (10 Tasks requiring 8/10 to pass)
export const SKILL_PIECE_MOVEMENT_CHALLENGE: LearningSkill = {
  id: "level-2-mixed-challenge",
  title: "7. Piece Movement Challenge",
  description: "Final Level 2 Challenge! Execute 10 piece movement tasks. Score at least 8/10 to master Level 2!",
  icon: "🏆",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: ["level-2-pawn"],
  exercises: [
    {
      id: "l2-ch-1-knight",
      type: "make-move",
      title: "Task 1 of 10: Knight to c6",
      explanation: ["Move the Knight on d4 to c6."],
      position: { fen: "6k1/8/8/8/3N4/8/8/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Nc6"],
      hints: ["L-shape leap to c6."],
      feedback: { correct: "Correct!", incorrect: "Move the Knight to c6." }
    },
    {
      id: "l2-ch-2-bishop",
      type: "make-move",
      title: "Task 2 of 10: Bishop to h7",
      explanation: ["Move the Bishop on c2 diagonally to h7."],
      position: { fen: "6k1/8/8/8/8/8/2B5/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Bh7+"],
      hints: ["Slide the Bishop diagonally up-right to h7."],
      feedback: { correct: "Correct!", incorrect: "Move the Bishop to h7." }
    },
    {
      id: "l2-ch-3-rook",
      type: "make-move",
      title: "Task 3 of 10: Rook to a8",
      explanation: ["Move the Rook on a1 to a8."],
      position: { fen: "6k1/8/8/8/8/8/8/R5K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Ra8+"],
      hints: ["Slide the Rook straight up to a8."],
      feedback: { correct: "Correct!", incorrect: "Move the Rook to a8." }
    },
    {
      id: "l2-ch-4-queen",
      type: "make-move",
      title: "Task 4 of 10: Queen to e7",
      explanation: ["Move the Queen on d1 diagonally to e7."],
      position: { fen: "6k1/8/8/8/8/8/8/3Q2K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Qe7"],
      hints: ["Move the Queen to e7."],
      feedback: { correct: "Correct!", incorrect: "Move the Queen to e7." }
    },
    {
      id: "l2-ch-5-king",
      type: "make-move",
      title: "Task 5 of 10: King to f4",
      explanation: ["Move the King on e3 to f4."],
      position: { fen: "6k1/8/8/8/8/4K3/8/8 w - - 0 1", orientation: "white" },
      expectedMoves: ["Kf4"],
      hints: ["Step the King 1 square to f4."],
      feedback: { correct: "Correct!", incorrect: "Move the King to f4." }
    },
    {
      id: "l2-ch-6-pawn",
      type: "make-move",
      title: "Task 6 of 10: Pawn to e4",
      explanation: ["Move the White Pawn on e2 two squares to e4."],
      position: { fen: "6k1/8/8/8/8/8/4P3/6K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["e4"],
      hints: ["Push pawn to e4."],
      feedback: { correct: "Correct!", incorrect: "Move the pawn to e4." }
    },
    {
      id: "l2-ch-7-knight",
      type: "make-move",
      title: "Task 7 of 10: Knight to f3",
      explanation: ["Move the Knight on g1 to f3."],
      position: { fen: "6k1/8/8/8/8/8/8/4K1N1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Nf3"],
      hints: ["Move the Knight to f3."],
      feedback: { correct: "Correct!", incorrect: "Move the Knight to f3." }
    },
    {
      id: "l2-ch-8-bishop",
      type: "make-move",
      title: "Task 8 of 10: Bishop to c4",
      explanation: ["Move the Bishop on f1 to c4."],
      position: { fen: "6k1/8/8/8/8/8/8/5B1K w - - 0 1", orientation: "white" },
      expectedMoves: ["Bc4+"],
      hints: ["Move the Bishop to c4."],
      feedback: { correct: "Correct!", incorrect: "Move the Bishop to c4." }
    },
    {
      id: "l2-ch-9-rook",
      type: "make-move",
      title: "Task 9 of 10: Rook to d1",
      explanation: ["Move the Rook on h1 to d1."],
      position: { fen: "6k1/8/8/8/8/8/8/4K2R w - - 0 1", orientation: "white" },
      expectedMoves: ["Rd1"],
      hints: ["Slide the Rook to d1."],
      feedback: { correct: "Correct!", incorrect: "Move the Rook to d1." }
    },
    {
      id: "l2-ch-10-queen",
      type: "make-move",
      title: "Task 10 of 10: Queen to d4",
      explanation: ["Move the Queen on d1 up to d4."],
      position: { fen: "6k1/8/8/8/8/8/8/3Q2K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Qd4"],
      hints: ["Slide the Queen to d4."],
      feedback: { correct: "Correct!", incorrect: "Move the Queen to d4." }
    }
  ]
};

export const LEVEL_2: LearningLevel = {
  levelNumber: 2,
  title: "Level 2 — Learn the Chess Pieces",
  description: "Learn how King, Queen, Rook, Bishop, Knight, and Pawn move by physically moving them on the board.",
  skills: [
    SKILL_KING,
    SKILL_ROOK,
    SKILL_BISHOP,
    SKILL_QUEEN,
    SKILL_KNIGHT,
    SKILL_PAWN,
    SKILL_PIECE_MOVEMENT_CHALLENGE
  ]
};
