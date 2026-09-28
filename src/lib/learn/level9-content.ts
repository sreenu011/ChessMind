import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: King Activity
export const SKILL_KING_ACTIVITY: LearningSkill = {
  id: "level-9-king-activity",
  title: "1. King Activity",
  description: "In the endgame, the King transforms into an active attacking and defending piece. Centralize your King and bring it toward the action!",
  icon: "👑",
  category: "endgame",
  difficulty: "intermediate",
  prerequisites: [],
  exercises: [
    {
      id: "l9-ka-1-centralize",
      type: "make-move",
      title: "King Activity #1: Centralize Your King",
      explanation: [
        "PRACTICAL ENDGAME CHECKLIST:",
        "1. Is my King active? | 2. Is my opponent's King active? | 3. Who has the passed pawn? | 4. Can I create a passed pawn? | 5. Can I trade pieces? | 6. Can I promote safely? | 7. Is the position winning or drawable?",
        "In the endgame with few pieces, the King must take an active role.",
        "Advance your White King to e3 to centralize it and support your center."
      ],
      position: { fen: "8/8/4k3/8/3P4/8/4K3/8 w - - 0 1", orientation: "white", highlightSquares: ["e2", "e3"] },
      expectedMoves: ["Ke3"],
      hints: [
        "Check Endgame Rule #1: Is your King active?",
        "Step your King forward to e3.",
        "Play 1.Ke3!"
      ],
      feedback: {
        correct: "Excellent! Active Kings win endgames. Your King now controls critical central squares.",
        incorrect: "Your King needs to move closer to the center! Play Ke3."
      }
    },
    {
      id: "l9-ka-2-support-pawn",
      type: "make-move",
      title: "King Activity #2: Escort the Passed Pawn",
      explanation: [
        "A passed pawn cannot advance safely on its own without King support.",
        "Move your King to f3 to shield and escort your passed pawn forward."
      ],
      position: { fen: "8/8/6k1/8/5P2/8/5K2/8 w - - 0 1", orientation: "white", highlightSquares: ["f2", "f3"] },
      expectedMoves: ["Kf3"],
      hints: [
        "Bring your King in front or alongside your pawn.",
        "Move your King forward to f3.",
        "Play 1.Kf3!"
      ],
      feedback: {
        correct: "Great work! Escorting the pawn with your King prevents the enemy King from stopping it.",
        incorrect: "Bring your King forward to escort the pawn! Play Kf3."
      }
    },
    {
      id: "l9-ka-3-cut-off-enemy",
      type: "make-move",
      title: "King Activity #3: Intercept Enemy King",
      explanation: [
        "Use your active King to block the path of the enemy King.",
        "Play 1.Kd5 to take control of key squares and prevent Black's King from reaching d6."
      ],
      position: { fen: "8/3k4/8/8/4K3/3P4/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["Kd5"],
      hints: [
        "Step your King in front of your pawn to cut off Black's King.",
        "Move to d5 to dominate the position.",
        "Play 1.Kd5!"
      ],
      feedback: {
        correct: "Well played! Controlling the square in front of your pawn shuts out the enemy King.",
        incorrect: "Step into the center to dominate Black's King. Play Kd5!"
      }
    },
    {
      id: "l9-ka-4-king-in-front",
      type: "make-move",
      title: "King Activity #4: King Leading the Charge",
      explanation: [
        "The golden rule of pawn endings: The King should lead, not follow the pawn!",
        "Play 1.Ke2 to take position ahead of your e3 pawn."
      ],
      position: { fen: "8/4k3/8/8/8/4P3/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e1", "e2"] },
      expectedMoves: ["Ke2"],
      hints: [
        "Move your King forward to lead the pawn.",
        "Advance your King up the e-file to e2.",
        "Play 1.Ke2!"
      ],
      feedback: {
        correct: "Brilliant! Putting your King in front of the pawn guarantees smooth promotion.",
        incorrect: "Do not push the pawn first! Activate your King with Ke2."
      }
    },
    {
      id: "l9-ka-5-active-king-defence",
      type: "make-move",
      title: "King Activity #5: Defensive King Centralization",
      explanation: [
        "DEFENSIVE ENDGAME: When defending, an active King is just as vital!",
        "Black has a passed pawn on d4. Move your King to f2 to rush into the stopping square."
      ],
      position: { fen: "8/8/7k/8/3p4/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e1", "f2"] },
      expectedMoves: ["Kf2"],
      hints: [
        "Rush your King toward the passed pawn.",
        "Move toward the pawn with 1.Kf2.",
        "Play 1.Kf2!"
      ],
      feedback: {
        correct: "Awesome defense! Activating your King immediately catches the pawn.",
        incorrect: "Your King is idling! Step toward the pawn with Kf2."
      }
    }
  ]
};

