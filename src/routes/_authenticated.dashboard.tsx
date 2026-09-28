import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Crown,
  Play,
  Puzzle,
  Sparkles,
  Swords,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/state-panels";

import { useAuth } from "@/contexts/auth-context";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { getAvatarById } from "@/lib/avatars";
import { fetchPlayerGames, type PlayedGame } from "@/lib/game-history";
import { puzzleForDate } from "@/lib/learn/content";
import { formatTimeControlLabel } from "@/lib/time-controls";

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

import { HeroChessScene } from "@/components/dashboard-3d/hero-chess-scene";
import { MiniKnightScene, MiniRookScene } from "@/components/dashboard-3d/mini-piece-scenes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ChessMind" },
      {
        name: "description",
        content: "Your ChessMind command center: status, rating, learning progress, and recent games at a glance.",
      },
      { property: "og:title", content: "Dashboard — ChessMind" },
      {
        property: "og:description",
        content: "Your ChessMind command center: status, rating, learning progress, and recent games at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const ALL_CURRICULUM_LEVELS = [
  { levelNum: 1, levelObj: LEVEL_1, routePrefix: "level1", title: "Level 1: Learn the Chessboard" },
  { levelNum: 2, levelObj: LEVEL_2, routePrefix: "level2", title: "Level 2: Board Vision & Pieces" },
  { levelNum: 3, levelObj: LEVEL_3, routePrefix: "level3", title: "Level 3: Safe Captures & Defense" },
  { levelNum: 4, levelObj: LEVEL_4, routePrefix: "level4", title: "Level 4: Check & Checkmate Basics" },
  { levelNum: 5, levelObj: LEVEL_5, routePrefix: "level5", title: "Level 5: Tactical Patterns" },
  { levelNum: 6, levelObj: LEVEL_6, routePrefix: "level6", title: "Level 6: Opening Principles" },
  { levelNum: 7, levelObj: LEVEL_7, routePrefix: "level7", title: "Level 7: Checks, Captures & Threats" },
  { levelNum: 8, levelObj: LEVEL_8, routePrefix: "level8", title: "Level 8: Calculation & Forcing Moves" },
  { levelNum: 9, levelObj: LEVEL_9, routePrefix: "level9", title: "Level 9: Endgame Principles" },
  { levelNum: 10, levelObj: LEVEL_10, routePrefix: "level10", title: "Level 10: Mixed Tactical Practice" },
];

