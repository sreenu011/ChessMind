import { Trophy, Handshake, Flag } from "lucide-react";

import type { GameResult } from "@/hooks/use-chess-game";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function GameResultDialog({
  result,
  open,
  onOpenChange,
  onRematch,
}: {
  result: GameResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRematch: () => void;
}) {
  if (!result) return null;

  const headline =
    result.winner === null
      ? "Draw"
      : `${result.winner === "w" ? "White" : "Black"} wins`;

  const Icon = result.status === "resigned" ? Flag : result.winner === null ? Handshake : Trophy;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Icon className="size-7" />
          </div>
          <DialogTitle className="font-display text-2xl">{headline}</DialogTitle>
          <DialogDescription>{result.reason}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Review board
          </Button>
          <Button onClick={onRematch}>Play again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
