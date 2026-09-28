import type { LearningLevel, LearningSkill } from "./interactive-types";

export const SAMPLE_INTERACTIVE_SKILL: LearningSkill = {
  id: "knight-tactics-mastery",
  title: "The Knight: Moves, Forks & Defense",
  description: "Master the unique L-shaped leap of the knight, execute game-winning forks, and defend against threats.",
  icon: "♞",
  category: "pieces",
  difficulty: "beginner",
  prerequisites: [],
  exercises: [
    {
      id: "ex-1-learn",
      type: "learn",
      title: "1. Learn: The Knight's L-Shape Move",
      explanation: [
        "The knight moves in an 'L' shape: 2 squares in one direction and 1 square perpendicular.",
        "It is the only piece in chess that can jump over other pieces!",
        "Try moving the knight from g1 to f3 to occupy an active central square."
      ],
      position: {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        orientation: "white",
        highlightSquares: ["g1", "f3"]
      },
      expectedMoves: ["Nf3"],
      hints: [
        "Click the knight on g1 and move it to f3.",
        "The move Nf3 develops your knight toward the centre of the board."
      ],
      feedback: {
        correct: "Excellent! Nf3 is the most common knight opening move in chess.",
        incorrect: "Not quite. Move the knight from g1 to f3."
      }
    },
    {
      id: "ex-2-make-move",
      type: "make-move",
      title: "2. Make the Move: Jump Over the Pawn",
      explanation: [
        "Because knights jump over obstacles, pawns in front do not block them.",
        "Hop your knight over your pawn on e2 to reach f3."
      ],
      position: {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        orientation: "white",
        highlightSquares: ["g1", "f3"]
      },
      expectedMoves: ["Nf3"],
      hints: [
        "Move your knight from g1 to f3.",
        "Knights move 2 squares forward and 1 to the side."
      ],
      feedback: {
        correct: "Great move! Notice how the knight leaped over the pawn chain.",
        incorrect: "Try again. Move the knight to f3."
      }
    },
    {
      id: "ex-3-find-move",
      type: "find-move",
      title: "3. Find the Move: Attack Black's Pawn",
      explanation: [
        "Black has a pawn on e5. Find the knight move that attacks this pawn directly."
      ],
      position: {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        orientation: "white"
      },
      expectedMoves: ["Nf3"],
      hints: [
        "Look for a knight move that threatens Black's e5-pawn.",
        "Move the knight to f3 to attack e5."
      ],
      feedback: {
        correct: "Spot on! Nf3 develops a piece AND attacks Black's pawn on e5.",
        incorrect: "That move does not attack the e5 pawn. Try Nf3!"
      }
    },
    {
      id: "ex-4-capture-piece",
      type: "capture-piece",
      title: "4. Capture the Piece: Take the Hanging Pawn",
      explanation: [
        "Black left their e5 pawn undefended! Capture it with your knight."
      ],
      position: {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        orientation: "white",
        targetSquare: "e5"
      },
      expectedMoves: ["Nxe5"],
      hints: [
        "Your knight on f3 can leap to e5 to capture Black's pawn.",
        "Capture the pawn on e5 with Nxe5."
      ],
      feedback: {
        correct: "Boom! Free pawn captured! Always look out for undefended pieces.",
        incorrect: "Look closely at the e5 square. Your knight on f3 can take it!"
      }
    },
    {
      id: "ex-5-avoid-mistake",
      type: "avoid-mistake",
      title: "5. Avoid the Mistake: Don't Lose Your Knight",
      explanation: [
        "Do NOT move your knight to e5 where Black's knight on c6 can capture it!",
        "Instead, defend your pawn on e4 by playing Nc3."
      ],
      position: {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        orientation: "white",
        attackerSquare: "c6"
      },
      expectedMoves: ["Nc3"],
      mistakeMoveSan: "Nxe5",
      hints: [
        "If you play Nxe5, Black's knight on c6 takes your knight (Nxe5).",
        "Play Nc3 instead to defend e4 safely."
      ],
      feedback: {
        correct: "Smart choice! Nc3 defends e4 without risking your knight.",
        incorrect: "Be careful! Moving to e5 loses your knight to Black's knight on c6.",
        mistakeFeedback: "Blunder! Black's knight on c6 would capture your knight for free."
      }
    },
    {
      id: "ex-6-defend-piece",
      type: "defend-piece",
      title: "6. Defend the Piece: Protect Your E4 Pawn",
      explanation: [
        "Black's knight on c6 and pawn threat requires solid defense. Play Nc3 to protect e4."
      ],
      position: {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3",
        orientation: "white"
      },
      expectedMoves: ["Nc3"],
      hints: [
        "Develop your other knight from b1 to c3.",
        "Nc3 defends your central pawn."
      ],
      feedback: {
        correct: "Well defended! Your e4 pawn is now safe.",
        incorrect: "Try Nc3 to protect your pawn on e4."
      }
    },
    {
      id: "ex-7-choose-move",
      type: "choose-move",
      title: "7. Choose the Correct Move: Strategic Choice",
      explanation: [
        "Choose between two knight developments: Nc3 (controls centre) vs Na3 (on the rim)."
      ],
      position: {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        orientation: "white"
      },
      expectedMoves: ["Nc3"],
      options: [
        {
          id: "opt-nc3",
          moveSan: "Nc3",
          label: "Nc3 (Develop toward Centre)",
          explanation: "Nc3 controls d5 and e4 in the centre of the board.",
          isCorrect: true
        },
        {
          id: "opt-na3",
          moveSan: "Na3",
          label: "Na3 (Knight on the Rim)",
          explanation: "Knights on the rim are dim! Na3 controls far fewer squares.",
          isCorrect: false
        }
      ],
      hints: [
        "A knight on the rim is dim! Choose the central square c3.",
        "Nc3 controls 8 squares while Na3 controls only 4."
      ],
      feedback: {
        correct: "Correct! 'Knights on the rim are dim' — central knights dominate!",
        incorrect: "Na3 places your knight on the edge where it controls fewer squares."
      }
    },
    {
      id: "ex-8-find-checkmate",
      type: "find-checkmate",
      title: "8. Find Checkmate: Smothered Mate!",
      explanation: [
        "Black's king is trapped by its own pieces on h8! Find the knight checkmate move."
      ],
      position: {
        fen: "6rk/5Npp/8/8/8/8/8/6QK w - - 0 1",
        orientation: "white",
        highlightSquares: ["f7", "h8"]
      },
      expectedMoves: ["Nf7#"],
      hints: [
        "Look for a knight check on f7.",
        "Move the knight to f7 for a classic smothered checkmate!"
      ],
      feedback: {
        correct: "CHECKMATE! That is a famous 'Smothered Mate' — the king cannot escape its own pawns!",
        incorrect: "Look at f7! The knight delivers checkmate directly."
      }
    },
    {
      id: "ex-9-mini-challenge",
      type: "mini-challenge",
      title: "9. Mini Challenge: Royal Knight Fork!",
      explanation: [
        "Execute a 2-move tactical sequence: Deliver a royal fork on c7, Black moves their king, then capture Black's rook!"
      ],
      position: {
        fen: "r1b1kbnr/pppp1ppp/8/4p3/4P2q/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4",
        orientation: "white"
      },
      expectedMoves: ["Nxh4"],
      hints: [
        "Black played Qh4 attacking your king area! Take Black's queen on h4 with your knight on f3.",
        "Play Nxh4 to win Black's queen!"
      ],
      feedback: {
        correct: "Outstanding! You punished Black's early queen attack by capturing their queen!",
        incorrect: "Look at Black's queen on h4. Your knight on f3 can capture it with Nxh4."
      }
    },
    {
      id: "ex-10-practice-game",
      type: "practice-game",
      title: "10. Practice Game: Win the End Game",
      explanation: [
        "You have a knight and king against a lonely king. Deliver checkmate to complete the skill!"
      ],
      position: {
        fen: "7k/5K2/5N2/8/8/8/8/8 w - - 0 1",
        orientation: "white"
      },
      expectedMoves: ["Ng4", "Kh8", "Nf6#"],
      hints: [
        "Move your knight to setup checkmate.",
        "Ng4 then Nf6# delivers checkmate."
      ],
      feedback: {
        correct: "MASTERY ACHIEVED! You have completed The Knight Masterclass!",
        incorrect: "Keep trying! Find the winning knight sequence."
      }
    }
  ]
};

export const SAMPLE_LEARNING_LEVEL: LearningLevel = {
  levelNumber: 1,
  title: "Level 1: Fundamentals of Chess Tactics",
  description: "Learn piece movements, basic tactics, forks, captures, and checkmates.",
  skills: [SAMPLE_INTERACTIVE_SKILL]
};
