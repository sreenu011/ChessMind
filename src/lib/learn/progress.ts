import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { LESSONS, lessonById, todayKey } from "./content";

export type QuizScore = { quizId: string; score: number; total: number; at: string };

export type LessonProgress = {
  lessonId: string;
  answeredQuestions: string[];
  correctQuestions: string[];
  currentQuestionId: string | null;
  completed: boolean;
  updatedAt: string;
};

export type LearningProgress = {
  completedLessons: string[];
  completedTopics: string[];
  quizScores: QuizScore[];
  puzzlesSolved: string[];
  dailyPuzzlesSolved: string[];
  currentLevel: number;
  totalXP: number;
  learningStreak: number;
  activeDays: string[];
  lastActivity: string | null;
  lessons?: Record<string, LessonProgress>;
};

export const EMPTY_PROGRESS: LearningProgress = {
  completedLessons: [],
  completedTopics: [],
  quizScores: [],
  puzzlesSolved: [],
  dailyPuzzlesSolved: [],
  currentLevel: 1,
  totalXP: 0,
  learningStreak: 0,
  activeDays: [],
  lastActivity: null,
  lessons: {},
};

export const XP_PER_LESSON = 10;
export const XP_PER_QUIZ = 20;
export const XP_PER_PUZZLE = 15;
export const XP_PER_DAILY = 25;

/**
 * XP is always derived from what the learner actually completed, never sent
 * as a number by the client. The same function can run in trusted backend
 * code later to re-verify a stored total.
 */
export function deriveXP(p: LearningProgress) {
  return (
    p.completedLessons.length * XP_PER_LESSON +
    p.quizScores.length * XP_PER_QUIZ +
    p.puzzlesSolved.length * XP_PER_PUZZLE +
    p.dailyPuzzlesSolved.length * XP_PER_DAILY
  );
}

export function levelFromXP(xp: number) {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function xpIntoLevel(xp: number) {
  return xp % 100;
}

function streakFrom(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const today = new Date();
  const todayStr = todayKey(today);
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (!set.has(todayStr) && !set.has(todayKey(yesterday))) return 0;
  let streak = 0;
  const cursor = new Date(set.has(todayStr) ? today : yesterday);
  while (set.has(todayKey(cursor))) {
    streak += 1;
    cursor.setTime(cursor.getTime() - 86_400_000);
  }
  return streak;
}

export function normalise(raw: Partial<LearningProgress> | null | undefined): LearningProgress {
  const base: LearningProgress = {
    ...EMPTY_PROGRESS,
    ...raw,
    completedLessons: raw?.completedLessons ?? [],
    completedTopics: raw?.completedTopics ?? [],
    quizScores: raw?.quizScores ?? [],
    puzzlesSolved: raw?.puzzlesSolved ?? [],
    dailyPuzzlesSolved: raw?.dailyPuzzlesSolved ?? [],
    activeDays: raw?.activeDays ?? [],
    lessons: raw?.lessons ?? {},
  };
  const totalXP = deriveXP(base);
  return {
    ...base,
    totalXP,
    currentLevel: levelFromXP(totalXP),
    learningStreak: streakFrom(base.activeDays),
  };
}

function progressRef(uid: string) {
  if (!db) throw new Error("Firebase is not ready yet.");
  return doc(db, "learningProgress", uid);
}

export async function fetchProgress(uid: string): Promise<LearningProgress> {
  const snap = await getDoc(progressRef(uid));
  return normalise(snap.exists() ? (snap.data() as Partial<LearningProgress>) : null);
}

async function save(uid: string, next: LearningProgress) {
  await setDoc(progressRef(uid), next, { merge: true });
}

function withActivity(p: LearningProgress): LearningProgress {
  const today = todayKey();
  const activeDays = p.activeDays.includes(today) ? p.activeDays : [...p.activeDays, today].slice(-120);
  return normalise({ ...p, activeDays, lastActivity: new Date().toISOString() });
}

function topicsFor(lessonIds: string[]) {
  const topics = new Set<string>();
  for (const id of lessonIds) {
    const lesson = lessonById(id);
    if (lesson) topics.add(lesson.category);
  }
  return [...topics].filter((category) =>
    LESSONS.filter((l) => l.category === category).every((l) => lessonIds.includes(l.id)),
  );
}

export async function updateQuestionProgress(
  uid: string,
  current: LearningProgress,
  lessonId: string,
  questionId: string,
  isCorrect: boolean,
  totalQuestions: number,
): Promise<LearningProgress> {
  const existingLesson: LessonProgress = current.lessons?.[lessonId] ?? {
    lessonId,
    answeredQuestions: [],
    correctQuestions: [],
    currentQuestionId: questionId,
    completed: false,
    updatedAt: new Date().toISOString(),
  };

  const answered = Array.from(new Set([...existingLesson.answeredQuestions, questionId]));
  const correct = isCorrect
    ? Array.from(new Set([...existingLesson.correctQuestions, questionId]))
    : existingLesson.correctQuestions;

  const isCompleted = correct.length >= totalQuestions;

  const updatedLesson: LessonProgress = {
    ...existingLesson,
    answeredQuestions: answered,
    correctQuestions: correct,
    currentQuestionId: isCompleted ? null : questionId,
    completed: isCompleted,
    updatedAt: new Date().toISOString(),
  };

  const nextLessonsMap = {
    ...(current.lessons ?? {}),
    [lessonId]: updatedLesson,
  };

  const completedLessons =
    isCompleted && !current.completedLessons.includes(lessonId)
      ? [...current.completedLessons, lessonId]
      : current.completedLessons;

  const next = withActivity({
    ...current,
    completedLessons,
    completedTopics: topicsFor(completedLessons),
    lessons: nextLessonsMap,
  });

  await save(uid, next);
  return next;
}

export async function completeLesson(uid: string, current: LearningProgress, lessonId: string) {
  const completedLessons = current.completedLessons.includes(lessonId)
    ? current.completedLessons
    : [...current.completedLessons, lessonId];
  const next = withActivity({
    ...current,
    completedLessons,
    completedTopics: topicsFor(completedLessons),
  });
  await save(uid, next);
  return next;
}

export async function recordQuiz(
  uid: string,
  current: LearningProgress,
  quizId: string,
  score: number,
  total: number,
) {
  const next = withActivity({
    ...current,
    quizScores: [...current.quizScores.filter((q) => q.quizId !== quizId), { quizId, score, total, at: todayKey() }],
  });
  await save(uid, next);
  return next;
}

export async function recordPuzzle(uid: string, current: LearningProgress, puzzleId: string) {
  if (current.puzzlesSolved.includes(puzzleId)) return current;
  const next = withActivity({ ...current, puzzlesSolved: [...current.puzzlesSolved, puzzleId] });
  await save(uid, next);
  return next;
}

export async function recordDailyPuzzle(uid: string, current: LearningProgress, dayKey: string) {
  if (current.dailyPuzzlesSolved.includes(dayKey)) return current;
  const next = withActivity({ ...current, dailyPuzzlesSolved: [...current.dailyPuzzlesSolved, dayKey] });
  await save(uid, next);
  return next;
}

export function isLessonUnlocked(lessonId: string, completed: string[]) {
  return true;
}
