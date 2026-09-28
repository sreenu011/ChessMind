import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DifficultyBadge } from "@/components/learn/lesson-card";
import { CATEGORIES, categoryById, lessonById } from "@/lib/learn/content";
import { isLessonUnlocked } from "@/lib/learn/progress";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/learn/category/$categoryId")({
  ssr: false,
  head: ({ params }) => {
    const category = CATEGORIES.find((c) => c.id === params.categoryId);
    const title = `${category?.title ?? "Lessons"} — Learn Chess | ChessMind`;
    const description = category?.description ?? "Interactive chess lessons on ChessMind.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { categoryId } = Route.useParams();
  const category = categoryById(categoryId);
  const { progress } = useLearningProgress();
  if (!category) throw notFound();

  const completed = progress.completedLessons;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6">
      <div>
        <Button asChild variant="ghost" className="-ml-3">
          <Link to="/learn">
            <ArrowLeft className="mr-2 size-4" /> Learn Chess
          </Link>
        </Button>
        <h1 className="mt-3 flex items-center gap-3 font-display text-3xl font-bold">
          <span aria-hidden>{category.icon}</span> {category.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{category.description}</p>
      </div>

      <div className="space-y-4">
        {category.lessonIds.map((id, i) => {
          const lesson = lessonById(id);
          if (!lesson) return null;
          const done = completed.includes(id);
          const unlocked = isLessonUnlocked(id, completed);

          const totalQuestions = lesson.steps.length;
          const savedLesson = progress.lessons?.[id];
          const correctCount = done ? totalQuestions : (savedLesson?.correctQuestions?.length ?? 0);
          const isStarted = correctCount > 0;

          return (
            <Card key={id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center border-border/80">
              <CardHeader className="flex-1 p-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Lesson {i + 1}</span>
                  <DifficultyBadge difficulty={lesson.difficulty} />
                  {done ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                      <CheckCircle2 className="size-3.5" /> COMPLETED
                    </span>
                  ) : isStarted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
                      IN PROGRESS
                    </span>
                  ) : null}
                </div>
                <CardTitle className="mt-1 text-lg font-bold">{lesson.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{lesson.description}</CardDescription>
                <p className="text-xs font-medium text-muted-foreground pt-1">
                  {correctCount} / {totalQuestions} questions completed
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Button asChild className="min-h-11 w-full sm:w-auto font-semibold">
                  <Link to="/learn/lesson/$lessonId" params={{ lessonId: id }}>
                    {done ? "Review Lesson" : isStarted ? "Continue" : "Start Lesson"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