// SKILL 2: King and Pawn vs King
export const SKILL_KING_PAWN_VS_KING: LearningSkill = {
  id: "level-9-kpk",
  title: "2. King & Pawn vs King",
  description: "Master the fundamental endgame win: escorting a single pawn to promotion with King support while avoiding stalemate.",
  icon: "♟️",
  category: "endgame",
  difficulty: "intermediate",
  prerequisites: ["level-9-king-activity"],
  exercises: [
    {
      id: "l9-kpk-1-escort",
      type: "make-move",
      title: "K&P vs K #1: Escort Pawn to Promotion",
      explanation: [
        "White's King is on e6, pawn on e7, Black King on d7.",
        "Play 1.Kf7 to clear the e8 square and force promotion!"
      ],
      position: { fen: "3k4/4P3/4K3/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e6", "f7"] },
      expectedMoves: ["Kf7", "Kc7", "e8=Q"],
      hints: [
        "Move your King to f7 to shield e8.",
        "Step to f7.",
        "Play 1.Kf7!"
      ],
      feedback: {
        correct: "Perfect execution! The King shielded e8, forcing promotion on the next move.",
        incorrect: "Move your King to f7 to clear the runway for promotion!"
      }
    },
    {
      id: "l9-kpk-2-pawn-push",
      type: "make-move",
      title: "K&P vs K #2: Advance into Promotion",
      explanation: [
        "Your King on f7 guards the promotion square e8.",
        "Advance the pawn to e8 and promote to a Queen!"
      ],
      position: { fen: "2k5/4PK2/8/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e7", "e8"] },
      expectedMoves: ["e8=Q+"],
      hints: [
        "Promote your pawn on e8.",
        "Transform the pawn into a Queen.",
        "Play 1.e8=Q+!"
      ],
      feedback: {
        correct: "Checkmate/Promotion! Promoting with King support delivers immediate victory.",
        incorrect: "Promote your pawn on e8 to a Queen!"
      }
    },
    {
      id: "l9-kpk-3-key-square",
      type: "make-move",
      title: "K&P vs K #3: Key Square Mastery",
      explanation: [
        "To win with a pawn, your King must occupy key squares in front of the pawn.",
        "Move 1.Kd4 to claim the critical key square."
      ],
      position: { fen: "8/8/4k3/8/4P3/4K3/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e3", "d4"] },
      expectedMoves: ["Kd4"],
      hints: [
        "Advance your King in front of your pawn.",
        "Play 1.Kd4 to occupy a key square.",
        "Play 1.Kd4!"
      ],
      feedback: {
        correct: "Great job! Occupying key squares in front of the pawn guarantees a forced win.",
        incorrect: "Move your King forward to control squares ahead of your pawn! Play Kd4."
      }
    },
    {
      id: "l9-kpk-4-outflanking",
      type: "make-move",
      title: "K&P vs K #4: Outflanking Technique",
      explanation: [
        "When the enemy King steps sideways, outflank it by stepping your King around!",
        "Play 1.Kf6 to bypass Black's King and clear the path for the e-pawn."
      ],
      position: { fen: "4k3/8/4K3/8/4P3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e6", "f6"] },
      expectedMoves: ["Kf6", "Kf8", "e5"],
      hints: [
        "Outflank Black's King by moving your King sideways-forward.",
        "Move to f6.",
        "Play 1.Kf6!"
      ],
      feedback: {
        correct: "Brilliant outflanking! Stepping around enemy Kings clears the runway for promotion.",
        incorrect: "Outflank the enemy King by playing Kf6!"
      }
    },
    {
      id: "l9-kpk-5-avoid-stalemate",
      type: "make-move",
      title: "K&P vs K #5: Avoid Stalemate Trap",
      explanation: [
        "BEWARE: Pushing a pawn to the 7th rank when your King is behind it leads to STALEMATE if the enemy King gets in front.",
        "Do NOT push e6 yet! Instead, advance your King in front with 1.Kd5!"
      ],
      position: { fen: "4k3/8/8/4P3/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["Kd5"],
      hints: [
        "Do NOT push e6 yet, which allows Black to hold.",
        "Bring your King in front of the pawn first.",
        "Play 1.Kd5!"
      ],
      feedback: {
        correct: "Smart choice! Advancing the King first avoids stalemate traps.",
        incorrect: "Do not rush the pawn! Move your King forward first with Kd5."
      }
    },
    {
      id: "l9-kpk-6-defensive-draw",
      type: "make-move",
      title: "K&P vs K #6: Defensive Draw (Hold the Draw)",
      explanation: [
        "DEFENSIVE EXERCISE: You are Black, defending against White's passed pawn on e5.",
        "Keep your King directly in front of the pawn on e6 to force a draw by stalemate!"
      ],
      position: { fen: "8/4k3/8/4P3/4K3/8/8/8 b - - 0 1", orientation: "black", highlightSquares: ["e7", "e6"] },
      expectedMoves: ["Ke6"],
      hints: [
        "Stay directly in front of the passed pawn.",
        "Move your Black King to e6.",
        "Play 1...Ke6!"
      ],
      feedback: {
        correct: "Well defended! Staying in front of the pawn secures a forced draw.",
        incorrect: "Keep your King on the pawn's file! Play Ke6."
      }
    }
  ]
};

