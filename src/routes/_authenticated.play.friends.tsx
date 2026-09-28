import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Copy, Crown, Loader2, Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import {
  cancelGame,
  createGame,
  joinGameByCode,
  type GameDoc,
} from "@/lib/games";
import { DEFAULT_TIME_CONTROL, TIME_CONTROLS } from "@/lib/time-controls";
import { OnlineGame } from "@/components/chess/online-game";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/play/friends")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Play with Friends — ChessMind" },
      { name: "description", content: "Create or join a private real-time chess game with a 6-digit invite code." },
      { property: "og:title", content: "Play with Friends — ChessMind" },
      { property: "og:description", content: "Create or join a private real-time chess game with a 6-digit invite code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayFriendsPage,
});

function PlayFriendsPage() {
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [selectedTc, setSelectedTc] = useState(DEFAULT_TIME_CONTROL.id);
  const [creating, setCreating] = useState(false);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Join state
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  // If a game is active or waiting, render the OnlineGame arena
  if (activeGameId) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <OnlineGame gameId={activeGameId} />
      </div>
    );
  }

  const handleCreateGame = async () => {
    if (!user) {
      toast.error("Please log in to create a game.");
      return;
    }
    setCreating(true);
    try {
      const tcObj = TIME_CONTROLS.find((tc) => tc.id === selectedTc) ?? DEFAULT_TIME_CONTROL;
      const hostPlayer = {
        uid: user.uid,
        username: profile?.username ?? user.displayName ?? "Player",
        rating: profile?.rating ?? 1200,
      };
      const result = await createGame(hostPlayer, tcObj);
      setActiveGameId(result.gameId);
      toast.success("Game room created!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create game room.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    if (!user) {
      toast.error("Please log in to join a game.");
      return;
    }

    const cleanCode = joinCode.trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      setCodeError("Please enter exactly 6 numeric digits (e.g. 123456)");
      return;
    }

    setJoining(true);
    try {
      const player = {
        uid: user.uid,
        username: profile?.username ?? user.displayName ?? "Player",
        rating: profile?.rating ?? 1200,
      };
      const joinedId = await joinGameByCode(cleanCode, player);
      setActiveGameId(joinedId);
      toast.success("Joined game!");
    } catch (err: any) {
      setCodeError(err?.message || "Invalid or expired invite code.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8 min-h-[calc(100vh-4rem)]">
      {/* Back Link */}
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/play">
            <ArrowLeft className="mr-2 size-4" /> Back to Mode Selection
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center gap-3">
          <Users className="size-8 text-emerald-500" /> PLAY WITH FRIENDS
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Choose what you want to do.
        </p>
      </div>

      {/* Main Tab Container */}
      <Card className="border-emerald-600/30 bg-card/95 shadow-xl max-w-2xl mx-auto overflow-hidden">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/60 p-1.5 border-b border-emerald-900/20 rounded-none h-14">
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-slate-950 font-bold text-sm h-11 rounded-lg transition-all"
            >
              CREATE GAME
            </TabsTrigger>
            <TabsTrigger
              value="join"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-slate-950 font-bold text-sm h-11 rounded-lg transition-all"
            >
              JOIN GAME
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CREATE GAME */}
          <TabsContent value="create" className="p-6 sm:p-8 space-y-6 m-0">
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-foreground">Select Time Control</h3>
              <p className="text-xs text-muted-foreground">Choose clock settings for your match</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIME_CONTROLS.map((tc) => {
                const isSelected = selectedTc === tc.id;
                return (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => setSelectedTc(tc.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20",
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 ring-2 ring-emerald-500/40"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-display font-bold text-base">{tc.label}</span>
                    <span className="text-[11px] opacity-70 font-mono">{tc.category}</span>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleCreateGame}
              disabled={creating}
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-base shadow-lg h-12 gap-2 cursor-pointer"
            >
              {creating ? <Loader2 className="size-5 animate-spin" /> : "CREATE GAME →"}
            </Button>
          </TabsContent>

          {/* TAB 2: JOIN GAME */}
          <TabsContent value="join" className="p-6 sm:p-8 space-y-6 m-0">
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-foreground">Join Friend's Game</h3>
              <p className="text-xs text-muted-foreground">Enter the 6-digit invite code provided by your friend</p>
            </div>

            <form onSubmit={handleJoinGame} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  maxLength={6}
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setCodeError(null);
                  }}
                  placeholder="123456"
                  className="font-mono text-center text-3xl font-bold tracking-[0.3em] h-16 bg-slate-950 border-emerald-900/40 focus-visible:ring-emerald-500"
                />
                {codeError && <p className="text-xs text-rose-500 font-medium text-center">{codeError}</p>}
              </div>

              <Button
                type="submit"
                disabled={joining || joinCode.length !== 6}
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-base shadow-lg h-12 gap-2 cursor-pointer"
              >
                {joining ? <Loader2 className="size-5 animate-spin" /> : "JOIN GAME →"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
