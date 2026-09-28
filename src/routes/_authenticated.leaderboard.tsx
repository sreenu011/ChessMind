import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Crown, Medal, Search, Trophy } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { subscribeToLeaderboard, type LeaderboardPlayer } from "@/lib/leaderboard";
import { getAvatarById } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Leaderboard — ChessMind" },
      { name: "description", content: "The top-rated ChessMind players, ranked by rating." },
      { property: "og:title", content: "Leaderboard — ChessMind" },
      { property: "og:description", content: "The top-rated ChessMind players, ranked by rating." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LeaderboardPage,
});

const PAGE_SIZE = 10;

function rankIcon(rank: number) {
  if (rank === 1) return <Crown className="h-4 w-4 text-amber-400" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-slate-300" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-amber-700" />;
  return null;
}

export function LeaderboardPage() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<LeaderboardPlayer[] | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsPending(true);
    setIsError(false);

    const unsubscribe = subscribeToLeaderboard(
      (data) => {
        setPlayers(data);
        setIsPending(false);
        setIsError(false);
      },
      (err) => {
        console.error("Leaderboard realtime error:", err);
        setIsError(true);
        setIsPending(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Calculate real rank based on the full canonical rating-sorted list
  const rankOf = useMemo(() => {
    const map = new Map<string, number>();
    (players ?? []).forEach((p, i) => map.set(p.id, i + 1));
    return map;
  }, [players]);

  const myRank = user ? rankOf.get(user.uid) : undefined;

  // Filter canonical players by search query
  const filtered = useMemo(() => {
    const all = players ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return all;
    return all.filter((p) => p.username.toLowerCase().includes(term));
  }, [players, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagePlayers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      {/* HEADER & MY RANK BADGE */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Trophy className="h-6 w-6 text-amber-400" /> Leaderboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every ChessMind player, ranked by rating.
          </p>
        </div>
        {myRank !== undefined && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium">
            You are ranked <span className="font-bold text-primary">#{myRank}</span>
          </div>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search username…"
          className="pl-9"
          aria-label="Search username"
        />
      </div>

      {/* RESPONSIVE TABLE & CARD CONTAINER */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border/60">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Games</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Wins</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Losses</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Draws</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j} className={cn(j >= 4 && "hidden sm:table-cell")}>
                        <Skeleton className="h-5 w-full max-w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      Unable to load leaderboard. Please try again.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setIsPending(true);
                        setIsError(false);
                      }}
                    >
                      Try again
                    </Button>
                  </TableCell>
                </TableRow>
              ) : pagePlayers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    {search.trim()
                      ? `No players found for “${search.trim()}”.`
                      : "No players yet — be the first to play a rated game."}
                  </TableCell>
                </TableRow>
              ) : (
                pagePlayers.map((p) => {
                  const rank = rankOf.get(p.id) ?? 0;
                  const isMe = user?.uid === p.id;
                  return (
                    <TableRow
                      key={p.id}
                      className={cn(
                        isMe && "bg-primary/10 hover:bg-primary/15 [&>td]:border-primary/20",
                      )}
                    >
                      <TableCell>
                        <span className="flex items-center gap-1.5 font-semibold tabular-nums">
                          {rankIcon(rank)}
                          {rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={getAvatarById(p.avatarId || p.photoURL).src} alt={p.username} className="object-cover" />
                            <AvatarFallback className="text-xs">
                              {p.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium truncate max-w-[120px] sm:max-w-none">
                            {p.username}
                            {isMe && (
                              <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {p.rating}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{p.gamesPlayed}</TableCell>
                      <TableCell className="hidden text-right tabular-nums text-emerald-400 sm:table-cell">
                        {p.wins}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums text-red-400 sm:table-cell">
                        {p.losses}
                      </TableCell>
                      <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
                        {p.draws}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {p.winRate === null ? "—" : `${p.winRate}%`}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      {!isPending && !isError && filtered.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {pageCount} · {filtered.length} players
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
              disabled={currentPage >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
