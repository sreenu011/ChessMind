import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle } from "lucide-react";

import { LESSONS } from "@/lib/learn/content";
import { cn } from "@/lib/utils";

export function LearningPath({ completed }: { completed: string[] }) {
  return (
    <ol className="relative space-y-1 border-l border-border/70 pl-6">
      {LESSONS.map((lesson) => {
        const done = completed.includes(lesson.id);
        return (
          <li key={lesson.id} className="relative py-2">
            <Link
              to="/learn/lesson/$lessonId"
              params={{ lessonId: lesson.id }}
              className="block rounded-md px-1 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "absolute -left-[9px] grid size-[18px] place-items-center rounded-full bg-background",
                    done ? "text-emerald-500" : "text-primary",
                  )}
                >
                  {done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                </span>
                <span className="text-sm font-medium">{lesson.title}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
