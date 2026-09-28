import { createFileRoute } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-panels";
import { Achievements } from "@/components/profile/achievements";
import { ChessJourney } from "@/components/profile/chess-journey";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";
import { LearningProgressCard } from "@/components/profile/learning-progress";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStats } from "@/components/profile/profile-stats";
import { RatingChart } from "@/components/profile/rating-chart";
import { RatingHistoryTable } from "@/components/profile/rating-history";
import { RecentGames } from "@/components/profile/recent-games";
import { useAuth } from "@/contexts/auth-context";
import { useLearningProgress } from "@/hooks/use-learning-progress";
import { fetchPlayerGames } from "@/lib/game-history";
import { fetchRatingHistory } from "@/lib/rating-history";
import { winPercentage } from "@/lib/rating";
import {
  buildAchievements,
  chessLevel,
  learningByCategory,
  longestWinStreak,
  peakRating,
} from "@/lib/profile-stats";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — ChessMind" },
      { name: "description", content: "Your ChessMind rating, record, rating history and achievements." },
      { property: "og:title", content: "Profile — ChessMind" },
      { property: "og:description", content: "Your ChessMind rating, record, history and achievements." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { progress, loading: learnLoading } = useLearningProgress();
  const [editing, setEditing] = useState(false);

  const [gamesQuery, historyQuery] = useQueries({
    queries: [
      {
        queryKey: ["profile-games", user?.uid],
        queryFn: () => fetchPlayerGames(user!.uid, 50),
        enabled: !!user,
      },
      {
        queryKey: ["rating-history", user?.uid],
        queryFn: () => fetchRatingHistory(user!.uid, 50),
        enabled: !!user,
      },
    ],
  });

  const games = gamesQuery.data ?? [];
  const history = historyQuery.data ?? [];
  const loading = authLoading || (!!user && !profile) || gamesQuery.isLoading || historyQuery.isLoading;
  const failed = gamesQuery.isError || historyQuery.isError;

  const username = profile?.username ?? user?.displayName ?? "Player";
  const rating = profile?.rating ?? 1200;

  // Calculate statistics dynamically from real completed games in Firestore,
  // merged with server-maintained user profile record if present.
  const gamesWins = games.filter((g) => g.result === "win").length;
  const gamesLosses = games.filter((g) => g.result === "loss").length;
  const gamesDraws = games.filter((g) => g.result === "draw").length;
  const gamesTotal = games.length;

  const wins = Math.max(profile?.wins ?? 0, gamesWins);
  const losses = Math.max(profile?.losses ?? 0, gamesLosses);
  const draws = Math.max(profile?.draws ?? 0, gamesDraws);
  const gamesPlayed = Math.max(profile?.gamesPlayed ?? 0, gamesTotal);

  const winRate = winPercentage(wins, gamesPlayed);
  const peak = peakRating(rating, history);
  const level = chessLevel(progress, rating, gamesPlayed);

  const chartData = useMemo(
    () =>
      [...history]
        .reverse()
        .map((h) => ({
          date: h.timestamp ? h.timestamp.toDate().toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "",
          rating: h.newRating,
        })),
    [history],
  );

  const opponentNames = useMemo(
    () => new Map(games.map((g) => [g.id, g.opponent])),
    [games],
  );

  const achievements = useMemo(
    () => buildAchievements(games, wins, gamesPlayed, progress),
    [games, wins, gamesPlayed, progress],
  );

  const categories = useMemo(() => learningByCategory(progress), [progress]);
  const hasLearning =
    progress.completedLessons.length + progress.puzzlesSolved.length + progress.quizScores.length > 0;

  if (failed) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <ErrorState
          title="Unable to load your profile."
          description="Please try again."
          onRetry={() => {
            void gamesQuery.refetch();
            void historyQuery.refetch();
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-10 sm:px-6 sm:py-12">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const journey = [
    { label: "Games played", value: gamesPlayed },
    { label: "Best rating", value: peak },
    { label: "Current rating", value: rating },
    { label: "Win rate", value: `${winRate}%` },
    { label: "Longest win streak", value: longestWinStreak(games) },
    { label: "Puzzles solved", value: progress.puzzlesSolved.length + progress.dailyPuzzlesSolved.length },
    { label: "Lessons completed", value: progress.completedLessons.length },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-10 px-4 py-10 sm:px-6 sm:py-12">
      <ProfileHeader
        username={username}
        displayName={user?.displayName ?? null}
        avatarId={profile?.avatarId ?? null}
        photoURL={profile?.photoURL ?? user?.photoURL ?? null}
        rating={rating}
        wins={wins}
        losses={losses}
        draws={draws}
        gamesPlayed={gamesPlayed}
        winRate={winRate}
        level={level}
        onEdit={() => setEditing(true)}
      />

      <ProfileStats
        stats={[
          { label: "Rating", value: rating },
          { label: "Peak rating", value: peak },
          { label: "Games", value: gamesPlayed },
          { label: "Win rate", value: `${winRate}%` },
          { label: "Wins", value: wins },
          { label: "Losses", value: losses },
          { label: "Draws", value: draws },
          { label: "Chess level", value: level },
        ]}
      />

      <section aria-labelledby="rating-history-heading">
        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle id="rating-history-heading" className="font-display text-2xl font-bold tracking-tight">
              Rating History
            </CardTitle>
            <CardDescription className="text-sm">
              Every rated game and what it did to your rating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <EmptyState
                className="my-2 border-border/60 bg-card/40"
                title="No rated games yet."
                description="Finish an online rated game and your rating change will appear here."
              />
            ) : (
              <>
                <RatingChart data={chartData} />
                <RatingHistoryTable
                  entries={history.slice(0, 10)}
                  opponentNames={opponentNames}
                  hasMore={history.length > 10}
                />
              </>
            )}
          </CardContent>
        </Card>
      </section>

      <RecentGames games={games.slice(0, 5)} />

      <Achievements achievements={achievements} />

      <div className="grid gap-6 lg:grid-cols-2">
        <LearningProgressCard
          categories={categories}
          xp={progress.totalXP}
          level={progress.currentLevel}
          streak={progress.learningStreak}
          hasActivity={!learnLoading && hasLearning}
        />
        <ChessJourney rows={journey} />
      </div>

      <EditProfileModal
        open={editing}
        onOpenChange={setEditing}
        username={username}
        avatarId={profile?.avatarId ?? null}
        photoURL={profile?.photoURL ?? user?.photoURL ?? null}
      />
    </div>
  );
}
