import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: Control the Center
export const SKILL_CONTROL_CENTER: LearningSkill = {
  id: "level-6-control-center",
  title: "1. Control the Center",
  description: "Learn why controlling the central squares (e4, d4, e5, d5) is the foundation of practical chess strategy.",
  icon: "🎯",
  category: "openings",
  difficulty: "beginner",
  prerequisites: [],
  exercises: [
    {
      id: "l6-cntr-1-e4",
      type: "make-move",
      title: "Claim the Center with 1.e4",
      explanation: [
        "The central squares e4, d4, e5, and d5 are the most valuable real estate on the board.",
        "Playing 1.e4 immediately controls d5 and f5 while opening pathways for your Queen and light-squared Bishop.",
        "Push your King's pawn two squares forward to e4!"
      ],
      position: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["e4"],
      hints: ["Move your pawn from e2 to e4.", "Click e2, then e4."],
      feedback: {
        correct: "Great job! 1.e4 claims central space and opens lines for rapid piece development.",
        incorrect: "Push the e-pawn two squares to e4."
      }
    },
    {
      id: "l6-cntr-2-d4",
      type: "make-move",
      title: "Control Central Squares with 1.d4",
      explanation: [
        "1.d4 is another world-class opening move. It claims e5 and c5 in the center.",
        "Unlike e4, the d4 pawn is immediately protected by the White Queen on d1.",
        "Play 1.d4 to stake your claim in the center!"
      ],
      position: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", orientation: "white", highlightSquares: ["d4", "e5"] },
      expectedMoves: ["d4"],
      hints: ["Move your d2 pawn to d4.", "Click d2 then d4."],
      feedback: {
        correct: "Excellent! 1.d4 controls vital central squares and opens the diagonal for your dark-squared Bishop.",
        incorrect: "Move the pawn from d2 to d4."
      }
    },
    {
      id: "l6-cntr-3-black-center",
      type: "make-move",
      title: "Respond in the Center as Black",
      explanation: [
        "White opened with 1.e4 taking control of d5.",
        "As Black, you must fight for equal central territory instead of making passive wing moves.",
        "Play 1...e5 to meet White's center pawn head-on!"
      ],
      position: { fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", orientation: "black", highlightSquares: ["e5", "d4"] },
      expectedMoves: ["e5"],
      hints: ["Move Black's e7 pawn to e5."],
      feedback: {
        correct: "Spot on! 1...e5 prevents White from taking full control with d4 and opens lines for Black's pieces.",
        incorrect: "Push the e7 pawn to e5."
      }
    },
    {
      id: "l6-cntr-4-choice",
      type: "choose-move",
      title: "Central Pawn vs Flank Pawn Move",
      explanation: [
        "Both players have placed a pawn in the center (1.e4 e5).",
        "Compare White's candidates: fight for central dominance or make an unnecessary flank pawn move.",
        "Which move follows opening principles best?"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white" },
      options: [
        {
          id: "opt-d4",
          moveSan: "d4",
          label: "d4 — Challenge Black's center pawn",
          explanation: "Fights directly for the center and opens diagonals for both Bishops.",
          isCorrect: true
        },
        {
          id: "opt-a3",
          moveSan: "a3",
          label: "a3 — Push a wing pawn",
          explanation: "Does not control central squares and wastes valuable opening time.",
          isCorrect: false
        },
        {
          id: "opt-h3",
          moveSan: "h3",
          label: "h3 — Push a flank pawn",
          explanation: "Ignores the center entirely and fails to develop a piece.",
          isCorrect: false
        }
      ],
      hints: ["Look for the move that directly challenges central squares."],
      feedback: {
        correct: "Correct! Playing d4 challenges Black's e5 pawn directly and opens paths for development.",
        incorrect: "Try again. Flank pawn moves like a3 or h3 do not control the center."
      }
    }
  ]
};

// SKILL 2: Develop Your Pieces
export const SKILL_DEVELOP_PIECES: LearningSkill = {
  id: "level-6-develop-pieces",
  title: "2. Develop Your Pieces",
  description: "Get your Knights and Bishops off the back rank and into active, central squares quickly.",
  icon: "🐴",
  category: "openings",
  difficulty: "beginner",
  prerequisites: ["level-6-control-center"],
  exercises: [
    {
      id: "l6-dev-1-knight",
      type: "make-move",
      title: "Develop a Knight Toward the Center",
      explanation: [
        "Knights should be developed before Bishops in most openings because they control key central squares from f3 or c3.",
        "After 1.e4 e5, White's Knight on g1 can leap to f3, attacking Black's e5 pawn and preparing castling.",
        "Play Nf3 to develop your Knight!"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Nf3"],
      hints: ["Move your Knight on g1 to f3."],
      feedback: {
        correct: "Awesome! Nf3 develops a minor piece, attacks e5, and prepares Kingside castling.",
        incorrect: "Move your Knight from g1 to f3."
      }
    },
    {
      id: "l6-dev-2-bishop",
      type: "make-move",
      title: "Develop Your Bishop to an Active Square",
      explanation: [
        "Now that your Knight is developed and Black defended with 2...Nc6, bring out your Bishop!",
        "Bc4 places the Bishop on an active diagonal, targeting Black's weak f7 pawn.",
        "Move your Bishop on f1 to c4!"
      ],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white", highlightSquares: ["c4", "f7"] },
      expectedMoves: ["Bc4"],
      hints: ["Slide the f1 Bishop to c4."],
      feedback: {
        correct: "Perfect! 3.Bc4 (Italian Game) develops the Bishop actively and points right at Black's f7 square.",
        incorrect: "Move your Bishop from f1 to c4."
      }
    },
    {
      id: "l6-dev-3-black-knight",
      type: "make-move",
      title: "Develop Black's Knight to Defend e5",
      explanation: [
        "White just played 2.Nf3, attacking your e5 pawn.",
        "Instead of pushing pawns, defend e5 by developing a piece: play 2...Nc6!",
        "Develop your Knight from b8 to c6!"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", orientation: "black", highlightSquares: ["c6", "e5"] },
      expectedMoves: ["Nc6"],
      hints: ["Move the b8 Knight to c6."],
      feedback: {
        correct: "Great defense! 2...Nc6 defends e5 while bringing a key minor piece into the game.",
        incorrect: "Move Black's Knight from b8 to c6."
      }
    },
    {
      id: "l6-dev-4-find-target",
      type: "find-square",
      title: "Identify the Undeveloped Piece",
      explanation: [
        "White has played 1.e4, 2.Nf3, and 3.Bc4. Look at White's back rank.",
        "Which square holds the dark-squared Bishop that has NOT been developed yet?"
      ],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", orientation: "white" },
      targetSquare: "c1",
      targetSquares: ["c1"],
      hints: ["Look at the original starting square of White's dark-squared Bishop."],
      feedback: {
        correct: "Correct! The Bishop on c1 is still sitting on its home square, waiting to be developed.",
        incorrect: "Click square c1 where White's undeveloped dark-squared Bishop stands."
      }
    }
  ]
};

// SKILL 3: Castle Early
export const SKILL_CASTLE_EARLY: LearningSkill = {
  id: "level-6-castle-early",
  title: "3. Castle Early",
  description: "Protect your King behind a wall of pawns and activate your Rook in a single move.",
  icon: "🏰",
  category: "openings",
  difficulty: "beginner",
  prerequisites: ["level-6-develop-pieces"],
  exercises: [
    {
      id: "l6-cst-1-kingside",
      type: "make-move",
      title: "Perform Kingside Castling (O-O)",
      explanation: [
        "Keeping your King in the center makes it a target for enemy attacks once lines open up.",
        "Castling Kingside moves your King to g1 and brings your Rook to f1 where it can enter the battle.",
        "Castle Kingside by moving your King from e1 to g1!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5", orientation: "white", highlightSquares: ["e1", "g1"] },
      expectedMoves: ["O-O"],
      hints: ["Move your King 2 squares to the right (to g1)."],
      feedback: {
        correct: "Excellent! Your King is safe behind pawns on g1, and your f1 Rook is ready to fight.",
        incorrect: "Move your King from e1 to g1 to castle Kingside."
      }
    },
    {
      id: "l6-cst-2-blocked",
      type: "make-move",
      title: "Clear the Path to Castle",
      explanation: [
        "You cannot castle if pieces stand between the King and the Rook.",
        "White wants to castle Kingside, but the Knight is sitting on f3... wait! In this position, the Knight on g1 needs to develop to f3.",
        "Move your Knight to f3 so the path between e1 and h1 will be clear for castling next!"
      ],
      position: { fen: "r1bqk1nr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 4", orientation: "white", highlightSquares: ["g1", "f3"] },
      expectedMoves: ["Nf3"],
      hints: ["Develop the Knight from g1 to f3."],
      feedback: {
        correct: "Good! Now that f3 and g1 are clear, White is ready to castle on the next move.",
        incorrect: "Move your Knight from g1 to f3 to clear the back rank."
      }
    },
    {
      id: "l6-cst-3-illegal-check",
      type: "choose-move",
      title: "Identify Legal Response When in Check",
      explanation: [
        "CRITICAL RULE: You CANNOT castle while your King is in check!",
        "Black just played 3...Bb4+, placing White's King in check.",
        "Castling right now is illegal. How should White resolve the check?"
      ],
      position: { fen: "r1bqk1nr/pppp1ppp/2n5/4p3/1b2P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", orientation: "white" },
      options: [
        {
          id: "opt-c3",
          moveSan: "c3",
          label: "c3 — Block the check with a pawn",
          explanation: "Blocks the check legally while attacking the Black Bishop on b4!",
          isCorrect: true
        },
        {
          id: "opt-oo",
          moveSan: "O-O",
          label: "O-O — Castle Kingside",
          explanation: "Illegal! You cannot castle while in check.",
          isCorrect: false
        },
        {
          id: "opt-a3",
          moveSan: "a3",
          label: "a3 — Attack the bishop without blocking check",
          explanation: "Illegal! Does not escape or block the check on e1.",
          isCorrect: false
        }
      ],
      hints: ["Select c3 to block the check legally."],
      feedback: {
        correct: "Correct! Playing c3 blocks the check from Bb4. Once check is resolved, you can castle later.",
        incorrect: "Castling is illegal while in check. Choose c3 to block the check."
      }
    },
    {
      id: "l6-cst-4-black-castle",
      type: "make-move",
      title: "Secure the Black King",
      explanation: [
        "White has castled and has an active position. Black must prioritize King safety immediately.",
        "Castle Kingside with Black to secure your King on g8!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5", orientation: "black", highlightSquares: ["e8", "g8"] },
      expectedMoves: ["O-O"],
      hints: ["Move Black's King from e8 to g8."],
      feedback: {
        correct: "Perfect! Black's King is tucked away safely, and both players have secured their Kings early.",
        incorrect: "Move Black's King two squares right to g8."
      }
    }
  ]
};

// SKILL 4: Connect the Rooks
export const SKILL_CONNECT_ROOKS: LearningSkill = {
  id: "level-6-connect-rooks",
  title: "4. Connect the Rooks",
  description: "Complete your opening development by clearing the back rank so your Rooks guard each other.",
  icon: "🔗",
  category: "openings",
  difficulty: "beginner",
  prerequisites: ["level-6-castle-early"],
  exercises: [
    {
      id: "l6-rnk-1-queen-move",
      type: "make-move",
      title: "Develop the Queen to Connect the Rooks",
      explanation: [
        "Connecting your Rooks means clearing every piece off the rank between them.",
        "Here, White has developed Knights, Bishops, and castled. Only the Queen remains on d1.",
        "Play 8.Qe2 to move the Queen off d1 and connect your Rooks on a1 and f1!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 1 7", orientation: "white", highlightSquares: ["d1", "e2"] },
      expectedMoves: ["Qe2"],
      hints: ["Move your Queen from d1 to e2."],
      feedback: {
        correct: "Brilliant! By playing Qe2, the back rank is clear and your Rooks now connect and defend each other.",
        incorrect: "Move your Queen from d1 to e2."
      }
    },
    {
      id: "l6-rnk-2-bishop-move",
      type: "make-move",
      title: "Complete Minor Piece Development",
      explanation: [
        "White has castled and moved the Queen, but the dark-squared Bishop still sits on c1 blocking the a1 Rook.",
        "Play Be3 to develop your last minor piece and clear the square for Rook connection!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1QPPP/R1B2RK1 w - - 2 8", orientation: "white", highlightSquares: ["c1", "e3"] },
      expectedMoves: ["Be3"],
      hints: ["Move your c1 Bishop to e3."],
      feedback: {
        correct: "Excellent! Developing Be3 completes all minor piece development and unites the Rooks.",
        incorrect: "Move your dark-squared Bishop from c1 to e3."
      }
    },
    {
      id: "l6-rnk-3-identify-blocker",
      type: "find-square",
      title: "Identify What Prevents Rook Connection",
      explanation: [
        "White has castled Kingside, but the Rooks on a1 and f1 cannot talk to each other yet.",
        "Click the square of the dark-squared Bishop that is currently standing between the Rooks!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 1 7", orientation: "white" },
      targetSquare: "c1",
      targetSquares: ["c1"],
      hints: ["Look at c1 on the back rank."],
      feedback: {
        correct: "Correct! The Bishop on c1 blocks communication between the a1 and f1 Rooks.",
        incorrect: "Click the c1 square where the undeveloped Bishop sits."
      }
    },
    {
      id: "l6-rnk-4-full-connection",
      type: "make-move",
      title: "Final Step of Opening Development",
      explanation: [
        "You have developed all 4 minor pieces and castled.",
        "Make the final move (Qe2) to complete your full opening setup!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 2 8", orientation: "white", highlightSquares: ["d1", "e2"] },
      expectedMoves: ["Qe2"],
      hints: ["Move Queen to e2."],
      feedback: {
        correct: "Masterful! Your opening phase is complete: Center controlled, pieces developed, King safe, Rooks connected.",
        incorrect: "Move Queen from d1 to e2."
      }
    }
  ]
};

// SKILL 5: Don't Move the Queen Too Early
export const SKILL_QUEEN_EARLY: LearningSkill = {
  id: "level-6-queen-early",
  title: "5. Don't Move the Queen Too Early",
  description: "Understand why early Queen sorties waste precious time and make your most valuable piece a target.",
  icon: "👑",
  category: "openings",
  difficulty: "intermediate",
  prerequisites: ["level-6-connect-rooks"],
  exercises: [
    {
      id: "l6-qn-1-punish-early-q",
      type: "make-move",
      title: "Punish an Early Queen Move",
      explanation: [
        "White brought the Queen out on move 2 (2.Qh5), hoping for a cheap attack.",
        "Do NOT panic! Defend your e5 pawn while developing a piece: play 2...Nc6!",
        "Develop your Knight from b8 to c6!"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2", orientation: "black", highlightSquares: ["c6", "e5"] },
      expectedMoves: ["Nc6"],
      hints: ["Develop Black's Knight from b8 to c6."],
      feedback: {
        correct: "Great move! 2...Nc6 defends e5 and develops a piece, making White's early Qh5 move look foolish.",
        incorrect: "Move Knight from b8 to c6 to defend e5."
      }
    },
    {
      id: "l6-qn-2-gain-tempo",
      type: "make-move",
      title: "Gain a Tempo on the Early Queen",
      explanation: [
        "After 2.Qh5 Nc6 3.Bc4 g6 4.Qf3, White's Queen is still hovering around.",
        "Develop your Knight to f6, attacking White's central space and blocking White's threat while gaining development!",
        "Play 4...Nf6!"
      ],
      position: { fen: "r1bqkbnr/pppp1p1p/2n3p1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 1 4", orientation: "black", highlightSquares: ["f6"] },
      expectedMoves: ["Nf6"],
      hints: ["Develop Black's Knight from g8 to f6."],
      feedback: {
        correct: "Awesome! 4...Nf6 develops a piece, defends f7, and prepares castling while White wasted 2 Queen moves.",
        incorrect: "Move Knight from g8 to f6."
      }
    },
    {
      id: "l6-qn-3-avoid-mistake",
      type: "choose-move",
      title: "Choose Development Over Early Queen Rush",
      explanation: [
        "You are White after 1.e4 e5. You have three candidate moves.",
        "Which move follows sound opening principles?"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white" },
      options: [
        {
          id: "opt-nf3-q",
          moveSan: "Nf3",
          label: "Nf3 — Develop Knight toward center",
          explanation: "Develops a minor piece, attacks e5, and prepares early castling.",
          isCorrect: true
        },
        {
          id: "opt-qh5",
          moveSan: "Qh5",
          label: "Qh5 — Launch Queen to attack e5",
          explanation: "Violates principles! Exposes the Queen to attacks and loses tempi.",
          isCorrect: false
        },
        {
          id: "opt-qf3",
          moveSan: "Qf3",
          label: "Qf3 — Bring Queen out early",
          explanation: "Blocks the natural f3 square for your Knight and wastes early development time.",
          isCorrect: false
        }
      ],
      hints: ["Choose Nf3 to develop minor pieces first."],
      feedback: {
        correct: "Correct! Nf3 develops a minor piece efficiently without exposing the Queen.",
        incorrect: "Early Queen moves allow the opponent to develop with tempo. Choose Nf3!"
      }
    },
    {
      id: "l6-qn-4-useful-qa5",
      type: "make-move",
      title: "Tactical Exception: The Counter-Check Qa5+",
      explanation: [
        "While early Queen moves are usually bad, tactical exceptions exist!",
        "When White's d-file is open and King remains on e1, Black can play Qa5+ checking the King while creating double attacks!",
        "Play Qa5+ as Black!"
      ],
      position: { fen: "r1bqkbnr/pp2pppp/2n5/2pp4/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 4", orientation: "black", highlightSquares: ["a5", "e1"] },
      expectedMoves: ["Qa5+"],
      hints: ["Move Queen from d8 to a5."],
      feedback: {
        correct: "Well done! Qa5+ is a strong tactical check that forces White to defend while Black gains activity.",
        incorrect: "Move Black's Queen from d8 to a5 to give check."
      }
    }
  ]
};

// SKILL 6: Don't Move the Same Piece Repeatedly
export const SKILL_REPEATED_MOVES: LearningSkill = {
  id: "level-6-repeated-moves",
  title: "6. Don't Move the Same Piece Repeatedly",
  description: "Move each piece once in the opening until all your forces are mobilized. Don't waste time (tempi).",
  icon: "⏳",
  category: "openings",
  difficulty: "intermediate",
  prerequisites: ["level-6-queen-early"],
  exercises: [
    {
      id: "l6-rpt-1-best-dev",
      type: "make-move",
      title: "Develop a New Piece Instead of Repeating",
      explanation: [
        "White has played 1.e4 e5 2.Nf3 Nc6. Your Knight is already developed on f3.",
        "Do NOT move the f3 Knight a second time (like Ng5). Instead, bring out a NEW piece!",
        "Play 3.Nc3 to develop your Queen's Knight!"
      ],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white", highlightSquares: ["c3"] },
      expectedMoves: ["Nc3"],
      hints: ["Move your b1 Knight to c3."],
      feedback: {
        correct: "Great decision! 3.Nc3 (Three Knights Game) mobilizes a new piece instead of wasting moves with an already developed one.",
        incorrect: "Move your b1 Knight to c3."
      }
    },
    {
      id: "l6-rpt-2-punish-repeater",
      type: "make-move",
      title: "Punish Opponent's Repeated Movements",
      explanation: [
        "In the Alekhine Defense (1.e4 Nf6 2.e5 Nd5), Black moved the Knight TWICE in the first two moves.",
        "Take advantage of Black's lost time by occupying the center with 3.d4!",
        "Push your pawn to d4!"
      ],
      position: { fen: "rnbqkb1r/pppppppp/8/3nP3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 3", orientation: "white", highlightSquares: ["d4"] },
      expectedMoves: ["d4"],
      hints: ["Push the d2 pawn to d4."],
      feedback: {
        correct: "Dominant! Pushing d4 creates a massive White pawn center while Black spent moves running around with one Knight.",
        incorrect: "Move your d-pawn to d4."
      }
    },
    {
      id: "l6-rpt-3-avoid-wasting",
      type: "choose-move",
      title: "Avoid Moving a Developed Knight Twice",
      explanation: [
        "Position after 1.e4 e5 2.Nf3 Nc6.",
        "Which candidate move follows the rule: 'Develop new pieces instead of repeating moves'?"
      ],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white" },
      options: [
        {
          id: "opt-bc4-rep",
          moveSan: "Bc4",
          label: "Bc4 — Develop the light-squared Bishop",
          explanation: "Brings a fresh minor piece into play and prepares early castling.",
          isCorrect: true
        },
        {
          id: "opt-ng5-rep",
          moveSan: "Ng5",
          label: "Ng5 — Move the f3 Knight again",
          explanation: "Premature attack! Moves the same piece twice before White has castled or developed other pieces.",
          isCorrect: false
        },
        {
          id: "opt-h3-rep",
          moveSan: "h3",
          label: "h3 — Push a side pawn",
          explanation: "Passive move that fails to develop any new piece.",
          isCorrect: false
        }
      ],
      hints: ["Select Bc4 to bring out your Bishop."],
      feedback: {
        correct: "Correct! Bc4 develops a second minor piece and moves closer to castling.",
        incorrect: "Moving Ng5 early wastes time. Choose Bc4 to develop a new piece!"
      }
    },
    {
      id: "l6-rpt-4-tempo-punishment",
      type: "make-move",
      title: "Seize the Center Against Passive Play",
      explanation: [
        "Black has played 1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d4... wait!",
        "In this position after 1.e4 e5 2.Nf3 Nf6, Black offered the Petroff.",
        "Play 3.d4 to strike at the center and gain space!"
      ],
      position: { fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white", highlightSquares: ["d4"] },
      expectedMoves: ["d4"],
      hints: ["Move d2 pawn to d4."],
      feedback: {
        correct: "Solid! 3.d4 opens the game and fights for full central superiority.",
        incorrect: "Move pawn to d4."
      }
    }
  ]
};

// SKILL 7: Opening Mistakes & Practical Mini Trainer
export const SKILL_OPENING_MISTAKES: LearningSkill = {
  id: "level-6-opening-mistakes",
  title: "7. Opening Mistakes & Practical Mini Trainer",
  description: "Recognize common beginner blunders (pawn pushing, early Queen, ignoring safety) and learn practical principle-based responses.",
  icon: "🧠",
  category: "openings",
  difficulty: "intermediate",
  prerequisites: ["level-6-repeated-moves"],
  exercises: [
    {
      id: "l6-mstk-1-too-many-pawns",
      type: "choose-move",
      title: "Avoid Moving Too Many Pawns",
      explanation: [
        "Beginners often push 4 or 5 pawns in a row (a3, h3, c3, f3) while leaving all Knights and Bishops on the back rank.",
        "After 1.e4 e5, what is the best move for White?"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white" },
      options: [
        {
          id: "opt-nf3-pwn",
          moveSan: "Nf3",
          label: "Nf3 — Develop Knight toward center",
          explanation: "Develops a piece, attacks e5, and prepares castling.",
          isCorrect: true
        },
        {
          id: "opt-a3-pwn",
          moveSan: "a3",
          label: "a3 — Push edge pawn",
          explanation: "Wastes a move. Does not control center or develop pieces.",
          isCorrect: false
        },
        {
          id: "opt-h3-pwn",
          moveSan: "h3",
          label: "h3 — Push flank pawn",
          explanation: "Unnecessary pawn move that ignores piece development.",
          isCorrect: false
        }
      ],
      hints: ["Choose Nf3 to develop your knight."],
      feedback: {
        correct: "Correct! Moving pawns without developing pieces leaves you vulnerable to fast attacks.",
        incorrect: "Avoid pushing edge pawns early. Choose Nf3!"
      }
    },
    {
      id: "l6-mstk-2-mini-trainer-e4e5",
      type: "make-move",
      title: "Mini Trainer: 1.e4 e5 Practical Response",
      explanation: [
        "Practical Trainer Position #1: 1.e4 e5",
        "What is the recommended principle-based move for White?",
        "Develop a piece that attacks e5 and prepares castling!"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Nf3"],
      hints: ["Play Nf3."],
      feedback: {
        correct: "SUCCESS: Good! You developed a Knight toward the center and prepared to castle.",
        incorrect: "TRY AGAIN: Look for piece development toward the center (Nf3)."
      }
    },
    {
      id: "l6-mstk-3-mini-trainer-d4d5",
      type: "make-move",
      title: "Mini Trainer: 1.d4 d5 Practical Response",
      explanation: [
        "Practical Trainer Position #2: 1.d4 d5",
        "What is a top principle-based response for White to control e5 and build solid development?",
        "Play Nf3!"
      ],
      position: { fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", orientation: "white", highlightSquares: ["f3"] },
      expectedMoves: ["Nf3"],
      hints: ["Develop Knight to f3."],
      feedback: {
        correct: "SUCCESS: Excellent! Developing the Knight to f3 controls e5 and d4 without wasting time.",
        incorrect: "TRY AGAIN: Develop your Knight to f3."
      }
    },
    {
      id: "l6-mstk-4-mini-trainer-sicilian",
      type: "make-move",
      title: "Mini Trainer: 1.e4 c5 (Sicilian) Response",
      explanation: [
        "Practical Trainer Position #3: 1.e4 c5",
        "Black plays the Sicilian Defense fighting for d4 from the wing.",
        "What is White's best developing move to prepare d4?"
      ],
      position: { fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white", highlightSquares: ["f3"] },
      expectedMoves: ["Nf3"],
      hints: ["Play 2.Nf3."],
      feedback: {
        correct: "SUCCESS: Spot on! 2.Nf3 prepares to open the center with d4 while developing smoothly.",
        incorrect: "TRY AGAIN: Play 2.Nf3 to prepare d4."
      }
    },
    {
      id: "l6-mstk-5-mini-trainer-italian",
      type: "make-move",
      title: "Mini Trainer: 1.e4 e5 2.Nf3 Nc6 Continuation",
      explanation: [
        "Practical Trainer Position #4: 1.e4 e5 2.Nf3 Nc6",
        "Develop your light-squared Bishop to target f7 and prepare fast castling!",
        "Play 3.Bc4!"
      ],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white", highlightSquares: ["c4"] },
      expectedMoves: ["Bc4"],
      hints: ["Move Bishop to c4."],
      feedback: {
        correct: "SUCCESS: Great move! The Italian Game bishop targets f7 and prepares early castling.",
        incorrect: "TRY AGAIN: Move your Bishop to c4."
      }
    },
    {
      id: "l6-mstk-6-mini-trainer-kings-indian",
      type: "make-move",
      title: "Mini Trainer: 1.d4 d5 2.Nf3 Nf6 Development",
      explanation: [
        "Practical Trainer Position #5: 1.d4 d5 2.Nf3 Nf6",
        "Develop your dark-squared Bishop actively outside your pawn structure!",
        "Play 3.Bf4!"
      ],
      position: { fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3", orientation: "white", highlightSquares: ["f4"] },
      expectedMoves: ["Bf4"],
      hints: ["Move dark-squared Bishop to f4."],
      feedback: {
        correct: "SUCCESS: Well played! Developing the dark-squared Bishop to f4 builds a rock-solid opening structure.",
        incorrect: "TRY AGAIN: Move your dark-squared Bishop to f4."
      }
    }
  ]
};

// SKILL 8: Opening Principles Challenge
export const SKILL_OPENING_CHALLENGE: LearningSkill = {
  id: "level-6-opening-challenge",
  title: "8. Opening Principles Challenge",
  description: "Final practical assessment! Pass 12 principle-based exercises (80%+ score) to master Level 6!",
  icon: "🏆",
  category: "openings",
  difficulty: "intermediate",
  prerequisites: ["level-6-opening-mistakes"],
  exercises: [
    {
      id: "l6-chl-1-center",
      type: "make-move",
      title: "Task 1 of 12: Claim the Center",
      explanation: ["Open with White's best central pawn move!"],
      position: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", orientation: "white" },
      expectedMoves: ["e4"],
      hints: ["Play e4."],
      feedback: { correct: "Correct! 1.e4 claims center space.", incorrect: "Play e4." }
    },
    {
      id: "l6-chl-2-knight",
      type: "make-move",
      title: "Task 2 of 12: Develop Knights First",
      explanation: ["Develop your King's Knight to attack e5 and prepare castling!"],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white" },
      expectedMoves: ["Nf3"],
      hints: ["Play Nf3."],
      feedback: { correct: "Correct! Nf3 develops with threat.", incorrect: "Play Nf3." }
    },
    {
      id: "l6-chl-3-defend",
      type: "make-move",
      title: "Task 3 of 12: Defend and Develop as Black",
      explanation: ["White attacks e5 with Nf3. Defend e5 by developing a piece!"],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", orientation: "black" },
      expectedMoves: ["Nc6"],
      hints: ["Play Nc6."],
      feedback: { correct: "Correct! 2...Nc6 defends and develops.", incorrect: "Play Nc6." }
    },
    {
      id: "l6-chl-4-bishop",
      type: "make-move",
      title: "Task 4 of 12: Active Bishop Development",
      explanation: ["Develop your light-squared Bishop to c4!"],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white" },
      expectedMoves: ["Bc4"],
      hints: ["Play Bc4."],
      feedback: { correct: "Correct! Bc4 targets f7.", incorrect: "Play Bc4." }
    },
    {
      id: "l6-chl-5-castle",
      type: "make-move",
      title: "Task 5 of 12: Castle for King Safety",
      explanation: ["Tuck your King safely into the corner with Kingside castling!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 6 5", orientation: "white" },
      expectedMoves: ["O-O"],
      hints: ["Move King e1 to g1."],
      feedback: { correct: "Correct! O-O secures King safety.", incorrect: "Castle Kingside (O-O)." }
    },
    {
      id: "l6-chl-6-punish-q",
      type: "make-move",
      title: "Task 6 of 12: Respond to Early Queen Move",
      explanation: ["White played 2.Qh5. Defend e5 and develop a piece as Black!"],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2", orientation: "black" },
      expectedMoves: ["Nc6"],
      hints: ["Play Nc6."],
      feedback: { correct: "Correct! Nc6 defends e5 and develops.", incorrect: "Play Nc6." }
    },
    {
      id: "l6-chl-7-d4-center",
      type: "make-move",
      title: "Task 7 of 12: Fight for Center with d4",
      explanation: ["Claim central space with 1.d4!"],
      position: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", orientation: "white" },
      expectedMoves: ["d4"],
      hints: ["Play d4."],
      feedback: { correct: "Correct! d4 controls central squares.", incorrect: "Play d4." }
    },
    {
      id: "l6-chl-8-connect-rooks",
      type: "make-move",
      title: "Task 8 of 12: Connect the Rooks",
      explanation: ["Move your Queen to e2 to clear the back rank and connect your Rooks!"],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 1 7", orientation: "white" },
      expectedMoves: ["Qe2"],
      hints: ["Play Qe2."],
      feedback: { correct: "Correct! Qe2 connects the Rooks.", incorrect: "Play Qe2." }
    },
    {
      id: "l6-chl-9-avoid-repeated",
      type: "make-move",
      title: "Task 9 of 12: Develop New Piece",
      explanation: ["Instead of moving the f3 Knight twice, develop your Queen's Knight to c3!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 3 5", orientation: "white" },
      expectedMoves: ["Nc3"],
      hints: ["Play Nc3."],
      feedback: { correct: "Correct! Nc3 mobilizes a new piece.", incorrect: "Play Nc3." }
    },
    {
      id: "l6-chl-10-black-castle",
      type: "make-move",
      title: "Task 10 of 12: Castle Kingside as Black",
      explanation: ["Secure Black's King by castling Kingside!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 5", orientation: "black" },
      expectedMoves: ["O-O"],
      hints: ["Move King e8 to g8."],
      feedback: { correct: "Correct! Black King is safe on g8.", incorrect: "Castle Kingside with Black." }
    },
    {
      id: "l6-chl-11-avoid-mistake",
      type: "choose-move",
      title: "Task 11 of 12: Avoid Flank Pawn Wasting",
      explanation: ["White played 2.Nf3 attacking e5. Which move follows opening principles?"],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", orientation: "black" },
      options: [
        {
          id: "opt-nc6-chl",
          moveSan: "Nc6",
          label: "Nc6 — Develop Knight and defend e5",
          explanation: "Develops a piece and protects e5 directly.",
          isCorrect: true
        },
        {
          id: "opt-a6-chl",
          moveSan: "a6",
          label: "a6 — Push wing pawn",
          explanation: "Wastes a move and fails to defend e5.",
          isCorrect: false
        },
        {
          id: "opt-h6-chl",
          moveSan: "h6",
          label: "h6 — Push edge pawn",
          explanation: "Does not defend e5 or contribute to development.",
          isCorrect: false
        }
      ],
      hints: ["Select Nc6."],
      feedback: { correct: "Correct! Nc6 defends and develops.", incorrect: "Choose Nc6 to defend e5 and develop." }
    },
    {
      id: "l6-chl-12-ruy-lopez",
      type: "make-move",
      title: "Task 12 of 12: Spanish Opening Development",
      explanation: ["Play 3.Bb5 (Ruy Lopez) to pressure Black's knight on c6!"],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white" },
      expectedMoves: ["Bb5"],
      hints: ["Play Bb5."],
      feedback: { correct: "Correct! Bb5 plays the Ruy Lopez.", incorrect: "Play Bb5." }
    }
  ]
};

export const LEVEL_6: LearningLevel = {
  levelNumber: 6,
  title: "Level 6 — Opening Principles",
  description: "Master practical opening play: center control, rapid development, early castling, connecting rooks, avoiding early queen moves, and avoiding wasted moves.",
  skills: [
    SKILL_CONTROL_CENTER,
    SKILL_DEVELOP_PIECES,
    SKILL_CASTLE_EARLY,
    SKILL_CONNECT_ROOKS,
    SKILL_QUEEN_EARLY,
    SKILL_REPEATED_MOVES,
    SKILL_OPENING_MISTAKES,
    SKILL_OPENING_CHALLENGE
  ]
};
