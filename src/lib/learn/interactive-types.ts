import type { Move } from "chess.js";

export type ExerciseType =
  | "learn"
  | "find-move"
  | "make-move"
  | "avoid-mistake"
  | "choose-move"
  | "find-checkmate"
  | "capture-piece"
  | "defend-piece"
  | "mini-challenge"
  | "practice-game"
  | "find-square"
  | "identify-square"
  | "board-challenge";

export type LearningPosition = {
  fen: string;
  orientation?: "white" | "black";
  highlightSquares?: string[];
  targetSquare?: string;
  targetSquares?: string[];
  attackerSquare?: string;
};

export type ChoiceMoveOption = {
  id: string;
  moveSan: string;
  label: string;
  explanation: string;
  isCorrect: boolean;
};

export type LearningExercise = {
  id: string;
  type: ExerciseType;
  title: string;
  explanation: string[];
  position: LearningPosition;
  /** Expected move SAN or sequence of alternating player/opponent moves */
  expectedMoves?: string[];
  /** Target square for click-to-identify exercises */
  targetSquare?: string;
  /** Acceptable target squares (e.g., both White rooks a1 or h1) */
  targetSquares?: string[];
  /** Optional choices for "choose-move" exercise type */
  options?: ChoiceMoveOption[];
  /** Bad move SAN that triggers specific "avoid-mistake" feedback */
  mistakeMoveSan?: string;
  hints: string[];
  feedback: {
    correct: string;
    incorrect: string;
    mistakeFeedback?: string;
    hintExplanation?: string;
  };
};

export type LearningSkill = {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prerequisites: string[];
  exercises: LearningExercise[];
};

export type LearningLevel = {
  levelNumber: number;
  title: string;
  description: string;
  skills: LearningSkill[];
};

export type LearningSession = {
  skillId: string;
  currentExerciseIndex: number;
  attempts: Record<string, number>;
  hintsUsed: Record<string, number>;
  status: "in-progress" | "completed";
  startedAt: string;
};

export type ValidationResult = {
  valid: boolean;
  san?: string;
  moveObj?: Move;
  isExpected: boolean;
  isMistake: boolean;
  message?: string;
};
