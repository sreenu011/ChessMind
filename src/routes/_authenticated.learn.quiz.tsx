import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Quiz } from "@/components/learn/quiz";
import { QUIZ_QUESTIONS } from "@/lib/learn/content";
import { XP_PER_QUIZ } from "@/lib/learn/progress";
import { useLearningProgress } from "@/hooks/use-learning-progress";

export const Route = createFileRoute("/_authenticated/learn/quiz")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Chess Quiz — ChessMind" },
      { name: "description", content: "Ten multiple-choice questions on the rules, tactics and openings of chess." },
      { property: "og:title", content: "Chess Quiz — ChessMind" },
      { property: "og:description", content: "Test what you have learned with a ten question chess quiz." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { finishQuiz } = useLearningProgress();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
      <div>
        <Button asChild variant="ghost" className="-ml-3">
          <Link to="/learn">
            <ArrowLeft className="mr-2 size-4" /> Learn Chess
          </Link>
        </Button>
        <h1 className="mt-3 font-display text-3xl font-bold">Chess Quiz</h1>
        <p className="mt-2 text-muted-foreground">Ten questions. Answer, get instant feedback, and earn XP.</p>
      </div>

      <Quiz
        questions={QUIZ_QUESTIONS}
        onComplete={(score, total) => {
          void finishQuiz("general-quiz", score, total).then(() => {
            toast.success(`Quiz complete — +${XP_PER_QUIZ} XP`);
          });
        }}
        onContinue={() => navigate({ to: "/learn" })}
      />
    </div>
  );
}
