import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TacticalPuzzle } from "@/components/learn/tactical-puzzle";
import { puzzleForDate, todayKey } from "@/lib/learn/content";
import { XP_PER_DAILY } from "@/lib/learn/progress";
import { useLearningProgress } from "@/hooks/use-learning-progress";

export const Route = createFileRoute("/_authenticated/learn/daily-puzzle")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Daily Puzzle — ChessMind" },
      { name: "description", content: "A new chess position every day. Find the best move and keep your streak alive." },
      { property: "og:title", content: "Daily Puzzle — ChessMind" },
      { property: "og:description", content: "Solve today's chess puzzle and earn XP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DailyPuzzlePage,
});

function DailyPuzzlePage() {
  const { progress, solveDaily } = useLearningProgress();
  const day = todayKey();
  const puzzle = useMemo(() => puzzleForDate(), []);
  const alreadySolved = progress.dailyPuzzlesSolved.includes(day);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
      <div>
        <Button asChild variant="ghost" className="-ml-3">
          <Link to="/learn">
            <ArrowLeft className="mr-2 size-4" /> Learn Chess
          </Link>
        </Button>
        <h1 className="mt-3 font-display text-3xl font-bold">Daily Puzzle</h1>
        <p className="mt-2 text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })} · Find the
          best move.
        </p>
        {alreadySolved && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-500">
            <CheckCircle2 className="size-4" /> Solved today
          </p>
        )}
      </div>

      <TacticalPuzzle
        id={`${puzzle.id}-${day}`}
        fen={puzzle.fen}
        orientation={puzzle.orientation}
        prompt={puzzle.prompt}
        sideToMove={puzzle.sideToMove}
        solution={puzzle.solution}
        idea={puzzle.idea}
        onSolved={() => {
          if (alreadySolved) return;
          void solveDaily(day).then(() => toast.success(`Daily puzzle solved — +${XP_PER_DAILY} XP`));
        }}
        footer={
          <Button asChild variant="outline" className="w-full">
            <Link to="/learn/category/$categoryId" params={{ categoryId: "tactics" }}>
              More tactics training
            </Link>
          </Button>
        }
      />
    </div>
  );
}
