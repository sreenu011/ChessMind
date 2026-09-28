const START = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

export function ChessBoardPreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid aspect-square w-full grid-cols-8 overflow-hidden rounded-xl border border-border/70 shadow-elevate ${className}`}
    >
      {START.flatMap((row, r) =>
        row.map((piece, c) => (
          <div
            key={`${r}-${c}`}
            className={`grid place-items-center text-[clamp(1rem,4vw,2rem)] leading-none select-none ${
              (r + c) % 2 === 0 ? "bg-board-light" : "bg-board-dark"
            }`}
          >
            <span className={(r + c) % 2 === 0 ? "text-neutral-800" : "text-neutral-100"}>
              {piece}
            </span>
          </div>
        )),
      )}
    </div>
  );
}
