import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Filter, Play, RefreshCw, Search, Shield, Swords, Trophy, Zap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-panels";
import { useAuth } from "@/contexts/auth-context";
import {
  filterPlayedGames,
  subscribeToPlayerGames,
  type GameHistoryFilters,
  type PlayedGame,
} from "@/lib/game-history";
import { formatChange } from "@/lib/rating";
import { findTimeControl, formatTimeControlLabel } from "@/lib/time-controls";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/games")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Game History — ChessMind" },
      { name: "description", content: "Review your completed games, inspect move history, and replay your matches." },
      { property: "og:title", content: "Game History — ChessMind" },
      { property: "og:description", content: "Review your completed games, inspect move history, and replay your matches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamesPage,
});

const PAGE_SIZE = 20;

type ResultFilterType = "all" | "win" | "loss" | "draw";
type TypeFilterType = "all" | "rated" | "training";
type ColorFilterType = "all" | "w" | "b";
type TimeControlFilterType = "all" | "bullet" | "blitz" | "rapid" | "custom";
type DateFilterType = "all" | "today" | "this_week" | "this_month";

function GamesPage() {
  const { user } = useAuth();
  const [rawGames, setRawGames] = useState<PlayedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [resultFilter, setResultFilter] = useState<ResultFilterType>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilterType>("all");
  const [colorFilter, setColorFilter] = useState<ColorFilterType>("all");
  const [timeControlFilter, setTimeControlFilter] = useState<TimeControlFilterType>("all");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setRawGames([]);
      return;
    }
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToPlayerGames(
      user.uid,
      (games) => {
        setRawGames(games);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Game history subscription error:", err);
        setError("Unable to load your game history.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Apply filters
  const filteredGames = useMemo(() => {
    return filterPlayedGames(rawGames, {
      resultFilter,
      typeFilter,
      colorFilter,
      timeControlFilter,
      dateFilter,
      searchQuery,
    });
  }, [rawGames, resultFilter, typeFilter, colorFilter, timeControlFilter, dateFilter, searchQuery]);

  // Overall Statistics from raw user games
  const stats = useMemo(() => {
    const total = rawGames.length;
    const wins = rawGames.filter((g) => g.result === "win").length;
    const losses = rawGames.filter((g) => g.result === "loss").length;
    const draws = rawGames.filter((g) => g.result === "draw").length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : null;
    return { total, wins, losses, draws, winRate };
  }, [rawGames]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedGames = filteredGames.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilters = () => {
    setResultFilter("all");
    setTypeFilter("all");
    setColorFilter("all");
    setTimeControlFilter("all");
    setDateFilter("all");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="font-display flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl">
            <Swords className="h-8 w-8 text-primary" /> Game History
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Review your games and learn from every move.
          </p>
        </div>

        <Button asChild size="lg" className="font-semibold shadow-sm">
          <Link to="/play">
            <Play className="mr-2 h-4 w-4 fill-current" /> Play a Game
          </Link>
        </Button>
      </div>

      {/* TOP SUMMARY STATS CARD */}
      <Card className="border-border/70 bg-card/60 p-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          <div className="space-y-1 sm:pr-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Games</p>
            <p className="font-display text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wins</p>
            <p className="font-display text-2xl font-bold text-emerald-400">{stats.wins}</p>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Losses</p>
            <p className="font-display text-2xl font-bold text-rose-400">{stats.losses}</p>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Draws</p>
            <p className="font-display text-2xl font-bold text-muted-foreground">{stats.draws}</p>
          </div>
          <div className="pt-3 sm:pt-0 sm:pl-4 space-y-1 col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Win Rate</p>
            <p className="font-display text-2xl font-bold text-amber-400">
              {stats.winRate === null ? "—" : `${stats.winRate}%`}
            </p>
          </div>
        </div>
      </Card>

      {/* SEARCH AND FILTERS BAR */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH OPPONENT */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search opponent..."
              className="pl-9"
              aria-label="Search opponent"
            />
          </div>

          {/* RESULT FILTER */}
          <Select
            value={resultFilter}
            onValueChange={(val) => {
              setResultFilter(val as ResultFilterType);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]" aria-label="Result Filter">
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="win">Wins</SelectItem>
              <SelectItem value="loss">Losses</SelectItem>
              <SelectItem value="draw">Draws</SelectItem>
            </SelectContent>
          </Select>

          {/* GAME TYPE FILTER */}
          <Select
            value={typeFilter}
            onValueChange={(val) => {
              setTypeFilter(val as TypeFilterType);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]" aria-label="Game Type Filter">
              <SelectValue placeholder="Game Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rated">Rated</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>

          {/* COLOR FILTER */}
          <Select
            value={colorFilter}
            onValueChange={(val) => {
              setColorFilter(val as ColorFilterType);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]" aria-label="Color Filter">
              <SelectValue placeholder="Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              <SelectItem value="w">White</SelectItem>
              <SelectItem value="b">Black</SelectItem>
            </SelectContent>
          </Select>

          {/* TIME CONTROL FILTER */}
          <Select
            value={timeControlFilter}
            onValueChange={(val) => {
              setTimeControlFilter(val as TimeControlFilterType);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]" aria-label="Time Control Filter">
              <SelectValue placeholder="Time Control" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Controls</SelectItem>
              <SelectItem value="bullet">Bullet</SelectItem>
              <SelectItem value="blitz">Blitz</SelectItem>
              <SelectItem value="rapid">Rapid</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {/* DATE FILTER */}
          <Select
            value={dateFilter}
            onValueChange={(val) => {
              setDateFilter(val as DateFilterType);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]" aria-label="Date Filter">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
            </SelectContent>
          </Select>

          {(resultFilter !== "all" ||
            typeFilter !== "all" ||
            colorFilter !== "all" ||
            timeControlFilter !== "all" ||
            dateFilter !== "all" ||
            searchQuery.trim() !== "") && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* MAIN GAME LIST CONTENT */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to load your game history."
            description="Please try refreshing or check your connection."
            onRetry={() => {
              setLoading(true);
              setError(null);
            }}
          />
        ) : rawGames.length === 0 ? (
          <EmptyState
            className="border-border/60 bg-card/40 py-12"
            icon={<Swords className="size-8 text-muted-foreground" />}
            title="No games yet"
            description="Play your first ChessMind game to build your history."
            action={
              <Button asChild size="lg" className="shadow-sm">
                <Link to="/play">Play a Game</Link>
              </Button>
            }
          />
        ) : paginatedGames.length === 0 ? (
          <Card className="p-8 text-center border-border/60 bg-card/40">
            <p className="text-muted-foreground">No games found matching your active filters.</p>
            <Button variant="outline" size="sm" onClick={resetFilters} className="mt-4">
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {paginatedGames.map((game) => {
              const tcLabel = formatTimeControlLabel(game.timeControlId, game.baseMs, game.incrementMs);
              const formattedDate = game.playedAt ? format(game.playedAt, "MMM d, yyyy · h:mm a") : "Date unknown";

              let resultBadgeClass = "border-slate-500/30 bg-slate-500/10 text-slate-300 font-bold";
              let resultLabel = "DRAW";
              if (game.result === "win") {
                resultBadgeClass = "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-bold";
                resultLabel = "WIN";
              } else if (game.result === "loss") {
                resultBadgeClass = "border-rose-500/40 bg-rose-500/15 text-rose-400 font-bold";
                resultLabel = "LOSS";
              }

              return (
                <Card
                  key={game.id}
                  className="card-hover border-border/70 bg-card/70 transition-all duration-200 overflow-hidden"
                >
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* LEFT SECTION: RESULT BADGE + OPPONENT INFO */}
                    <div className="flex items-start gap-4 min-w-0">
                      {/* RESULT BADGE */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <Badge
                          variant="outline"
                          className={cn("px-3 py-1 text-xs uppercase tracking-wider font-extrabold shadow-xs", resultBadgeClass)}
                        >
                          {resultLabel}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground capitalize mt-1 font-mono">
                          {game.color === "w" ? "White ♔" : "Black ♚"}
                        </span>
                      </div>

                      {/* OPPONENT AVATAR & NAME */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 border border-border/60">
                            <AvatarFallback className="text-xs font-bold">
                              {game.opponentUsername.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-display font-semibold text-foreground text-base truncate max-w-[160px] sm:max-w-[240px]">
                            vs {game.opponentUsername}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground font-mono">
                          {game.userRating !== null && game.opponentRating !== null ? (
                            <span>
                              Rating: {game.userRating} vs {game.opponentRating}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/80">Rating info unavailable</span>
                          )}
                          <span>·</span>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SECTION: GAME DETAILS & REVIEW CTA */}
                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/40 sm:pt-0 sm:border-t-0 sm:justify-end">
                      <div className="flex flex-col items-start sm:items-end text-xs font-mono gap-1">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] uppercase font-semibold px-2 py-0",
                              game.rated
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                                : "border-slate-500/30 bg-slate-500/10 text-slate-400",
                            )}
                          >
                            {game.rated ? "Rated" : "Training"}
                          </Badge>
                          <span className="font-semibold text-foreground">{tcLabel}</span>
                        </div>
                        <span className="text-muted-foreground">{game.moveCount} moves · {game.reason}</span>
                      </div>

                      <Button asChild size="sm" className="font-semibold shadow-xs">
                        <Link to="/game/$gameId/replay" params={{ gameId: game.id }}>
                          Review Game
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {!loading && !error && filteredGames.length > PAGE_SIZE && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <p className="text-xs font-mono text-muted-foreground">
            Page {currentPage} of {totalPages} · {filteredGames.length} games
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
