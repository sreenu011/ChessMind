import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/learn/types";

export type QuizProps = {
  questions: QuizQuestion[];
  title?: string;
  onComplete?: (score: number, total: number) => void;
  onContinue?: () => void;
  continueLabel?: string;
};

export function Quiz({ questions, title = "Chess Quiz", onComplete, onContinue, continueLabel }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index]!;
  const total = questions.length;

  function choose(option: number) {
    if (picked !== null) return;
    setPicked(option);
    if (option === question.answerIndex) setScore((s) => s + 1);
  }

  function next() {
    const finalScore = score;
    if (index + 1 >= total) {
      setFinished(true);
      onComplete?.(finalScore, total);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const percent = Math.round((score / total) * 100);
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Quiz complete!</CardTitle>
          <CardDescription>Nice work — here is how you did.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="font-display text-5xl font-bold text-brand-gradient">
              {score} / {total}
            </p>
            <p className="mt-1 text-muted-foreground">{percent}%</p>
          </div>
          <Progress value={percent} className="h-2" />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={restart}>
              Try again
            </Button>
            {onContinue && <Button onClick={onContinue}>{continueLabel ?? "Continue learning"}</Button>}
          </div>
        </CardContent>
      </Card>
    );
  }

  const correct = picked !== null && picked === question.answerIndex;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{title}</span>
          <span>
            Question {index + 1} of {total}
          </span>
        </div>
        <Progress value={((index + (picked !== null ? 1 : 0)) / total) * 100} className="mt-2 h-2" />
        <CardTitle className="mt-4 text-xl">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          {question.options.map((option, i) => {
            const isAnswer = i === question.answerIndex;
            const isPicked = picked === i;
            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(i)}
                disabled={picked !== null}
                className={cn(
                  "flex min-h-12 items-center justify-between rounded-lg border border-border/70 px-4 py-3 text-left text-sm transition-colors",
                  "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  picked !== null && isAnswer && "border-emerald-500/60 bg-emerald-500/10",
                  picked !== null && isPicked && !isAnswer && "border-destructive/60 bg-destructive/10",
                )}
              >
                <span>
                  <span className="mr-2 font-medium text-muted-foreground">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </span>
                {picked !== null && isAnswer && <Check className="size-4 text-emerald-500" />}
                {picked !== null && isPicked && !isAnswer && <X className="size-4 text-destructive" />}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "rounded-lg border p-4 text-sm",
              correct ? "border-emerald-500/40 bg-emerald-500/10" : "border-destructive/40 bg-destructive/10",
            )}
          >
            <p className="font-medium">{correct ? "✓ Correct" : "✗ Incorrect"}</p>
            <p className="mt-1 text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={next} disabled={picked === null}>
            {index + 1 >= total ? "See results" : "Next question"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
