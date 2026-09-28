import { Check, Lock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/lib/profile-stats";

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <section aria-labelledby="achievements-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="achievements-heading" className="font-display text-2xl font-bold tracking-tight">
            Achievements
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {unlockedCount} of {achievements.length} unlocked
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <Card
            key={a.id}
            className={cn(
              "border-border/60 transition-all",
              a.unlocked ? "bg-card/70 border-primary/30" : "bg-card/30 opacity-60",
            )}
          >
            <CardContent className="flex items-start gap-3.5 p-4 sm:p-5">
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl transition-colors shadow-sm",
                  a.unlocked
                    ? "bg-brand-gradient text-primary-foreground font-bold"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {a.unlocked ? <Check aria-hidden className="size-5" /> : <Lock aria-hidden className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("font-semibold text-base leading-tight", a.unlocked ? "text-foreground" : "text-muted-foreground")}>
                  {a.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{a.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
