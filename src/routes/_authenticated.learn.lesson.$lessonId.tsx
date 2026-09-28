import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChessBoard } from "@/components/chess/chess-board";
import { LearningChessBoard } from "@/components/learn/learning-chess-board";
import { DifficultyBadge } from "@/components/learn/lesson-card";
import { LESSONS, START_FEN, lessonById } from "@/lib/learn/content";
import { XP_PER_LESSON } from "@/lib/learn/progress";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/learn/lesson/$lessonId")({
  ssr: false,
  head: ({ params }) => {
    const lesson = LESSONS.find((l) => l.id === params.lessonId);
    const title = `${lesson?.title ?? "Lesson"} — Learn Chess | ChessMind`;
    const description = lesson?.description ?? "An interactive chess lesson on ChessMind.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = lessonById(lessonId);
  const navigate = useNavigate();
  const { progress, loading, error, reload, recordQuestion, finishLesson } = useLearningProgress();

  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [stepState, setStepState] = useState<"idle" | "wrong" | "solved">("idle");
  const [quizPick, setQuizPick] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);

  const nextLesson = useMemo(() => {
    if (!lesson) return null;
    const i = LESSONS.findIndex((l) => l.id === lesson.id);
    return LESSONS[i + 1] ?? null;
  }, [lesson]);

  if (!lesson) throw notFound();

  const total = lesson.steps.length;
  const savedLesson = progress.lessons?.[lesson.id];
  const correctQuestions = useMemo(() => savedLesson?.correctQuestions ?? [], [savedLesson?.correctQuestions]);
  const correctQuestionsKey = correctQuestions.join(",");
  const answeredQuestions = savedLesson?.answeredQuestions ?? [];
  const isLessonCompleted = savedLesson?.completed ?? progress.completedLessons.includes(lesson.id);

  // Resume logic: Initialize stepIndex once Firestore progress is loaded
  useEffect(() => {
    if (loading || stepIndex !== null) return;

    // Find the first question that is NOT completed (i.e. not in correctQuestions)
    const firstIncompleteIndex = lesson.steps.findIndex((_, idx) => !correctQuestions.includes(`q${idx + 1}`));

    if (firstIncompleteIndex !== -1) {
      setStepIndex(firstIncompleteIndex);
    } else {
      // All questions already completed -> Open at index 0 in Review mode
      setStepIndex(0);
    }
  }, [loading, stepIndex, lesson.steps, correctQuestionsKey]);

  if (loading || stepIndex === null) {
    return (
      <div className="mx-auto max-w-md py-24 text-center space-y-4">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <p className="text-base font-medium text-muted-foreground">Loading your progress...</p>
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

  const step = lesson.steps[stepIndex]!;
  const currentQuestionId = `q${stepIndex + 1}`;
  const isCurrentQuestionCorrect = correctQuestions.includes(currentQuestionId);
  const isLast = stepIndex === total - 1;

  const canAdvance = (() => {
    if (isCurrentQuestionCorrect) return true;
    if (step.kind === "info") return true;
    if (step.kind === "move") return stepState === "solved";
    if (step.kind === "quiz") return quizPick === step.answerIndex;
    return false;
  })();

  function goTo(index: number) {
    setStepIndex(index);
    setStepState("idle");
    setQuizPick(null);
    setAttempt(0);
  }

  async function handleAdvance() {
    setSaving(true);
    try {
      // Record answer if step is info or solved
      if (step.kind === "info") {
        await recordQuestion(lesson!.id, currentQuestionId, true, total);
      }

      const allSolvedNow =
        Array.from(new Set([...correctQuestions, currentQuestionId])).length >= total;

      if (isLast) {
        if (!isLessonCompleted || allSolvedNow) {
          await finishLesson(lesson!.id);
          toast.success(`Lesson complete — +${XP_PER_LESSON} XP`);
        }
        setShowCompletionScreen(true);
      } else {
        goTo(stepIndex! + 1);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleMoveSolved() {
    setStepState("solved");
    await recordQuestion(lesson!.id, currentQuestionId, true, total);
  }

  async function handleMoveWrong() {
    setStepState("wrong");
    await recordQuestion(lesson!.id, currentQuestionId, false, total);
  }

  async function handleQuizSelect(index: number) {
    if (step.kind !== "quiz") return;
    setQuizPick(index);
    const isCorrect = index === step.answerIndex;
    await recordQuestion(lesson!.id, currentQuestionId, isCorrect, total);
  }

  const boardFen = step.kind === "quiz" ? null : (step.fen ?? START_FEN);
  const orientation = step.kind === "quiz" ? "white" : (step.orientation ?? "white");

  if (showCompletionScreen) {
    const score = correctQuestions.length;
    const accuracy = Math.round((score / total) * 100);

    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <Card className="surface-hero border-border/80 shadow-2xl p-8 space-y-6">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand-gradient text-primary-foreground shadow-lg">
            <Trophy className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold tracking-tight">Lesson Complete!</h1>
            <p className="text-muted-foreground">{lesson.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-background/60 p-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Score</p>
              <p className="font-display text-2xl font-bold text-primary">
                {score} / {total}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Accuracy</p>
              <p className="font-display text-2xl font-bold text-emerald-400">{accuracy}%</p>
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
                setShowCompletionScreen(false);
                goTo(0);
              }}
            >
              Review Lesson
            </Button>
            {nextLesson ? (
              <Button
                className="flex-1 font-semibold shadow-md"
                onClick={() => {
                  setShowCompletionScreen(false);
                  void navigate({ to: "/learn/lesson/$lessonId", params: { lessonId: nextLesson.id } });
                }}
              >
                Next Lesson <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button
                className="flex-1 font-semibold shadow-md"
                onClick={() => void navigate({ to: "/learn" })}
              >
                Back to Learn
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 space-y-4">
        <Button asChild variant="ghost" className="-ml-3 text-muted-foreground hover:text-foreground">
          <Link to="/learn/category/$categoryId" params={{ categoryId: lesson.category }}>
            <ArrowLeft className="mr-2 size-4" /> Back to lessons
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
          <DifficultyBadge difficulty={lesson.difficulty} />
          {isLessonCompleted && <CheckCircle2 className="size-5 text-emerald-500" aria-label="Completed" />}
        </div>

        {/* Question progress and question indicator badges */}
        <div className="max-w-xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Question {stepIndex + 1} of {total}
            </p>
            <div className="flex gap-1.5 overflow-x-auto py-1">
              {lesson.steps.map((_, idx) => {
                const qId = `q${idx + 1}`;
                const isDone = correctQuestions.includes(qId);
                const isAttempted = answeredQuestions.includes(qId);
                const isCurrent = idx === stepIndex;
                return (
                  <button
                    key={qId}
                    type="button"
                    onClick={() => goTo(idx)}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-md text-xs font-bold transition-all",
                      isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                      isDone
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : isAttempted
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-muted text-muted-foreground border border-border/50",
                    )}
                  >
                    {isDone ? "✓" : `Q${idx + 1}`}
                  </button>
                );
              })}
            </div>
          </div>
          <Progress value={((correctQuestions.length) / total) * 100} className="h-2" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="mx-auto w-full max-w-[650px] lg:order-1">
          {boardFen &&
            (step.kind === "move" ? (
              <LearningChessBoard
                key={`${lesson.id}-${stepIndex}-${attempt}`}
                fen={step.fen}
                orientation={orientation}
                solution={step.solution}
                resetKey={attempt}
                onSolved={() => void handleMoveSolved()}
                onWrong={() => void handleMoveWrong()}
              />
            ) : (
              <ChessBoard
                fen={boardFen}
                boardOrientation={orientation}
                onMove={() => false}
                legalMovesFrom={() => []}
                interactive={false}
              />
            ))}
        </div>

        <Card className="lg:order-2 lg:sticky lg:top-24 lg:self-start border-border/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{step.title}</CardTitle>
            {step.kind === "move" && <CardDescription>{step.instruction}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {step.kind !== "quiz" &&
              step.body.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}

            {step.kind === "move" && (
              <>
                <div
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "rounded-lg border p-4 text-sm font-medium",
                    (stepState === "solved" || isCurrentQuestionCorrect) &&
                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                    stepState === "wrong" && !isCurrentQuestionCorrect &&
                      "border-destructive/40 bg-destructive/10 text-destructive",
                    stepState === "idle" && !isCurrentQuestionCorrect &&
                      "border-border/70 bg-muted/30 text-muted-foreground",
                  )}
                >
                  {(stepState === "solved" || isCurrentQuestionCorrect) && <p>✓ {step.success}</p>}
                  {stepState === "wrong" && !isCurrentQuestionCorrect && <p>{step.retry}</p>}
                  {stepState === "idle" && !isCurrentQuestionCorrect && (
                    <p className="text-muted-foreground">Make your move on the board.</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="min-h-11 border-border/80"
                  onClick={() => {
                    setAttempt((a) => a + 1);
                    setStepState("idle");
                  }}
                >
                  <RotateCcw className="mr-2 size-4" /> Reset position
                </Button>
              </>
            )}

            {step.kind === "quiz" && (
              <div className="space-y-3">
                <p className="text-sm font-medium">{step.question}</p>
                <div className="grid gap-2">
                  {step.options.map((option, i) => {
                    const isAnswer = i === step.answerIndex;
                    const isPicked = quizPick === i;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => void handleQuizSelect(i)}
                        className={cn(
                          "min-h-12 rounded-lg border border-border/70 px-4 py-3 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          (quizPick !== null || isCurrentQuestionCorrect) && isAnswer && "border-emerald-500/60 bg-emerald-500/10 font-semibold text-emerald-400",
                          quizPick !== null && isPicked && !isAnswer && "border-destructive/60 bg-destructive/10 text-destructive",
                        )}
                      >
                        <span className="mr-2 font-medium text-muted-foreground">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {quizPick !== null && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={cn(
                      "rounded-lg border p-4 text-sm space-y-2",
                      quizPick === step.answerIndex || isCurrentQuestionCorrect
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                        : "border-destructive/40 bg-destructive/10 text-destructive",
                    )}
                  >
                    <p className="font-semibold">
                      {quizPick === step.answerIndex || isCurrentQuestionCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </p>
                    <p className="text-muted-foreground">{step.explanation}</p>

                    {quizPick !== step.answerIndex && !isCurrentQuestionCorrect && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 border-border/80"
                        onClick={() => setQuizPick(null)}
                      >
                        <RotateCcw className="mr-2 size-3.5" /> Try Again
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button
                variant="outline"
                className="min-h-11 sm:flex-1 border-border/80"
                disabled={stepIndex === 0}
                onClick={() => goTo(stepIndex - 1)}
              >
                <ArrowLeft className="mr-2 size-4" /> Previous
              </Button>
              {isLast ? (
                <Button
                  className="min-h-11 sm:flex-1 font-semibold shadow-md"
                  disabled={!canAdvance || saving}
                  onClick={() => void handleAdvance()}
                >
                  {saving ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : isLessonCompleted ? (
                    "Finish"
                  ) : (
                    "Complete lesson"
                  )}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button
                  className="min-h-11 sm:flex-1 font-semibold shadow-md"
                  disabled={!canAdvance || saving}
                  onClick={() => void handleAdvance()}
                >
                  {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Next"}{" "}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
