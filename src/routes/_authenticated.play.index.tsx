import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Bot, Swords, Users } from "lucide-react";
import { useState } from "react";

import { HeroChessScene } from "@/components/dashboard-3d/hero-chess-scene";
import { MiniKnightScene, MiniRookScene } from "@/components/dashboard-3d/mini-piece-scenes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/play/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Play Chess — ChessMind" },
      { name: "description", content: "Choose how you want to play: Practice against Stockfish or challenge friends in real-time." },
      { property: "og:title", content: "Play Chess — ChessMind" },
      { property: "og:description", content: "Choose how you want to play: Practice against Stockfish or challenge friends in real-time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayLandingPage,
});

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function PlayLandingPage() {
  const [hoveredCard, setHoveredCard] = useState<"computer" | "friends" | null>(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 min-h-[calc(100vh-4rem)] overflow-x-hidden flex flex-col justify-center"
    >
      {/* 1. TITLE & SUBTITLE HEADER */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-600/30 bg-amber-500/10 text-amber-500 text-xs font-mono">
          <Swords className="size-3.5" /> Midnight Chess Club
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          PLAY CHESS
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto font-sans">
          Choose how you want to play.
        </p>
      </motion.div>

      {/* 2. 3D CHESS SCENE CENTERPIECE */}
      <motion.div variants={itemVariants} className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl">
        <HeroChessScene />
      </motion.div>

      {/* 3. TWO MODE SELECTION CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        {/* CARD 1: PLAY WITH COMPUTER */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          onHoverStart={() => setHoveredCard("computer")}
          onHoverEnd={() => setHoveredCard(null)}
          className="h-full"
        >
          <Card className="h-full border-amber-600/30 bg-card/95 hover:border-amber-500/60 hover:shadow-amber-500/10 hover:shadow-2xl transition-all flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-400 opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="p-0 pb-6">
              <div className="flex items-center gap-5">
                <MiniKnightScene isHovered={hoveredCard === "computer"} />
                <div>
                  <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
                    PLAY COMPUTER
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    Practice against Stockfish engine
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Test your tactics against Stockfish with customizable difficulty levels, custom clocks, and real-time move feedback.
              </p>

              <Link
                to="/play/computer"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold gap-2 shadow-lg cursor-pointer transition-all"
                )}
              >
                PLAY NOW <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* CARD 2: PLAY WITH FRIENDS */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
          onHoverStart={() => setHoveredCard("friends")}
          onHoverEnd={() => setHoveredCard(null)}
          className="h-full"
        >
          <Card className="h-full border-emerald-600/30 bg-card/95 hover:border-emerald-500/60 hover:shadow-emerald-500/10 hover:shadow-2xl transition-all flex flex-col justify-between p-6 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="p-0 pb-6">
              <div className="flex items-center gap-5">
                <MiniRookScene isHovered={hoveredCard === "friends"} />
                <div>
                  <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
                    PLAY FRIENDS
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    Challenge a friend in real time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create a private game with custom time controls or join a friend using a 6-digit invite code.
              </p>

              <Link
                to="/play/friends"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold gap-2 shadow-lg cursor-pointer transition-all"
                )}
              >
                PLAY NOW <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
