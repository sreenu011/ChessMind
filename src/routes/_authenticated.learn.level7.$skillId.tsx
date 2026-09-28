import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InteractiveExerciseEngine } from "@/components/learn/interactive-exercise";
import { LEVEL_7 } from "@/lib/learn/level7-content";

export const Route = createFileRoute("/_authenticated/learn/level7/$skillId")({
  ssr: false,
  head: ({ params }) => {
    const skill = LEVEL_7.skills.find((s) => s.id === params.skillId);
    const title = `${skill?.title ?? "Level 7 Training"} — Learn Chess | ChessMind`;
    return {
      meta: [
        { title },
        { name: "description", content: skill?.description ?? "Level 7 middlegame thinking training." },
        { property: "og:title", content: title },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: Level7SkillPage,
});

function Level7SkillPage() {
  const { skillId } = Route.useParams();
  const skill = LEVEL_7.skills.find((s) => s.id === skillId);

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
              Skill ID "{skillId}" does not exist in Level 7.
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

  return <InteractiveExerciseEngine skill={skill} />;
}
