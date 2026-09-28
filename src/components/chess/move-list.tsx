import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export type MoveListProps = {
  /** Moves in SAN order, starting with White's first move. */
  san: string[];
  /** Index of the move to highlight (defaults to the last played move). */
  activeIndex?: number;
  onSelect?: (index: number) => void;
  className?: string;
};

/**
 * Shared move history. Full height on desktop, collapsible on small screens.
 */
export function MoveList({ san, activeIndex, onSelect, className }: MoveListProps) {
  const [open, setOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const current = activeIndex ?? san.length - 1;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [san.length]);

  const pairs: { number: number; white?: string; black?: string }[] = [];
  san.forEach((move, i) => {
    const index = Math.floor(i / 2);
    pairs[index] ??= { number: index + 1 };
    if (i % 2 === 0) pairs[index]!.white = move;
    else pairs[index]!.black = move;
  });

  const cell = (value: string | undefined, index: number) => {
    if (!value) return <span aria-hidden className="px-2 py-1" />;
    const isCurrent = index === current;
    const classes = cn(
      "rounded-md px-2 py-1 text-left tabular-nums transition-colors",
      isCurrent ? "bg-primary/15 font-semibold text-foreground" : "text-foreground/90",
      onSelect &&
        "cursor-pointer hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    );
    if (!onSelect) return <span className={classes}>{value}</span>;
    return (
      <button
        type="button"
        className={classes}
        aria-current={isCurrent ? "true" : undefined}
        aria-label={`Go to move ${Math.floor(index / 2) + 1}${index % 2 === 0 ? " white" : " black"}, ${value}`}
        onClick={() => onSelect(index)}
      >
        {value}
      </button>
    );
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="move-history-panel"
        className="flex min-h-12 w-full items-center justify-between gap-2 px-5 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:pointer-events-none lg:min-h-0"
      >
        <span className="flex items-center gap-2 font-display text-base font-semibold">
          Move history
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {san.length}
          </span>
        </span>
        <ChevronDown
          aria-hidden
          className={cn("size-4 text-muted-foreground transition-transform lg:hidden", open && "rotate-180")}
        />
      </button>

      <CardContent
        id="move-history-panel"
        className={cn("pt-0 pb-4 lg:block", open ? "block" : "hidden")}
      >
        {pairs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/70 px-3 py-6 text-center text-sm text-muted-foreground">
            No moves yet — White starts.
          </p>
        ) : (
          <ScrollArea className="h-56 pr-3 lg:h-72">
            <ol className="space-y-0.5 font-mono text-sm" aria-label="Move history">
              {pairs.map((pair, row) => (
                <li
                  key={pair.number}
                  className="grid grid-cols-[2.25rem_1fr_1fr] items-center gap-1 rounded-md px-1 odd:bg-muted/40"
                >
                  <span className="pl-1 text-xs text-muted-foreground tabular-nums">{pair.number}.</span>
                  {cell(pair.white, row * 2)}
                  {cell(pair.black, row * 2 + 1)}
                </li>
              ))}
            </ol>
            <div ref={endRef} />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
