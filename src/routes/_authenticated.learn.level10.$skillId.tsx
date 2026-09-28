import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Award, CheckCircle2, RotateCcw, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveExerciseEngine } from "@/components/learn/interactive-exercise";
import { LEVEL_10 } from "@/lib/learn/level10-content";
import { useLearningProgress } from "@/hooks/use-learning-progress";

export const Route = createFileRoute("/_authenticated/learn/level10/$skillId")({
  ssr: false,
  head: ({ params }) => {
    const skill = LEVEL_10.skills.find((s) => s.id === params.skillId);
    const title = `${skill?.title ?? "Level 10 Training"} — Learn Chess | ChessMind`;
    return {
      meta: [
        { title },
        { name: "description", content: skill?.description ?? "Level 10 practice & mastery capstone training." },
        { property: "og:title", content: title },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: Level10SkillPage,
});

function Level10SkillPage() {
  const { skillId } = Route.useParams();
  const skill = LEVEL_10.skills.find((s) => s.id === skillId);
  const navigate = useNavigate();
  const { progress } = useLearningProgress();

  if (!skill) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center space-y-6">
        <Card className="border-border/80 shadow-2xl p-8 space-y-6 bg-card text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-amber-500/20 text-amber-400">
            <AlertTriangle className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Skill Not Found</h1>
            <p className="text-muted-foreground font-mono text-sm">
              Skill ID "{skillId}" does not exist in Level 10.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <Button asChild size="lg" className="font-semibold shadow-md">
              <Link to="/learn">
                <RotateCcw className="mr-2 size-4" /> Return to Learn Dashboard
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If this is the Stockfish Full Practice Game, provide direct redirect/launch option
  if (skill.id === "level-10-practice-game") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-8">
        <Card className="surface-hero border-border/80 shadow-2xl p-8 space-y-6">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/20 text-primary">
            <Trophy className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold">Skill 5: Full Practice Game</h1>
            <p className="text-muted-foreground leading-relaxed">
              Test your tactical, opening, middlegame, and endgame mastery in a full unrated game against Stockfish right in your browser.
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/60 p-4 text-left text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span><strong>Unrated Training:</strong> Will not alter your competitive online rating.</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-400 shrink-0" />
              <span><strong>Custom Setup:</strong> Choose your color, difficulty, and time controls.</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-2">
            <Button asChild size="lg" className="w-full font-semibold shadow-md">
              <Link to="/learn/practice-game">
                Start Stockfish Practice Game
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return <InteractiveExerciseEngine skill={skill} />;
}
