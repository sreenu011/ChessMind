import { CheckCircle2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ExerciseType, LearningSkill } from "@/lib/learn/interactive-types";
import { cn } from "@/lib/utils";

export const EXERCISE_TYPE_CONFIG: Record<
  ExerciseType,
  { label: string; color: string; badgeVariant: "default" | "secondary" | "outline" | "destructive" }
> = {
  learn: { label: "Learn Move", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", badgeVariant: "outline" },
  "find-move": { label: "Find Move", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", badgeVariant: "outline" },
  "make-move": { label: "Make Move", color: "bg-primary/15 text-primary border-primary/30", badgeVariant: "outline" },
  "avoid-mistake": { label: "Avoid Mistake", color: "bg-rose-500/15 text-rose-400 border-rose-500/30", badgeVariant: "destructive" },
  "choose-move": { label: "Choose Move", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", badgeVariant: "outline" },
  "find-checkmate": { label: "Checkmate!", color: "bg-purple-500/15 text-purple-400 border-purple-500/30", badgeVariant: "outline" },
  "capture-piece": { label: "Capture Piece", color: "bg-orange-500/15 text-orange-400 border-orange-500/30", badgeVariant: "outline" },
  "defend-piece": { label: "Defend Piece", color: "bg-teal-500/15 text-teal-400 border-teal-500/30", badgeVariant: "outline" },
  "mini-challenge": { label: "Mini Challenge", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30", badgeVariant: "outline" },
  "practice-game": { label: "Practice Game", color: "bg-sky-500/15 text-sky-400 border-sky-500/30", badgeVariant: "outline" },
  "find-square": { label: "Find Square", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30", badgeVariant: "outline" },
  "identify-square": { label: "Coordinates", color: "bg-violet-500/15 text-violet-400 border-violet-500/30", badgeVariant: "outline" },
  "board-challenge": { label: "Challenge", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", badgeVariant: "outline" },
};

export function ExerciseHeader({
  skill,
  currentExerciseIndex,
  completedExercises,
}: {
  skill: LearningSkill;
  currentExerciseIndex: number;
  completedExercises: string[];
}) {
  const total = skill.exercises.length;
  const currentExercise = skill.exercises[currentExerciseIndex];
  const typeConfig = currentExercise ? EXERCISE_TYPE_CONFIG[currentExercise.type] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-2xl">
            {skill.icon}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold sm:text-2xl">{skill.title}</h1>
            <p className="text-xs text-muted-foreground">{skill.description}</p>
          </div>
        </div>

        {typeConfig && (
          <Badge className={cn("px-3 py-1 font-semibold text-xs border shadow-sm", typeConfig.color)}>
            {typeConfig.label}
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>Exercise {currentExerciseIndex + 1} of {total}</span>
          <div className="flex gap-1.5 overflow-x-auto py-1">
            {skill.exercises.map((ex, idx) => {
              const isCompleted = completedExercises.includes(ex.id);
              const isCurrent = idx === currentExerciseIndex;
              return (
                <span
                  key={ex.id}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-md text-[10px] font-bold transition-all",
                    isCurrent && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                    isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-muted text-muted-foreground border border-border/50",
                  )}
                >
                  {isCompleted ? "✓" : idx + 1}
                </span>
              );
            })}
          </div>
        </div>
        <Progress value={((currentExerciseIndex + 1) / total) * 100} className="h-2" />
      </div>
    </div>
  );
}
