import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, ShieldCheck } from "lucide-react";

import { ComputerGame } from "@/components/chess/computer-game";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/learn/practice-game")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Level 10 Practice Game — ChessMind Learn" },
      { name: "description", content: "Play a full practice game to test your skills." },
      { property: "og:title", content: "Level 10 Practice Game — ChessMind Learn" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PracticeGamePage,
});

function PracticeGamePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link to="/learn">
              <ArrowLeft className="mr-2 size-4" /> Back to Learn Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold">Level 10 Practice Game</h1>
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs">
              Unrated Training
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Test your skills in a full game against Stockfish. Choose your difficulty and clock control.
          </p>
        </div>

        <Card className="border-border/70 bg-card/60 p-4 max-w-sm flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2.5 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Competitive Rating Protected:</strong> Practice games are for learning only and will not alter your online multiplayer rating.
          </p>
        </Card>
      </div>

      <ComputerGame />
    </div>
  );
}