function getGreetingTime(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatChange(val: number) {
  return val > 0 ? `+${val}` : `${val}`;
}

// Framer Motion Entrance Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function DashboardPage() {
  const { user, profile } = useAuth();
  const { progress, loading: progressLoading } = useLearningProgress();

  const [games, setGames] = useState<PlayedGame[] | null>(null);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);

  const [hoveredAi, setHoveredAi] = useState(false);
  const [hoveredFriends, setHoveredFriends] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) return;

    setGamesLoading(true);
    fetchPlayerGames(user.uid, 3)
      .then((rows) => {
        if (active) {
          setGames(rows);
          setGamesError(null);
        }
      })
      .catch((err) => {
        console.error("[Dashboard] Recent games error:", err);
        if (active) {
          setGames([]);
          setGamesError("Unable to load recent games.");
        }
      })
      .finally(() => {
        if (active) setGamesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  // Player User Details
  const username = profile?.username || user?.displayName || "Player";
  const userAvatar = getAvatarById(profile?.avatarId || profile?.photoURL || user?.photoURL);
  const rating = profile?.rating ?? 1200;
  const gamesPlayed = profile?.gamesPlayed ?? 0;
  const wins = profile?.wins ?? 0;
  const winRateFormatted = gamesPlayed > 0 ? `${Math.round((wins / gamesPlayed) * 100)}%` : "0%";

  // Active / Next Incomplete Learning Skill Calculation
  const learningInfo = useMemo(() => {
    const completed = new Set(progress.completedLessons ?? []);

    let activeSkillItem: {
      levelNum: number;
      levelTitle: string;
      skillTitle: string;
      skillDescription: string;
      route: string;
      doneCount: number;
      totalCount: number;
      percent: number;
    } | null = null;

    for (const lvl of ALL_CURRICULUM_LEVELS) {
      const skillsInLvl = lvl.levelObj.skills || [];
      for (const sk of skillsInLvl) {
        if (!completed.has(sk.id) && !activeSkillItem) {
          const lessonProg = progress.lessons?.[sk.id];
          const doneCount = lessonProg?.correctQuestions?.length ?? 0;
          const totalCount = sk.exercises?.length || 4;
          const percent = Math.min(100, Math.round((doneCount / totalCount) * 100));

          activeSkillItem = {
            levelNum: lvl.levelNum,
            levelTitle: lvl.title,
            skillTitle: sk.title,
            skillDescription: sk.description,
            route: `/learn/${lvl.routePrefix}/${sk.id}`,
            doneCount,
            totalCount,
            percent,
          };
        }
      }
    }

    return {
      activeSkillItem,
      hasStarted: (progress.completedLessons?.length ?? 0) > 0 || (activeSkillItem?.doneCount ?? 0) > 0,
    };
  }, [progress]);

  // Daily Puzzle State
  const puzzle = useMemo(() => puzzleForDate(), []);
  const puzzleDone = progress.dailyPuzzlesSolved.includes(new Date().toISOString().slice(0, 10));

  const primaryContinueRoute = learningInfo.activeSkillItem
    ? learningInfo.activeSkillItem.route
    : "/learn/level1/level-1-find-square";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-background text-foreground min-h-[calc(100vh-4rem)] overflow-x-hidden"
    >
      {/* 1. HEADER / HERO SECTION */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-6 rounded-2xl border border-amber-900/20 bg-gradient-to-r from-card via-card/95 to-amber-950/10 p-6 sm:p-8 sm:flex-row sm:items-center sm:justify-between shadow-xl"
      >
        <div className="flex items-center gap-5">
          <Avatar className="size-16 sm:size-20 border-2 border-amber-600/30 shadow-md">
            <AvatarImage src={userAvatar.src} alt={username} />
            <AvatarFallback className="text-xl font-bold bg-amber-950/50 text-amber-500">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {getGreetingTime()}, {username}
            </h1>
            <p className="text-sm text-muted-foreground italic font-serif">
              "Think better. Play better." — Welcome back to <span className="font-semibold text-amber-500 not-italic font-sans">ChessMind</span>.
            </p>
          </div>
        </div>

        {/* Compact Player Summary Metrics */}
        <div className="flex items-center gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-amber-900/20 pt-4 sm:pt-0 sm:pl-6">
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Rating</p>
            <p className="font-display text-xl sm:text-2xl font-bold text-amber-500">{rating}</p>
          </div>
          <div className="h-8 w-px bg-amber-900/20" />
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Games</p>
            <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{gamesPlayed}</p>
          </div>
          <div className="h-8 w-px bg-amber-900/20" />
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Win Rate</p>
            <p className="font-display text-xl sm:text-2xl font-bold text-emerald-500">{winRateFormatted}</p>
          </div>
        </div>
      </motion.div>

      {/* 2. CONTINUE LEARNING HERO CARD (WITH 3D CHESS SCENE) */}
      <motion.div variants={itemVariants}>
        <Card className="border-amber-600/30 shadow-xl relative overflow-hidden bg-card/95">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600" />
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Progress Info & CTA */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1.5 border-amber-600/40 bg-amber-500/10 text-amber-500 px-3 py-1 text-xs">
                    <Sparkles className="size-3.5" /> Continue Learning
                  </Badge>
                  {learningInfo.activeSkillItem && (
                    <span className="text-xs text-muted-foreground font-mono">
                      Level {learningInfo.activeSkillItem.levelNum}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {learningInfo.activeSkillItem
                      ? learningInfo.activeSkillItem.skillTitle
                      : "Curriculum Mastered!"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {learningInfo.activeSkillItem
                      ? `${learningInfo.activeSkillItem.levelTitle} — ${learningInfo.activeSkillItem.skillDescription}`
                      : "Congratulations! You have completed all 10 levels of the ChessMind curriculum."}
                  </p>
                </div>

                {progressLoading ? (
                  <div className="space-y-3 max-w-md">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ) : learningInfo.activeSkillItem ? (
                  <div className="space-y-2 max-w-md">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-muted-foreground">Skill Progress</span>
                      <span className="text-amber-500 font-semibold">
                        {learningInfo.activeSkillItem.doneCount} / {learningInfo.activeSkillItem.totalCount} exercises ({learningInfo.activeSkillItem.percent}%)
                      </span>
                    </div>
                    <Progress value={learningInfo.activeSkillItem.percent} className="h-2 bg-amber-950/40 [&>div]:bg-amber-500" />
                  </div>
                ) : null}

                <div className="pt-2">
                  <Link
                    to={primaryContinueRoute as any}
                    className={cn(
                      buttonVariants({ variant: "default", size: "lg" }),
                      "bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold gap-2 shadow-lg px-6 cursor-pointer"
                    )}
                  >
                    <Play className="size-4 fill-current" />
                    {learningInfo.hasStarted ? "Continue Training →" : "Start Level 1 →"}
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive 3D Chess Centerpiece */}
              <div className="lg:col-span-6 w-full">
                <HeroChessScene />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3. PLAY CHESS SECTION (3D MINIATURE CARDS) */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="font-display text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <Swords className="size-5 text-amber-500" /> Play Chess
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Play with AI / Computer */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            onHoverStart={() => setHoveredAi(true)}
            onHoverEnd={() => setHoveredAi(false)}
          >
            <Card className="border-amber-600/20 bg-card/90 hover:border-amber-600/50 hover:shadow-amber-500/10 transition-all shadow-md h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <MiniKnightScene isHovered={hoveredAi} />
                  <div>
                    <CardTitle className="font-display text-xl font-bold">Play with Computer</CardTitle>
                    <CardDescription className="text-xs">Practice against Stockfish engine</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Challenge Stockfish at customizable difficulty levels. Practice tactics, test opening lines, or play standard matches.
                </p>
                <Link
                  to="/play/computer"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full sm:w-auto border-amber-600/40 hover:bg-amber-500/10 text-amber-500 hover:text-amber-400 font-semibold gap-2"
                  )}
                >
                  Play Now →
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Play with Friends */}
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            onHoverStart={() => setHoveredFriends(true)}
            onHoverEnd={() => setHoveredFriends(false)}
          >
            <Card className="border-emerald-600/20 bg-card/90 hover:border-emerald-600/50 hover:shadow-emerald-500/10 transition-all shadow-md h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <MiniRookScene isHovered={hoveredFriends} />
                  <div>
                    <CardTitle className="font-display text-xl font-bold">Play with Friends</CardTitle>
                    <CardDescription className="text-xs">Challenge a friend via room code</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Create a private room with a 6-digit code or join a friend's match in real time with custom clock options.
                </p>
                <Link
                  to="/play"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full sm:w-auto border-emerald-600/40 hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 font-semibold gap-2"
                  )}
                >
                  Create Game →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* 4. DAILY PUZZLE & RECENT GAMES (GRID) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DAILY PUZZLE */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-amber-600/20 bg-card/90 shadow-md h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="gap-1 border-amber-600/40 bg-amber-500/10 text-amber-500 text-xs">
                  <Puzzle className="size-3" /> Daily Puzzle
                </Badge>
                {puzzleDone && (
                  <Badge variant="outline" className="gap-1 border-emerald-600/40 bg-emerald-500/10 text-emerald-500 text-xs">
                    <Crown className="size-3" /> Solved Today
                  </Badge>
                )}
              </div>
              <CardTitle className="font-display text-xl font-bold mt-2">Tactical Challenge</CardTitle>
              <CardDescription className="text-xs">{puzzle.prompt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-amber-900/20 bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Side to Move</span>
                  <Badge variant="secondary" className="capitalize text-[11px]">
                    {puzzle.sideToMove} to move
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="font-semibold text-amber-500">+25 XP</span>
                </div>
              </div>

              <Link
                to="/learn/daily-puzzle"
                className={cn(
                  buttonVariants({ variant: puzzleDone ? "outline" : "default" }),
                  puzzleDone
                    ? "border-amber-600/30 text-amber-500 hover:bg-amber-500/10"
                    : "bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold",
                  "w-full justify-center gap-2"
                )}
              >
                <Puzzle className="size-4" />
                {puzzleDone ? "Review Today's Puzzle →" : "Solve Puzzle →"}
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* RECENT GAMES */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-amber-600/20 bg-card/90 shadow-md h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="font-display text-xl font-bold">Recent Games</CardTitle>
                <CardDescription className="text-xs">Your last finished matches</CardDescription>
              </div>
              <Link
                to="/games"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs text-amber-500 hover:text-amber-400 gap-1")}
              >
                View All <ArrowRight className="size-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {gamesLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : gamesError ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
                  {gamesError}
                </div>
              ) : !games || games.length === 0 ? (
                <EmptyState
                  title="No completed games yet"
                  description="Play your first game against a friend or Stockfish to start your match history."
                  action={
                    <Link
                      to="/play"
                      className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold gap-1.5")}
                    >
                      <Swords className="size-3.5" /> Play Now
                    </Link>
                  }
                  className="py-6"
                />
              ) : (
                games.map((g) => {
                  const isWin = g.result === "win";
                  const isLoss = g.result === "loss";
                  const tcName = formatTimeControlLabel(g.timeControlId, g.baseMs, g.incrementMs);

                  return (
                    <motion.div key={g.id} whileHover={{ x: 3 }} transition={{ duration: 0.15 }}>
                      <Link
                        to="/game/$gameId/replay"
                        params={{ gameId: g.id }}
                        className="flex items-center justify-between gap-3 rounded-xl border border-amber-900/20 bg-card/60 px-4 py-3 transition-colors hover:border-amber-600/40 hover:bg-amber-950/10"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">
                              <span aria-hidden className="mr-1 text-amber-500">
                                {g.color === "w" ? "♔" : "♚"}
                              </span>
                              vs {g.opponent}
                            </span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase border-amber-900/30">
                              {!g.rated ? "TRAINING" : "RATED"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {g.color === "w" ? "White" : "Black"} · {tcName} ·{" "}
                            {g.playedAt ? formatDistanceToNow(g.playedAt, { addSuffix: true }) : "Recently"}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          {g.ratingChange !== null && g.ratingChange !== undefined && (
                            <span
                              className={cn(
                                "text-xs font-bold",
                                g.ratingChange > 0
                                  ? "text-emerald-500"
                                  : g.ratingChange < 0
                                    ? "text-destructive"
                                    : "text-muted-foreground"
                              )}
                            >
                              {formatChange(g.ratingChange)}
                            </span>
                          )}
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-bold px-2.5 py-0.5",
                              isWin
                                ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-500"
                                : isLoss
                                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                                  : "border-muted/40 bg-muted/10 text-muted-foreground"
                            )}
                          >
                            {isWin ? "Win" : isLoss ? "Loss" : "Draw"}
                          </Badge>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
