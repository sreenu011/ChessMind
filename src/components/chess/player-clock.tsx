import { cn } from "@/lib/utils";
import { formatClock } from "@/lib/time-controls";

export function PlayerClock({
  username,
  subtitle,
  rating,
  color,
  ms,
  active,
  className,
}: {
  username: string;
  subtitle?: string;
  rating?: number | null;
  color: "w" | "b";
  ms: number;
  active: boolean;
  className?: string;
}) {
  const low = ms <= 20_000;
  const colorName = color === "w" ? "White" : "Black";
  const subText = subtitle ?? (rating ? `(${rating})` : colorName);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border bg-card/90 px-3.5 py-1.5 transition-all duration-200 select-none",
        active
          ? "border-amber-500/70 bg-card ring-1 ring-amber-500/30 shadow-[0_0_16px_-6px_rgba(245,158,11,0.4)]"
          : "border-border/50 text-muted-foreground/80",
        active && low && "border-destructive/80 ring-destructive/40 shadow-[0_0_16px_-6px_rgba(239,68,68,0.5)]",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "size-3 shrink-0 rounded-full border border-slate-700 shadow-sm",
            color === "w" ? "bg-[#FFF8EB]" : "bg-[#1C1917]",
            active && "ring-2 ring-amber-500/60 ring-offset-1 ring-offset-background"
          )}
          aria-hidden
        />
        <div className="min-w-0 flex items-baseline gap-2">
          <span className="truncate text-sm sm:text-base font-bold text-foreground tracking-tight">{username}</span>
          {subText && (
            <span className="text-xs text-muted-foreground font-mono truncate font-medium">{subText}</span>
          )}
        </div>
      </div>
      <span
        role="timer"
        aria-live={active && low ? "assertive" : "off"}
        aria-label={`${username} clock`}
        className={cn(
          "font-mono text-xl sm:text-2xl tabular-nums font-bold tracking-wider shrink-0",
          active && low
            ? "text-destructive motion-safe:animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            : active
              ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
              : "text-muted-foreground/70",
        )}
      >
        {formatClock(ms)}
      </span>
    </div>
  );
}
