import { Link } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/learn/types";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent",
        difficulty === "beginner" && "bg-emerald-500/15 text-emerald-500",
        difficulty === "intermediate" && "bg-amber-500/15 text-amber-500",
        difficulty === "advanced" && "bg-rose-500/15 text-rose-500",
      )}
    >
      {DIFFICULTY_LABEL[difficulty]}
    </Badge>
  );
}

export type LessonCardProps = {
  icon: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  lessonCount: number;
  completedCount: number;
  locked?: boolean;
  to: string;
  params?: Record<string, string> | undefined;
  actionLabel?: string | undefined;
};

export function LessonCard({
  icon,
  title,
  description,
  difficulty,
  lessonCount,
  completedCount,
  locked = false,
  to,
  params,
  actionLabel,
}: LessonCardProps) {
  const percent = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;
  const done = lessonCount > 0 && completedCount >= lessonCount;

  return (
    <Card className={cn("card-hover flex flex-col bg-card/70", locked && "opacity-60")}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-accent text-2xl leading-none">
            {icon}
          </span>
          {done ? (
            <CheckCircle2 className="size-5 text-emerald-500" aria-label="Completed" />
          ) : locked ? (
            <Lock className="size-4 text-muted-foreground" aria-label="Locked" />
          ) : null}
        </div>
        <CardTitle className="mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <DifficultyBadge difficulty={difficulty} />
          {lessonCount > 0 && <span>{lessonCount} lessons</span>}
        </div>
        {lessonCount > 0 && (
          <div className="space-y-1">
            <Progress value={percent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedCount} of {lessonCount} complete · {percent}%
            </p>
          </div>
        )}
        <Button asChild disabled={locked} className="w-full">
          <Link to={to} params={params as never}>
            {actionLabel ?? (completedCount > 0 ? "Continue" : "Start learning")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
