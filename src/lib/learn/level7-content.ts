import type { LearningLevel, LearningSkill } from "./interactive-types";

// SKILL 1: Checks, Captures, Threats
export const SKILL_CHECKS_CAPTURES_THREATS: LearningSkill = {
  id: "level-7-checks-captures-threats",
  title: "1. Checks, Captures, Threats",
  description: "Master the fundamental forcing scan: always check for Checks, Captures, and Threats before deciding your move.",
  icon: "🔍",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: [],
  exercises: [
    {
      id: "l7-cct-1-check",
      type: "make-move",
      title: "Think Step 1: Scan for Forcing Checks",
      explanation: [
        "THINK BEFORE YOU MOVE CHECKLIST:",
        "STEP 1: Checks? | STEP 2: Captures? | STEP 3: Threats? | STEP 4: King Safety? | STEP 5: Worst Piece? | STEP 6: Plan?",
        "Always look for forcing checks first! In this position, White's Bishop and Queen target f7.",
        "Play 1.Bxf7+ to deliver a forcing check that breaks open Black's defense!"
      ],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5", orientation: "white", highlightSquares: ["c4", "f7"] },
      expectedMoves: ["Bxf7+"],
      hints: [
        "Step 1: Check for forcing moves.",
        "Check Black's King using your light-squared Bishop.",
        "Capture on f7 with check: Bxf7+!"
      ],
      feedback: {
        correct: "Brilliant! You scanned for forcing checks first and found 1.Bxf7+, stripping away Black's king safety.",
        incorrect: "You missed a forcing move! Look for a bishop check on f7."
      }
    },
    {
      id: "l7-cct-2-capture",
      type: "make-move",
      title: "Think Step 2: Scan for Free Captures",
      explanation: [
        "STEP 2 IN THE C-C-T SCAN: CAPTURES!",
        "Black's Queen just moved to d5 without sufficient protection.",
        "Scan the board for undefended captures: play 1.exd5 to win the Queen!"
      ],
      position: { fen: "r1b1k2r/ppp2ppp/2n2n2/3qp3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 6", orientation: "white", highlightSquares: ["e4", "d5"] },
      expectedMoves: ["exd5"],
      hints: [
        "Step 2: Look for undefended enemy pieces.",
        "White's e4 pawn can capture a major piece.",
        "Play exd5 to take Black's Queen!"
      ],
      feedback: {
        correct: "Great calculation! Always scan for free or hanging captures before making positional moves.",
        incorrect: "Look closely at Black's Queen on d5. Take it with your e4 pawn!"
      }
    },
    {
      id: "l7-cct-3-threat",
      type: "make-move",
      title: "Think Step 3: Create a Powerful Threat",
      explanation: [
        "STEP 3 IN THE C-C-T SCAN: THREATS!",
        "When no direct winning check or capture exists, create a tactical threat your opponent must answer.",
        "Move your Knight from f3 to d5 to create a double threat on c7 and b6!"
      ],
      position: { fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 7", orientation: "white", highlightSquares: ["f3", "d5"] },
      expectedMoves: ["Nd5"],
      hints: [
        "Step 3: Look for strong forward threats.",
        "Leap your Knight to the central d5 square.",
        "Play Nd5 to attack central squares and c7!"
      ],
      feedback: {
        correct: "Awesome! Nd5 creates immediate central pressure and tactical threats.",
        incorrect: "Leap your Knight from f3 to d5."
      }
    },
    {
      id: "l7-cct-4-scan-all",
      type: "choose-move",
      title: "Apply the Full C-C-T Scan",
      explanation: [
        "Run the 3-step scan: 1. Checks? None. 2. Captures? None clean. 3. Threats? Pin the defender!",
        "Which move creates the strongest pin threat against Black's f6 Knight?"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      options: [
        {
          id: "opt-bg5",
          moveSan: "Bg5",
          label: "Bg5 — Pin Black's Knight to the Queen",
          explanation: "Creates an immediate tactical pin threat on the f6 Knight.",
          isCorrect: true
        },
        {
          id: "opt-h3",
          moveSan: "h3",
          label: "h3 — Prevent Bg4 passively",
          explanation: "Slow defensive pawn move that creates no threat.",
          isCorrect: false
        },
        {
          id: "opt-a3",
          moveSan: "a3",
          label: "a3 — Flank pawn move",
          explanation: "Does not create a threat or improve your tactical position.",
          isCorrect: false
        }
      ],
      hints: ["Choose Bg5 to pin the f6 Knight to Black's Queen."],
      feedback: {
        correct: "Correct! Bg5 creates an active threat by pinning Black's key central defender.",
        incorrect: "You missed a forcing threat! Choose Bg5 to pin the Knight on f6."
      }
    }
  ]
};

// SKILL 2: King Safety
export const SKILL_KING_SAFETY: LearningSkill = {
  id: "level-7-king-safety",
  title: "2. King Safety",
  description: "Evaluate king safety for both sides: exploit open lines against exposed kings and fortify your own king.",
  icon: "👑",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: ["level-7-checks-captures-threats"],
  exercises: [
    {
      id: "l7-ks-1-attack-exposed",
      type: "make-move",
      title: "Attack an Uncastled Enemy King",
      explanation: [
        "Evaluate King Safety: Black's King is stuck in the center on e8 while White is ready to attack.",
        "Exploit Black's uncastled King by launching 1.Qh5! attacking e5 and preparing devastating checkmates.",
        "Move your Queen from d1 to h5!"
      ],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3", orientation: "white", highlightSquares: ["d1", "h5"] },
      expectedMoves: ["Qh5"],
      hints: [
        "Target the uncastled King on e8.",
        "Launch your Queen to the h-file.",
        "Play Qh5!"
      ],
      feedback: {
        correct: "Devastating! 1.Qh5 punishes Black's uncastled King by creating multiple mating and capturing threats.",
        incorrect: "Move your Queen from d1 to h5."
      }
    },
    {
      id: "l7-ks-2-defend-king",
      type: "make-move",
      title: "Shield Your Vulnerable King",
      explanation: [
        "Evaluate King Safety: Black is threatening Bg4 to pin your Knight and weaken your castled King's cover.",
        "Play 1.h3 to control g4 and maintain a solid pawn shield around your King!",
        "Push your h-pawn to h3!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n5/3np3/2B5/3P1N2/PPP2PPP/RN1QK2R w KQ - 0 8", orientation: "white", highlightSquares: ["h3"] },
      expectedMoves: ["h3"],
      hints: [
        "Prevent the enemy Bishop from pinning your Knight at g4.",
        "Push your h-pawn one square.",
        "Play h3!"
      ],
      feedback: {
        correct: "Solid play! Playing h3 safeguards your King's shelter and prevents dangerous enemy pins.",
        incorrect: "Your king is exposed to pins. Play h3 to secure g4!"
      }
    },
    {
      id: "l7-ks-3-open-file-attack",
      type: "make-move",
      title: "Pry Open Lines Against the Castled King",
      explanation: [
        "When the enemy King is castled, look for tactical sacrifices that shatter the pawn shield.",
        "Play 1.Bxh7+! (The Greek Gift Sacrifice) to rip open Black's King shelter!",
        "Capture the h7 pawn with your Bishop!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R2QK2R w KQ - 0 8", orientation: "white", highlightSquares: ["d3", "h7"] },
      expectedMoves: ["Bxh7+"],
      hints: [
        "Sacrifice your Bishop on h7 to check the King.",
        "Bxh7+ exposes Black's King completely.",
        "Play Bxh7+!"
      ],
      feedback: {
        correct: "Brilliant attack! Bxh7+ strips away Black's pawn shield and forces the King into the open.",
        incorrect: "Capture the h7 pawn with your Bishop: Bxh7+!"
      }
    },
    {
      id: "l7-ks-4-avoid-weakening",
      type: "choose-move",
      title: "Avoid Weakening Your Own King Shelter",
      explanation: [
        "Pushing pawns in front of your castled King creates permanent light-square and dark-square weaknesses.",
        "Which candidate move preserves your King's safety while improving your position?"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/2PP1N2/PP3PPP/RN1Q1RK1 w - - 0 8", orientation: "white" },
      options: [
        {
          id: "opt-h3-safe",
          moveSan: "h3",
          label: "h3 — Prophylactic move keeping the King safe",
          explanation: "Keeps g4 controlled without weakening your castled pawn structure.",
          isCorrect: true
        },
        {
          id: "opt-d4-unsafe",
          moveSan: "d4",
          label: "d4 — Central pawn break",
          explanation: "Valid central move, but h3 keeps the king shelter rock solid.",
          isCorrect: false
        },
        {
          id: "opt-a3-unsafe",
          moveSan: "a3",
          label: "a3 — Flank pawn move",
          explanation: "Passive move that does not improve king safety.",
          isCorrect: false
        }
      ],
      hints: ["Choose h3 to keep your King shelter safe."],
      feedback: {
        correct: "Correct! h3 maintains King safety while preventing unwanted opponent pins.",
        incorrect: "Choose h3 to safeguard your king!"
      }
    }
  ]
};

// SKILL 3: Piece Activity
export const SKILL_PIECE_ACTIVITY: LearningSkill = {
  id: "level-7-piece-activity",
  title: "3. Piece Activity",
  description: "Learn the difference between active and passive pieces, and improve your pieces to dominant central squares.",
  icon: "⚡",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: ["level-7-king-safety"],
  exercises: [
    {
      id: "l7-pa-1-activate-bishop",
      type: "make-move",
      title: "Activate a Blocked Bishop",
      explanation: [
        "A piece is only as good as the squares it controls!",
        "White's dark-squared Bishop on c1 is ready to active. Play 1.Bf4 to place it on an open diagonal!",
        "Develop your Bishop from c1 to f4!"
      ],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["c1", "f4"] },
      expectedMoves: ["Bf4"],
      hints: [
        "Find the dark-squared Bishop on c1.",
        "Move it to the active f4 diagonal.",
        "Play Bf4!"
      ],
      feedback: {
        correct: "Better piece activity! Bf4 places your dark-squared Bishop on a powerful, active diagonal.",
        incorrect: "Move your c1 Bishop to f4."
      }
    },
    {
      id: "l7-pa-2-central-knight",
      type: "make-move",
      title: "Place Your Knight on an Active Outpost",
      explanation: [
        "Knights thrive in the center! On e5, a Knight radiates power across 8 key squares.",
        "Leap your Knight from f3 to e5 to establish an active central outpost!",
        "Move your Knight to e5!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Ne5"],
      hints: [
        "Leap Knight to e5.",
        "Occupies a dominant central outpost.",
        "Play Ne5!"
      ],
      feedback: {
        correct: "Dominant activity! Ne5 places your Knight in the heart of Black's position.",
        incorrect: "Move your Knight from f3 to e5."
      }
    },
    {
      id: "l7-pa-3-find-passive",
      type: "find-square",
      title: "Identify the Passive Piece",
      explanation: [
        "Look at White's army. Three pieces are active, but one dark-squared Bishop is still stuck on its home square.",
        "Click the square of White's passive, undeveloped dark-squared Bishop!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/4p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      targetSquare: "c1",
      targetSquares: ["c1"],
      hints: ["Look at the original starting square c1."],
      feedback: {
        correct: "Correct! The Bishop on c1 is passive and needs to be activated.",
        incorrect: "Click square c1 where White's passive dark-squared Bishop sits."
      }
    },
    {
      id: "l7-pa-4-reposition",
      type: "make-move",
      title: "Re-route a Piece to a Superior Diagonal",
      explanation: [
        "White's Queen on d1 is inactive behind pawns.",
        "Play 1.Qe1! preparing to swing to g3 or h4 where it pressures Black's King directly.",
        "Move your Queen to e1!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/4p3/2B1P3/3P1N2/PPP1NPPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["d1", "e1"] },
      expectedMoves: ["Qe1"],
      hints: ["Move Queen from d1 to e1."],
      feedback: {
        correct: "Great re-routing! Qe1 activates your Queen for a Kingside attack.",
        incorrect: "Move Queen to e1."
      }
    }
  ]
};

// SKILL 4: Open Files and Rooks
export const SKILL_OPEN_FILES: LearningSkill = {
  id: "level-7-open-files",
  title: "4. Open Files and Rooks",
  description: "Seize open and semi-open files with your Rooks and infiltrate the enemy's 7th rank.",
  icon: "🏰",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: ["level-7-piece-activity"],
  exercises: [
    {
      id: "l7-of-1-claim-file",
      type: "make-move",
      title: "Place Your Rook on the Open File",
      explanation: [
        "Rooks need open files (files with no pawns) to unleash their long-range power.",
        "The c-file is open! Play 1.Rfc1 to control the c-file with your Rook.",
        "Move your f1 Rook to c1!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/8/2P1P3/2P2N2/P3QPPP/R4RK1 w - - 1 10", orientation: "white", highlightSquares: ["f1", "c1"] },
      expectedMoves: ["Rfc1"],
      hints: [
        "Find the open c-file.",
        "Move your f1 Rook to c1.",
        "Play Rfc1!"
      ],
      feedback: {
        correct: "Excellent! Placing your Rook on the open c-file gives it maximum range and control.",
        incorrect: "Move your f1 Rook to c1."
      }
    },
    {
      id: "l7-of-2-seventh-rank",
      type: "make-move",
      title: "Infiltrate the 7th Rank",
      explanation: [
        "A Rook on the 7th rank ('Pig on the 7th') attacks enemy pawns from behind and cuts off the King.",
        "Play 1.Rc7 to land your Rook on the 7th rank and attack Black's b7 and f7 pawns!",
        "Move your Rook to c7!"
      ],
      position: { fen: "5rk1/pp3ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1", orientation: "white", highlightSquares: ["c1", "c7"] },
      expectedMoves: ["Rc7"],
      hints: [
        "Infiltrate the 7th rank.",
        "Move your c1 Rook to c7.",
        "Play Rc7!"
      ],
      feedback: {
        correct: "Devastating infiltration! A Rook on the 7th rank paralyzes the opponent's defense.",
        incorrect: "Move your Rook to c7."
      }
    },
    {
      id: "l7-of-3-doubled-rooks",
      type: "make-move",
      title: "Double Rooks on the Open File",
      explanation: [
        "Two Rooks working together on an open file create irresistible pressure.",
        "Play 1.Rfc1 to double your Rooks on the c-file behind the c3 Rook!",
        "Move your f1 Rook to c1!"
      ],
      position: { fen: "2r2rk1/pp3ppp/8/8/8/2R5/5PPP/5RK1 w - - 0 1", orientation: "white", highlightSquares: ["f1", "c1"] },
      expectedMoves: ["Rfc1"],
      hints: [
        "Double your Rooks on c1.",
        "Move f1 Rook to c1.",
        "Play Rfc1!"
      ],
      feedback: {
        correct: "Maximum control! Doubled Rooks dominate the c-file completely.",
        incorrect: "Move your f1 Rook to c1."
      }
    },
    {
      id: "l7-of-4-semi-open",
      type: "make-move",
      title: "Use a Semi-Open File",
      explanation: [
        "A semi-open file has no friendly pawns but one enemy pawn.",
        "The b-file is semi-open with Black's b7 pawn. Play 1.Rb1 to put immediate pressure on b7!",
        "Move your a1 Rook to b1!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/8/1P1P4/P1N1PN2/5PPP/R2QKB1R w KQ - 0 10", orientation: "white", highlightSquares: ["a1", "b1"] },
      expectedMoves: ["Rb1"],
      hints: ["Move a1 Rook to b1."],
      feedback: {
        correct: "Great positional play! Semi-open files give Rooks immediate targets.",
        incorrect: "Move Rook from a1 to b1."
      }
    }
  ]
};

// SKILL 5: Weak Pawns and Weak Squares
export const SKILL_WEAK_PAWNS_SQUARES: LearningSkill = {
  id: "level-7-weak-pawns-squares",
  title: "5. Weak Pawns and Weak Squares",
  description: "Identify structural weaknesses (isolated, backward, doubled pawns, outposts) and exploit them.",
  icon: "🎯",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: ["level-7-open-files"],
  exercises: [
    {
      id: "l7-wp-1-target-isolated",
      type: "make-move",
      title: "Target the Isolated Pawn",
      explanation: [
        "An isolated pawn (like Black's d5 pawn) has no friendly pawns on adjacent files to defend it.",
        "Block and pressure the isolated pawn by playing 1.Rd4!",
        "Move your Rook from d1 to d4!"
      ],
      position: { fen: "3r1rk1/pp3ppp/8/3p4/8/2P2N2/PP3PPP/3R1RK1 w - - 0 1", orientation: "white", highlightSquares: ["d1", "d4"] },
      expectedMoves: ["Rd4"],
      hints: [
        "Target the d5 isolated pawn.",
        "Place your Rook in front of it on d4.",
        "Play Rd4!"
      ],
      feedback: {
        correct: "Target locked! Rd4 blockades the isolated pawn and prepares to pile up pressure.",
        incorrect: "Move your Rook from d1 to d4."
      }
    },
    {
      id: "l7-wp-2-occupy-outpost",
      type: "make-move",
      title: "Occupy the Weak Square Outpost",
      explanation: [
        "A weak square (outpost) cannot be attacked by enemy pawns.",
        "White's e5 square is a perfect outpost. Play 1.Ne5 to plant your Knight firmly in Black's territory!",
        "Move your Knight to e5!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Ne5"],
      hints: [
        "Plant your Knight on the e5 outpost.",
        "Play Ne5!"
      ],
      feedback: {
        correct: "Outpost claimed! An outpost Knight in enemy territory acts as a permanent thorn.",
        incorrect: "Move Knight from f3 to e5."
      }
    },
    {
      id: "l7-wp-3-backward-pawn",
      type: "make-move",
      title: "Press Stress Against a Backward Pawn",
      explanation: [
        "A backward pawn cannot advance without being captured and is stuck behind neighboring pawns.",
        "Black's d6 pawn is backward. Play 1.Qd2 preparing Rad1 to double attack d6!",
        "Move your Queen to d2!"
      ],
      position: { fen: "r1bq1rk1/1pp2ppp/2np1n2/4p3/4P3/2NP1N2/PPP1BPPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["d1", "d2"] },
      expectedMoves: ["Qd2"],
      hints: ["Move Queen from d1 to d2."],
      feedback: {
        correct: "Great plan! Qd2 connects your Rooks and prepares to gang up on Black's backward d6 pawn.",
        incorrect: "Move Queen from d1 to d2."
      }
    },
    {
      id: "l7-wp-4-doubled-pawns",
      type: "make-move",
      title: "Exploit Doubled Pawns",
      explanation: [
        "Doubled pawns are inflexible and hard to defend.",
        "Black has doubled c-pawns. Play 1.Nxe5! taking advantage of the weakened structure!",
        "Capture the e5 pawn with your Knight!"
      ],
      position: { fen: "r1bq1rk1/p1p2ppp/2p2n2/4p3/4P3/2N2N2/PPP2PPP/R2Q1RK1 w - - 0 10", orientation: "white", highlightSquares: ["f3", "e5"] },
      expectedMoves: ["Nxe5"],
      hints: ["Capture e5 with your f3 Knight."],
      feedback: {
        correct: "Pawn won! Doubled pawns weaken neighboring pawns, making e5 vulnerable.",
        incorrect: "Capture e5 with your f3 Knight."
      }
    }
  ]
};

// SKILL 6: Improve Your Worst Piece
export const SKILL_WORST_PIECE: LearningSkill = {
  id: "level-7-worst-piece",
  title: "6. Improve Your Worst Piece",
  description: "Form the essential practical habit: identify your least active piece and re-route it to a better square.",
  icon: "🛠️",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: ["level-7-weak-pawns-squares"],
  exercises: [
    {
      id: "l7-wp-1-reposition-knight",
      type: "make-move",
      title: "Reroute a Knight to the Center",
      explanation: [
        "Improve your worst piece by mobilizing your b1 Knight to c3!",
        "Play 1.Nc3!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/3P4/3BPN2/PPP2PPP/RN1Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["b1", "c3"] },
      expectedMoves: ["Nc3"],
      hints: [
        "Find the undeveloped Knight on b1.",
        "Develop it to c3.",
        "Play Nc3!"
      ],
      feedback: {
        correct: "Better! You improved your worst piece by developing the b1 Knight to c3.",
        incorrect: "Move your b1 Knight to c3."
      }
    },
    {
      id: "l7-wp-2-unblock-bishop",
      type: "make-move",
      title: "Free a Trapped Bishop",
      explanation: [
        "White's c1 Bishop is trapped behind d4 and e3.",
        "Play 1.c4! to open the c-file and break open diagonal paths for your dark-squared Bishop.",
        "Push your c-pawn to c4!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/3P4/3BPN2/PPP2PPP/RN1Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["c2", "c4"] },
      expectedMoves: ["c4"],
      hints: [
        "Push c-pawn to c4.",
        "Frees the dark-squared Bishop.",
        "Play c4!"
      ],
      feedback: {
        correct: "Great break! Playing c4 frees your c1 Bishop and attacks Black's center.",
        incorrect: "Push c-pawn to c4."
      }
    },
    {
      id: "l7-wp-3-activate-rook",
      type: "make-move",
      title: "Bring the Passive Corner Rook into Play",
      explanation: [
        "Your f1 Rook is active, but your a1 Rook is sitting doing nothing.",
        "Improve your worst piece by playing 1.Rad1 to centralize the a1 Rook!",
        "Move your a1 Rook to d1!"
      ],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/4p3/2B1P3/3P1N2/PPP1QPPP/R4RK1 w - - 0 9", orientation: "white", highlightSquares: ["a1", "d1"] },
      expectedMoves: ["Rad1"],
      hints: [
        "Find the idle a1 Rook.",
        "Move it to d1.",
        "Play Rad1!"
      ],
      feedback: {
        correct: "All pieces active! Rad1 brings your last passive piece directly into central action.",
        incorrect: "Move your a1 Rook to d1."
      }
    },
    {
      id: "l7-wp-4-centralize-queen",
      type: "make-move",
      title: "Relocate an Awkward Queen",
      explanation: [
        "White's Queen on d1 has no open lines.",
        "Play 1.Qe2 to centralize your Queen and complete your piece coordination!",
        "Move your Queen to e2!"
      ],
      position: { fen: "r1bq1rk1/ppp2ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["d1", "e2"] },
      expectedMoves: ["Qe2"],
      hints: ["Move Queen from d1 to e2."],
      feedback: {
        correct: "Excellent! Qe2 moves the Queen off the back rank and connects your Rooks.",
        incorrect: "Move Queen from d1 to e2."
      }
    }
  ]
};

// SKILL 7: Basic Planning
export const SKILL_BASIC_PLANNING: LearningSkill = {
  id: "level-7-basic-planning",
  title: "7. Basic Planning",
  description: "Formulate simple middlegame plans: pawn breaks, passed pawns, minority attacks, and trading key defenders.",
  icon: "📋",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: ["level-7-worst-piece"],
  exercises: [
    {
      id: "l7-bp-1-pawn-break",
      type: "make-move",
      title: "Execute a Central Pawn Break",
      explanation: [
        "PLANNING CHECKLIST: 1. Improve worst piece? 2. Attack weakness? 3. Open lines with a pawn break!",
        "Play 1.e5 to gain central space, drive Black's f6 Knight away, and open lines for your attack!",
        "Push your e-pawn to e5!"
      ],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p4/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white", highlightSquares: ["e4", "e5"] },
      expectedMoves: ["e5"],
      hints: [
        "Push e4 pawn to e5.",
        "Gains space and kicks the Knight.",
        "Play e5!"
      ],
      feedback: {
        correct: "Great plan executed! 1.e5 gains space and disrupts Black's defensive setup.",
        incorrect: "Push the e4 pawn to e5."
      }
    },
    {
      id: "l7-bp-2-passed-pawn",
      type: "make-move",
      title: "Create a Passed Pawn",
      explanation: [
        "Plan: A passed pawn is a criminal that must be kept under lock and key!",
        "Play 1.b5 to expand on the queenside and pave the way for a passed pawn!",
        "Push your b-pawn to b5!"
      ],
      position: { fen: "2r2rk1/pp1b1ppp/4pn2/3p4/1P1P4/3BPN2/P4PPP/R4RK1 w - - 0 15", orientation: "white", highlightSquares: ["b4", "b5"] },
      expectedMoves: ["b5"],
      hints: [
        "Push b4 pawn to b5.",
        "Expands and creates pawn pressure.",
        "Play b5!"
      ],
      feedback: {
        correct: "Strong plan! Pushing b5 restricts Black's pieces and creates queenside passed pawn chances.",
        incorrect: "Push the b4 pawn to b5."
      }
    },
    {
      id: "l7-bp-3-minority-attack",
      type: "make-move",
      title: "Initiate a Queenside Minority Attack",
      explanation: [
        "Plan: Advance 2 pawns against Black's 3 queenside pawns to create a structural weakness.",
        "Play 1.b4 to launch the Minority Attack!",
        "Push your b-pawn to b4!"
      ],
      position: { fen: "r2q1rk1/ppp1bppp/2n1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["b2", "b4"] },
      expectedMoves: ["b4"],
      hints: ["Push b2 pawn to b4."],
      feedback: {
        correct: "Textbook planning! The minority attack b4-b5 creates weaknesses in Black's pawn structure.",
        incorrect: "Push b2 pawn to b4."
      }
    },
    {
      id: "l7-bp-4-trade-defenders",
      type: "make-move",
      title: "Trade Off Black's Key Defender",
      explanation: [
        "Plan: Eliminate the enemy piece that defends the position.",
        "Black's f6 Knight guards the d5 and e4 squares. Play 1.Bxf6 to remove Black's key central defender!",
        "Capture the f6 Knight with your Bishop!"
      ],
      position: { fen: "r2q1rk1/ppp1bppp/2n1pn2/3p2B1/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 9", orientation: "white", highlightSquares: ["g5", "f6"] },
      expectedMoves: ["Bxf6"],
      hints: ["Capture f6 Knight with g5 Bishop."],
      feedback: {
        correct: "Strategic clarity! Removing Black's f6 Knight leaves Black's central pawns without key support.",
        incorrect: "Capture the f6 Knight with your g5 Bishop."
      }
    }
  ]
};

// SKILL 8: Middlegame Decision Challenge
export const SKILL_MIDDLEGAME_CHALLENGE: LearningSkill = {
  id: "level-7-middlegame-challenge",
  title: "8. Middlegame Decision Challenge",
  description: "Final Level 7 Assessment! Apply all middlegame skills across 12 practical positions (80%+ score to master).",
  icon: "🏆",
  category: "middlegame",
  difficulty: "intermediate",
  prerequisites: ["level-7-basic-planning"],
  exercises: [
    {
      id: "l7-mc-1-cct",
      type: "make-move",
      title: "Task 1 of 12: C-C-T Scan (Check First!)",
      explanation: ["Scan for forcing checks! Deliver 1.Bxf7+."],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5", orientation: "white" },
      expectedMoves: ["Bxf7+"],
      hints: ["Play Bxf7+."],
      feedback: { correct: "Correct! Forcing check delivers instant pressure.", incorrect: "Play Bxf7+." }
    },
    {
      id: "l7-mc-2-safety",
      type: "make-move",
      title: "Task 2 of 12: Secure King Safety",
      explanation: ["Tuck your King to safety with Kingside castling!"],
      position: { fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5", orientation: "white" },
      expectedMoves: ["O-O"],
      hints: ["Castle Kingside O-O."],
      feedback: { correct: "Correct! King safety secured.", incorrect: "Castle Kingside (O-O)." }
    },
    {
      id: "l7-mc-3-open-file",
      type: "make-move",
      title: "Task 3 of 12: Claim the Open File",
      explanation: ["Place your Rook on the open c-file with 1.Rfc1!"],
      position: { fen: "r2q1rk1/ppp2ppp/2np1n2/8/2P1P3/2P2N2/P3QPPP/R4RK1 w - - 1 10", orientation: "white" },
      expectedMoves: ["Rfc1"],
      hints: ["Play Rfc1."],
      feedback: { correct: "Correct! Open file seized.", incorrect: "Play Rfc1." }
    },
    {
      id: "l7-mc-4-worst-piece",
      type: "make-move",
      title: "Task 4 of 12: Improve Your Worst Piece",
      explanation: ["Mobilize your b1 Knight to c3!"],
      position: { fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/3P4/3BPN2/PPP2PPP/RN1Q1RK1 w - - 0 9", orientation: "white" },
      expectedMoves: ["Nc3"],
      hints: ["Play Nc3."],
      feedback: { correct: "Correct! Worst piece improved.", incorrect: "Play Nc3." }
    },
    {
      id: "l7-mc-5-weak-pawn",
      type: "make-move",
      title: "Task 5 of 12: Blockade Weak Isolated Pawn",
      explanation: ["Blockade and pressure d5 with 1.Rd4!"],
      position: { fen: "3r1rk1/pp3ppp/8/3p4/8/2P2N2/PP3PPP/3R1RK1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Rd4"],
      hints: ["Play Rd4."],
      feedback: { correct: "Correct! Isolated pawn blockaded.", incorrect: "Play Rd4." }
    },
    {
      id: "l7-mc-6-7th-rank",
      type: "make-move",
      title: "Task 6 of 12: Infiltrate the 7th Rank",
      explanation: ["Infiltrate the 7th rank with 1.Rc7!"],
      position: { fen: "5rk1/pp3ppp/8/8/8/8/5PPP/2R3K1 w - - 0 1", orientation: "white" },
      expectedMoves: ["Rc7"],
      hints: ["Play Rc7."],
      feedback: { correct: "Correct! Pig on the 7th rank!", incorrect: "Play Rc7." }
    },
    {
      id: "l7-mc-7-threat",
      type: "make-move",
      title: "Task 7 of 12: Launch King Attack Threat",
      explanation: ["Launch 1.Qh5 attacking e5 and h7!"],
      position: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3", orientation: "white" },
      expectedMoves: ["Qh5"],
      hints: ["Play Qh5."],
      feedback: { correct: "Correct! Mating threat launched.", incorrect: "Play Qh5." }
    },
    {
      id: "l7-mc-8-outpost",
      type: "make-move",
      title: "Task 8 of 12: Plant Knight on Central Outpost",
      explanation: ["Plant Knight on e5!"],
      position: { fen: "r2q1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2N1PN2/PP3PPP/R2Q1RK1 w - - 0 9", orientation: "white" },
      expectedMoves: ["Ne5"],
      hints: ["Play Ne5."],
      feedback: { correct: "Correct! Dominant outpost occupied.", incorrect: "Play Ne5." }
    },
    {
      id: "l7-mc-9-defend",
      type: "make-move",
      title: "Task 9 of 12: Prevent Pin on Castled King",
      explanation: ["Play 1.h3 to keep g4 controlled!"],
      position: { fen: "r1bq1rk1/ppp2ppp/2n5/3np3/2B5/3P1N2/PPP2PPP/RN1QK2R w KQ - 0 8", orientation: "white" },
      expectedMoves: ["h3"],
      hints: ["Play h3."],
      feedback: { correct: "Correct! King safety maintained.", incorrect: "Play h3." }
    },
    {
      id: "l7-mc-10-pawn-break",
      type: "make-move",
      title: "Task 10 of 12: Central Pawn Break",
      explanation: ["Gain central space with 1.e5!"],
      position: { fen: "r1bq1rk1/ppp1bppp/2n1pn2/3p4/3PP3/2N2N2/PPP1BPPP/R1BQ1RK1 w - - 0 8", orientation: "white" },
      expectedMoves: ["e5"],
      hints: ["Play e5."],
      feedback: { correct: "Correct! Central pawn break executed.", incorrect: "Play e5." }
    },
    {
      id: "l7-mc-11-trade",
      type: "make-move",
      title: "Task 11 of 12: Remove Key Defender",
      explanation: ["Trade off Black's f6 Knight defender with 1.Bxf6!"],
      position: { fen: "r2q1rk1/ppp1bppp/2n1pn2/3p2B1/2PP4/2N1PN2/PP2BPPP/R2Q1RK1 w - - 0 9", orientation: "white" },
      expectedMoves: ["Bxf6"],
      hints: ["Play Bxf6."],
      feedback: { correct: "Correct! Key defender eliminated.", incorrect: "Play Bxf6." }
    },
    {
      id: "l7-mc-12-passed-pawn",
      type: "make-move",
      title: "Task 12 of 12: Create Queenside Expansion",
      explanation: ["Push b5 to expand and build passed pawn chances!"],
      position: { fen: "2r2rk1/pp1b1ppp/4pn2/3p4/1P1P4/3BPN2/P4PPP/R4RK1 w - - 0 15", orientation: "white" },
      expectedMoves: ["b5"],
      hints: ["Play b5."],
      feedback: { correct: "Correct! Queenside expansion complete.", incorrect: "Play b5." }
    }
  ]
};

export const LEVEL_7: LearningLevel = {
  levelNumber: 7,
  title: "Level 7 — Middlegame Thinking",
  description: "Master practical middlegame decision-making: Checks-Captures-Threats scan, king safety, piece activity, open files, weak pawns, improving worst pieces, and planning.",
  skills: [
    SKILL_CHECKS_CAPTURES_THREATS,
    SKILL_KING_SAFETY,
    SKILL_PIECE_ACTIVITY,
    SKILL_OPEN_FILES,
    SKILL_WEAK_PAWNS_SQUARES,
    SKILL_WORST_PIECE,
    SKILL_BASIC_PLANNING,
    SKILL_MIDDLEGAME_CHALLENGE
  ]
};
