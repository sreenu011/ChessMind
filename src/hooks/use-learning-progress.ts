import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/contexts/auth-context";
import {
  EMPTY_PROGRESS,
  completeLesson,
  fetchProgress,
  recordDailyPuzzle,
  recordPuzzle,
  recordQuiz,
  updateQuestionProgress,
  type LearningProgress,
} from "@/lib/learn/progress";

export function useLearningProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LearningProgress>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) {
      setProgress(EMPTY_PROGRESS);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await fetchProgress(user.uid);
      setProgress(next);
    } catch {
      setError("Unable to load your learning progress.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const recordQuestion = useCallback(
    async (lessonId: string, questionId: string, isCorrect: boolean, totalQuestions: number) => {
      if (!user) return;
      const next = await updateQuestionProgress(user.uid, progress, lessonId, questionId, isCorrect, totalQuestions);
      setProgress(next);
      return next;
    },
    [user, progress],
  );

  const finishLesson = useCallback(
    async (lessonId: string) => {
      if (!user) return;
      const next = await completeLesson(user.uid, progress, lessonId);
      setProgress(next);
    },
    [user, progress],
  );

  const finishQuiz = useCallback(
    async (quizId: string, score: number, total: number) => {
      if (!user) return;
      const next = await recordQuiz(user.uid, progress, quizId, score, total);
      setProgress(next);
    },
    [user, progress],
  );

  const solvePuzzle = useCallback(
    async (puzzleId: string) => {
      if (!user) return;
      const next = await recordPuzzle(user.uid, progress, puzzleId);
      setProgress(next);
    },
    [user, progress],
  );

  const solveDaily = useCallback(
    async (dayKey: string) => {
      if (!user) return;
      const next = await recordDailyPuzzle(user.uid, progress, dayKey);
      setProgress(next);
    },
    [user, progress],
  );

  return { progress, loading, error, reload, recordQuestion, finishLesson, finishQuiz, solvePuzzle, solveDaily };
}
