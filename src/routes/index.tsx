import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bot, History, Trophy, Users, BarChart3, ArrowRight, Sparkles } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroChessScene } from "@/components/dashboard-3d/hero-chess-scene";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ChessMind — Modern 3D Online Chess" },
      {
        name: "description",
        content:
          "Play online chess, challenge friends, compete against AI, learn chess, and improve your game with ChessMind 3D.",
      },
      { property: "og:title", content: "ChessMind — Modern 3D Online Chess" },
      {
        property: "og:description",
        content: "Play online, challenge friends, compete against AI, and track your progress on ChessMind 3D.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Users,
    title: "Online Multiplayer",
    description: "Get matched with players at your level in seconds, any time of day.",
  },
  {
    icon: Bot,
    title: "Play Against AI",
    description: "Train against adjustable engine strength, from beginner to grandmaster.",
  },
  {
    icon: BarChart3,
    title: "Rating System",
    description: "A transparent Elo-style rating that follows every game you play.",
  },
  {
    icon: History,
    title: "Game History",
    description: "Revisit every move, spot your mistakes and learn from your wins.",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Climb global and friend leaderboards across all time controls.",
  },
];

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="space-y-12 pb-16 overflow-x-hidden">
      {/* 1. HERO SECTION WITH 3D CHESSBOARD */}
      <section className="relative border-b border-amber-900/20 bg-gradient-to-b from-slate-950 via-card to-background py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 text-amber-400 text-xs font-mono">
                <Sparkles className="size-3.5" /> Midnight Chess Club
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-none">
                PLAY CHESS.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400">
                  IMPROVE YOUR GAME.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Play online, challenge friends, compete against AI, learn chess, and improve your game with ChessMind 3D.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/play"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold gap-2 shadow-xl px-8 text-base h-12 cursor-pointer transition-all"
                  )}
                >
                  PLAY CHESS <ArrowRight className="size-5" />
                </Link>

                <Link
                  to="/register"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "border-amber-600/40 hover:bg-amber-500/10 text-amber-400 font-bold px-8 text-base h-12 cursor-pointer transition-all"
                  )}
                >
                  GET STARTED
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Chessboard Centerpiece */}
            <div className="lg:col-span-6 w-full max-w-2xl mx-auto shadow-2xl rounded-2xl">
              <HeroChessScene />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES GRID SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything You Need To Master Chess
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            A complete chess home: fast multiplayer matches, Stockfish AI engine, rating stats, and progressive interactive training.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-amber-900/20 bg-card/90 hover:border-amber-600/40 transition-all shadow-md">
              <CardHeader>
                <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-600/20">
                  <f.icon className="size-5" />
                </span>
                <CardTitle className="font-display text-xl font-bold mt-3 text-foreground">{f.title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed">{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}

          <Card className="border-amber-600/30 bg-gradient-to-br from-amber-950/40 via-card to-card text-foreground shadow-lg flex flex-col justify-between p-6">
            <CardHeader className="p-0 pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-mono">
                <Sparkles className="size-3.5" /> Start Today
              </div>
              <CardTitle className="font-display text-xl font-bold mt-1 text-foreground">Ready for your first move?</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Create a free account and start tracking your Elo rating today.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <Link
                to="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold gap-2 shadow-md cursor-pointer"
                )}
              >
                Create Account →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

