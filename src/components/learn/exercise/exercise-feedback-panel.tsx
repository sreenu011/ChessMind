import { useState } from "react";
import { ArrowRight, CheckCircle2, HelpCircle, Lightbulb, RotateCcw, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChoiceMoveOption, LearningExercise } from "@/lib/learn/interactive-types";
import { cn } from "@/lib/utils";

export function ExerciseFeedbackPanel({
  exercise,
  status,
  hintIndex,
  onShowHint,
  onReset,
  onSelectOption,
  onNext,
  isLastExercise,
}: {
  exercise: LearningExercise;
  status: "idle" | "wrong" | "mistake" | "solved";
  hintIndex: number;
  onShowHint: () => void;
  onReset: () => void;
  onSelectOption?: (option: ChoiceMoveOption) => void;
  onNext: () => void;
  isLastExercise: boolean;
}) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const activeHint = hintIndex > 0 ? exercise.hints[Math.min(hintIndex - 1, exercise.hints.length - 1)] : null;

  return (
    <Card className="border-border/80 shadow-lg flex flex-col justify-between">
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="font-display text-xl font-bold">{exercise.title}</CardTitle>
        <CardDescription className="text-sm space-y-1.5 pt-1">
          {exercise.explanation.map((para, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Choose Move Options (for exercise type 'choose-move') */}
        {exercise.type === "choose-move" && exercise.options && (
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-muted-foreground">Select your move:</p>
            <div className="grid gap-2">
              {exercise.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={status === "solved"}
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      onSelectOption?.(opt);
                    }}
                    className={cn(
                      "min-h-11 rounded-lg border border-border/70 px-4 py-3 text-left text-sm font-medium transition-all hover:bg-accent",
                      isSelected && opt.isCorrect && "border-emerald-500/60 bg-emerald-500/10 text-emerald-400 font-semibold",
                      isSelected && !opt.isCorrect && "border-destructive/60 bg-destructive/10 text-destructive font-semibold",
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <p className="mt-1 text-xs text-muted-foreground font-normal">{opt.explanation}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Status Feedback Banner */}
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "rounded-xl border p-4 text-sm font-medium transition-all space-y-1.5",
            status === "solved" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
            status === "wrong" && "border-amber-500/40 bg-amber-500/10 text-amber-400",
            status === "mistake" && "border-destructive/40 bg-destructive/10 text-destructive",
            status === "idle" && "border-border/70 bg-muted/30 text-muted-foreground",
          )}
        >
          {status === "solved" && (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="size-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-400">Mastered!</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {exercise.feedback.correct}
                </p>
              </div>
            </div>
          )}

          {status === "wrong" && (
            <div className="flex items-start gap-2">
              <XCircle className="size-5 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-400">Not quite</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {exercise.feedback.incorrect}
                </p>
              </div>
            </div>
          )}

          {status === "mistake" && (
            <div className="flex items-start gap-2">
              <XCircle className="size-5 shrink-0 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Blunder Detected!</p>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {exercise.feedback.mistakeFeedback ?? exercise.feedback.incorrect}
                </p>
              </div>
            </div>
          )}

          {status === "idle" && (
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 shrink-0 text-primary" />
              <span>Make your move on the interactive chessboard.</span>
            </div>
          )}
        </div>

        {/* Active Hint Box */}
        {activeHint && (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 text-xs text-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-primary">
              <Lightbulb className="size-4" /> Hint {Math.min(hintIndex, exercise.hints.length)}
            </div>
            <p className="text-muted-foreground leading-relaxed">{activeHint}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          {status !== "solved" && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-medium border-border/80"
                onClick={onShowHint}
                disabled={hintIndex >= exercise.hints.length}
              >
                <Lightbulb className="mr-1.5 size-4 text-amber-400" />
                {hintIndex >= exercise.hints.length ? "No more hints" : "Get Hint"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-medium border-border/80"
                onClick={() => {
                  setSelectedOptionId(null);
                  onReset();
                }}
              >
                <RotateCcw className="mr-1.5 size-4" /> Reset Board
              </Button>
            </>
          )}

          {status === "solved" && (
            <Button className="w-full font-semibold shadow-md" onClick={onNext}>
              {isLastExercise ? "Complete Skill" : "Next Exercise"}{" "}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
