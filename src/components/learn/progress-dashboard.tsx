import { Flame, GraduationCap, Sparkles, Target } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LESSONS, todayKey } from "@/lib/learn/content";
import { xpIntoLevel, type LearningProgress } from "@/lib/learn/progress";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function currentWeek(): { key: string; label: string }[] {
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(today.getTime() - dayOfWeek * 86_400_000);
  return DAY_LABELS.map((label, i) => ({
    key: todayKey(new Date(monday.getTime() + i * 86_400_000)),
    label,
  }));
}

export function ProgressDashboard({ progress }: { progress: LearningProgress }) {
  const week = currentWeek();
  const lessonPercent = Math.round((progress.completedLessons.length / LESSONS.length) * 100);

  const totalQuestionsAllLessons = LESSONS.reduce((sum, l) => sum + l.steps.length, 0);
  const totalQuestionsCompleted = LESSONS.reduce((sum, l) => {
    const isCompleted = progress.completedLessons.includes(l.id);
    if (isCompleted) return sum + l.steps.length;
    const saved = progress.lessons?.[l.id];
    return sum + (saved?.correctQuestions?.length ?? 0);
  }, 0);
  const questionPercent = totalQuestionsAllLessons > 0 ? Math.round((totalQuestionsCompleted / totalQuestionsAllLessons) * 100) : 0;

  const stats = [
    { icon: Sparkles, label: "Total XP", value: progress.totalXP },
    { icon: GraduationCap, label: "Level", value: progress.currentLevel },
    { icon: Target, label: "Lessons done", value: `${progress.completedLessons.length}/${LESSONS.length}` },
    { icon: Flame, label: "Day streak", value: progress.learningStreak },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card/70 border-border/80">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2 font-medium">
                <s.icon className="size-4 text-primary" /> {s.label}
              </CardDescription>
              <CardTitle className="font-display text-3xl font-bold">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Level {progress.currentLevel}</CardTitle>
            <CardDescription>{100 - xpIntoLevel(progress.totalXP)} XP to the next level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={xpIntoLevel(progress.totalXP)} className="h-2" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Curriculum & Question Progress</p>
              <Progress value={questionPercent} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground font-medium pt-1">
                <span>{progress.completedLessons.length} / {LESSONS.length} lessons complete ({lessonPercent}%)</span>
                <span>{totalQuestionsCompleted} / {totalQuestionsAllLessons} questions ({questionPercent}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span aria-hidden>🔥</span> {progress.learningStreak} day streak
            </CardTitle>
            <CardDescription>Learn something every day to keep it alive.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {week.map((day) => {
                const active = progress.activeDays.includes(day.key);
                return (
                  <div key={day.key}>
                    <p className="text-xs text-muted-foreground">{day.label}</p>
                    <div
                      aria-label={`${day.label}: ${active ? "studied" : "no activity"}`}
                      className={cn(
                        "mt-1 grid aspect-square place-items-center rounded-lg border text-sm",
                        active
                          ? "border-transparent bg-brand-gradient text-primary-foreground"
                          : "border-border/70 bg-muted/30 text-muted-foreground",
                      )}
                    >
                      {active ? "✓" : "·"}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
