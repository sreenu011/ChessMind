import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/state-panels";
import { LearningPath } from "@/components/learn/learning-path";
import { ProgressDashboard } from "@/components/learn/progress-dashboard";
import { useLearningProgress } from "@/hooks/use-learning-progress";

export const Route = createFileRoute("/_authenticated/learn/progress")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Learning Progress — ChessMind" },
      { name: "description", content: "Your chess learning XP, level, streak and completed lessons." },
      { property: "og:title", content: "Learning Progress — ChessMind" },
      { property: "og:description", content: "Track your XP, level, streak and lesson progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { progress, loading } = useLearningProgress();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
      <div>
        <Button asChild variant="ghost" className="-ml-3">
          <Link to="/learn">
            <ArrowLeft className="mr-2 size-4" /> Learn Chess
          </Link>
        </Button>
        <h1 className="mt-3 font-display text-3xl font-bold">Your progress</h1>
        <p className="mt-2 text-muted-foreground">Everything you have completed in the Learn Chess section.</p>
      </div>

      {loading ? (
        <LoadingState label="Loading your progress…" />
      ) : (
        <>
          <ProgressDashboard progress={progress} />

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning path</CardTitle>
                <CardDescription>Explore all lessons freely at any time.</CardDescription>
              </CardHeader>
              <CardContent>
                <LearningPath completed={progress.completedLessons} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quiz results</CardTitle>
                <CardDescription>Your most recent score for each quiz.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {progress.quizScores.length === 0 ? (
                  <p className="text-muted-foreground">No quizzes completed yet.</p>
                ) : (
                  progress.quizScores.map((q) => (
                    <div key={q.quizId} className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                      <span>{q.quizId === "general-quiz" ? "Chess Quiz" : q.quizId}</span>
                      <span className="font-medium">
                        {q.score} / {q.total}
                      </span>
                    </div>
                  ))
                )}
                <div className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                  <span>Tactical puzzles solved</span>
                  <span className="font-medium">{progress.puzzlesSolved.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                  <span>Daily puzzles solved</span>
                  <span className="font-medium">{progress.dailyPuzzlesSolved.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
