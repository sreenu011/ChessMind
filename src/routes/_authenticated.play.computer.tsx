import { createFileRoute } from "@tanstack/react-router";
import { ComputerGame } from "@/components/chess/computer-game";

export const Route = createFileRoute("/_authenticated/play/computer")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Play the computer — ChessMind" },
      { name: "description", content: "Challenge Stockfish at five difficulty levels, choose your colour and clock." },
      { property: "og:title", content: "Play the computer — ChessMind" },
      { property: "og:description", content: "Challenge Stockfish at five difficulty levels, choose your colour and clock." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComputerPage,
});

function ComputerPage() {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center">
      <ComputerGame />
    </div>
  );
}
