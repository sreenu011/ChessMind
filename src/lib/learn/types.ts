export type Difficulty = "beginner" | "intermediate" | "advanced";

export type LessonStep =
  | {
      kind: "info";
      title: string;
      body: string[];
      fen?: string;
      orientation?: "white" | "black";
    }
  | {
      kind: "move";
      title: string;
      body: string[];
      fen: string;
      orientation?: "white" | "black";
      /** SAN moves, alternating: user, opponent, user, ... */
      solution: string[];
      instruction: string;
      success: string;
      retry: string;
    }
  | {
      kind: "quiz";
      title: string;
      question: string;
      options: string[];
      answerIndex: number;
      explanation: string;
    };

export type ChessLesson = {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  description: string;
  prerequisites: string[];
  steps: LessonStep[];
};

export type LearnCategory = {
  id: string;
  title: string;
  icon: string;
  description: string;
  difficulty: Difficulty;
  /** Lesson ids in this category. Empty for link-out categories. */
  lessonIds: string[];
  href?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type DailyPuzzle = {
  id: string;
  fen: string;
  orientation: "white" | "black";
  sideToMove: "White" | "Black";
  prompt: string;
  solution: string[];
  idea: string;
};
