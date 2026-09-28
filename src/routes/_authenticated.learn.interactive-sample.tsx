import { createFileRoute } from "@tanstack/react-router";
import { InteractiveExerciseEngine } from "@/components/learn/interactive-exercise";
import { SAMPLE_INTERACTIVE_SKILL } from "@/lib/learn/sample-interactive-lesson";

export const Route = createFileRoute("/_authenticated/learn/interactive-sample")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Interactive Knight Masterclass — Learn Chess | ChessMind" },
      {
        name: "description",
        content: "Interactive chess board training: learn, see, try, get feedback, avoid mistakes, and master skills.",
      },
      { property: "og:title", content: "Interactive Knight Masterclass — Learn Chess | ChessMind" },
      {
        property: "og:description",
        content: "Interactive chess board training: learn, see, try, get feedback, avoid mistakes, and master skills.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InteractiveSamplePage,
});

function InteractiveSamplePage() {
  return <InteractiveExerciseEngine skill={SAMPLE_INTERACTIVE_SKILL} />;
}