// SKILL 3: Opposition
export const SKILL_OPPOSITION: LearningSkill = {
  id: "level-9-opposition",
  title: "3. Opposition",
  description: "Learn how taking opposition (placing Kings face-to-face with one square between them) forces the enemy King to step aside.",
  icon: "⚔️",
  category: "endgame",
  difficulty: "intermediate",
  prerequisites: ["level-9-kpk"],
  exercises: [
    {
      id: "l9-opp-1-direct-opposition",
      type: "make-move",
      title: "Opposition #1: Taking Direct Opposition",
      explanation: [
        "When Kings face each other on the same rank or file with one square in between, the player NOT to move holds opposition.",
        "Play 1.Ke5 to take direct opposition against Black's King on e7!"
      ],
      position: { fen: "4k3/4p3/8/8/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["Ke5"],
      hints: [
        "Face Black's King with one empty square between.",
        "Move your King to e5.",
        "Play 1.Ke5!"
      ],
      feedback: {
        correct: "Outstanding! You took direct opposition, forcing Black's King to give ground.",
        incorrect: "Step directly opposite Black's King! Play Ke5."
      }
    },
    {
      id: "l9-opp-2-pawn-win",
      type: "make-move",
      title: "Opposition #2: Using Opposition to Win",
      explanation: [
        "Black just played Ke7. Use opposition to outflank and win the d6 pawn.",
        "Play 1.Kc6 to outflank Black's King!"
      ],
      position: { fen: "8/4k3/3p4/3K4/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["d5", "c6"] },
      expectedMoves: ["Kc6"],
      hints: [
        "Black's King is on e7. Move your King to c6 to threaten the d6 pawn.",
        "Outflank on the c-file.",
        "Play 1.Kc6!"
      ],
      feedback: {
        correct: "Perfect! Outflanking using opposition wins Black's pawn on the next turn.",
        incorrect: "Outflank Black's King by playing Kc6!"
      }
    },
    {
      id: "l9-opp-3-distant-opposition",
      type: "make-move",
      title: "Opposition #3: Distant Opposition",
      explanation: [
        "Distant opposition occurs when Kings face each other with 3 or 5 squares in between.",
        "Play 1.Ke2 to hold distant opposition across 3 empty squares from Black's King on e6!"
      ],
      position: { fen: "8/8/4k3/8/8/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e1", "e2"] },
      expectedMoves: ["Ke2"],
      hints: [
        "Keep an odd number of squares (3) between Kings on the e-file.",
        "Move your King to e2.",
        "Play 1.Ke2!"
      ],
      feedback: {
        correct: "Masterful! Distant opposition converts into direct opposition as the Kings close in.",
        incorrect: "Move to e2 to keep an odd number of squares between the Kings!"
      }
    },
    {
      id: "l9-opp-4-defensive-opposition",
      type: "make-move",
      title: "Opposition #4: Defensive Opposition (Hold the Draw)",
      explanation: [
        "DEFENSIVE EXERCISE: White is defending a pawn ending down a pawn.",
        "White's King is on e2 and Black's King is on e3. Take direct opposition with 1.Ke1!"
      ],
      position: { fen: "8/8/8/8/4p3/4k3/4K3/8 w - - 0 1", orientation: "white", highlightSquares: ["e2", "e1"] },
      expectedMoves: ["Ke1"],
      hints: [
        "Stand directly opposite Black's King on e1.",
        "Keep the e1 square to maintain opposition.",
        "Play 1.Ke1!"
      ],
      feedback: {
        correct: "You held the draw! Defensive opposition prevents the enemy King from advancing.",
        incorrect: "Do not move away! Play Ke1 to hold opposition and save the draw."
      }
    },
    {
      id: "l9-opp-5-diagonal-opposition",
      type: "make-move",
      title: "Opposition #5: Diagonal Opposition",
      explanation: [
        "Diagonal opposition happens when Kings form a 2x2 square box diagonally.",
        "Play 1.Kd3 to maintain diagonal opposition against Black's King on f6!"
      ],
      position: { fen: "8/8/5k2/8/8/8/3K4/8 w - - 0 1", orientation: "white", highlightSquares: ["d2", "d3"] },
      expectedMoves: ["Kd3"],
      hints: [
        "Step diagonally to match Black's King position.",
        "Move your King to d3.",
        "Play 1.Kd3!"
      ],
      feedback: {
        correct: "Great spatial awareness! Diagonal opposition transitions into direct opposition.",
        incorrect: "Step to d3 to take diagonal opposition!"
      }
    }
  ]
};

// SKILL 4: Rule of the Square
export const SKILL_RULE_OF_THE_SQUARE: LearningSkill = {
  id: "level-9-rule-of-square",
  title: "4. Rule of the Square",
  description: "Calculate whether a King can catch an unstoppable passed pawn by building a visual square from the pawn to its promotion rank.",
  icon: "📐",
  category: "endgame",
  difficulty: "intermediate",
  prerequisites: ["level-9-opposition"],
  exercises: [
    {
      id: "l9-ros-1-push-passed-pawn",
      type: "make-move",
      title: "Rule of the Square #1: Outrunning the King",
      explanation: [
        "The visual square for a pawn on a4 extends from a4-a8-e8-e4.",
        "Black's King is on g6 (outside the square!). Push 1.a5 to outrun Black's King!"
      ],
      position: { fen: "8/8/6k1/8/P7/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["a4", "a5"] },
      expectedMoves: ["a5", "Kf6", "a6", "Ke6", "a7", "Kd7", "a8=Q"],
      hints: [
        "Black's King cannot enter the square of your pawn.",
        "Push your passed pawn forward!",
        "Play 1.a5!"
      ],
      feedback: {
        correct: "Pure speed! The pawn was outside the enemy King's square and promoted cleanly.",
        incorrect: "Black's King is outside the square! Push a5 to outrun the King."
      }
    },
    {
      id: "l9-ros-2-intercept-pawn",
      type: "make-move",
      title: "Rule of the Square #2: Intercepting the Pawn",
      explanation: [
        "DEFENSIVE EXERCISE: Black's passed pawn on a5 threatens to promote.",
        "Move 1.Kc3 to step inside the square of Black's pawn and catch it!"
      ],
      position: { fen: "8/8/6k1/p7/8/8/2K5/8 w - - 0 1", orientation: "white", highlightSquares: ["c2", "c3"] },
      expectedMoves: ["Kc3"],
      hints: [
        "Step into the square of the a5 pawn.",
        "Move your King to c3.",
        "Play 1.Kc3!"
      ],
      feedback: {
        correct: "Great calculation! Stepping inside the square catches the passed pawn easily.",
        incorrect: "Move your King into the pawn's square with Kc3!"
      }
    },
    {
      id: "l9-ros-3-out-of-square",
      type: "make-move",
      title: "Rule of the Square #3: Recognizing Out of Square",
      explanation: [
        "White has a pawn on h4. Black's King is on b6.",
        "The square for h4 is h4-h8-d8-d4. Black's King is on b6 (outside!). Push 1.h5!"
      ],
      position: { fen: "8/8/1k6/8/7P/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["h4", "h5"] },
      expectedMoves: ["h5", "Kc5", "h6", "Kd5", "h7", "Ke5", "h8=Q+"],
      hints: [
        "Black's King is far outside the square.",
        "Sprint your pawn down the h-file.",
        "Play 1.h5!"
      ],
      feedback: {
        correct: "Unstoppable! Recognizing when an enemy King is outside the square guarantees promotion.",
        incorrect: "Push your h-pawn immediately! Play h5."
      }
    },
    {
      id: "l9-ros-4-defensive-chase",
      type: "make-move",
      title: "Rule of the Square #4: Defensive Chase (Hold the Draw)",
      explanation: [
        "DEFENSIVE EXERCISE: Black's h-pawn is sprinting. Your King must step into its square.",
        "Play 1.Kg3 to enter the h5 pawn's square and force a draw!"
      ],
      position: { fen: "8/8/6k1/7p/8/5K2/8/8 w - - 0 1", orientation: "white", highlightSquares: ["f3", "g3"] },
      expectedMoves: ["Kg3"],
      hints: [
        "Move your King closer to the h-pawn.",
        "Play 1.Kg3 to enter the square.",
        "Play 1.Kg3!"
      ],
      feedback: {
        correct: "You caught the pawn! Entering the square neutralizes enemy passed pawns.",
        incorrect: "Step toward the pawn to enter its square! Play Kg3."
      }
    },
    {
      id: "l9-ros-5-pawn-race",
      type: "make-move",
      title: "Rule of the Square #5: Pawn Race",
      explanation: [
        "Both sides have passed pawns! White's pawn on a4 is closer to promotion than Black's h5 pawn.",
        "Push 1.a5 to win the pawn race!"
      ],
      position: { fen: "8/8/6k1/7p/P7/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["a4", "a5"] },
      expectedMoves: ["a5", "h4", "a6", "h3", "a7", "h2", "a8=Q"],
      hints: [
        "Push your passed pawn down the a-file.",
        "Play 1.a5.",
        "Play 1.a5!"
      ],
      feedback: {
        correct: "Race won! Promoting first gives you a Queen to stop Black's pawn.",
        incorrect: "Push your a-pawn! Play a5."
      }
    }
  ]
};

// SKILL 5: Queen and Pawn Promotion
export const SKILL_QUEEN_PROMOTION: LearningSkill = {
  id: "level-9-queen-promotion",
  title: "5. Queen & Pawn Promotion",
  description: "Convert passed pawns into Queens safely, checkmate efficiently, and avoid accidental stalemate traps.",
  icon: "👑",
  category: "endgame",
  difficulty: "intermediate",
  prerequisites: ["level-9-rule-of-square"],
  exercises: [
    {
      id: "l9-qp-1-promote-safely",
      type: "make-move",
      title: "Queen Promotion #1: Safe Promotion",
      explanation: [
        "White has a pawn on c7 backed by King on c6.",
        "Advance the pawn to c8 and promote to a Queen!"
      ],
      position: { fen: "8/2P5/2K5/8/8/8/8/k7 w - - 0 1", orientation: "white", highlightSquares: ["c7", "c8"] },
      expectedMoves: ["c8=Q"],
      hints: [
        "Promote your c7 pawn.",
        "Select Queen.",
        "Play 1.c8=Q!"
      ],
      feedback: {
        correct: "Pawn promoted! You now have a decisive material advantage.",
        incorrect: "Promote your pawn on c8 to a Queen!"
      }
    },
    {
      id: "l9-qp-2-avoid-stalemate-mate",
      type: "make-move",
      title: "Queen Promotion #2: Delivering Mate without Stalemate",
      explanation: [
        "White: King g6, Queen h7. Black: King g8.",
        "Deliver instant checkmate with 1.Qg7# while leaving Black's King no escape!"
      ],
      position: { fen: "6k1/7Q/6K1/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["h7", "g7"] },
      expectedMoves: ["Qg7#"],
      hints: [
        "Look for checkmate adjacent to Black's King.",
        "Move Queen to g7.",
        "Play 1.Qg7#!"
      ],
      feedback: {
        correct: "Checkmate! Perfect Queen & King coordination.",
        incorrect: "Deliver checkmate with Qg7#!"
      }
    },
    {
      id: "l9-qp-3-staircase-mate",
      type: "make-move",
      title: "Queen Promotion #3: King + Queen Checkmate Technique",
      explanation: [
        "Black's King is trapped on g8.",
        "Deliver checkmate with 1.Qg7#!"
      ],
      position: { fen: "6k1/8/5K2/6Q1/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["g5", "g7"] },
      expectedMoves: ["Qg7#"],
      hints: [
        "Move Queen right next to Black's King with King support.",
        "Move Queen to g7.",
        "Play 1.Qg7#!"
      ],
      feedback: {
        correct: "Great technique! Trapping the King on the edge makes checkmate effortless.",
        incorrect: "Deliver checkmate with Qg7#!"
      }
    },
    {
      id: "l9-qp-4-corner-mate",
      type: "make-move",
      title: "Queen Promotion #4: Driving King to Corner",
      explanation: [
        "Black's King is trapped in the corner on h8.",
        "Deliver checkmate with 1.Qg7#!"
      ],
      position: { fen: "7k/5K1P/6Q1/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["g6", "g7"] },
      expectedMoves: ["Qg7#"],
      hints: [
        "Place your Queen right next to Black's King with King backup.",
        "Move Queen to g7.",
        "Play 1.Qg7#!"
      ],
      feedback: {
        correct: "Checkmate! A classic endgame finish.",
        incorrect: "Deliver checkmate with Qg7#!"
      }
    },
    {
      id: "l9-qp-5-defensive-stalemate",
      type: "make-move",
      title: "Queen Promotion #5: Defensive Stalemate Trap (Hold the Draw)",
      explanation: [
        "DEFENSIVE EXERCISE: White King is on h1, Black Queen on f3.",
        "Move 1.Kh2 to step out of immediate corner pressure and force a draw!"
      ],
      position: { fen: "7k/8/8/8/8/5q2/8/7K w - - 0 1", orientation: "white", highlightSquares: ["h1", "h2"] },
      expectedMoves: ["Kh2"],
      hints: [
        "Move your King to h2.",
        "Play 1.Kh2.",
        "Play 1.Kh2!"
      ],
      feedback: {
        correct: "Position saved! Active defensive play holds the draw.",
        incorrect: "Move your King to h2!"
      }
    }
  ]
};

// SKILL 6: Rook Endgame Basics
export const SKILL_ROOK_ENDGAME: LearningSkill = {
  id: "level-9-rook-endgame",
  title: "6. Rook Endgame Basics",
  description: "Rook endgames are the most common in chess. Keep your Rook active, place it behind passed pawns, and cut off the enemy King.",
  icon: "🏰",
  category: "endgame",
  difficulty: "intermediate",
  prerequisites: ["level-9-queen-promotion"],
  exercises: [
    {
      id: "l9-rb-1-active-rook",
      type: "make-move",
      title: "Rook Endgames #1: Rook Behind Passed Pawn",
      explanation: [
        "TARRASCH RULE: Rooks belong behind passed pawns (yours or your opponent's!).",
        "Place your Rook on a1 behind your passed pawn on a4."
      ],
      position: { fen: "8/8/6k1/8/P7/8/8/1R2K3 w - - 0 1", orientation: "white", highlightSquares: ["b1", "a1"] },
      expectedMoves: ["Ra1"],
      hints: [
        "Apply Tarrasch's rule: Rook behind the passed pawn.",
        "Move your Rook to a1.",
        "Play 1.Ra1!"
      ],
      feedback: {
        correct: "Tarrasch Rule applied! Placing the Rook behind the passed pawn gives it maximum activity as the pawn advances.",
        incorrect: "Place your Rook behind your passed pawn! Play Ra1."
      }
    },
    {
      id: "l9-rb-2-cut-off-king",
      type: "make-move",
      title: "Rook Endgames #2: Cutting Off Enemy King",
      explanation: [
        "Rooks excel at building horizontal or vertical barriers.",
        "Play 1.Rd7+ to check and cut off Black's King on the 7th rank!"
      ],
      position: { fen: "3k4/8/8/3R4/8/4K3/8/8 w - - 0 1", orientation: "white", highlightSquares: ["d5", "d7"] },
      expectedMoves: ["Rd7+"],
      hints: [
        "Cut off Black's King along a rank or file.",
        "Move your Rook to d7 with check.",
        "Play 1.Rd7+!"
      ],
      feedback: {
        correct: "Great barrier! Cutting off the enemy King prevents it from stopping your passed pawns.",
        incorrect: "Cut off Black's King by moving your Rook to d7+!"
      }
    },
    {
      id: "l9-rb-3-check-from-behind",
      type: "make-move",
      title: "Rook Endgames #3: Checking from Behind",
      explanation: [
        "When defending against an enemy passed pawn, check the enemy King from behind with long-range Rook checks!",
        "Play 1.Ra8 to deliver long-range checks from behind!"
      ],
      position: { fen: "8/8/4k3/4p3/8/4K3/8/R7 w - - 0 1", orientation: "white", highlightSquares: ["a1", "a8"] },
      expectedMoves: ["Ra8"],
      hints: [
        "Check Black's King from long distance.",
        "Move your Rook to a8.",
        "Play 1.Ra8!"
      ],
      feedback: {
        correct: "Brilliant! Long-range checks from behind harass the King without giving up defense.",
        incorrect: "Move your Rook behind to a8!"
      }
    },
    {
      id: "l9-rb-4-rook-escort",
      type: "make-move",
      title: "Rook Endgames #4: Escorting Passed Pawn",
      explanation: [
        "White has a passed pawn on h7 supported by Rook on h1.",
        "Move 1.Kg3 to prepare King activation!"
      ],
      position: { fen: "7k/7P/8/8/8/8/6K1/7R w - - 0 1", orientation: "white", highlightSquares: ["g2", "g3"] },
      expectedMoves: ["Kg3"],
      hints: [
        "Activate your King.",
        "Move your King to g3.",
        "Play 1.Kg3!"
      ],
      feedback: {
        correct: "Excellent conversion! Your active Rook and King guaranteed promotion.",
        incorrect: "Activate your King with Kg3!"
      }
    },
    {
      id: "l9-rb-5-defensive-passive-rook",
      type: "make-move",
      title: "Rook Endgames #5: Defensive Passive Rook (Hold the Draw)",
      explanation: [
        "DEFENSIVE EXERCISE: Black has a passed pawn on a3.",
        "Put your Rook on a7 behind Black's passed pawn to hold the draw!"
      ],
      position: { fen: "R7/8/8/8/8/p7/4K3/1k6 w - - 0 1", orientation: "white", highlightSquares: ["a8", "a7"] },
      expectedMoves: ["Ra7"],
      hints: [
        "Place your Rook behind Black's passed pawn.",
        "Move your Rook to a7.",
        "Play 1.Ra7!"
      ],
      feedback: {
        correct: "You held the draw! Rook behind enemy passed pawn is the ultimate defensive setup.",
        incorrect: "Move your Rook behind Black's passed pawn on a7!"
      }
    }
  ]
};

// SKILL 7: Converting an Advantage
export const SKILL_CONVERTING_ADVANTAGE: LearningSkill = {
  id: "level-9-converting-advantage",
  title: "7. Converting an Advantage",
  description: "When ahead in material or position, trade pieces to simplify into a winning pawn ending and avoid unnecessary counterplay.",
  icon: "🎯",
  category: "endgame",
  difficulty: "intermediate",
  prerequisites: ["level-9-rook-endgame"],
  exercises: [
    {
      id: "l9-ca-1-simplify-trade",
      type: "make-move",
      title: "Converting Advantage #1: Simplify by Trading",
      explanation: [
        "RULE OF CONVERSION: When ahead in material, trade pieces to simplify into an easy pawn ending!",
        "Capture Black's Rook on d8 with 1.Rxd8#!"
      ],
      position: { fen: "3r2k1/5ppp/8/8/3R4/8/5PPP/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "d8"] },
      expectedMoves: ["Rxd8#"],
      hints: [
        "Trade Rooks on d8.",
        "Deliver back-rank checkmate by capturing on d8.",
        "Play 1.Rxd8#!"
      ],
      feedback: {
        correct: "Simplified & checkmated! Trading pieces when ahead eliminates enemy counterplay.",
        incorrect: "Capture Black's Rook on d8 with Rxd8#!"
      }
    },
    {
      id: "l9-ca-2-push-passed-pawn",
      type: "make-move",
      title: "Converting Advantage #2: Push Passed Pawn",
      explanation: [
        "Your passed pawn on d6 forces Black to react.",
        "Centralize your King to d5 to support the d6 pawn!"
      ],
      position: { fen: "8/3k4/3P4/4K3/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e5", "d5"] },
      expectedMoves: ["Kd5", "Kd8", "Ke6"],
      hints: [
        "Centralize your King to d5.",
        "Move your King to d5.",
        "Play 1.Kd5!"
      ],
      feedback: {
        correct: "Decisive pressure! Passed pawns dictate the tempo of endgames.",
        incorrect: "Support your pawn with Kd5!"
      }
    },
    {
      id: "l9-ca-3-king-infiltration",
      type: "make-move",
      title: "Converting Advantage #3: King Infiltration",
      explanation: [
        "White has a healthier pawn structure.",
        "Infiltrate Black's position by capturing 1.exd5+ to open the path for King infiltration!"
      ],
      position: { fen: "8/8/4k3/3p4/4P3/4K3/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["exd5+"],
      hints: [
        "Trade pawns on d5 to activate your King.",
        "Capture on d5 with 1.exd5+.",
        "Play 1.exd5+!"
      ],
      feedback: {
        correct: "Clean conversion! Trading pawns opened the path for King infiltration.",
        incorrect: "Trade pawns on d5 with exd5+!"
      }
    },
    {
      id: "l9-ca-4-two-passed-pawns",
      type: "make-move",
      title: "Converting Advantage #4: Connected Passed Pawns",
      explanation: [
        "Connected passed pawns protect each other!",
        "Capture 1.dxc5 to create passed pawns."
      ],
      position: { fen: "8/8/4k3/2p5/3P4/8/4K3/8 w - - 0 1", orientation: "white", highlightSquares: ["d4", "c5"] },
      expectedMoves: ["dxc5"],
      hints: [
        "Capture on c5.",
        "Capture on c5 with 1.dxc5.",
        "Play 1.dxc5!"
      ],
      feedback: {
        correct: "Connected passed pawns created! Two passed pawns side-by-side are unstoppable.",
        incorrect: "Capture Black's pawn on c5 with dxc5!"
      }
    },
    {
      id: "l9-ca-5-defensive-fortress",
      type: "make-move",
      title: "Converting Advantage #5: Hold Drawing Fortress (Hold the Draw)",
      explanation: [
        "DEFENSIVE EXERCISE: You are Black, down a pawn but holding a fortress.",
        "Move 1...Ke6 to maintain your defensive block."
      ],
      position: { fen: "8/4k3/8/4P3/4K3/8/8/8 b - - 0 1", orientation: "black", highlightSquares: ["e7", "e6"] },
      expectedMoves: ["Ke6"],
      hints: [
        "Keep your King directly facing White's pawn.",
        "Move to e6.",
        "Play 1...Ke6!"
      ],
      feedback: {
        correct: "Fortress maintained! Careful endgame defense denies White the win.",
        incorrect: "Maintain your defensive wall! Play Ke6."
      }
    }
  ]
};

// SKILL 8: Endgame Mastery Challenge
export const SKILL_ENDGAME_MASTERY_CHALLENGE: LearningSkill = {
  id: "level-9-endgame-challenge",
  title: "8. Endgame Mastery Challenge",
  description: "Test your endgame mastery across 15 practical positions covering King activity, pawn endings, opposition, rule of the square, and rook technique.",
  icon: "🏆",
  category: "endgame",
  difficulty: "advanced",
  prerequisites: ["level-9-converting-advantage"],
  exercises: [
    {
      id: "l9-ch-1",
      type: "make-move",
      title: "Endgame Challenge #1: King Activation",
      explanation: ["Centralize your White King to e4 to dominate the endgame."],
      position: { fen: "8/8/4k3/8/8/4K3/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e3", "e4"] },
      expectedMoves: ["Ke4"],
      hints: ["Centralize your King on e4.", "Play 1.Ke4!"],
      feedback: { correct: "Challenge #1 Passed! King centralized.", incorrect: "Move King to e4!" }
    },
    {
      id: "l9-ch-2",
      type: "make-move",
      title: "Endgame Challenge #2: Pawn Promotion",
      explanation: ["Play 1.Kf7 to clear the e8 square for promotion."],
      position: { fen: "3k4/4P3/4K3/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e6", "f7"] },
      expectedMoves: ["Kf7", "Kc7", "e8=Q"],
      hints: ["Move King to f7.", "Play 1.Kf7!"],
      feedback: { correct: "Challenge #2 Passed! Promotion setup complete.", incorrect: "Play Kf7!" }
    },
    {
      id: "l9-ch-3",
      type: "make-move",
      title: "Endgame Challenge #3: Direct Opposition",
      explanation: ["Take direct opposition with 1.Ke5."],
      position: { fen: "4k3/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["Ke5"],
      hints: ["Step opposite Black's King.", "Play 1.Ke5!"],
      feedback: { correct: "Challenge #3 Passed! Direct opposition claimed.", incorrect: "Play Ke5!" }
    },
    {
      id: "l9-ch-4",
      type: "make-move",
      title: "Endgame Challenge #4: Rule of the Square Sprint",
      explanation: ["Black's King is outside the square. Sprint 1.b5!"],
      position: { fen: "8/8/6k1/8/1P6/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["b4", "b5"] },
      expectedMoves: ["b5", "Kf6", "b6", "Ke6", "b7", "Kd7", "b8=Q"],
      hints: ["Push the b-pawn forward.", "Play 1.b5!"],
      feedback: { correct: "Challenge #4 Passed! Pawn outran enemy King.", incorrect: "Push b5!" }
    },
    {
      id: "l9-ch-5",
      type: "make-move",
      title: "Endgame Challenge #5: Queen & King Checkmate",
      explanation: ["Deliver checkmate with 1.Qg7#."],
      position: { fen: "6k1/7Q/6K1/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["h7", "g7"] },
      expectedMoves: ["Qg7#"],
      hints: ["Checkmate on g7.", "Play 1.Qg7#!"],
      feedback: { correct: "Challenge #5 Passed! Queen checkmate.", incorrect: "Play Qg7#!" }
    },
    {
      id: "l9-ch-6",
      type: "make-move",
      title: "Endgame Challenge #6: Active Rook Placement",
      explanation: ["Place your Rook behind your passed pawn with 1.Ra1."],
      position: { fen: "8/8/6k1/8/P7/8/8/1R2K3 w - - 0 1", orientation: "white", highlightSquares: ["b1", "a1"] },
      expectedMoves: ["Ra1"],
      hints: ["Rook behind passed pawn.", "Play 1.Ra1!"],
      feedback: { correct: "Challenge #6 Passed! Tarrasch Rule applied.", incorrect: "Play Ra1!" }
    },
    {
      id: "l9-ch-7",
      type: "make-move",
      title: "Endgame Challenge #7: Simplifying Trade",
      explanation: ["Trade Rooks on d8 to deliver checkmate."],
      position: { fen: "3r2k1/5ppp/8/8/3R4/8/5PPP/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "d8"] },
      expectedMoves: ["Rxd8#"],
      hints: ["Capture on d8.", "Play 1.Rxd8#!"],
      feedback: { correct: "Challenge #7 Passed! Trade & Checkmate.", incorrect: "Play Rxd8#!" }
    },
    {
      id: "l9-ch-8",
      type: "make-move",
      title: "Endgame Challenge #8: Defensive Draw (Hold the Draw)",
      explanation: ["Hold defensive opposition with 1.Ke1."],
      position: { fen: "8/8/8/8/4p3/4k3/4K3/8 w - - 0 1", orientation: "white", highlightSquares: ["e2", "e1"] },
      expectedMoves: ["Ke1"],
      hints: ["Stand in front of the King.", "Play 1.Ke1!"],
      feedback: { correct: "Challenge #8 Passed! Defensive draw held.", incorrect: "Play Ke1!" }
    },
    {
      id: "l9-ch-9",
      type: "make-move",
      title: "Endgame Challenge #9: Intercepting Square",
      explanation: ["Step your King into the square of Black's a-pawn with 1.Kc3."],
      position: { fen: "8/8/6k1/p7/8/8/2K5/8 w - - 0 1", orientation: "white", highlightSquares: ["c2", "c3"] },
      expectedMoves: ["Kc3"],
      hints: ["Move into the square.", "Play 1.Kc3!"],
      feedback: { correct: "Challenge #9 Passed! Pawn caught.", incorrect: "Play Kc3!" }
    },
    {
      id: "l9-ch-10",
      type: "make-move",
      title: "Endgame Challenge #10: Outflanking Key Square",
      explanation: ["Outflank Black's King with 1.Kf6."],
      position: { fen: "4k3/8/4K3/8/4P3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e6", "f6"] },
      expectedMoves: ["Kf6", "Kf8", "e5"],
      hints: ["Outflank sideways.", "Play 1.Kf6!"],
      feedback: { correct: "Challenge #10 Passed! Outflanking mastered.", incorrect: "Play Kf6!" }
    },
    {
      id: "l9-ch-11",
      type: "make-move",
      title: "Endgame Challenge #11: Long-Range Rook Check",
      explanation: ["Check Black's King from long distance with 1.Ra8."],
      position: { fen: "8/8/4k3/4p3/8/4K3/8/R7 w - - 0 1", orientation: "white", highlightSquares: ["a1", "a8"] },
      expectedMoves: ["Ra8"],
      hints: ["Move Rook to a8.", "Play 1.Ra8!"],
      feedback: { correct: "Challenge #11 Passed! Long-range check executed.", incorrect: "Play Ra8!" }
    },
    {
      id: "l9-ch-12",
      type: "make-move",
      title: "Endgame Challenge #12: Distant Opposition",
      explanation: ["Take distant opposition across 3 squares with 1.Ke2."],
      position: { fen: "8/8/4k3/8/8/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["e1", "e2"] },
      expectedMoves: ["Ke2"],
      hints: ["Keep 3 squares distance.", "Play 1.Ke2!"],
      feedback: { correct: "Challenge #12 Passed! Distant opposition held.", incorrect: "Play Ke2!" }
    },
    {
      id: "l9-ch-13",
      type: "make-move",
      title: "Endgame Challenge #13: Escort Passed Pawn",
      explanation: ["Escort passed pawn with 1.Kf3."],
      position: { fen: "8/8/6k1/8/5P2/8/5K2/8 w - - 0 1", orientation: "white", highlightSquares: ["f2", "f3"] },
      expectedMoves: ["Kf3"],
      hints: ["Escort pawn with King.", "Play 1.Kf3!"],
      feedback: { correct: "Challenge #13 Passed! Pawn escorted.", incorrect: "Play Kf3!" }
    },
    {
      id: "l9-ch-14",
      type: "make-move",
      title: "Endgame Challenge #14: Cut off King on 7th Rank",
      explanation: ["Cut off Black's King with 1.Rd7+."],
      position: { fen: "3k4/8/8/3R4/8/4K3/8/8 w - - 0 1", orientation: "white", highlightSquares: ["d5", "d7"] },
      expectedMoves: ["Rd7+"],
      hints: ["Cut off on 7th rank.", "Play 1.Rd7+!"],
      feedback: { correct: "Challenge #14 Passed! King barrier set.", incorrect: "Play Rd7+!" }
    },
    {
      id: "l9-ch-15",
      type: "make-move",
      title: "Endgame Challenge #15: Final Endgame Master Strike",
      explanation: ["Deliver final checkmate with 1.Qg7#!"],
      position: { fen: "7k/5K1P/6Q1/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["g6", "g7"] },
      expectedMoves: ["Qg7#"],
      hints: ["Checkmate on g7.", "Play 1.Qg7#!"],
      feedback: { correct: "CONGRATULATIONS! LEVEL 9 ENDGAME MASTERY COMPLETE!", incorrect: "Deliver checkmate with Qg7#!" }
    }
  ]
};

export const LEVEL_9: LearningLevel = {
  levelNumber: 9,
  title: "Endgame Mastery",
  description: "Learn how to active your King, master pawn & rook endings, harness opposition, and convert winning advantages practically.",
  skills: [
    SKILL_KING_ACTIVITY,
    SKILL_KING_PAWN_VS_KING,
    SKILL_OPPOSITION,
    SKILL_RULE_OF_THE_SQUARE,
    SKILL_QUEEN_PROMOTION,
    SKILL_ROOK_ENDGAME,
    SKILL_CONVERTING_ADVANTAGE,
    SKILL_ENDGAME_MASTERY_CHALLENGE
  ]
};
