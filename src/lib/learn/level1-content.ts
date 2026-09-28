import type { LearningLevel, LearningSkill } from "./interactive-types";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
export const EMPTY_FEN = "4k3/8/8/8/8/8/8/4K3 w - - 0 1";

// SKILL 1: Find the Square
export const SKILL_FIND_SQUARE: LearningSkill = {
  id: "level-1-find-square",
  title: "1. Find the Square",
  description: "Learn to identify squares on the chessboard using files (a-h) and ranks (1-8).",
  icon: "🎯",
  category: "board-basics",
  difficulty: "beginner",
  prerequisites: [],
  exercises: [
    {
      id: "l1-s1-ex1-e4",
      type: "find-square",
      title: "Find Square e4",
      explanation: [
        "A chessboard has 8 columns called files (a-h) and 8 rows called ranks (1-8).",
        "To find square e4, find file 'e' first, then go up to rank 4.",
        "Click on the square e4 on the board below."
      ],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "e4",
      hints: [
        "Start by finding file 'e' at the bottom of the board.",
        "The file is e (the 5th column from the left).",
        "Now go up to rank 4 (the 4th row from the bottom)."
      ],
      feedback: {
        correct: "Correct! e4 is the central square on file e, rank 4.",
        incorrect: "Not quite. Look at file 'e' first, then rank 4."
      }
    },
    {
      id: "l1-s1-ex2-d5",
      type: "find-square",
      title: "Find Square d5",
      explanation: ["Find file 'd' and go up to rank 5."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "d5",
      hints: [
        "Find file 'd' (the 4th column).",
        "File d, then go up 5 ranks.",
        "Square d5 is next to e5 in the centre."
      ],
      feedback: {
        correct: "Great job! d5 is another key central square.",
        incorrect: "Not quite. Look at file 'd' and rank 5."
      }
    },
    {
      id: "l1-s1-ex3-a1",
      type: "find-square",
      title: "Find Square a1",
      explanation: ["Square a1 is the bottom-left corner from White's side."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "a1",
      hints: [
        "Look at the bottom-left corner of the board.",
        "File 'a' is the leftmost file, rank 1 is the bottom rank.",
        "Click the bottom-left dark square: a1."
      ],
      feedback: {
        correct: "Spot on! a1 is the bottom-left corner square.",
        incorrect: "Look at the bottom-left corner."
      }
    },
    {
      id: "l1-s1-ex4-h8",
      type: "find-square",
      title: "Find Square h8",
      explanation: ["Square h8 is the top-right corner square."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "h8",
      hints: [
        "Look at the top-right corner of the board.",
        "File 'h' is the rightmost file, rank 8 is the top rank.",
        "Click the top-right square: h8."
      ],
      feedback: {
        correct: "Awesome! h8 is the top-right corner square.",
        incorrect: "Look at the top-right corner square."
      }
    },
    {
      id: "l1-s1-ex5-c3",
      type: "find-square",
      title: "Find Square c3",
      explanation: ["Find file 'c' (3rd column) and rank 3 (3rd row)."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "c3",
      hints: [
        "File 'c' is the 3rd column from the left.",
        "Rank 3 is the 3rd row up from the bottom.",
        "Click square c3."
      ],
      feedback: {
        correct: "Correct! c3 is a popular development square for the knight.",
        incorrect: "Not quite. Find file c, rank 3."
      }
    },
    {
      id: "l1-s1-ex6-f7",
      type: "find-square",
      title: "Find Square f7",
      explanation: ["Find file 'f' (6th column) and rank 7 (7th row)."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "f7",
      hints: [
        "File 'f' is near the right side of the board.",
        "Rank 7 is near the top of the board.",
        "Click square f7."
      ],
      feedback: {
        correct: "Well done! f7 is famously a vulnerable pawn square in Black's camp.",
        incorrect: "Look for file f and rank 7."
      }
    },
    {
      id: "l1-s1-ex7-b6",
      type: "find-square",
      title: "Find Square b6",
      explanation: ["Find file 'b' (2nd column) and rank 6."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "b6",
      hints: [
        "File 'b' is the 2nd column from the left.",
        "Rank 6 is 3 rows from the top.",
        "Click square b6."
      ],
      feedback: {
        correct: "Perfect! b6 is on file b, rank 6.",
        incorrect: "Find file b, rank 6."
      }
    },
    {
      id: "l1-s1-ex8-g2",
      type: "find-square",
      title: "Find Square g2",
      explanation: ["Find file 'g' (7th column) and rank 2."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "g2",
      hints: [
        "File 'g' is near the right side.",
        "Rank 2 is the 2nd row from the bottom.",
        "Click square g2."
      ],
      feedback: {
        correct: "Excellent! g2 is the home square for White's g-pawn.",
        incorrect: "Find file g, rank 2."
      }
    }
  ]
};

// SKILL 2: Chess Coordinates
export const SKILL_COORDINATES: LearningSkill = {
  id: "level-1-coordinates",
  title: "2. Chess Coordinates",
  description: "Master fast square identification by combining FILE (letter) + RANK (number).",
  icon: "📍",
  category: "board-basics",
  difficulty: "beginner",
  prerequisites: ["level-1-find-square"],
  exercises: [
    {
      id: "l1-s2-ex1-c6",
      type: "identify-square",
      title: "Locate Coordinate: c6",
      explanation: ["Click square c6 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "c6",
      hints: ["Find column c, row 6.", "c is column 3, 6 is row 6."],
      feedback: { correct: "Correct! c6 located.", incorrect: "Try again. Column c, row 6." }
    },
    {
      id: "l1-s2-ex2-g4",
      type: "identify-square",
      title: "Locate Coordinate: g4",
      explanation: ["Click square g4 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "g4",
      hints: ["Find column g, row 4.", "g is column 7, 4 is row 4."],
      feedback: { correct: "Correct! g4 located.", incorrect: "Try again. Column g, row 4." }
    },
    {
      id: "l1-s2-ex3-b2",
      type: "identify-square",
      title: "Locate Coordinate: b2",
      explanation: ["Click square b2 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "b2",
      hints: ["Find column b, row 2.", "b is column 2, 2 is row 2."],
      feedback: { correct: "Correct! b2 located.", incorrect: "Try again. Column b, row 2." }
    },
    {
      id: "l1-s2-ex4-e7",
      type: "identify-square",
      title: "Locate Coordinate: e7",
      explanation: ["Click square e7 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "e7",
      hints: ["Find column e, row 7.", "e is column 5, 7 is row 7."],
      feedback: { correct: "Correct! e7 located.", incorrect: "Try again. Column e, row 7." }
    },
    {
      id: "l1-s2-ex5-f3",
      type: "identify-square",
      title: "Locate Coordinate: f3",
      explanation: ["Click square f3 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "f3",
      hints: ["Find column f, row 3.", "f is column 6, 3 is row 3."],
      feedback: { correct: "Correct! f3 located.", incorrect: "Try again. Column f, row 3." }
    }
  ]
};

// SKILL 3: White and Black Sides
export const SKILL_WHITE_BLACK: LearningSkill = {
  id: "level-1-white-black",
  title: "3. White and Black Sides",
  description: "Learn piece starting ranks: White on ranks 1-2, Black on ranks 7-8.",
  icon: "♔",
  category: "board-basics",
  difficulty: "beginner",
  prerequisites: ["level-1-coordinates"],
  exercises: [
    {
      id: "l1-s3-ex1-wking",
      type: "find-square",
      title: "White King Starting Square",
      explanation: [
        "White pieces start on ranks 1 and 2.",
        "White's King always starts on the e1 square.",
        "Click the square where White's King starts."
      ],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "e1",
      hints: ["Look at rank 1 (bottom row).", "The White King is on e1."],
      feedback: { correct: "Correct! White's King starts on e1.", incorrect: "Click square e1." }
    },
    {
      id: "l1-s3-ex2-bking",
      type: "find-square",
      title: "Black King Starting Square",
      explanation: [
        "Black pieces start on ranks 7 and 8.",
        "Black's King always starts on the e8 square.",
        "Click the square where Black's King starts."
      ],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "e8",
      hints: ["Look at rank 8 (top row).", "The Black King is on e8."],
      feedback: { correct: "Correct! Black's King starts on e8.", incorrect: "Click square e8." }
    },
    {
      id: "l1-s3-ex3-wqueen",
      type: "find-square",
      title: "White Queen Starting Square",
      explanation: [
        "The Queen always starts on her own colour!",
        "White Queen starts on the light square d1.",
        "Click the square where White's Queen starts."
      ],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "d1",
      hints: ["White Queen on light square d1.", "Click square d1."],
      feedback: { correct: "Correct! White Queen starts on d1.", incorrect: "Click square d1." }
    },
    {
      id: "l1-s3-ex4-bqueen",
      type: "find-square",
      title: "Black Queen Starting Square",
      explanation: [
        "Black Queen starts on her own colour — the dark square d8.",
        "Click the square where Black's Queen starts."
      ],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "d8",
      hints: ["Black Queen on dark square d8.", "Click square d8."],
      feedback: { correct: "Correct! Black Queen starts on d8.", incorrect: "Click square d8." }
    },
    {
      id: "l1-s3-ex5-wrooks",
      type: "find-square",
      title: "White Rooks Starting Squares",
      explanation: ["Rooks start in the corners! Click either square where a White Rook starts (a1 or h1)."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquares: ["a1", "h1"],
      hints: ["Rooks start in the corners on rank 1.", "Click a1 or h1."],
      feedback: { correct: "Correct! White Rooks start in corners a1 and h1.", incorrect: "Click a1 or h1." }
    },
    {
      id: "l1-s3-ex6-brooks",
      type: "find-square",
      title: "Black Rooks Starting Squares",
      explanation: ["Black Rooks start in the corners on rank 8 (a8 or h8)."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquares: ["a8", "h8"],
      hints: ["Black Rooks start in top corners.", "Click a8 or h8."],
      feedback: { correct: "Correct! Black Rooks start in corners a8 and h8.", incorrect: "Click a8 or h8." }
    }
  ]
};

// SKILL 4: Board Orientation
export const SKILL_BOARD_ORIENTATION: LearningSkill = {
  id: "level-1-board-orientation",
  title: "4. Board Orientation & Flipping",
  description: "Understand White and Black perspectives and board flipping.",
  icon: "🔄",
  category: "board-basics",
  difficulty: "beginner",
  prerequisites: ["level-1-white-black"],
  exercises: [
    {
      id: "l1-s4-ex1-white-e4",
      type: "find-square",
      title: "White Perspective: Find e4",
      explanation: ["With White at the bottom, click square e4."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "e4",
      hints: ["White is at the bottom. e4 is on the 4th rank."],
      feedback: { correct: "Correct! e4 with White at bottom.", incorrect: "Click e4." }
    },
    {
      id: "l1-s4-ex2-black-e4",
      type: "find-square",
      title: "Flipped Board (Black Perspective): Find e4",
      explanation: [
        "The board is now flipped! Black is at the bottom.",
        "Coordinates stay fixed: file e is still file e. Find square e4!"
      ],
      position: { fen: START_FEN, orientation: "black" },
      targetSquare: "e4",
      hints: ["Black is at the bottom now. e4 is 5 ranks up from Black's side."],
      feedback: { correct: "Excellent! Notice how coordinates remain exact even when flipped.", incorrect: "Look for file e, rank 4." }
    },
    {
      id: "l1-s4-ex3-black-d5",
      type: "find-square",
      title: "Black Perspective: Find d5",
      explanation: ["With Black at the bottom, find square d5."],
      position: { fen: START_FEN, orientation: "black" },
      targetSquare: "d5",
      hints: ["Find file d and rank 5."],
      feedback: { correct: "Correct! d5 located from Black's perspective.", incorrect: "Click d5." }
    },
    {
      id: "l1-s4-ex4-white-d5",
      type: "find-square",
      title: "White Perspective: Find d5",
      explanation: ["Flipped back to White at bottom. Find square d5."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "d5",
      hints: ["White at bottom. File d, rank 5."],
      feedback: { correct: "Spot on! You have mastered board orientation.", incorrect: "Click d5." }
    }
  ]
};

// SKILL 5: Starting Position Setup
export const SKILL_STARTING_POSITION: LearningSkill = {
  id: "level-1-starting-position",
  title: "5. The Starting Position",
  description: "Recognise piece arrangements and home squares.",
  icon: "♟️",
  category: "board-basics",
  difficulty: "beginner",
  prerequisites: ["level-1-board-orientation"],
  exercises: [
    {
      id: "l1-s5-ex1-wking",
      type: "find-square",
      title: "Where does the White King start?",
      explanation: ["Click the square occupied by White's King at the start of a game."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "e1",
      hints: ["Look at the e1 square."],
      feedback: { correct: "Correct! e1 is the White King's starting square.", incorrect: "Click e1." }
    },
    {
      id: "l1-s5-ex2-bqueen",
      type: "find-square",
      title: "Where does the Black Queen start?",
      explanation: ["Click the square occupied by Black's Queen."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "d8",
      hints: ["Look at the d8 square."],
      feedback: { correct: "Correct! d8 is the Black Queen's starting square.", incorrect: "Click d8." }
    },
    {
      id: "l1-s5-ex3-b1-piece",
      type: "find-square",
      title: "Which piece starts on b1?",
      explanation: ["Click the piece on b1 at the start of the game."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "b1",
      hints: ["b1 is between a1 (Rook) and c1 (Bishop).", "Click the White Knight on b1."],
      feedback: { correct: "Correct! White's Queenside Knight starts on b1.", incorrect: "Click square b1." }
    },
    {
      id: "l1-s5-ex4-g8-piece",
      type: "find-square",
      title: "Which piece starts on g8?",
      explanation: ["Click the piece on g8 at the start of the game."],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "g8",
      hints: ["g8 is on Black's back rank.", "Click the Black Knight on g8."],
      feedback: { correct: "Correct! Black's Kingside Knight starts on g8.", incorrect: "Click square g8." }
    },
    {
      id: "l1-s5-ex5-wbishop",
      type: "find-square",
      title: "White Light-Squared Bishop",
      explanation: ["Where does White's Kingside Bishop start?"],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "f1",
      hints: ["Look at f1 next to the King on e1."],
      feedback: { correct: "Correct! f1 is White's Kingside Bishop square.", incorrect: "Click f1." }
    },
    {
      id: "l1-s5-ex6-bbishop",
      type: "find-square",
      title: "Black Dark-Squared Bishop",
      explanation: ["Where does Black's Kingside Bishop start?"],
      position: { fen: START_FEN, orientation: "white" },
      targetSquare: "f8",
      hints: ["Look at f8 next to the King on e8."],
      feedback: { correct: "Correct! f8 is Black's Kingside Bishop square.", incorrect: "Click f8." }
    }
  ]
};

// SKILL 6: Board Master Challenge (10 Task Challenge requiring 8/10 to pass)
export const SKILL_BOARD_MASTER_CHALLENGE: LearningSkill = {
  id: "level-1-board-master",
  title: "6. Board Master Challenge",
  description: "Final Level 1 Challenge! Complete 10 square identification tasks. Score at least 8/10 to master Level 1!",
  icon: "🏆",
  category: "board-basics",
  difficulty: "beginner",
  prerequisites: ["level-1-starting-position"],
  exercises: [
    {
      id: "l1-ch-1-e4",
      type: "board-challenge",
      title: "Task 1 of 10: Find e4",
      explanation: ["Click square e4 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "e4",
      hints: ["File e, Rank 4."],
      feedback: { correct: "Correct! e4 found.", incorrect: "Incorrect! Move to next task." }
    },
    {
      id: "l1-ch-2-c7",
      type: "board-challenge",
      title: "Task 2 of 10: Find c7",
      explanation: ["Click square c7 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "c7",
      hints: ["File c, Rank 7."],
      feedback: { correct: "Correct! c7 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-3-h2",
      type: "board-challenge",
      title: "Task 3 of 10: Find h2",
      explanation: ["Click square h2 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "h2",
      hints: ["File h, Rank 2."],
      feedback: { correct: "Correct! h2 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-4-a8",
      type: "board-challenge",
      title: "Task 4 of 10: Find a8",
      explanation: ["Click square a8 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "a8",
      hints: ["Top-left corner a8."],
      feedback: { correct: "Correct! a8 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-5-f5",
      type: "board-challenge",
      title: "Task 5 of 10: Find f5",
      explanation: ["Click square f5 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "f5",
      hints: ["File f, Rank 5."],
      feedback: { correct: "Correct! f5 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-6-d1",
      type: "board-challenge",
      title: "Task 6 of 10: Find d1",
      explanation: ["Click square d1 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "d1",
      hints: ["File d, Rank 1 (White Queen square)."],
      feedback: { correct: "Correct! d1 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-7-b6",
      type: "board-challenge",
      title: "Task 7 of 10: Find b6",
      explanation: ["Click square b6 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "b6",
      hints: ["File b, Rank 6."],
      feedback: { correct: "Correct! b6 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-8-g8",
      type: "board-challenge",
      title: "Task 8 of 10: Find g8",
      explanation: ["Click square g8 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "g8",
      hints: ["File g, Rank 8."],
      feedback: { correct: "Correct! g8 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-9-a3",
      type: "board-challenge",
      title: "Task 9 of 10: Find a3",
      explanation: ["Click square a3 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "a3",
      hints: ["File a, Rank 3."],
      feedback: { correct: "Correct! a3 found.", incorrect: "Incorrect!" }
    },
    {
      id: "l1-ch-10-h7",
      type: "board-challenge",
      title: "Task 10 of 10: Find h7",
      explanation: ["Click square h7 on the board."],
      position: { fen: EMPTY_FEN, orientation: "white" },
      targetSquare: "h7",
      hints: ["File h, Rank 7."],
      feedback: { correct: "Correct! h7 found.", incorrect: "Incorrect!" }
    }
  ]
};

export const LEVEL_1: LearningLevel = {
  levelNumber: 1,
  title: "Level 1 — Learn the Chessboard",
  description: "Master files, ranks, coordinates, board orientation, and starting piece setups.",
  skills: [
    SKILL_FIND_SQUARE,
    SKILL_COORDINATES,
    SKILL_WHITE_BLACK,
    SKILL_BOARD_ORIENTATION,
    SKILL_STARTING_POSITION,
    SKILL_BOARD_MASTER_CHALLENGE
  ]
};
