import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { CategoryProgress } from "@/lib/profile-stats";

export function LearningProgressCard({
  categories,
  xp,
  level,
  streak,
  hasActivity,
}: {
  categories: CategoryProgress[];
  xp: number;
  level: number;
  streak: number;
  hasActivity: boolean;
}) {
  return (
    <Card className="border-border/60 bg-card/60 flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="font-display text-xl font-bold tracking-tight">Learning Progress</CardTitle>
        <CardDescription className="text-sm">
          {hasActivity
            ? `XP ${xp} · Level ${level}${streak > 0 ? ` · 🔥 ${streak} day streak` : ""}`
            : "Start learning chess and track your progress here."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasActivity
          ? categories.map((c) => (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">{c.title}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {c.percent}% · {c.done} / {c.total} lessons
                  </span>
                </div>
                <Progress value={c.percent} className="h-2" aria-label={`${c.title} ${c.percent}%`} />
              </div>
            ))
          : (
            <p className="text-sm text-muted-foreground py-2">
              No lessons or puzzles completed yet. Explore structured courses to build your chess skills.
            </p>
          )}
        <div className="pt-2">
          <Button asChild variant="outline" className="min-h-11 w-full sm:w-auto border-border/80 hover:bg-accent">
            <Link to="/learn">Continue Learning →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
