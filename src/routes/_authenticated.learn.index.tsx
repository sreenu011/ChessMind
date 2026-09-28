import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Award, CheckCircle2, Flame, Play, ShieldCheck, Sparkles, Trophy, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { LEVEL_1 } from "@/lib/learn/level1-content";
import { LEVEL_2 } from "@/lib/learn/level2-content";
import { LEVEL_3 } from "@/lib/learn/level3-content";
import { LEVEL_4 } from "@/lib/learn/level4-content";
import { LEVEL_5 } from "@/lib/learn/level5-content";
import { LEVEL_6 } from "@/lib/learn/level6-content";
import { LEVEL_7 } from "@/lib/learn/level7-content";
import { LEVEL_8 } from "@/lib/learn/level8-content";
import { LEVEL_9 } from "@/lib/learn/level9-content";
import { LEVEL_10 } from "@/lib/learn/level10-content";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/learn/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Learn Chess — ChessMind" },
      {
        name: "description",
        content: "Learn chess step by step across 10 interactive levels: rules, tactics, strategy, endgames, and mastery.",
      },
      { property: "og:title", content: "Learn Chess — ChessMind" },
      {
        property: "og:description",
        content: "Practical interactive chessboard training and step-by-step chess curriculum.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnDashboard,
});

export function LearnDashboard() {
  const { progress, loading } = useLearningProgress();
  const navigate = useNavigate();
  const completed = progress.completedLessons ?? [];

  const ALL_LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6, LEVEL_7, LEVEL_8, LEVEL_9, LEVEL_10];

  const LEVEL_METADATA = [
    {
      levelNumber: 1,
      level: LEVEL_1,
      masteryId: "level-1-board-master",
      shortTitle: "Piece Movement & Moves",
      shortDesc: "Master files, ranks, coordinates, board orientation, and starting piece setups.",
      icon: "♟️",
      routePrefix: "level1",
    },
    {
      levelNumber: 2,
      level: LEVEL_2,
      masteryId: "level-2-mixed-challenge",
      shortTitle: "Board Vision & Coordinates",
      shortDesc: "Master piece movement for King, Queen, Rook, Bishop, Knight, and Pawn.",
      icon: "♔",
      routePrefix: "level2",
    },
    {
      levelNumber: 3,
      level: LEVEL_3,
      masteryId: "level-3-capture-challenge",
      shortTitle: "Safe Captures & Defending",
      shortDesc: "Learn safe captures, protecting pieces, and spotting undefended targets.",
      icon: "⚔️",
      routePrefix: "level3",
    },
    {
      levelNumber: 4,
      level: LEVEL_4,
      masteryId: "level-4-checkmate-challenge",
      shortTitle: "Check & Checkmate Basics",
      shortDesc: "Recognise check, escape checkmate, deliver mate in 1, and avoid stalemate.",
      icon: "👑",
      routePrefix: "level4",
    },
    {
      levelNumber: 5,
      level: LEVEL_5,
      masteryId: "level-5-tactics-challenge",
      shortTitle: "Tactical Patterns",
      shortDesc: "Special moves (castling, en passant, promotion) and core tactics (fork, pin, skewer).",
      icon: "⚡",
      routePrefix: "level5",
    },
    {
      levelNumber: 6,
      level: LEVEL_6,
      masteryId: "level-6-opening-challenge",
      shortTitle: "Opening Principles",
      shortDesc: "Control the center, develop knights & bishops, castle early, avoid early queen traps.",
      icon: "🎯",
      routePrefix: "level6",
    },
    {
      levelNumber: 7,
      level: LEVEL_7,
      masteryId: "level-7-middlegame-challenge",
      shortTitle: "Middlegame Thinking",
      shortDesc: "Formulate plans, evaluate piece activity, pawn structures, and forcing lines.",
      icon: "🧠",
      routePrefix: "level7",
    },
    {
      levelNumber: 8,
      level: LEVEL_8,
      masteryId: "level-8-calculation-challenge",
      shortTitle: "Tactical Calculation",
      shortDesc: "Calculate forcing sequences (Checks, Captures, Threats) and candidate moves.",
      icon: "🔬",
      routePrefix: "level8",
    },
    {
      levelNumber: 9,
      level: LEVEL_9,
      masteryId: "level-9-endgame-challenge",
      shortTitle: "Endgame Mastery",
      shortDesc: "Activate your King, promote passed pawns, and win King & Pawn endgames.",
      icon: "🏆",
      routePrefix: "level9",
    },
    {
      levelNumber: 10,
      level: LEVEL_10,
      masteryId: "level-10-mastery-challenge",
      shortTitle: "Practice & Mastery",
      shortDesc: "62 practical exercises combining tactics, strategy, endgames, and the Mastery Test.",
      icon: "⭐",
      routePrefix: "level10",
    },
  ];

  // Helper to compute stats for a single level
  const getLevelStats = (meta: (typeof LEVEL_METADATA)[0]) => {
    const totalSkills = meta.level.skills.length;
    const completedSkills = meta.level.skills.filter((s) => completed.includes(s.id));
    const isMastered = completed.includes(meta.masteryId);
    const isCompleted = completedSkills.length === totalSkills;

    const totalExercises = meta.level.skills.reduce((sum, s) => sum + s.exercises.length, 0);

    let completedExercises = 0;
    for (const s of meta.level.skills) {
      if (completed.includes(s.id)) {
        completedExercises += s.exercises.length;
      } else {
        const saved = progress.lessons?.[s.id];
        completedExercises += saved?.correctQuestions?.length ?? 0;
      }
    }

    const percent = Math.round((completedSkills.length / totalSkills) * 100);

    let status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "MASTERED" = "NOT STARTED";
    if (isMastered) {
      status = "MASTERED";
    } else if (isCompleted) {
      status = "COMPLETED";
    } else if (completedSkills.length > 0 || completedExercises > 0) {
      status = "IN PROGRESS";
    }

    const nextSkill = meta.level.skills.find((s) => !completed.includes(s.id)) ?? meta.level.skills[0]!;
    const nextRoute = `/learn/${meta.routePrefix}/${nextSkill.id}`;

    return {
      totalSkills,
      completedSkillsCount: completedSkills.length,
      totalExercises,
      completedExercises,
      percent,
      status,
      isMastered,
      nextRoute,
    };
  };

  // Compute Overall Stats
  const levelStatsList = LEVEL_METADATA.map((meta) => getLevelStats(meta));

  const totalSkillsCount = ALL_LEVELS.reduce((sum, l) => sum + l.skills.length, 0);
  const totalCompletedSkillsCount = levelStatsList.reduce((sum, s) => sum + s.completedSkillsCount, 0);
  const overallPercent = Math.round((totalCompletedSkillsCount / totalSkillsCount) * 100);

  const completedLevelsCount = levelStatsList.filter((s) => s.status === "COMPLETED" || s.status === "MASTERED").length;

  const totalExercisesCount = levelStatsList.reduce((sum, s) => sum + s.totalExercises, 0);
  const totalCompletedExercises = levelStatsList.reduce((sum, s) => sum + s.completedExercises, 0);

  // Global "Continue Learning" target route
  const activeLevelMeta = LEVEL_METADATA.find((meta, idx) => levelStatsList[idx]!.status !== "MASTERED" && levelStatsList[idx]!.status !== "COMPLETED") ?? LEVEL_METADATA[0]!;
  const globalContinueStats = getLevelStats(activeLevelMeta);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
      {/* TOP SECTION HEADER */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-border/60 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary text-xl">
              ♟️
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">ChessMind Learn</h1>
          </div>
          <p className="text-muted-foreground text-base">
            Master Chess Step by Step — 10 interactive levels of board vision, tactics, strategy, and endgames.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="font-semibold shadow-elevate group bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate({ to: globalContinueStats.nextRoute })}
          >
            <Play className="mr-2 size-4 fill-current transition-transform group-hover:translate-x-0.5" />
            Continue Learning
          </Button>
        </div>
      </div>

      {/* COMPACT PROGRESS SUMMARY STATS */}
      <Card className="border-border/70 bg-card/60 shadow-sm p-5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {/* Stat 1: Overall Progress */}
          <div className="space-y-2 sm:pr-4">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Overall Progress</span>
              <span className="text-foreground font-mono text-sm">{overallPercent}%</span>
            </div>
            <Progress value={overallPercent} className="h-2.5 bg-muted/80" />
          </div>

          {/* Stat 2: Levels Completed */}
          <div className="pt-4 sm:pt-0 sm:px-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Levels Completed</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {completedLevelsCount} <span className="text-sm font-normal text-muted-foreground">/ 10</span>
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Trophy className="size-5" />
            </div>
          </div>

          {/* Stat 3: Exercises Completed */}
          <div className="pt-4 sm:pt-0 sm:pl-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exercises Completed</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {totalCompletedExercises} <span className="text-sm font-normal text-muted-foreground">/ {totalExercisesCount}</span>
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="size-5" />
            </div>
          </div>
        </div>
      </Card>

      {/* 3-COLUMN GRID FOR LEVELS 1 THROUGH 9 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">Curriculum Levels (1–9)</h2>
          <span className="text-xs font-mono text-muted-foreground">All levels unlocked & accessible</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVEL_METADATA.slice(0, 9).map((meta, idx) => {
            const stats = levelStatsList[idx]!;

            // Status badge style
            let badgeVariant: "outline" | "default" | "secondary" = "outline";
            let badgeClass = "border-border/80 bg-muted/40 text-muted-foreground";

            if (stats.status === "MASTERED") {
              badgeClass = "border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold";
            } else if (stats.status === "COMPLETED") {
              badgeClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold";
            } else if (stats.status === "IN PROGRESS") {
              badgeClass = "border-primary/40 bg-primary/10 text-primary font-semibold";
            }

            const isCardActive = stats.status === "IN PROGRESS" || stats.status === "COMPLETED" || stats.status === "MASTERED";

            return (
              <Card
                key={meta.levelNumber}
                className={cn(
                  "card-hover flex flex-col justify-between p-5 transition-all duration-200 border-border/80 bg-card/70",
                  isCardActive && "border-primary/40 shadow-sm",
                )}
              >
                <div className="space-y-4">
                  {/* Top Row: Level Number Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      LEVEL {meta.levelNumber}
                    </span>
                    <Badge variant={badgeVariant} className={cn("text-[10px] tracking-wide uppercase px-2 py-0.5", badgeClass)}>
                      {stats.status}
                    </Badge>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted/60 text-xl">
                      {meta.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground leading-snug line-clamp-1">
                        {meta.shortTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {meta.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="space-y-2 pt-1 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>{stats.completedSkillsCount} / {stats.totalSkills} skills</span>
                      <span className="font-bold text-foreground">{stats.percent}%</span>
                    </div>
                    <Progress value={stats.percent} className="h-2 bg-muted/60" />
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {stats.completedExercises} / {stats.totalExercises} exercises completed
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 mt-2">
                  <Button
                    asChild
                    size="sm"
                    variant={stats.status === "NOT STARTED" ? "outline" : "default"}
                    className="w-full font-semibold"
                  >
                    <Link to={stats.nextRoute}>
                      {stats.status === "NOT STARTED" ? (
                        <>
                          <Play className="mr-1.5 size-3.5 fill-current" /> Start Training
                        </>
                      ) : stats.status === "IN PROGRESS" ? (
                        <>
                          <ArrowRight className="mr-1.5 size-3.5" /> Continue
                        </>
                      ) : (
                        <>
                          <ArrowRight className="mr-1.5 size-3.5" /> Review
                        </>
                      )}
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* LEVEL 10 — LARGE CAPSTONE CARD */}
      {(() => {
        const l10Meta = LEVEL_METADATA[9]!;
        const l10Stats = levelStatsList[9]!;

        const featureLabels = [
          "Mixed Tactical Practice",
          "Opening Practice",
          "Middlegame Practice",
          "Endgame Practice",
          "Full Practice Game",
          "ChessMind Mastery Test",
        ];

        return (
          <Card className="border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 sm:p-8 shadow-elevate space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-amber-500/50 bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                    LEVEL 10 — CAPSTONE
                  </Badge>
                  <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xs">
                    {l10Stats.status}
                  </Badge>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                  <span>Practice & Mastery</span>
                  <span className="text-2xl">⭐</span>
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Combine everything learned in Levels 1–9 across tactical practice, openings, middlegames, endgames, and the ultimate ChessMind Mastery Test.
                </p>
              </div>

              <div className="shrink-0 pt-2 md:pt-0">
                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto font-bold shadow-md bg-amber-500 text-slate-950 hover:bg-amber-400 border-none"
                >
                  <Link to={l10Stats.nextRoute}>
                    <Award className="mr-2 size-5" /> TAKE MASTERY TEST
                  </Link>
                </Button>
              </div>
            </div>

            {/* Feature Chips */}
            <div className="space-y-3 pt-2 border-t border-amber-500/20">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400/90">
                Included Capstone Training Modules:
              </p>
              <div className="flex flex-wrap gap-2">
                {featureLabels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-md border border-border/80 bg-card/80 px-3 py-1 text-xs font-medium text-foreground shadow-xs"
                  >
                    <CheckCircle2 className="mr-1.5 size-3.5 text-amber-400 shrink-0" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Level 10 Progress */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Capstone Progress: {l10Stats.completedSkillsCount} / {l10Stats.totalSkills} modules</span>
                <span className="font-bold text-foreground">{l10Stats.percent}%</span>
              </div>
              <Progress value={l10Stats.percent} className="h-2.5 bg-muted/80" />
            </div>
          </Card>
        );
      })()}
    </div>
  );
}
