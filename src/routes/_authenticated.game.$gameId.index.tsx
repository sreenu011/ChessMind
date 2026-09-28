import { createFileRoute } from "@tanstack/react-router";
import { OnlineGame } from "@/components/chess/online-game";

export const Route = createFileRoute("/_authenticated/game/$gameId/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Online game — ChessMind" },
      { name: "description", content: "Play a private online chess game with a friend in real time." },
      { property: "og:title", content: "Online game — ChessMind" },
      { property: "og:description", content: "Play a private online chess game with a friend in real time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  const { gameId } = Route.useParams();
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center">
      <OnlineGame gameId={gameId} />
    </div>
  );
}
