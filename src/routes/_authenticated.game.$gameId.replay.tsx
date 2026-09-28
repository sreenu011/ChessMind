import { Link, createFileRoute } from "@tanstack/react-router";

import { GameReplay } from "@/components/chess/game-replay";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/game/$gameId/replay")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Game replay — ChessMind" },
      { name: "description", content: "Step through a completed ChessMind game move by move." },
      { property: "og:title", content: "Game replay — ChessMind" },
      { property: "og:description", content: "Step through a completed ChessMind game move by move." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReplayPage,
});

function ReplayPage() {
  const { gameId } = Route.useParams();
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Game replay</h1>
          <p className="mt-1 text-muted-foreground">Step through the game move by move. Nothing here changes the game.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/games">Back to history</Link>
        </Button>
      </div>
      <GameReplay gameId={gameId} />
    </div>
  );
}
