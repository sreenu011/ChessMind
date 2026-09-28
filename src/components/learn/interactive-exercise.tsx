import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExerciseBoard } from "@/components/learn/exercise/exercise-board";
import { ExerciseFeedbackPanel } from "@/components/learn/exercise/exercise-feedback-panel";
import { ExerciseHeader } from "@/components/learn/exercise/exercise-header";
import type { ChoiceMoveOption, LearningSkill } from "@/lib/learn/interactive-types";
import { XP_PER_LESSON } from "@/lib/learn/progress";
import { useLearningProgress } from "@/hooks/use-learning-progress";

export function InteractiveExerciseEngine({ skill }: { skill: LearningSkill }) {
  const navigate = useNavigate();
  const { progress, loading, error, reload, recordQuestion, finishLesson } = useLearningProgress();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [boardStatus, setBoardStatus] = useState<"idle" | "wrong" | "mistake" | "solved">("idle");
  const [hintIndex, setHintIndex] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [skillCompleted, setSkillCompleted] = useState(false);
  const [challengeFailed, setChallengeFailed] = useState(false);

  const total = skill.exercises.length;
  const isChallenge = skill.id.includes("challenge") || skill.id === "level-1-board-master";
  const savedSkill = progress.lessons?.[skill.id];
  const savedCorrect = useMemo(() => savedSkill?.correctQuestions ?? [], [savedSkill?.correctQuestions]);
  const savedCorrectKey = savedCorrect.join(",");

  // Resume logic: Initialize currentIndex based on saved progress in Firestore
  useEffect(() => {
    if (loading || currentIndex !== null) return;

    if (savedCorrect.length > 0) {
      setCompletedExercises(savedCorrect);
      setCorrectCount(savedCorrect.length);
    }

    const firstIncomplete = skill.exercises.findIndex((ex) => !savedCorrect.includes(ex.id));
    if (firstIncomplete !== -1) {
      setCurrentIndex(firstIncomplete);
    } else {
      setCurrentIndex(0);
    }
  }, [loading, currentIndex, skill.exercises, savedCorrectKey]);

  if (loading || currentIndex === null) {
    return (
      <div className="mx-auto max-w-md py-24 text-center space-y-4">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="text-base font-medium text-muted-foreground">Loading your training session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md py-24 text-center space-y-4">
        <p className="text-base font-medium text-destructive">{error}</p>
        <Button onClick={() => void reload()} variant="outline" className="border-border/80">
          <RotateCcw className="mr-2 size-4" /> Retry
        </Button>
      </div>
    );
  }

  const currentExercise = skill.exercises[currentIndex]!;
  const isLast = currentIndex === total - 1;

  async function handleSolved() {
    setBoardStatus("solved");
    setTotalAttempts((a) => a + 1);
    if (!completedExercises.includes(currentExercise.id)) {
      setCompletedExercises((prev) => [...prev, currentExercise.id]);
      setCorrectCount((c) => c + 1);
    }
    // Record exercise progress to Firestore
    await recordQuestion(skill.id, currentExercise.id, true, total);
  }

  async function handleWrong() {
    setBoardStatus("wrong");
    setTotalAttempts((a) => a + 1);
    await recordQuestion(skill.id, currentExercise.id, false, total);
  }

  function handleMistake() {
    setBoardStatus("mistake");
    setTotalAttempts((a) => a + 1);
  }

  function handleReset() {
    setBoardStatus("idle");
    setResetKey((k) => k + 1);
  }

  function handleShowHint() {
    setHintIndex((h) => h + 1);
    setHintsUsedCount((h) => h + 1);
  }

  async function handleSelectOption(option: ChoiceMoveOption) {
    setTotalAttempts((a) => a + 1);
    if (option.isCorrect) {
      setBoardStatus("solved");
      if (!completedExercises.includes(currentExercise.id)) {
        setCompletedExercises((prev) => [...prev, currentExercise.id]);
        setCorrectCount((c) => c + 1);
      }
      await recordQuestion(skill.id, currentExercise.id, true, total);
    } else {
      setBoardStatus("wrong");
      await recordQuestion(skill.id, currentExercise.id, false, total);
    }
  }

  async function handleNext() {
    if (isLast) {
      if (isChallenge) {
        const finalCorrect = completedExercises.includes(currentExercise.id) ? correctCount : correctCount + 1;
        if (finalCorrect >= 8) {
          await finishLesson(skill.id);
          toast.success(`Challenge Mastered! +${XP_PER_LESSON} XP`);
          setSkillCompleted(true);
        } else {
          setChallengeFailed(true);
        }
      } else {
        await finishLesson(skill.id);
        toast.success(`Skill Mastered! +${XP_PER_LESSON} XP`);
        setSkillCompleted(true);
      }
    } else {
      setCurrentIndex((i) => i! + 1);
      setBoardStatus("idle");
      setHintIndex(0);
      setResetKey((k) => k + 1);
    }
  }

  if (challengeFailed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <Card className="border-border/80 shadow-2xl p-8 space-y-6 bg-card">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-destructive/20 text-destructive">
            <XCircle className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Keep Practicing!</h1>
            <p className="text-muted-foreground">
              You scored {correctCount} / {total}. You need at least 8 / 10 (80%) to master {skill.title} and proceed to the next level.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 text-center">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Score</p>
              <p className="font-display text-2xl font-bold text-amber-400">{correctCount} / {total}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Accuracy</p>
              <p className="font-display text-2xl font-bold text-amber-400">{Math.round((correctCount / total) * 100)}%</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              className="flex-1 font-semibold shadow-md"
              onClick={() => {
                setChallengeFailed(false);
                setCurrentIndex(0);
                setCorrectCount(0);
                setCompletedExercises([]);
                setBoardStatus("idle");
                setHintIndex(0);
                setResetKey((k) => k + 1);
              }}
            >
              <RotateCcw className="mr-2 size-4" /> Try Again
            </Button>
            <Button variant="outline" className="flex-1 border-border/80" onClick={() => void navigate({ to: "/learn" })}>
              Back to Learn
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (skillCompleted) {
    const accuracy = Math.round((completedExercises.length / total) * 100);

    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <Card className="surface-hero border-border/80 shadow-2xl p-8 space-y-6">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-gradient text-primary-foreground shadow-lg">
            <Trophy className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {isChallenge ? "Challenge Mastered!" : "Skill Mastered!"}
            </h1>
            <p className="text-muted-foreground">{skill.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-center">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Accuracy</p>
              <p className="font-display text-xl font-bold text-emerald-400">{accuracy}%</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Attempts</p>
              <p className="font-display text-xl font-bold text-primary">{totalAttempts || total}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Hints Used</p>
              <p className="font-display text-xl font-bold text-amber-400">{hintsUsedCount}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-primary bg-primary/10 py-2.5 px-4 rounded-xl">
            <Sparkles className="size-4" /> Earned +{XP_PER_LESSON} XP
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 font-semibold border-border/80"
              onClick={() => {
                setSkillCompleted(false);
                setCurrentIndex(0);
                setBoardStatus("idle");
                setHintIndex(0);
                setResetKey((k) => k + 1);
              }}
            >
              <RotateCcw className="mr-2 size-4" /> Practice Again
            </Button>
            <Button className="flex-1 font-semibold shadow-md" onClick={() => void navigate({ to: "/learn" })}>
              Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-6">
      <Button asChild variant="ghost" className="-ml-3 text-muted-foreground hover:text-foreground">
        <Link to="/learn">
          <ArrowLeft className="mr-2 size-4" /> Back to Learn Chess
        </Link>
      </Button>

      <ExerciseHeader
        skill={skill}
        currentExerciseIndex={currentIndex}
        completedExercises={completedExercises}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] items-start">
        <div className="mx-auto w-full max-w-[650px] lg:order-1">
          <ExerciseBoard
            key={currentExercise.id}
            exercise={currentExercise}
            onSolved={handleSolved}
            onWrong={handleWrong}
            onMistake={handleMistake}
            resetKey={resetKey}
          />
        </div>

        <div className="lg:order-2 lg:sticky lg:top-24">
          <ExerciseFeedbackPanel
            exercise={currentExercise}
            status={boardStatus}
            hintIndex={hintIndex}
            onShowHint={handleShowHint}
            onReset={handleReset}
            onSelectOption={handleSelectOption}
            onNext={() => void handleNext()}
            isLastExercise={isLast}
          />
        </div>
      </div>
    </div>
  );
}
