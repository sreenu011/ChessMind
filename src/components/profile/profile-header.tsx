import { Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAvatarById } from "@/lib/avatars";

export function ProfileHeader({
  username,
  displayName,
  avatarId,
  photoURL,
  rating,
  wins,
  losses,
  draws,
  gamesPlayed,
  winRate,
  level,
  onEdit,
}: {
  username: string;
  displayName: string | null;
  avatarId?: string | null;
  photoURL?: string | null;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
  gamesPlayed: number;
  winRate: number;
  level: string;
  onEdit: () => void;
}) {
  const initials = username.slice(0, 2).toUpperCase();
  const showDisplayName = displayName && displayName !== username;
  const avatar = getAvatarById(avatarId || photoURL);

  return (
    <Card className="surface-hero overflow-hidden border border-border/60 shadow-lg">
      <CardContent className="flex flex-col gap-6 py-8 px-6 sm:flex-row sm:items-center">
        <Avatar className="h-[72px] w-[72px] self-center sm:h-[96px] sm:w-[96px] sm:self-auto ring-2 ring-primary/30 shrink-0 shadow-md">
          <AvatarImage src={avatar.src} alt={username} className="object-cover" />
          <AvatarFallback className="bg-brand-gradient font-display text-2xl font-bold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {showDisplayName ? displayName : username}
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">@{username}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <Badge className="px-3.5 py-1 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
              Rating {rating}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold bg-secondary/80 text-secondary-foreground">
              {wins}W &nbsp;{losses}L &nbsp;{draws}D
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm border-border/60">
              {gamesPlayed} {gamesPlayed === 1 ? "game" : "games"} · {winRate}% win rate
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm border-primary/30 text-primary bg-primary/5">
              {level}
            </Badge>
          </div>
        </div>

        <div className="flex justify-center sm:self-start">
          <Button variant="outline" onClick={onEdit} className="min-h-11 border-border/80 hover:bg-accent/80 transition-colors">
            <Pencil aria-hidden className="mr-2 size-4" /> Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
