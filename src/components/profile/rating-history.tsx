import { Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatChange } from "@/lib/rating";
import type { RatingHistoryEntry } from "@/lib/rating-history";

function when(date: Date | null) {
  if (!date) return "—";
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  if (sameDay) return "Today";
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function RatingHistoryTable({
  entries,
  opponentNames,
  hasMore,
}: {
  entries: RatingHistoryEntry[];
  opponentNames: Map<string, string>;
  hasMore: boolean;
}) {
  return (
    <div className="mt-6 space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/40">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
            <tr>
              <th scope="col" className="px-3.5 py-3 font-semibold sm:px-4">
                Date
              </th>
              <th scope="col" className="px-3.5 py-3 font-semibold sm:px-4">
                Opponent
              </th>
              <th scope="col" className="px-3.5 py-3 font-semibold sm:px-4">
                Result
              </th>
              <th scope="col" className="px-3.5 py-3 text-right font-semibold sm:px-4">
                Rating Change
              </th>
              <th scope="col" className="px-3.5 py-3 text-right font-semibold sm:px-4">
                New Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {entries.map((h) => {
              const oppName = opponentNames.get(h.gameId) ?? "Opponent";
              return (
                <tr key={h.id} className="transition-colors hover:bg-accent/40">
                  <td className="px-3.5 py-3 font-medium whitespace-nowrap sm:px-4">
                    {when(h.timestamp?.toDate() ?? null)}
                  </td>
                  <td className="px-3.5 py-3 font-medium sm:px-4">
                    <span className="truncate max-w-[140px] sm:max-w-none block">{oppName}</span>
                  </td>
                  <td className="px-3.5 py-3 whitespace-nowrap sm:px-4">
                    <Badge
                      variant={
                        h.result === "win" ? "default" : h.result === "loss" ? "destructive" : "secondary"
                      }
                      className="capitalize font-semibold text-xs px-2.5 py-0.5"
                    >
                      {h.result}
                    </Badge>
                  </td>
                  <td
                    className={`px-3.5 py-3 text-right font-semibold whitespace-nowrap sm:px-4 ${
                      h.ratingChange > 0
                        ? "text-emerald-500 dark:text-emerald-400"
                        : h.ratingChange < 0
                          ? "text-rose-500 dark:text-rose-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {formatChange(h.ratingChange)}
                  </td>
                  <td className="px-3.5 py-3 text-right font-display font-semibold whitespace-nowrap sm:px-4">
                    {h.newRating}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasMore ? (
        <div className="flex justify-end pt-1">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link to="/games">View Full History →</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
