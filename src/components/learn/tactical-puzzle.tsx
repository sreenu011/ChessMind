import { useState } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LearningChessBoard } from "@/components/learn/learning-chess-board";
import { cn } from "@/lib/utils";

export type TacticalPuzzleProps = {
  id: string;
  fen: string;
  orientation?: "white" | "black";
  prompt: string;
  sideToMove: string;
  solution: string[];
  idea: string;
  onSolved?: () => void;
  footer?: React.ReactNode;
};

export function TacticalPuzzle({
  id,
  fen,
  orientation = "white",
  prompt,
  sideToMove,
  solution,
  idea,
  onSolved,
  footer,
}: TacticalPuzzleProps) {
  const [state, setState] = useState<"idle" | "wrong" | "solved">("idle");
  const [attempt, setAttempt] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="mx-auto w-full max-w-[650px]">
        <LearningChessBoard
          key={`${id}-${attempt}`}
          fen={fen}
          orientation={orientation}
          solution={solution}
          resetKey={attempt}
          onSolved={() => {
            setState("solved");
            onSolved?.();
          }}
          onWrong={() => setState("wrong")}
        />
      </div>

      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            {sideToMove} to move
          </Badge>
          <CardTitle className="mt-2 text-lg">{prompt}</CardTitle>
          <CardDescription>Make your move on the board.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "rounded-lg border p-4 text-sm",
              state === "solved" && "border-emerald-500/40 bg-emerald-500/10",
              state === "wrong" && "border-destructive/40 bg-destructive/10",
              state === "idle" && "border-border/70 bg-muted/30",
            )}
          >
            {state === "solved" && (
              <>
                <p className="font-medium">✓ Correct!</p>
                <p className="mt-1 text-muted-foreground">{idea}</p>
              </>
            )}
            {state === "wrong" && (
              <>
                <p className="font-medium">Try again.</p>
                <p className="mt-1 text-muted-foreground">
                  That is not the strongest move here — look for a forcing idea.
                </p>
              </>
            )}
            {state === "idle" && <p className="text-muted-foreground">Waiting for your move…</p>}
          </div>

          {showSolution && state !== "solved" && (
            <p className="rounded-lg border border-border/70 bg-muted/30 p-4 text-sm">
              <span className="font-medium">Solution: </span>
              {solution.join(" ")}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="min-h-11"
              onClick={() => {
                setAttempt((a) => a + 1);
                setState("idle");
                setShowSolution(false);
              }}
            >
              <RotateCcw className="mr-2 size-4" /> Reset
            </Button>
            {state !== "solved" && (
              <Button variant="ghost" className="min-h-11" onClick={() => setShowSolution(true)}>
                <Lightbulb className="mr-2 size-4" /> Show solution
              </Button>
            )}
          </div>

          {footer}
        </CardContent>
      </Card>
    </div>
  );
}
