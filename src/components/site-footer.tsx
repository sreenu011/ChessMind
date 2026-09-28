import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 text-center sm:px-6">
        <Link
          to="/"
          aria-label="ChessMind Home"
          className="flex items-center gap-2 text-foreground font-semibold transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
        >
          <img
            src="/logo.png"
            alt="ChessMind"
            className="h-7 w-7 object-contain rounded-lg shadow-sm"
          />
          <span className="font-display text-base font-bold tracking-tight">ChessMind</span>
        </Link>
        <p className="text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} ChessMind. Play well, play often.
        </p>
      </div>
    </footer>
  );
}
