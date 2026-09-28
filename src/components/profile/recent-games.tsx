import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Swords } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/state-panels";
import type { PlayedGame } from "@/lib/game-history";
import { formatChange } from "@/lib/rating";
import { formatTimeControlLabel } from "@/lib/time-controls";

export function RecentGames({ games }: { games: PlayedGame[] }) {
  return (
    <section aria-labelledby="recent-games-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="recent-games-heading" className="font-display text-2xl font-bold tracking-tight">
            Recent Games
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Your latest finished games.</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link to="/games">View All Games →</Link>
        </Button>
      </div>

      {games.length === 0 ? (
        <EmptyState
          className="mt-4 border-border/60 bg-card/40"
          icon={<Swords aria-hidden className="size-6 text-muted-foreground" />}
          title="No games played yet."
          description="Play your first game to build your record."
          action={
            <Button asChild className="min-h-11 shadow-sm">
              <Link to="/play">Play Chess</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-4 space-y-3">
          {games.map((g) => {
            const tcLabel = formatTimeControlLabel(g.timeControlId, g.baseMs, g.incrementMs);
            return (
              <Link
                key={g.id}
                to="/game/$gameId/replay"
                params={{ gameId: g.id }}
                className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="card-hover border-border/60 bg-card/60 transition-all">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4 px-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span aria-hidden className="text-lg leading-none">
                          {g.color === "w" ? "♔" : "♚"}
                        </span>
                        <p className="truncate font-semibold text-base text-foreground">{g.opponent}</p>
                        {g.opponentRating ? (
                          <span className="text-xs font-medium text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded">
                            {g.opponentRating}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {g.color === "w" ? "White" : "Black"} · {tcLabel} · {g.rated ? "Rated" : "Training"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div className="flex flex-col items-end">
                        <Badge
                          variant={
                            g.result === "win"
                              ? "default"
                              : g.result === "loss"
                                ? "destructive"
                                : "secondary"
                          }
                          className="uppercase font-bold tracking-wider text-xs px-2.5 py-0.5"
                        >
                          {g.result}
                        </Badge>
                        <p
                          className={`mt-1 text-xs font-semibold ${
                            g.ratingChange && g.ratingChange > 0
                              ? "text-emerald-500 dark:text-emerald-400"
                              : g.ratingChange && g.ratingChange < 0
                                ? "text-rose-500 dark:text-rose-400"
                                : "text-muted-foreground"
                          }`}
                        >
                          {g.ratingChange === null ? (g.rated ? "unrated" : "training") : formatChange(g.ratingChange)}
                        </p>
                      </div>

                      <p className="hidden text-xs text-muted-foreground sm:block min-w-[90px] text-right">
                        {g.playedAt ? `${formatDistanceToNow(g.playedAt)} ago` : "—"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
