import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: Mixed Tactical Practice (15 Exercises - Unlabeled Tactic Types)
export const SKILL_MIXED_TACTICS: LearningSkill = {
  id: "level-10-mixed-tactics",
  title: "1. Mixed Tactical Practice",
  description: "Test your tactical eye across 15 unlabelled practical positions. Inspect the board, calculate forcing moves, and strike!",
  icon: "⚡",
  category: "capstone",
  difficulty: "advanced",
  prerequisites: [],
  exercises: [
    {
      id: "l10-mt-1",
      type: "make-move",
      title: "Tactical Practice #1: Find the Best Move",
      explanation: [
        "THINK BEFORE YOU MOVE: Checks? Captures? Threats?",
        "White's Knight on e6 can fork Black's King on e8 and Queen on c7!",
        "Play 1.Nxc7+ to deliver a knight fork!"
      ],
      position: { fen: "r3k2r/2q2ppp/p3N3/3p4/8/2P5/PP3PPP/R2QK2R w KQkq - 0 1", orientation: "white", highlightSquares: ["e6", "c7"] },
      expectedMoves: ["Nxc7+"],
      hints: ["Look for a knight fork.", "Attack Black's King and Queen.", "Capture the c7 Queen with check!"],
      feedback: { correct: "Great vision! Knight fork executed.", incorrect: "Look for knight tactical jumps with check." }
    },
    {
      id: "l10-mt-2",
      type: "make-move",
      title: "Tactical Practice #2: Find the Best Move",
      explanation: [
        "White's Bishop on g5 pins Black's Knight on f6 to the Queen on d8.",
        "Play 1.Nd5 to exploit the pinned piece!"
      ],
      position: { fen: "r1bqk2r/ppp2ppp/2n2n2/3pp1B1/4P3/2NP1N2/PPP2PPP/R2QKB1R w KQkq - 0 6", orientation: "white", highlightSquares: ["c3", "d5"] },
      expectedMoves: ["Nd5"],
      hints: ["Capitalize on Black's pinned knight on f6.", "Move your knight to d5.", "Play 1.Nd5!"],
      feedback: { correct: "Brilliant exploitation of the pin!", incorrect: "Exploit the pin with Nd5!" }
    },
    {
      id: "l10-mt-3",
      type: "make-move",
      title: "Tactical Practice #3: Find the Best Move",
      explanation: [
        "Black's back rank is vulnerable!",
        "Deliver back-rank checkmate with 1.Rd8#!"
      ],
      position: { fen: "3r2k1/5ppp/8/8/3R4/8/5PPP/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "d8"] },
      expectedMoves: ["Rxd8#"],
      hints: ["Check the back rank.", "Capture Black's Rook on d8.", "Play 1.Rxd8#!"],
      feedback: { correct: "Back-rank checkmate delivered!", incorrect: "Play Rxd8#!" }
    },
    {
      id: "l10-mt-4",
      type: "make-move",
      title: "Tactical Practice #4: Find the Best Move",
      explanation: [
        "White's Queen and Bishop battery targets f7.",
        "Deliver checkmate with 1.Qxf7#!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5", orientation: "white", highlightSquares: ["f3", "f7"] },
      expectedMoves: ["Qxf7#"],
      hints: ["Look for a mating strike on f7.", "Capture f7 with Queen.", "Play 1.Qxf7#!"],
      feedback: { correct: "Scholar's checkmate pattern executed!", incorrect: "Play Qxf7#!" }
    },
    {
      id: "l10-mt-5",
      type: "make-move",
      title: "Tactical Practice #5: Find the Best Move",
      explanation: [
        "Black's Queen on c7 is aligned with White's Rook on c1.",
        "Move your Bishop with 1.Bxh7+ to reveal a discovered attack on Black's Queen!"
      ],
      position: { fen: "2r1k2r/ppq2ppp/2b1pn2/8/1b1P4/2N2N2/PPQ2PPP/2R1KB1R w Kk - 0 12", orientation: "white", highlightSquares: ["c3", "e4"] },
      expectedMoves: ["Ne5"],
      hints: ["Activate central forces.", "Move your knight to e5.", "Play 1.Ne5!"],
      feedback: { correct: "Great knight centralization!", incorrect: "Play Ne5!" }
    },
    {
      id: "l10-mt-6",
      type: "make-move",
      title: "Tactical Practice #6: Find the Best Move",
      explanation: [
        "Deflect Black's defender!",
        "Play 1.Bxf7+ to force Black's King away."
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 4 5", orientation: "white", highlightSquares: ["c4", "f7"] },
      expectedMoves: ["Bxf7+"],
      hints: ["Forcing check on f7.", "Capture f7 with Bishop.", "Play 1.Bxf7+!"],
      feedback: { correct: "Deflection tactic executed!", incorrect: "Play Bxf7+!" }
    },
    {
      id: "l10-mt-7",
      type: "make-move",
      title: "Tactical Practice #7: Find the Best Move",
      explanation: [
        "White's Queen skewers Black's King on e8 and Rook on h8.",
        "Play 1.Qe5+ to deliver a skewer!"
      ],
      position: { fen: "r3k2r/ppp2ppp/2n5/4p3/4Q3/3P4/PPP2PPP/R3K2R w KQkq - 0 12", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["Qe5+"],
      hints: ["Check Black's King on e5.", "Play 1.Qe5+.", "Play 1.Qe5+!"],
      feedback: { correct: "Skewer executed!", incorrect: "Play Qe5+!" }
    },
    {
      id: "l10-mt-8",
      type: "make-move",
      title: "Tactical Practice #8: Find the Best Move",
      explanation: [
        "Remove the defender of Black's e5 pawn!",
        "Play 1.Bxc6 to eliminate Black's knight defender."
      ],
      position: { fen: "r1bqk1nr/pppp1ppp/2n5/4p3/1b2P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 4", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Nxe5"],
      hints: ["Capture Black's e5 pawn.", "Play 1.Nxe5.", "Play 1.Nxe5!"],
      feedback: { correct: "Pawn captured safely!", incorrect: "Play Nxe5!" }
    },
    {
      id: "l10-mt-9",
      type: "make-move",
      title: "Tactical Practice #9: Find the Best Move",
      explanation: [
        "Consolidate your Queen position by dropping back to e2!",
        "Play 1.Qe2!"
      ],
      position: { fen: "r1bq1rk1/pppp1p1p/2n3p1/4P3/2B1Q3/8/PPP2PPP/RNB1K2R w KQ - 0 10", orientation: "white", highlightSquares: ["e4", "e2"] },
      expectedMoves: ["Qe2"],
      hints: ["Move Queen to e2.", "Play 1.Qe2.", "Play 1.Qe2!"],
      feedback: { correct: "Queen repositioned safely to e2!", incorrect: "Play Qe2!" }
    },
    {
      id: "l10-mt-10",
      type: "make-move",
      title: "Tactical Practice #10: Find the Best Move",
      explanation: [
        "Black's King is trapped. Play 1.Qxf7#!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/2P2Q2/PPP2PPP/R1B1K1NR w KQkq - 0 6", orientation: "white", highlightSquares: ["f3", "f7"] },
      expectedMoves: ["Qxf7#"],
      hints: ["Mate on f7!", "Capture f7 with Queen.", "Play 1.Qxf7#!"],
      feedback: { correct: "Checkmate!", incorrect: "Play Qxf7#!" }
    },
    {
      id: "l10-mt-11",
      type: "make-move",
      title: "Tactical Practice #11: Find the Best Move",
      explanation: [
        "Fork King and Queen with 1.Nxc7+!"
      ],
      position: { fen: "r3k2r/2q2ppp/p3N3/3p4/8/2P5/PP3PPP/R2QK2R w KQkq - 0 1", orientation: "white", highlightSquares: ["e6", "c7"] },
      expectedMoves: ["Nxc7+"],
      hints: ["Capture c7 Queen.", "Play 1.Nxc7+.", "Play 1.Nxc7+!"],
      feedback: { correct: "Material captured!", incorrect: "Play Nxc7+!" }
    },
    {
      id: "l10-mt-12",
      type: "make-move",
      title: "Tactical Practice #12: Find the Best Move",
      explanation: [
        "Deliver back-rank checkmate on d8!"
      ],
      position: { fen: "3r2k1/5ppp/8/8/3R4/8/5PPP/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "d8"] },
      expectedMoves: ["Rxd8#"],
      hints: ["Capture on d8.", "Play 1.Rxd8#!"],
      feedback: { correct: "Checkmate!", incorrect: "Play Rxd8#!" }
    },
    {
      id: "l10-mt-13",
      type: "make-move",
      title: "Tactical Practice #13: Find the Best Move",
      explanation: [
        "Exploit pinned knight on f6 with 1.Nd5!"
      ],
      position: { fen: "r1bqk2r/ppp2ppp/2n2n2/3pp1B1/4P3/2NP1N2/PPP2PPP/R2QKB1R w KQkq - 0 6", orientation: "white", highlightSquares: ["c3", "d5"] },
      expectedMoves: ["Nd5"],
      hints: ["Move knight to d5.", "Play 1.Nd5!"],
      feedback: { correct: "Knight centralized!", incorrect: "Play Nd5!" }
    },
    {
      id: "l10-mt-14",
      type: "make-move",
      title: "Tactical Practice #14: Find the Best Move",
      explanation: [
        "Skewer King and Rook with 1.Qe5+!"
      ],
      position: { fen: "r3k2r/ppp2ppp/2n5/4p3/4Q3/3P4/PPP2PPP/R3K2R w KQkq - 0 12", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["Qe5+"],
      hints: ["Check on e5.", "Play 1.Qe5+!"],
      feedback: { correct: "Skewer check delivered!", incorrect: "Play Qe5+!" }
    },
    {
      id: "l10-mt-15",
      type: "make-move",
      title: "Tactical Practice #15: Find the Best Move",
      explanation: [
        "Deliver final tactical checkmate with 1.Qxf7#!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5", orientation: "white", highlightSquares: ["f3", "f7"] },
      expectedMoves: ["Qxf7#"],
      hints: ["Mate on f7.", "Play 1.Qxf7#!"],
      feedback: { correct: "Mastery Tactical Challenge Completed!", incorrect: "Play Qxf7#!" }
    }
  ]
};

// SKILL 2: Opening Practice (6 Exercises)
export const SKILL_OPENING_PRACTICE: LearningSkill = {
  id: "level-10-opening-practice",
  title: "2. Opening Practice",
  description: "Apply opening principles: control the center, develop minor pieces toward the center, castle early for King safety, and connect your Rooks.",
  icon: "🚀",
  category: "capstone",
  difficulty: "intermediate",
  prerequisites: ["level-10-mixed-tactics"],
  exercises: [
    {
      id: "l10-op-1",
      type: "make-move",
      title: "Opening Decision #1: Central Pawn Opening",
      explanation: [
        "OPENING PRINCIPLE: Stake a claim in the center on move 1!",
        "Play 1.e4 to control d5 and e5 and open lines for your Bishop and Queen."
      ],
      position: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", orientation: "white", highlightSquares: ["e2", "e4"] },
      expectedMoves: ["e4"],
      hints: ["Open with a central pawn.", "Push e2 to e4.", "Play 1.e4!"],
      feedback: { correct: "Great opening move! 1.e4 controls key central squares.", incorrect: "Control the center with 1.e4!" }
    },
    {
      id: "l10-op-2",
      type: "make-move",
      title: "Opening Decision #2: Develop Minor Piece & Attack",
      explanation: [
        "Black played 1...e5. Develop your Knight to f3 to attack e5 and control d4!",
        "Play 1.Nf3!"
      ],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white", highlightSquares: ["g1", "f3"] },
      expectedMoves: ["Nf3"],
      hints: ["Develop your King's Knight.", "Move knight to f3.", "Play 1.Nf3!"],
      feedback: { correct: "Perfect development! 1.Nf3 develops with a threat on e5.", incorrect: "Develop your knight to f3!" }
    },
    {
      id: "l10-op-3",
      type: "make-move",
      title: "Opening Decision #3: Develop Bishop to Active Square",
      explanation: [
        "Develop your Light-Squared Bishop to c4 to target Black's weak f7 pawn!",
        "Play 1.Bc4!"
      ],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white", highlightSquares: ["f1", "c4"] },
      expectedMoves: ["Bc4"],
      hints: ["Develop your Bishop actively.", "Move Bishop to c4.", "Play 1.Bc4!"],
      feedback: { correct: "Active development! Italian Game setup complete.", incorrect: "Develop your bishop to c4!" }
    },
    {
      id: "l10-op-4",
      type: "make-move",
      title: "Opening Decision #4: King Safety & Castling",
      explanation: [
        "KING SAFETY: Castle Kingside (O-O) to tuck your King safely into the corner and activate your h1 Rook!",
        "Play 1.O-O!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", orientation: "white", highlightSquares: ["e1", "g1"] },
      expectedMoves: ["O-O"],
      hints: ["Castle kingside for King safety.", "Move King two squares right.", "Play 1.O-O!"],
      feedback: { correct: "King safe! Castling completes early opening setup.", incorrect: "Castle kingside with O-O!" }
    },
    {
      id: "l10-op-5",
      type: "make-move",
      title: "Opening Decision #5: Queen's Gambit Central Push",
      explanation: [
        "In 1.d4 openings, challenge Black's center with 2.c4!",
        "Play 1.c4!"
      ],
      position: { fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2", orientation: "white", highlightSquares: ["c2", "c4"] },
      expectedMoves: ["c4"],
      hints: ["Challenge Black's d5 pawn.", "Push c2 to c4.", "Play 1.c4!"],
      feedback: { correct: "Queen's Gambit played! Excellent central challenge.", incorrect: "Play 1.c4!" }
    },
    {
      id: "l10-op-6",
      type: "make-move",
      title: "Opening Decision #6: Connect Rooks",
      explanation: [
        "Develop your Dark-Squared Bishop to d2 or e3 to clear the 1st rank and connect your Rooks!",
        "Play 1.Be3!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1bn2/2bpp3/2B1P3/2PP1N2/PP1NBPPP/R2Q1RK1 w - - 0 8", orientation: "white", highlightSquares: ["e2", "d3"] },
      expectedMoves: ["Re1"],
      hints: ["Centralize your Rook on e1.", "Play 1.Re1.", "Play 1.Re1!"],
      feedback: { correct: "Rooks connected and centralized!", incorrect: "Play Re1!" }
    }
  ]
};

// SKILL 3: Middlegame Practice (10 Exercises - Checklist Driven)
export const SKILL_MIDDLEGAME_PRACTICE: LearningSkill = {
  id: "level-10-middlegame-practice",
  title: "3. Middlegame Practice",
  description: "Master middlegame decision making: use the THINK BEFORE YOU MOVE checklist to evaluate checks, captures, threats, piece activity, and open files.",
  icon: "⚔️",
  category: "capstone",
  difficulty: "advanced",
  prerequisites: ["level-10-opening-practice"],
  exercises: [
    {
      id: "l10-mp-1",
      type: "make-move",
      title: "Middlegame Decision #1: Claim the Open File",
      explanation: [
        "THINK BEFORE YOU MOVE: 1. Checks? 2. Captures? 3. Threats? 4. King safety? 5. Worst piece? 6. Plan?",
        "Your Rook on a1 is inactive. Seize the open e-file with 1.Re1!"
      ],
      position: { fen: "r2qr1k1/ppp2ppp/2n1bn2/3p4/3P4/2PB1N2/PP3PPP/R2QR1K1 w - - 0 11", orientation: "white", highlightSquares: ["e1", "e5"] },
      expectedMoves: ["h3"],
      hints: ["Create a luft escape square for your King.", "Push h3.", "Play 1.h3!"],
      feedback: { correct: "Great position safety! Created luft for King.", incorrect: "Play h3!" }
    },
    {
      id: "l10-mp-2",
      type: "make-move",
      title: "Middlegame Decision #2: Outpost Knight Centralization",
      explanation: [
        "Centralize your Knight onto the e5 outpost square!",
        "Play 1.Ne5!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1bn2/3pp3/2B1P3/2PP1N2/PP3PPP/R1BQR1K1 w - - 0 9", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Bb5"],
      hints: ["Pin Black's knight on c6.", "Move Bishop to b5.", "Play 1.Bb5!"],
      feedback: { correct: "Active bishop pinning knight!", incorrect: "Play Bb5!" }
    },
    {
      id: "l10-mp-3",
      type: "make-move",
      title: "Middlegame Decision #3: Improve Worst Piece",
      explanation: [
        "White's c1 Bishop is undeveloped. Bring it to g5 to pin Black's f6 Knight!",
        "Play 1.Bg5!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1bn2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQR1K1 w - - 0 8", orientation: "white", highlightSquares: ["c1", "g5"] },
      expectedMoves: ["Bg5"],
      hints: ["Develop your dark-squared bishop to g5.", "Move to g5.", "Play 1.Bg5!"],
      feedback: { correct: "Worst piece improved! Pin created on f6.", incorrect: "Develop your bishop to g5!" }
    },
    {
      id: "l10-mp-4",
      type: "make-move",
      title: "Middlegame Decision #4: Pawn Break in Center",
      explanation: [
        "Strike at Black's center with 1.d4!",
        "Play 1.d4!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R2QKB1R w KQ - 0 6", orientation: "white", highlightSquares: ["e2", "e3"] },
      expectedMoves: ["e3"],
      hints: ["Solidify center with e3.", "Play 1.e3.", "Play 1.e3!"],
      feedback: { correct: "Solid pawn structure built!", incorrect: "Play e3!" }
    },
    {
      id: "l10-mp-5",
      type: "make-move",
      title: "Middlegame Decision #5: Kingside Attacking Battery",
      explanation: [
        "Form a Queen and Bishop battery targeting h7 with 1.Qc2!",
        "Play 1.Qc2!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1b3/3np3/2B5/3P1N2/PPP1QPPP/RN3RK1 w - - 0 10", orientation: "white", highlightSquares: ["e2", "c2"] },
      expectedMoves: ["Re1"],
      hints: ["Centralize Rook on e1.", "Play 1.Re1.", "Play 1.Re1!"],
      feedback: { correct: "Rook centralized on open file!", incorrect: "Play Re1!" }
    },
    {
      id: "l10-mp-6",
      type: "make-move",
      title: "Middlegame Decision #6: Restrict Enemy Knight",
      explanation: [
        "Play 1.a3 to prevent Black's knight/bishop from hopping to b4!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1bn2/3p4/3P4/2PB1N2/PP3PPP/R1BQR1K1 w - - 0 11", orientation: "white", highlightSquares: ["a2", "a3"] },
      expectedMoves: ["h3"],
      hints: ["Prevent enemy intrusions with h3 or a3.", "Play 1.h3.", "Play 1.h3!"],
      feedback: { correct: "Prophylactic pawn move executed!", incorrect: "Play h3!" }
    },
    {
      id: "l10-mp-7",
      type: "make-move",
      title: "Middlegame Decision #7: Trade Inactive Piece",
      explanation: [
        "Trade off your passive bishop for Black's active knight on d4 with 1.Nxd4!",
        "Play 1.Nxd4!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1b3/3n4/3N4/3P4/PPP1QPPP/RN3RK1 w - - 0 10", orientation: "white", highlightSquares: ["d4", "c6"] },
      expectedMoves: ["Nxc6"],
      hints: ["Trade knights on c6.", "Play 1.Nxc6.", "Play 1.Nxc6!"],
      feedback: { correct: "Simplified and doubled enemy pawns!", incorrect: "Play Nxc6!" }
    },
    {
      id: "l10-mp-8",
      type: "make-move",
      title: "Middlegame Decision #8: King Safety Luft",
      explanation: [
        "Create a escape square (luft) for your King with 1.h3 to avoid back-rank threats!",
        "Play 1.h3!"
      ],
      position: { fen: "r2r2k1/ppp2ppp/2n1bn2/3p4/3P4/2PB1N2/PP3PPP/R3R1K1 w - - 0 12", orientation: "white", highlightSquares: ["h2", "h3"] },
      expectedMoves: ["h3"],
      hints: ["Push h3 for King safety.", "Play 1.h3.", "Play 1.h3!"],
      feedback: { correct: "Back-rank mate eliminated!", incorrect: "Play h3!" }
    },
    {
      id: "l10-mp-9",
      type: "make-move",
      title: "Middlegame Decision #9: Double Rooks on Open File",
      explanation: [
        "Double your Rooks on the open e-file with 1.Rae1!",
        "Play 1.Rae1!"
      ],
      position: { fen: "r3r1k1/ppp2ppp/2n1bn2/3p4/3P4/2PB1N2/PP3PPP/R3R1K1 w - - 0 12", orientation: "white", highlightSquares: ["a1", "e1"] },
      expectedMoves: ["Rad1"],
      hints: ["Centralize d1 rook.", "Play 1.Rad1.", "Play 1.Rad1!"],
      feedback: { correct: "Rooks doubled on central files!", incorrect: "Play Rad1!" }
    },
    {
      id: "l10-mp-10",
      type: "make-move",
      title: "Middlegame Decision #10: Central Knight Outpost",
      explanation: [
        "Plant your Knight firmly on d5!",
        "Play 1.Nd5!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1bn2/3p4/3P4/2PB1N2/PP3PPP/R2QR1K1 w - - 0 11", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Ne5"],
      hints: ["Plant knight on e5.", "Play 1.Ne5.", "Play 1.Ne5!"],
      feedback: { correct: "Middlegame Mastery Completed!", incorrect: "Play Ne5!" }
    }
  ]
};

// SKILL 4: Endgame Practice (10 Exercises)
export const SKILL_ENDGAME_PRACTICE: LearningSkill = {
  id: "level-10-endgame-practice",
  title: "4. Endgame Practice",
  description: "Refine endgame technique across pawn, queen, and rook endgames. Focus on King activity, opposition, passed pawns, and converting material.",
  icon: "🏁",
  category: "capstone",
  difficulty: "advanced",
  prerequisites: ["level-10-middlegame-practice"],
  exercises: [
    {
      id: "l10-ep-1",
      type: "make-move",
      title: "Endgame Practice #1: Activate King in Pawn Ending",
      explanation: ["Centralize your King with 1.Ke3 to control key central squares."],
      position: { fen: "8/8/4k3/8/3P4/8/4K3/8 w - - 0 1", orientation: "white", highlightSquares: ["e2", "e3"] },
      expectedMoves: ["Ke3"],
      hints: ["Centralize your King on e3.", "Play 1.Ke3!"],
      feedback: { correct: "King centralized!", incorrect: "Play Ke3!" }
    },
    {
      id: "l10-ep-2",
      type: "make-move",
      title: "Endgame Practice #2: King & Pawn Promotion",
      explanation: ["Play 1.Kf7 to clear e8 for pawn promotion."],
      position: { fen: "3k4/4P3/4K3/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e6", "f7"] },
      expectedMoves: ["Kf7", "Kc7", "e8=Q"],
      hints: ["Shield e8 with King on f7.", "Play 1.Kf7!"],
      feedback: { correct: "Pawn promotion setup complete!", incorrect: "Play Kf7!" }
    },
    {
      id: "l10-ep-3",
      type: "make-move",
      title: "Endgame Practice #3: Claim Opposition",
      explanation: ["Take direct opposition with 1.Ke5."],
      position: { fen: "4k3/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["Ke5"],
      hints: ["Step opposite Black's King.", "Play 1.Ke5!"],
      feedback: { correct: "Direct opposition claimed!", incorrect: "Play Ke5!" }
    },
    {
      id: "l10-ep-4",
      type: "make-move",
      title: "Endgame Practice #4: Rule of the Square",
      explanation: ["Push 1.a5 to outrun Black's King."],
      position: { fen: "8/8/6k1/8/P7/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["a4", "a5"] },
      expectedMoves: ["a5", "Kf6", "a6", "Ke6", "a7", "Kd7", "a8=Q"],
      hints: ["Push a-pawn.", "Play 1.a5!"],
      feedback: { correct: "Passed pawn outran King!", incorrect: "Play a5!" }
    },
    {
      id: "l10-ep-5",
      type: "make-move",
      title: "Endgame Practice #5: Queen Checkmate",
      explanation: ["Deliver checkmate with 1.Qg7#."],
      position: { fen: "6k1/7Q/6K1/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["h7", "g7"] },
      expectedMoves: ["Qg7#"],
      hints: ["Checkmate on g7.", "Play 1.Qg7#!"],
      feedback: { correct: "Queen checkmate delivered!", incorrect: "Play Qg7#!" }
    },
    {
      id: "l10-ep-6",
      type: "make-move",
      title: "Endgame Practice #6: Rook Behind Passed Pawn",
      explanation: ["Apply Tarrasch Rule with 1.Ra1."],
      position: { fen: "8/8/6k1/8/P7/8/8/1R2K3 w - - 0 1", orientation: "white", highlightSquares: ["b1", "a1"] },
      expectedMoves: ["Ra1"],
      hints: ["Rook to a1.", "Play 1.Ra1!"],
      feedback: { correct: "Rook placed behind passed pawn!", incorrect: "Play Ra1!" }
    },
    {
      id: "l10-ep-7",
      type: "make-move",
      title: "Endgame Practice #7: Simplify Material Advantage",
      explanation: ["Trade Rooks with 1.Rxd8# to checkmate."],
      position: { fen: "3r2k1/5ppp/8/8/3R4/8/5PPP/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "d8"] },
      expectedMoves: ["Rxd8#"],
      hints: ["Capture d8.", "Play 1.Rxd8#!"],
      feedback: { correct: "Material trade & mate!", incorrect: "Play Rxd8#!" }
    },
    {
      id: "l10-ep-8",
      type: "make-move",
      title: "Endgame Practice #8: Hold Defensive Draw",
      explanation: ["Take defensive opposition on 1.Ke1."],
      position: { fen: "8/8/8/8/4p3/4k3/4K3/8 w - - 0 1", orientation: "white", highlightSquares: ["e2", "e1"] },
      expectedMoves: ["Ke1"],
      hints: ["Move King to e1.", "Play 1.Ke1!"],
      feedback: { correct: "Defensive draw held!", incorrect: "Play Ke1!" }
    },
    {
      id: "l10-ep-9",
      type: "make-move",
      title: "Endgame Practice #9: Intercept Enemy Pawn",
      explanation: ["Step inside the square with 1.Kc3."],
      position: { fen: "8/8/6k1/p7/8/8/2K5/8 w - - 0 1", orientation: "white", highlightSquares: ["c2", "c3"] },
      expectedMoves: ["Kc3"],
      hints: ["Move King to c3.", "Play 1.Kc3!"],
      feedback: { correct: "Pawn intercepted!", incorrect: "Play Kc3!" }
    },
    {
      id: "l10-ep-10",
      type: "make-move",
      title: "Endgame Practice #10: Outflank Enemy King",
      explanation: ["Outflank Black's King with 1.Kf6."],
      position: { fen: "4k3/8/4K3/8/4P3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e6", "f6"] },
      expectedMoves: ["Kf6", "Kf8", "e5"],
      hints: ["Outflank on f6.", "Play 1.Kf6!"],
      feedback: { correct: "Endgame Practice Completed!", incorrect: "Play Kf6!" }
    }
  ]
};

// SKILL 5: Full Practice Game
export const SKILL_PRACTICE_GAME: LearningSkill = {
  id: "level-10-practice-game",
  title: "5. Full Practice Game",
  description: "Play a full, unrated practice game against Stockfish right in your browser to test your practical skills under realistic conditions.",
  icon: "🎮",
  category: "capstone",
  difficulty: "intermediate",
  prerequisites: ["level-10-endgame-practice"],
  exercises: [
    {
      id: "l10-pg-1",
      type: "make-move",
      title: "Full Practice Game vs Stockfish",
      explanation: [
        "Unrated Practice Game against Stockfish Engine.",
        "Choose your color, clock, and difficulty level, then play out a full game.",
        "Play 1.e4 to start your practice game!"
      ],
      position: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", orientation: "white", highlightSquares: ["e2", "e4"] },
      expectedMoves: ["e4"],
      hints: ["Start with 1.e4 or 1.d4.", "Play 1.e4!", "Play 1.e4!"],
      feedback: { correct: "Practice game initiated! Good luck!", incorrect: "Play 1.e4 to start!" }
    }
  ]
};

// SKILL 6: ChessMind Mastery Test (20 Challenges - Unlabelled Categories)
export const SKILL_CHESSMIND_MASTERY_TEST: LearningSkill = {
  id: "level-10-mastery-challenge",
  title: "6. ChessMind Mastery Test",
  description: "The ultimate 20-challenge capstone exam covering coordinates, pieces, captures, checkmate, tactics, opening, middlegame, calculation, and endgames.",
  icon: "🎓",
  category: "capstone",
  difficulty: "advanced",
  prerequisites: ["level-10-practice-game"],
  exercises: [
    {
      id: "l10-mc-1",
      type: "make-move",
      title: "Mastery Challenge #1: Find the Winning Move",
      explanation: ["Deliver knight fork with 1.Nxc7+!"],
      position: { fen: "r3k2r/2q2ppp/p3N3/3p4/8/2P5/PP3PPP/R2QK2R w KQkq - 0 1", orientation: "white", highlightSquares: ["e6", "c7"] },
      expectedMoves: ["Nxc7+"],
      hints: ["Fork pieces.", "Play 1.Nxc7+!"],
      feedback: { correct: "Challenge #1 Passed!", incorrect: "Play Nxc7+!" }
    },
    {
      id: "l10-mc-2",
      type: "make-move",
      title: "Mastery Challenge #2: Find the Winning Move",
      explanation: ["Exploit pinned knight with 1.Nd5!"],
      position: { fen: "r1bqk2r/ppp2ppp/2n2n2/3pp1B1/4P3/2NP1N2/PPP2PPP/R2QKB1R w KQkq - 0 6", orientation: "white", highlightSquares: ["c3", "d5"] },
      expectedMoves: ["Nd5"],
      hints: ["Move knight to d5.", "Play 1.Nd5!"],
      feedback: { correct: "Challenge #2 Passed!", incorrect: "Play Nd5!" }
    },
    {
      id: "l10-mc-3",
      type: "make-move",
      title: "Mastery Challenge #3: Find the Winning Move",
      explanation: ["Back-rank mate with 1.Rxd8#!"],
      position: { fen: "3r2k1/5ppp/8/8/3R4/8/5PPP/6K1 w - - 0 1", orientation: "white", highlightSquares: ["d4", "d8"] },
      expectedMoves: ["Rxd8#"],
      hints: ["Capture d8.", "Play 1.Rxd8#!"],
      feedback: { correct: "Challenge #3 Passed!", incorrect: "Play Rxd8#!" }
    },
    {
      id: "l10-mc-4",
      type: "make-move",
      title: "Mastery Challenge #4: Find the Winning Move",
      explanation: ["Deliver checkmate on f7 with 1.Qxf7#!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5", orientation: "white", highlightSquares: ["f3", "f7"] },
      expectedMoves: ["Qxf7#"],
      hints: ["Checkmate on f7.", "Play 1.Qxf7#!"],
      feedback: { correct: "Challenge #4 Passed!", incorrect: "Play Qxf7#!" }
    },
    {
      id: "l10-mc-5",
      type: "make-move",
      title: "Mastery Challenge #5: Find the Winning Move",
      explanation: ["Centralize Knight on e5!"],
      position: { fen: "2r1k2r/ppq2ppp/2b1pn2/8/1b1P4/2N2N2/PPQ2PPP/2R1KB1R w Kk - 0 12", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Ne5"],
      hints: ["Move knight to e5.", "Play 1.Ne5!"],
      feedback: { correct: "Challenge #5 Passed!", incorrect: "Play Ne5!" }
    },
    {
      id: "l10-mc-6",
      type: "make-move",
      title: "Mastery Challenge #6: Find the Winning Move",
      explanation: ["Deflection check with 1.Bxf7+!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 4 5", orientation: "white", highlightSquares: ["c4", "f7"] },
      expectedMoves: ["Bxf7+"],
      hints: ["Capture f7 with Bishop.", "Play 1.Bxf7+!"],
      feedback: { correct: "Challenge #6 Passed!", incorrect: "Play Bxf7+!" }
    },
    {
      id: "l10-mc-7",
      type: "make-move",
      title: "Mastery Challenge #7: Find the Winning Move",
      explanation: ["Deliver skewer check on 1.Qe5+!"],
      position: { fen: "r3k2r/ppp2ppp/2n5/4p3/4Q3/3P4/PPP2PPP/R3K2R w KQkq - 0 12", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["Qe5+"],
      hints: ["Check on e5.", "Play 1.Qe5+!"],
      feedback: { correct: "Challenge #7 Passed!", incorrect: "Play Qe5+!" }
    },
    {
      id: "l10-mc-8",
      type: "make-move",
      title: "Mastery Challenge #8: Find the Winning Move",
      explanation: ["Capture e5 pawn with 1.Nxe5!"],
      position: { fen: "r1bqk1nr/pppp1ppp/2n5/4p3/1b2P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 4", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Nxe5"],
      hints: ["Capture e5 pawn.", "Play 1.Nxe5!"],
      feedback: { correct: "Challenge #8 Passed!", incorrect: "Play Nxe5!" }
    },
    {
      id: "l10-mc-9",
      type: "make-move",
      title: "Mastery Challenge #9: Find the Winning Move",
      explanation: ["Open with 1.e4!"],
      position: { fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", orientation: "white", highlightSquares: ["e2", "e4"] },
      expectedMoves: ["e4"],
      hints: ["Push e4.", "Play 1.e4!"],
      feedback: { correct: "Challenge #9 Passed!", incorrect: "Play 1.e4!" }
    },
    {
      id: "l10-mc-10",
      type: "make-move",
      title: "Mastery Challenge #10: Find the Winning Move",
      explanation: ["Develop Knight to f3!"],
      position: { fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", orientation: "white", highlightSquares: ["g1", "f3"] },
      expectedMoves: ["Nf3"],
      hints: ["Develop knight.", "Play 1.Nf3!"],
      feedback: { correct: "Challenge #10 Passed!", incorrect: "Play Nf3!" }
    },
    {
      id: "l10-mc-11",
      type: "make-move",
      title: "Mastery Challenge #11: Find the Winning Move",
      explanation: ["Develop Bishop to c4!"],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", orientation: "white", highlightSquares: ["f1", "c4"] },
      expectedMoves: ["Bc4"],
      hints: ["Move Bishop to c4.", "Play 1.Bc4!"],
      feedback: { correct: "Challenge #11 Passed!", incorrect: "Play Bc4!" }
    },
    {
      id: "l10-mc-12",
      type: "make-move",
      title: "Mastery Challenge #12: Find the Winning Move",
      explanation: ["Castle kingside with 1.O-O!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", orientation: "white", highlightSquares: ["e1", "g1"] },
      expectedMoves: ["O-O"],
      hints: ["Castle kingside.", "Play 1.O-O!"],
      feedback: { correct: "Challenge #12 Passed!", incorrect: "Play O-O!" }
    },
    {
      id: "l10-mc-13",
      type: "make-move",
      title: "Mastery Challenge #13: Find the Winning Move",
      explanation: ["Create King luft with 1.h3!"],
      position: { fen: "r2r2k1/ppp2ppp/2n1bn2/3p4/3P4/2PB1N2/PP3PPP/R3R1K1 w - - 0 12", orientation: "white", highlightSquares: ["h2", "h3"] },
      expectedMoves: ["h3"],
      hints: ["Push h3.", "Play 1.h3!"],
      feedback: { correct: "Challenge #13 Passed!", incorrect: "Play h3!" }
    },
    {
      id: "l10-mc-14",
      type: "make-move",
      title: "Mastery Challenge #14: Find the Winning Move",
      explanation: ["Centralize King with 1.Ke3!"],
      position: { fen: "8/8/4k3/8/3P4/8/4K3/8 w - - 0 1", orientation: "white", highlightSquares: ["e2", "e3"] },
      expectedMoves: ["Ke3"],
      hints: ["King to e3.", "Play 1.Ke3!"],
      feedback: { correct: "Challenge #14 Passed!", incorrect: "Play Ke3!" }
    },
    {
      id: "l10-mc-15",
      type: "make-move",
      title: "Mastery Challenge #15: Find the Winning Move",
      explanation: ["Clear e8 for pawn promotion with 1.Kf7!"],
      position: { fen: "3k4/4P3/4K3/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e6", "f7"] },
      expectedMoves: ["Kf7", "Kc7", "e8=Q"],
      hints: ["King to f7.", "Play 1.Kf7!"],
      feedback: { correct: "Challenge #15 Passed!", incorrect: "Play Kf7!" }
    },
    {
      id: "l10-mc-16",
      type: "make-move",
      title: "Mastery Challenge #16: Find the Winning Move",
      explanation: ["Take opposition with 1.Ke5!"],
      position: { fen: "4k3/8/8/8/4K3/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["Ke5"],
      hints: ["King to e5.", "Play 1.Ke5!"],
      feedback: { correct: "Challenge #16 Passed!", incorrect: "Play Ke5!" }
    },
    {
      id: "l10-mc-17",
      type: "make-move",
      title: "Mastery Challenge #17: Find the Winning Move",
      explanation: ["Sprint passed pawn with 1.a5!"],
      position: { fen: "8/8/6k1/8/P7/8/8/4K3 w - - 0 1", orientation: "white", highlightSquares: ["a4", "a5"] },
      expectedMoves: ["a5", "Kf6", "a6", "Ke6", "a7", "Kd7", "a8=Q"],
      hints: ["Push a-pawn.", "Play 1.a5!"],
      feedback: { correct: "Challenge #17 Passed!", incorrect: "Play a5!" }
    },
    {
      id: "l10-mc-18",
      type: "make-move",
      title: "Mastery Challenge #18: Find the Winning Move",
      explanation: ["Checkmate with 1.Qg7#!"],
      position: { fen: "6k1/7Q/6K1/8/8/8/8/8 w - - 0 1", orientation: "white", highlightSquares: ["h7", "g7"] },
      expectedMoves: ["Qg7#"],
      hints: ["Checkmate on g7.", "Play 1.Qg7#!"],
      feedback: { correct: "Challenge #18 Passed!", incorrect: "Play Qg7#!" }
    },
    {
      id: "l10-mc-19",
      type: "make-move",
      title: "Mastery Challenge #19: Find the Winning Move",
      explanation: ["Place Rook behind passed pawn on 1.Ra1!"],
      position: { fen: "8/8/6k1/8/P7/8/8/1R2K3 w - - 0 1", orientation: "white", highlightSquares: ["b1", "a1"] },
      expectedMoves: ["Ra1"],
      hints: ["Rook to a1.", "Play 1.Ra1!"],
      feedback: { correct: "Challenge #19 Passed!", incorrect: "Play Ra1!" }
    },
    {
      id: "l10-mc-20",
      type: "make-move",
      title: "Mastery Challenge #20: Final Capstone Master Strike",
      explanation: ["Deliver checkmate on f7 with 1.Qxf7#!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 5", orientation: "white", highlightSquares: ["f3", "f7"] },
      expectedMoves: ["Qxf7#"],
      hints: ["Checkmate on f7.", "Play 1.Qxf7#!"],
      feedback: { correct: "CONGRATULATIONS! YOU HAVE GRADUATED CHESSMIND LEARN CHESS!", incorrect: "Deliver checkmate with Qxf7#!" }
    }
  ]
};

export const LEVEL_10: LearningLevel = {
  levelNumber: 10,
  title: "Practice & Mastery",
  description: "Put everything together through practical positions, practice games, and the final ChessMind Mastery Test.",
  skills: [
    SKILL_MIXED_TACTICS,
    SKILL_OPENING_PRACTICE,
    SKILL_MIDDLEGAME_PRACTICE,
    SKILL_ENDGAME_PRACTICE,
    SKILL_PRACTICE_GAME,
    SKILL_CHESSMIND_MASTERY_TEST
  ]
};
