import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: Forcing Moves
export const SKILL_FORCING_MOVES: LearningSkill = {
  id: "level-8-forcing-moves",
  title: "1. Forcing Moves",
  description: "Always calculate Forcing Moves (Checks, Captures, Threats) first. They restrict your opponent's options and demand an immediate answer.",
  icon: "⚡",
  category: "calculation",
  difficulty: "intermediate",
  prerequisites: [],
  exercises: [
    {
      id: "l8-fm-1-check",
      type: "make-move",
      title: "Forcing Move #1: Direct Checkmate Attack",
      explanation: [
        "PRACTICAL THINKING CHECKLIST:",
        "BEFORE YOU MOVE: 1. Checks? | 2. Captures? | 3. Threats? | 4. Candidate moves? | 5. Opponent reply? | 6. Final position? | 7. Blunder check?",
        "Look for the most forcing move first: A check against the enemy King!",
        "Play 1.Bxf7+ to deliver a forcing check that breaks open Black's defense!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5", orientation: "white", highlightSquares: ["c4", "f7"] },
      expectedMoves: ["Bxf7+"],
      hints: [
        "Start with checks, captures, and threats.",
        "Capture the f7 pawn with your Bishop to give check.",
        "Play Bxf7+!"
      ],
      feedback: {
        correct: "Brilliant! You calculated the forcing check first, tearing open Black's defense.",
        incorrect: "You missed a forcing move! Look for the bishop check on f7."
      }
    },
    {
      id: "l8-fm-2-capture",
      type: "make-move",
      title: "Forcing Move #2: Material Winning Capture",
      explanation: [
        "Check Step 2: Captures!",
        "Black's Queen moved to d5 without protection.",
        "Capture Black's Queen with 1.exd5!"
      ],
      position: { fen: "r1b1k2r/ppp2ppp/2n2n2/3qp3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 6", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["exd5"],
      hints: [
        "Look for free captures.",
        "Capture Black's Queen with your e4 pawn.",
        "Play exd5!"
      ],
      feedback: {
        correct: "Great calculation! Spotting free captures immediately wins material.",
        incorrect: "Look closely at Black's undefended Queen on d5. Play exd5!"
      }
    },
    {
      id: "l8-fm-3-threat",
      type: "make-move",
      title: "Forcing Move #3: Powerful Central Threat",
      explanation: [
        "Check Step 3: Threats!",
        "When no direct winning check or capture exists, create an unavoidable threat.",
        "Leap your Knight to d5 to threaten c7 and b6!"
      ],
      position: { fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 7", orientation: "white", highlightSquares: ["f3", "d5"] },
      expectedMoves: ["Nd5"],
      hints: [
        "Look for a powerful forward threat.",
        "Leap your Knight to d5.",
        "Play Nd5!"
      ],
      feedback: {
        correct: "Awesome threat! Nd5 forces Black onto the defensive.",
        incorrect: "Move your Knight from f3 to d5."
      }
    },
    {
      id: "l8-fm-4-fork",
      type: "make-move",
      title: "Forcing Move #4: Tactical Knight Fork Combination",
      explanation: [
        "Calculate the 2-move forcing sequence:",
        "1.Nf6+ checks the King on e8 AND attacks the Queen on d5!",
        "After Black recaptures with 1...gxf6, collect the Queen on d5 with 2.Qxd5!"
      ],
      position: { fen: "r3k2r/ppp2ppp/2n2n2/3qp3/4N3/8/PPP2PPP/R2Q1RK1 w kq - 0 10", orientation: "white", highlightSquares: ["e4", "f6"] },
      expectedMoves: ["Nf6+", "gxf6", "Qxd5"],
      hints: [
        "Look for a knight check on f6 that also attacks the queen.",
        "Play Nf6+ then collect the Queen on d5!",
        "Play Nf6+!"
      ],
      feedback: {
        correct: "Masterful calculation! Nf6+ forced the King to respond, leaving the Queen unprotected.",
        incorrect: "Leap your Knight to f6 to give check and fork the Queen!"
      }
    },
    {
      id: "l8-fm-5-skewer",
      type: "make-move",
      title: "Forcing Move #5: Back-Rank Mate Threat",
      explanation: [
        "Scan forcing moves: White's Rook on a7 can deliver a lethal back-rank checkmate!",
        "Play 1.Ra8#!"
      ],
      position: { fen: "6k1/R4ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1", orientation: "white", highlightSquares: ["a7", "a8"] },
      expectedMoves: ["Ra8#"],
      hints: [
        "Target the empty 8th rank.",
        "Move Rook to a8 for checkmate.",
        "Play Ra8#!"
      ],
      feedback: {
        correct: "Checkmate! The forcing move 1.Ra8# ends the game immediately.",
        incorrect: "Move your a7 Rook to a8 to deliver checkmate."
      }
    }
  ]
};

// SKILL 2: Candidate Moves
export const SKILL_CANDIDATE_MOVES: LearningSkill = {
  id: "level-8-candidate-moves",
  title: "2. Candidate Moves",
  description: "Do not calculate randomly. Identify 2–3 promising candidate moves, prefer forcing moves, and select the best one.",
  icon: "🧭",
  category: "calculation",
  difficulty: "intermediate",
  prerequisites: ["level-8-forcing-moves"],
  exercises: [
    {
      id: "l8-cm-1-compare",
      type: "choose-move",
      title: "Compare Candidates: Forcing vs Passive",
      explanation: [
        "You are White in a standard opening position.",
        "Compare candidate moves: 1.Bg5 (forces a pin on Black's knight), 2.a3 (passive), 3.h3 (passive).",
        "Which move is the superior forcing candidate?"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      options: [
        {
          id: "opt-bg5-cm",
          moveSan: "Bg5",
          label: "Bg5 — Active forcing candidate creating a pin threat",
          explanation: "Creates an immediate tactical pin against Black's f6 Knight.",
          isCorrect: true
        },
        {
          id: "opt-a3-cm",
          moveSan: "a3",
          label: "a3 — Passive flank move",
          explanation: "Inferior candidate: fails to create threats or force Black's hand.",
          isCorrect: false
        },
        {
          id: "opt-h3-cm",
          moveSan: "h3",
          label: "h3 — Slow prophylactic move",
          explanation: "Passive candidate: does not exert active pressure.",
          isCorrect: false
        }
      ],
      hints: ["Select Bg5 to pin the f6 Knight."],
      feedback: {
        correct: "Correct! Bg5 is the strongest candidate because it creates immediate tactical pressure.",
        incorrect: "Prefer forcing candidates. Choose Bg5!"
      }
    },
    {
      id: "l8-cm-2-select-best",
      type: "make-move",
      title: "Select and Execute the Strongest Candidate",
      explanation: [
        "Candidate evaluation: You want to activate your dark-squared Bishop.",
        "Candidate A: 1.Bf4 (active on long diagonal). Candidate B: 1.b3 (slow).",
        "Play 1.Bf4!"
      ],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["c1", "f4"] },
      expectedMoves: ["Bf4"],
      hints: ["Play Bf4 to activate your dark-squared Bishop."],
      feedback: {
        correct: "Great candidate selection! Bf4 mobilizes your Bishop onto a key active diagonal.",
        incorrect: "Move your Bishop to f4."
      }
    },
    {
      id: "l8-cm-3-tactic-vs-quiet",
      type: "make-move",
      title: "Tactical Pawn Break Candidate",
      explanation: [
        "Evaluate candidate moves in the Italian Game:",
        "Candidate A: 1.d4 (strikes at the center with tempo). Candidate B: 1.a3 (quiet).",
        "Play the forcing central candidate: 1.d4!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5", orientation: "white", highlightSquares: ["d2", "d4"] },
      expectedMoves: ["d4"],
      hints: ["Push your d-pawn to d4."],
      feedback: {
        correct: "Excellent! 1.d4 challenges the center directly and opens diagonal lines.",
        incorrect: "Push pawn from d2 to d4."
      }
    },
    {
      id: "l8-cm-4-defend-vs-attack",
      type: "choose-move",
      title: "Defensive Candidate vs Counter-Attack",
      explanation: [
        "Black has a piece active on d5. Look at candidate moves:",
        "Candidate 1: 1.O-O (solid, secures King). Candidate 2: 1.g4 (weakens King).",
        "Select the sound candidate move!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n5/3np3/2B5/3P1N2/PPP2PPP/RN1QK2R w KQ - 0 8", orientation: "white" },
      options: [
        {
          id: "opt-oo-cm",
          moveSan: "O-O",
          label: "O-O — Castle to secure King and complete development",
          explanation: "Best candidate: completes development while keeping King safe.",
          isCorrect: true
        },
        {
          id: "opt-g4-cm",
          moveSan: "g4",
          label: "g4 — Aggressive but weakening pawn push",
          explanation: "Inferior candidate: exposes your King.",
          isCorrect: false
        },
        {
          id: "opt-a3-cm2",
          moveSan: "a3",
          label: "a3 — Passive wing move",
          explanation: "Slow candidate.",
          isCorrect: false
        }
      ],
      hints: ["Select O-O."],
      feedback: {
        correct: "Correct! Castling O-O is the best candidate move to complete your development safely.",
        incorrect: "Choose O-O for King safety and development!"
      }
    },
    {
      id: "l8-cm-5-space-break",
      type: "make-move",
      title: "Pawn Break Space Candidate",
      explanation: [
        "Evaluate space candidates: 1.e5 (claims central space and kicks f6 Knight) vs 1.h3 (passive).",
        "Play 1.e5!"
      ],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p4/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["e5"],
      hints: ["Push e4 pawn to e5."],
      feedback: {
        correct: "Dominant candidate! 1.e5 gains space and forces Black's Knight to retreat.",
        incorrect: "Push e4 pawn to e5."
      }
    }
  ]
};

// SKILL 3: Opponent's Best Response
export const SKILL_OPPONENT_RESPONSE: LearningSkill = {
  id: "level-8-opponent-response",
  title: "3. Opponent's Best Response",
  description: "Never assume your opponent will play a bad move. Always calculate your opponent's strongest reply before playing your move.",
  icon: "🛡️",
  category: "calculation",
  difficulty: "intermediate",
  prerequisites: ["level-8-candidate-moves"],
  exercises: [
    {
      id: "l8-or-1-predict-reply",
      type: "make-move",
      title: "Calculate Opponent's Strongest Reply",
      explanation: [
        "CALCULATION HABIT: 'After I make my move, what is my opponent's strongest reply?'",
        "You play 1.O-O. Black's strongest reply is 1...Bxc3 threatening your pawn structure.",
        "Play 1.O-O, observe Black's 1...Bxc3 reply, then recapture with 2.dxc3!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5", orientation: "white", highlightSquares: ["e1", "g1"] },
      expectedMoves: ["O-O", "Bxc3", "dxc3"],
      hints: [
        "Castle Kingside with O-O.",
        "Observe Black's reply (Bxc3).",
        "Recapture with dxc3!"
      ],
      feedback: {
        correct: "Good calculation! You accounted for Black's strongest reply (Bxc3) and recaptured cleanly.",
        incorrect: "Castle O-O, wait for Black's reply, then recapture on c3!"
      }
    },
    {
      id: "l8-or-2-defend-reply",
      type: "make-move",
      title: "Anticipate the Counter-Threat",
      explanation: [
        "Play 1.Bg5 pinning the f6 Knight.",
        "Calculate Black's response: Black will play 1...h6 kicking your Bishop.",
        "Execute 1.Bg5, see 1...h6, then trade with 2.Bxf6!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/R1BQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["c1", "g5"] },
      expectedMoves: ["Bg5", "h6", "Bxf6"],
      hints: [
        "Move Bishop to g5.",
        "After Black plays h6, capture the f6 Knight with Bxf6!"
      ],
      feedback: {
        correct: "Spot on! You anticipated Black's h6 counter-move and executed the planned trade.",
        incorrect: "Play Bg5, wait for Black's h6, then play Bxf6."
      }
    },
    {
      id: "l8-or-3-tactic-defence",
      type: "make-move",
      title: "Calculate Central Exchanges and Reply",
      explanation: [
        "Play 1.cxd5 opening the c-file.",
        "Calculate Black's reply: Black will recapture 1...exd5.",
        "Play 1.cxd5, see 1...exd5, then complete development with 2.Bf4!"
      ],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["c4", "d5"] },
      expectedMoves: ["cxd5", "exd5", "Bf4"],
      hints: [
        "Capture d5 with your c4 pawn.",
        "After Black recaptures exd5, play Bf4!"
      ],
      feedback: {
        correct: "Clean line calculated! You foresaw the central pawn trade and activated your Bishop.",
        incorrect: "Play cxd5, wait for Black's reply, then play Bf4."
      }
    },
    {
      id: "l8-or-4-king-check-reply",
      type: "make-move",
      title: "Calculate Defender Trade and Central Opening",
      explanation: [
        "Play 1.Bxf6 removing Black's Knight defender.",
        "Black will recapture 1...Bxf6.",
        "Execute 1.Bxf6, observe 1...Bxf6, then open the center with 2.cxd5!"
      ],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p2B1/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["g5", "f6"] },
      expectedMoves: ["Bxf6", "Bxf6", "cxd5"],
      hints: [
        "Capture f6 with your g5 Bishop.",
        "After Black recaptures Bxf6, play cxd5!"
      ],
      feedback: {
        correct: "Great foresight! You calculated Black's recapturing move and followed up with a central strike.",
        incorrect: "Play Bxf6, wait for Black's reply, then play cxd5."
      }
    },
    {
      id: "l8-or-5-counter-attack",
      type: "make-move",
      title: "Punish Opponent's Miscalculated Reply",
      explanation: [
        "In the Italian Game, play 1.d4 striking at e5.",
        "Black replies 1...exd4.",
        "Recapture with 2.cxd4 to build a massive White pawn center!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5", orientation: "white", highlightSquares: ["d2", "d4"] },
      expectedMoves: ["d4", "exd4", "cxd4"],
      hints: [
        "Push d2 pawn to d4.",
        "After Black plays exd4, recapture with cxd4!"
      ],
      feedback: {
        correct: "Dominant center! You calculated Black's pawn trade and established full central control.",
        incorrect: "Play d4, wait for exd4, then play cxd4."
      }
    }
  ]
};

// SKILL 4: Two-Move Calculation
export const SKILL_TWO_MOVE_CALC: LearningSkill = {
  id: "level-8-two-move-calc",
  title: "4. Two-Move Calculation",
  description: "Calculate 2-move tactical variations physically on the board: Move 1 -> Opponent Reply -> Move 2 (Continuation).",
  icon: "🎯",
  category: "calculation",
  difficulty: "intermediate",
  prerequisites: ["level-8-opponent-response"],
  exercises: [
    {
      id: "l8-tm-1-fork",
      type: "make-move",
      title: "2-Move Calculation: Knight Fork Combination",
      explanation: [
        "CALCULATE THE VARIATION:",
        "Move 1: 1.Nf6+ (check King e8 & attack Queen d5)",
        "Opponent Reply: 1...gxf6",
        "Move 2: 2.Qxd5 (win Queen!)",
        "Physically play the full 2-move variation!"
      ],
      position: { fen: "r3k2r/ppp2ppp/2n2n2/3qp3/4N3/8/PPP2PPP/R2Q1RK1 w kq - 0 10", orientation: "white", highlightSquares: ["e4", "f6"] },
      expectedMoves: ["Nf6+", "gxf6", "Qxd5"],
      hints: [
        "Move 1: Knight check on f6.",
        "After Black recaptures (gxf6), Move 2: Capture Queen on d5!"
      ],
      feedback: {
        correct: "Calculated perfectly! You saw 1.Nf6+ gxf6 2.Qxd5 and won the Queen.",
        incorrect: "Play Nf6+, wait for Black's reply, then capture Qxd5!"
      }
    },
    {
      id: "l8-tm-2-pin",
      type: "make-move",
      title: "2-Move Calculation: Win Pinned Piece",
      explanation: [
        "Calculate the 2-move sequence:",
        "Move 1: 1.Bg5 (pin f6 Knight)",
        "Opponent Reply: 1...h6",
        "Move 2: 2.Bxf6 (trade Bishop for Knight and ruin Black's structure)",
        "Play the sequence on the board!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/4p3/1bB1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["c1", "g5"] },
      expectedMoves: ["Bg5", "h6", "Bxf6"],
      hints: [
        "Move 1: Bg5.",
        "Move 2: After h6, play Bxf6!"
      ],
      feedback: {
        correct: "2-Move calculation mastered! 1.Bg5 h6 2.Bxf6 wins the battle for f6.",
        incorrect: "Play Bg5, wait for Black's h6, then play Bxf6."
      }
    },
    {
      id: "l8-tm-3-skewer",
      type: "make-move",
      title: "2-Move Calculation: Rook Skewer Win",
      explanation: [
        "Calculate the 2-move skewer line:",
        "Move 1: 1.Rd8+ (check King on e8)",
        "Opponent Reply: 1...Ke7 (King moves away)",
        "Move 2: 2.Rxh8 (win the undefended h8 Rook!)",
        "Play the full 2-move variation!"
      ],
      position: { fen: "4k2r/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white", highlightSquares: ["d1", "d8"] },
      expectedMoves: ["Rd8+", "Ke7", "Rxh8"],
      hints: [
        "Move 1: Rd8+.",
        "Move 2: After Ke7, play Rxh8!"
      ],
      feedback: {
        correct: "Skewer calculated! 1.Rd8+ Ke7 2.Rxh8 won Black's corner Rook.",
        incorrect: "Play Rd8+, wait for Ke7, then play Rxh8."
      }
    },
    {
      id: "l8-tm-4-remove-defender",
      type: "make-move",
      title: "2-Move Calculation: Remove the Defender",
      explanation: [
        "Calculate 2 moves ahead:",
        "Move 1: 1.Bxf6 (remove d5 defender)",
        "Opponent Reply: 1...Bxf6",
        "Move 2: 2.cxd5 (win central pawn!)",
        "Play the line on the board!"
      ],
      position: { fen: "r2q1rk1/ppp1bppp/2n1pn2/3p2B1/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["g5", "f6"] },
      expectedMoves: ["Bxf6", "Bxf6", "cxd5"],
      hints: [
        "Move 1: Capture f6 with g5 Bishop.",
        "Move 2: After Bxf6, play decision move cxd5!"
      ],
      feedback: {
        correct: "Tactical removal of defender! 1.Bxf6 Bxf6 2.cxd5 wins central material.",
        incorrect: "Play Bxf6, wait for Bxf6, then play cxd5."
      }
    },
    {
      id: "l8-tm-5-mate",
      type: "make-move",
      title: "2-Move Calculation: Forced Mate in Two",
      explanation: [
        "Calculate the forced mating sequence:",
        "Move 1: 1.Ra8 (back-rank attack)",
        "Opponent Reply: 1...Qf8 (forced block)",
        "Move 2: 2.Rxf8# (Checkmate!)",
        "Deliver checkmate in two moves!"
      ],
      position: { fen: "2q3k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", orientation: "white", highlightSquares: ["a1", "a8"] },
      expectedMoves: ["Ra8", "Qf8", "Rxf8#"],
      hints: [
        "Move 1: Ra8.",
        "Move 2: After Qf8, play Rxf8#!"
      ],
      feedback: {
        correct: "Checkmate! 1.Ra8 Qf8 2.Rxf8# calculated and executed flawlessly.",
        incorrect: "Play Ra8, wait for Qf8, then play Rxf8#."
      }
    }
  ]
};

// SKILL 5: Three-Move Calculation
export const SKILL_THREE_MOVE_CALC: LearningSkill = {
  id: "level-8-three-move-calc",
  title: "5. Three-Move Calculation",
  description: "Calculate 3-move tactical combinations: Move 1 -> Reply 1 -> Move 2 -> Reply 2 -> Move 3 (Checkmate or Material Win).",
  icon: "🧠",
  category: "calculation",
  difficulty: "advanced",
  prerequisites: ["level-8-two-move-calc"],
  exercises: [
    {
      id: "l8-3m-1-deflection",
      type: "make-move",
      title: "3-Move Calculation: Queen Deflection Checkmate",
      explanation: [
        "CALCULATE 3 MOVES AHEAD:",
        "Move 1: 1.Rxd5! (Queen sacrifice / capture on d5)",
        "Reply 1: 1...Rxd5",
        "Move 2: 2.Qe8# (CHECKMATE!)",
        "Physically play all moves of the variation on the board!"
      ],
      position: { fen: "3r2k1/ppp2ppp/8/3q4/8/3R4/PPP2PPP/4Q1K1 w - - 0 1", orientation: "white", highlightSquares: ["d3", "d5"] },
      expectedMoves: ["Rxd5", "Rxd5", "Qe8#"],
      hints: [
        "Move 1: Capture Black's Queen on d5 (Rxd5).",
        "Move 2: After Black plays Rxd5, deliver back-rank checkmate with Qe8#!"
      ],
      feedback: {
        correct: "MASTERFUL 3-MOVE CALCULATION! 1.Rxd5 Rxd5 2.Qe8# delivered brilliant back-rank checkmate.",
        incorrect: "Play Rxd5, wait for Rxd5, then play Qe8#!"
      }
    },
    {
      id: "l8-3m-2-greek-gift",
      type: "make-move",
      title: "3-Move Calculation: Greek Gift Attack Sequence",
      explanation: [
        "Calculate the 3-move Greek Gift attack line:",
        "Move 1: 1.Bxh7+ (sacrifice Bishop to check King)",
        "Reply 1: 1...Kxh7",
        "Move 2: 2.Ng5+ (Knight check)",
        "Reply 2: 2...Kg8",
        "Move 3: 3.Qh5 (launch Queen to threaten Qh7# checkmate!)",
        "Play the full 3-move attack variation!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R2QK2R w KQ - 0 8", orientation: "white", highlightSquares: ["d3", "h7"] },
      expectedMoves: ["Bxh7+", "Kxh7", "Ng5+", "Kg8", "Qh5"],
      hints: [
        "Move 1: Bxh7+.",
        "Move 2: After Kxh7, play Ng5+.",
        "Move 3: After Kg8, play Qh5!"
      ],
      feedback: {
        correct: "Outstanding 3-move calculation! 1.Bxh7+ Kxh7 2.Ng5+ Kg8 3.Qh5 creates unstoppable mating threats.",
        incorrect: "Follow the sequence: Bxh7+, Ng5+, then Qh5!"
      }
    },
    {
      id: "l8-3m-3-clearance",
      type: "make-move",
      title: "3-Move Calculation: Back-Rank Clearance Combination",
      explanation: [
        "Calculate 3 moves ahead:",
        "Move 1: 1.Rxe5 (Queen capture!)",
        "Reply 1: 1...Rxd4",
        "Move 2: 2.Qxd4 (recapture Rook and win material!)",
        "Play the complete 3-move variation!"
      ],
      position: { fen: "3r2k1/pp3ppp/8/4q3/3R4/8/PPP2PPP/3QR1K1 w - - 0 1", orientation: "white", highlightSquares: ["e1", "e5"] },
      expectedMoves: ["Rxe5", "Rxd4", "Qxd4"],
      hints: [
        "Move 1: Rxe5.",
        "Move 2: After Rxd4, play Qxd4!"
      ],
      feedback: {
        correct: "Flawless calculation! 1.Rxe5 Rxd4 2.Qxd4 wins material cleanly.",
        incorrect: "Play Rxe5, wait for Rxd4, then play Qxd4."
      }
    },
    {
      id: "l8-3m-4-dis-check",
      type: "make-move",
      title: "3-Move Calculation: Discovered Check & Queen Win",
      explanation: [
        "Calculate the discovered check 3-move line:",
        "Move 1: 1.Nxf6+ (discovered check from e1 Rook)",
        "Reply 1: 1...Kf8",
        "Move 2: 2.Nxd5 (win Black's Queen!)",
        "Reply 2: 2...Nxd4",
        "Move 3: 3.Qxd4 (recapture and maintain Queen advantage)",
        "Play the 3-move variation!"
      ],
      position: { fen: "r3k2r/ppp2ppp/2n2n2/3q4/3NN3/8/PPP2PPP/R2QR1K1 w kq - 0 11", orientation: "white", highlightSquares: ["e4", "f6"] },
      expectedMoves: ["Nxf6+", "Kf8", "Nxd5", "Nxd4", "Qxd4"],
      hints: [
        "Move 1: Discovered check with Nxf6+.",
        "Move 2: Capture Queen with Nxd5.",
        "Move 3: Recapture Knight with Qxd4!"
      ],
      feedback: {
        correct: "Tactical mastery! Discovered check 1.Nxf6+ led to winning the Queen and central control.",
        incorrect: "Play Nxf6+, wait for Kf8, play Nxd5, wait for Nxd4, play Qxd4!"
      }
    },
    {
      id: "l8-3m-5-deflection-mate",
      type: "make-move",
      title: "3-Move Calculation: Deflection & Knight Fork Check",
      explanation: [
        "Calculate 3 moves ahead:",
        "Move 1: 1.Nxd5 (Queen capture!)",
        "Reply 1: 1...Bxe1",
        "Move 2: 2.Rxe1 (recapture Rook)",
        "Reply 2: 2...Rad8",
        "Move 3: 3.Ne7+ (deliver Knight check on e7!)",
        "Play the full 3-move variation!"
      ],
      position: { fen: "r4rk1/ppp2ppp/2n5/3q4/1b6/2N5/PPP1QPPP/R3R1K1 w - - 0 12", orientation: "white", highlightSquares: ["c3", "d5"] },
      expectedMoves: ["Nxd5", "Bxe1", "Rxe1", "Rad8", "Ne7+"],
      hints: [
        "Move 1: Nxd5.",
        "Move 2: After Bxe1, play Rxe1.",
        "Move 3: After Rad8, play Ne7+!"
      ],
      feedback: {
        correct: "Brilliant 3-move calculation! 1.Nxd5 Bxe1 2.Rxe1 Rad8 3.Ne7+ maintains complete material dominance.",
        incorrect: "Play Nxd5, wait for reply, play Rxe1, wait for reply, play Ne7+!"
      }
    }
  ]
};

// SKILL 6: Blunder Check
export const SKILL_BLUNDER_CHECK: LearningSkill = {
  id: "level-8-blunder-check",
  title: "6. Blunder Check",
  description: "Form the essential safety habit: before committing to a move, ask 'What can my opponent do next?' Avoid blunders!",
  icon: "🛑",
  category: "calculation",
  difficulty: "intermediate",
  prerequisites: ["level-8-three-move-calc"],
  exercises: [
    {
      id: "l8-bc-1-greedy-capture",
      type: "avoid-mistake",
      title: "Blunder Check #1: Avoid the Poisoned Sacrifice",
      explanation: [
        "BLUNDER CHECK HABIT: 'Before I move, what can my opponent do next?'",
        "In this position, 1.Bxf7+ looks tempting, but it is a BLUNDER that loses a piece without enough attack!",
        "Avoid 1.Bxf7+ and play the safe developing move 1.d3 instead!"
      ],
      position: { fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 0 6", orientation: "white", highlightSquares: ["d2", "d3"] },
      expectedMoves: ["d3"],
      mistakeMoveSan: "Bxf7+",
      hints: [
        "Do NOT play Bxf7+.",
        "Play d3 to develop and support e4 safely."
      ],
      feedback: {
        correct: "Blunder avoided! 1.d3 is solid and maintains your piece development.",
        incorrect: "Play d3!",
        mistakeFeedback: "BLUNDER DETECTED! Sacrificing 1.Bxf7+ loses a piece after 1...Kxf7 without sufficient attack. Play 1.d3 instead!"
      }
    },
    {
      id: "l8-bc-2-hung-queen",
      type: "avoid-mistake",
      title: "Blunder Check #2: Moving Defender Hangs Queen",
      explanation: [
        "Blunder check scan: Black's Queen is on d5 and White's Queen is on d1.",
        "If you play 1.Nxe5, you BLUNDER your Queen on d1!",
        "Avoid 1.Nxe5 and play 1.exd5 to win Black's Queen!"
      ],
      position: { fen: "r1b1k2r/ppp2ppp/2n2n2/3qp3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 6", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["exd5"],
      mistakeMoveSan: "Nxe5",
      hints: [
        "Do NOT move the f3 Knight.",
        "Capture Black's Queen with exd5."
      ],
      feedback: {
        correct: "Great blunder check! Capturing exd5 wins Black's Queen cleanly.",
        incorrect: "Play exd5!",
        mistakeFeedback: "BLUNDER DETECTED! Playing 1.Nxe5 leaves your Queen on d1 completely unprotected! Capture Black's Queen with 1.exd5!"
      }
    },
    {
      id: "l8-bc-3-back-rank-mate",
      type: "avoid-mistake",
      title: "Blunder Check #3: Missed Checkmate Trap",
      explanation: [
        "Check forcing moves first! Playing a slow pawn move like 1.h3 blunders a win when you have checkmate in two.",
        "Play 1.Qe8+ for the forced mate line!"
      ],
      position: { fen: "3r2k1/ppp2ppp/8/8/4Q3/8/PPP2PPP/4R1K1 w - - 0 1", orientation: "white", highlightSquares: ["e4", "e8"] },
      expectedMoves: ["Qe8+"],
      mistakeMoveSan: "h3",
      hints: ["Play Qe8+ for forced mate."],
      feedback: {
        correct: "Great calculation! 1.Qe8+ forces checkmate.",
        incorrect: "Play Qe8+!",
        mistakeFeedback: "BLUNDER! Playing 1.h3 misses an immediate forced checkmate. Play 1.Qe8+!"
      }
    },
    {
      id: "l8-bc-4-unprotected-piece",
      type: "avoid-mistake",
      title: "Blunder Check #4: Dropping a Knight",
      explanation: [
        "Blunder check: Playing 1.Nxd5 looks like a central pawn win, but Black recaptures 1...exd5 winning your Knight!",
        "Play 1.cxd5 instead!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R2QK2R w KQ - 0 8", orientation: "white", highlightSquares: ["c4", "d5"] },
      expectedMoves: ["cxd5"],
      mistakeMoveSan: "Nxd5",
      hints: ["Play 1.cxd5 with your c-pawn."],
      feedback: {
        correct: "Solid! 1.cxd5 maintains material equality while opening the c-file.",
        incorrect: "Play cxd5!",
        mistakeFeedback: "BLUNDER DETECTED! 1.Nxd5 loses a piece after 1...exd5. Capture with your pawn using 1.cxd5!"
      }
    },
    {
      id: "l8-bc-5-king-exposure",
      type: "choose-move",
      title: "Blunder Check #5: Exposing Your King",
      explanation: [
        "Blunder check: 1.g4 pushes pawns directly in front of your castled King, creating a massive blunder.",
        "Which move is the safe, solid choice?"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      options: [
        {
          id: "opt-h3-bc-safe",
          moveSan: "h3",
          label: "h3 — Safe prophylactic move",
          explanation: "Keeps King shelter completely solid.",
          isCorrect: true
        },
        {
          id: "opt-g4-bc-blunder",
          moveSan: "g4",
          label: "g4 — Weakening pawn surge",
          explanation: "BLUNDER! Destroys your King's pawn cover.",
          isCorrect: false
        },
        {
          id: "opt-d4-bc-pawn",
          moveSan: "d4",
          label: "d4 — Central pawn break",
          explanation: "Decent central move.",
          isCorrect: false
        }
      ],
      hints: ["Choose h3."],
      feedback: {
        correct: "Blunder check passed! h3 keeps your King position safe and sound.",
        incorrect: "g4 is a blunder! Choose h3 for safety."
      }
    },
    {
      id: "l8-bc-6-tactical-trap",
      type: "avoid-mistake",
      title: "Blunder Check #6: Stepping into a Pin Trap",
      explanation: [
        "Blunder check: 1.Nxe5 looks like winning a pawn, but Black plays 1...Nxe5 or 1...Bxc3 winning material!",
        "Play 1.O-O to castle safely!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5", orientation: "white", highlightSquares: ["e1", "g1"] },
      expectedMoves: ["O-O"],
      mistakeMoveSan: "Nxe5",
      hints: ["Castle Kingside with O-O."],
      feedback: {
        correct: "Castle complete! 1.O-O secures your King without falling for tactical traps.",
        incorrect: "Play O-O!",
        mistakeFeedback: "BLUNDER DETECTED! 1.Nxe5 falls into tactical traps after 1...Nxe5. Castle safely with 1.O-O!"
      }
    }
  ]
};

// SKILL 7: Calculate the Whole Line
export const SKILL_FULL_LINE_CALC: LearningSkill = {
  id: "level-8-full-line-calc",
  title: "7. Calculate the Whole Line",
  description: "Calculate full multi-move variations from starting move to checkmate or winning final position before committing.",
  icon: "🔗",
  category: "calculation",
  difficulty: "advanced",
  prerequisites: ["level-8-blunder-check"],
  exercises: [
    {
      id: "l8-fl-1-combination",
      type: "make-move",
      title: "Full Line #1: 3-Move Deflection Checkmate",
      explanation: [
        "Calculate the full 3-move line before playing:",
        "1.Rxd5! Rxd5 2.Qe8#",
        "Execute the entire winning sequence!"
      ],
      position: { fen: "3r2k1/ppp2ppp/8/3q4/8/3R4/PPP2PPP/4Q1K1 w - - 0 1", orientation: "white", highlightSquares: ["d3", "d5"] },
      expectedMoves: ["Rxd5", "Rxd5", "Qe8#"],
      hints: [
        "1. Capture Queen on d5.",
        "2. Deliver Queen checkmate on e8!"
      ],
      feedback: {
        correct: "Full line calculated and executed! 1.Rxd5 Rxd5 2.Qe8# delivered checkmate.",
        incorrect: "Execute the line: Rxd5 -> Qe8#!"
      }
    },
    {
      id: "l8-fl-2-knight-fork-line",
      type: "make-move",
      title: "Full Line #2: Fork & Queen Collection",
      explanation: [
        "Calculate full sequence: 1.Nf6+ gxf6 2.Qxd5",
        "Play the full material-winning line!"
      ],
      position: { fen: "r3k2r/ppp2ppp/2n2n2/3qp3/4N3/8/PPP2PPP/R2Q1RK1 w kq - 0 10", orientation: "white", highlightSquares: ["e4", "f6"] },
      expectedMoves: ["Nf6+", "gxf6", "Qxd5"],
      hints: [
        "1. Nf6+.",
        "2. Capture Qxd5!"
      ],
      feedback: {
        correct: "Full line executed! Knight fork 1.Nf6+ won Black's Queen.",
        incorrect: "Play Nf6+ then Qxd5!"
      }
    },
    {
      id: "l8-fl-3-back-rank-combination",
      type: "make-move",
      title: "Full Line #3: Back Rank Clearance Mating Line",
      explanation: [
        "Calculate full line: 1.Rxe5! Rxd4 2.Qxd4",
        "Play the full sequence on the board!"
      ],
      position: { fen: "3r2k1/pp3ppp/8/4q3/3R4/8/PPP2PPP/3QR1K1 w - - 0 1", orientation: "white", highlightSquares: ["e1", "e5"] },
      expectedMoves: ["Rxe5", "Rxd4", "Qxd4"],
      hints: [
        "1. Rxe5.",
        "2. Qxd4!"
      ],
      feedback: {
        correct: "Calculated flawlessly! 1.Rxe5 Rxd4 2.Qxd4 wins material cleanly.",
        incorrect: "Play Rxe5 -> Qxd4!"
      }
    },
    {
      id: "l8-fl-4-remove-guard",
      type: "make-move",
      title: "Full Line #4: Remove Defender & Win Central Material",
      explanation: [
        "Calculate 2 moves: 1.Bxf6 Bxf6 2.cxd5",
        "Play the material winning line!"
      ],
      position: { fen: "r2q1rk1/ppp1bppp/2n1pn2/3p2B1/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["g5", "f6"] },
      expectedMoves: ["Bxf6", "Bxf6", "cxd5"],
      hints: [
        "1. Bxf6.",
        "2. cxd5!"
      ],
      feedback: {
        correct: "Full line executed! Removing the defender won central control.",
        incorrect: "Play Bxf6 then cxd5!"
      }
    },
    {
      id: "l8-fl-5-discovered-attack",
      type: "make-move",
      title: "Full Line #5: Discovered Check Queen Capture",
      explanation: [
        "Calculate full line: 1.Nxf6+ Kf8 2.Nxd5",
        "Execute the discovered check sequence!"
      ],
      position: { fen: "r3k2r/ppp2ppp/2n2n2/3q4/3NN3/8/PPP2PPP/R2QR1K1 w kq - 0 11", orientation: "white", highlightSquares: ["e4", "f6"] },
      expectedMoves: ["Nxf6+", "Kf8", "Nxd5"],
      hints: [
        "1. Discovered check Nxf6+.",
        "2. Win Queen with Nxd5!"
      ],
      feedback: {
        correct: "Full line completed! 1.Nxf6+ Kf8 2.Nxd5 wins Black's Queen.",
        incorrect: "Play Nxf6+ then Nxd5!"
      }
    }
  ]
};

// SKILL 8: Final Calculation Challenge
export const SKILL_CALCULATION_CHALLENGE: LearningSkill = {
  id: "level-8-calculation-challenge",
  title: "8. Final Calculation Challenge",
  description: "Final Level 8 Assessment! Solve 15 multi-move tactical calculation positions (80%+ score required for mastery).",
  icon: "🏆",
  category: "calculation",
  difficulty: "advanced",
  prerequisites: ["level-8-full-line-calc"],
  exercises: [
    {
      id: "l8-cc-1-check",
      type: "make-move",
      title: "Task 1 of 15: Forcing Check Attack",
      explanation: ["Calculate and play 1.Bxf7+!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5", orientation: "white" },
      expectedMoves: ["Bxf7+"],
      hints: ["Play Bxf7+."],
      feedback: { correct: "Correct! Forcing check executed.", incorrect: "Play Bxf7+." }
    },
    {
      id: "l8-cc-2-capture",
      type: "make-move",
      title: "Task 2 of 15: Free Queen Capture",
      explanation: ["Capture the undefended Queen with 1.exd5!"],
      position: { fen: "r1b1k2r/ppp2ppp/2n2n2/3qp3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 6", orientation: "white" },
      expectedMoves: ["exd5"],
      hints: ["Play exd5."],
      feedback: { correct: "Correct! Queen captured.", incorrect: "Play exd5." }
    },
    {
      id: "l8-cc-3-threat",
      type: "make-move",
      title: "Task 3 of 15: Powerful Central Threat",
      explanation: ["Leap your Knight to d5 with 1.Nd5!"],
      position: { fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 7", orientation: "white" },
      expectedMoves: ["Nd5"],
      hints: ["Play Nd5."],
      feedback: { correct: "Correct! Threat launched.", incorrect: "Play Nd5." }
    },
    {
      id: "l8-cc-4-fork-line",
      type: "make-move",
      title: "Task 4 of 15: 2-Move Knight Fork Combination",
      explanation: ["Play 1.Nf6+ and capture 2.Qxd5!"],
      position: { fen: "r3k2r/ppp2ppp/2n2n2/3qp3/4N3/8/PPP2PPP/R2Q1RK1 w kq - 0 10", orientation: "white" },
      expectedMoves: ["Nf6+", "gxf6", "Qxd5"],
      hints: ["Play Nf6+ then Qxd5."],
      feedback: { correct: "Correct! Fork line calculated.", incorrect: "Play Nf6+ then Qxd5." }
    },
    {
      id: "l8-cc-5-skewer",
      type: "make-move",
      title: "Task 5 of 15: 2-Move Rook Skewer Win",
      explanation: ["Play 1.Rd8+ and capture 2.Rxh8!"],
      position: { fen: "4k2r/8/8/8/8/8/8/3R2K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Rd8+", "Ke7", "Rxh8"],
      hints: ["Play Rd8+ then Rxh8."],
      feedback: { correct: "Correct! Skewer completed.", incorrect: "Play Rd8+ then Rxh8." }
    },
    {
      id: "l8-cc-6-candidate",
      type: "choose-move",
      title: "Task 6 of 15: Select Strongest Candidate",
      explanation: ["Which move is the active forcing candidate?"],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      options: [
        { id: "opt-bg5-cc", moveSan: "Bg5", label: "Bg5 — Active forcing pin", explanation: "Pins the knight.", isCorrect: true },
        { id: "opt-a3-cc", moveSan: "a3", label: "a3 — Passive move", explanation: "Passive.", isCorrect: false }
      ],
      hints: ["Choose Bg5."],
      feedback: { correct: "Correct! Bg5 is the best candidate.", incorrect: "Choose Bg5." }
    },
    {
      id: "l8-cc-7-reply",
      type: "make-move",
      title: "Task 7 of 15: Account for Opponent Reply",
      explanation: ["Castle 1.O-O, wait for 1...Bxc3, then recapture 2.dxc3!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5", orientation: "white" },
      expectedMoves: ["O-O", "Bxc3", "dxc3"],
      hints: ["Play O-O then dxc3."],
      feedback: { correct: "Correct! Accounted for reply.", incorrect: "Play O-O then dxc3." }
    },
    {
      id: "l8-cc-8-blunder-avoid",
      type: "avoid-mistake",
      title: "Task 8 of 15: Avoid Blunder Sacrifice",
      explanation: ["Avoid 1.Bxf7+! Play 1.d3 instead."],
      position: { fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 0 6", orientation: "white" },
      expectedMoves: ["d3"],
      mistakeMoveSan: "Bxf7+",
      hints: ["Play d3."],
      feedback: { correct: "Correct! Blunder avoided.", incorrect: "Play d3.", mistakeFeedback: "BLUNDER! Play d3." }
    },
    {
      id: "l8-cc-9-3move-mate",
      type: "make-move",
      title: "Task 9 of 15: 3-Move Deflection Checkmate",
      explanation: ["Calculate 1.Rxd5 Rxd5 2.Qe8#!"],
      position: { fen: "3r2k1/ppp2ppp/8/3q4/8/3R4/PPP2PPP/4Q1K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Rxd5", "Rxd5", "Qe8#"],
      hints: ["1. Rxd5 -> 2. Qe8#!"],
      feedback: { correct: "Correct! 3-move mate calculated.", incorrect: "Play Rxd5 -> Qe8#!" }
    },
    {
      id: "l8-cc-10-pin",
      type: "make-move",
      title: "Task 10 of 15: 2-Move Pin Trade",
      explanation: ["Play 1.Bg5, wait for 1...h6, then trade 2.Bxf6!"],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/4p3/1bB1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      expectedMoves: ["Bg5", "h6", "Bxf6"],
      hints: ["Play Bg5 then Bxf6."],
      feedback: { correct: "Correct! Pin line executed.", incorrect: "Play Bg5 then Bxf6." }
    },
    {
      id: "l8-cc-11-remove-defender",
      type: "make-move",
      title: "Task 11 of 15: Remove Defender & Win Material",
      explanation: ["Play 1.Bxf6, wait for 1...Bxf6, then capture 2.cxd5!"],
      position: { fen: "r2q1rk1/ppp1bppp/2n1pn2/3p2B1/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 9", orientation: "white" },
      expectedMoves: ["Bxf6", "Bxf6", "cxd5"],
      hints: ["Play Bxf6 then cxd5."],
      feedback: { correct: "Correct! Defender removed.", incorrect: "Play Bxf6 then cxd5." }
    },
    {
      id: "l8-cc-12-dis-check",
      type: "make-move",
      title: "Task 12 of 15: Discovered Check Queen Win",
      explanation: ["Play 1.Nxf6+ and capture 2.Nxd5!"],
      position: { fen: "r3k2r/ppp2ppp/2n2n2/3q4/3NN3/8/PPP2PPP/R2QR1K1 w kq - 0 11", orientation: "white" },
      expectedMoves: ["Nxf6+", "Kf8", "Nxd5"],
      hints: ["Play Nxf6+ then Nxd5."],
      feedback: { correct: "Correct! Queen won via discovered check.", incorrect: "Play Nxf6+ then Nxd5." }
    },
    {
      id: "l8-cc-13-back-rank-clear",
      type: "make-move",
      title: "Task 13 of 15: 3-Move Back-Rank Clearance",
      explanation: ["Play 1.Rxe5, wait for 1...Rxd4, play 2.Qxd4!"],
      position: { fen: "3r2k1/pp3ppp/8/4q3/3R4/8/PPP2PPP/3QR1K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Rxe5", "Rxd4", "Qxd4"],
      hints: ["1. Rxe5 -> 2. Qxd4!"],
      feedback: { correct: "Correct! Back-rank clearance completed.", incorrect: "Play Rxe5 -> Qxd4!" }
    },
    {
      id: "l8-cc-14-pawn-break",
      type: "make-move",
      title: "Task 14 of 15: Central Space Pawn Break",
      explanation: ["Push 1.e5 to gain central space!"],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p4/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      expectedMoves: ["e5"],
      hints: ["Play e5."],
      feedback: { correct: "Correct! Central space claimed.", incorrect: "Play e5." }
    },
    {
      id: "l8-cc-15-mate-in-two",
      type: "make-move",
      title: "Task 15 of 15: Forced Back-Rank Mate in Two",
      explanation: ["Play 1.Ra8 and deliver 2.Rxf8#!"],
      position: { fen: "2q3k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Ra8", "Qf8", "Rxf8#"],
      hints: ["Play Ra8 then Rxf8#."],
      feedback: { correct: "Correct! Mate in two executed.", incorrect: "Play Ra8 then Rxf8#." }
    }
  ]
};

export const LEVEL_8: LearningLevel = {
  levelNumber: 8,
  title: "Level 8 — Tactical Calculation",
  description: "Master multi-move tactical calculation: forcing moves, candidate moves, opponent responses, 2-move & 3-move calculation lines, blunder prevention, and deep variation analysis.",
  skills: [
    SKILL_FORCING_MOVES,
    SKILL_CANDIDATE_MOVES,
    SKILL_OPPONENT_RESPONSE,
    SKILL_TWO_MOVE_CALC,
    SKILL_THREE_MOVE_CALC,
    SKILL_BLUNDER_CHECK,
    SKILL_FULL_LINE_CALC,
    SKILL_CALCULATION_CHALLENGE
  ]
};
