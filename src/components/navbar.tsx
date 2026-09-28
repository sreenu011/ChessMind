import { Link, useNavigate } from "@tanstack/react-router";
import { Bot, ChevronDown, LogOut, Menu, Moon, Sun, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import { getAvatarById } from "@/lib/avatars";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/learn", label: "Learn Chess" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/games", label: "Games" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
] as const;

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, profile, loading, logout } = useAuth();
  const navigate = useNavigate();

  const userAvatar = getAvatarById(profile?.avatarId || profile?.photoURL || user?.photoURL);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    toast.success("Signed out.");
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          to="/"
          aria-label="ChessMind Home"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <img
            src="/logo.png"
            alt="ChessMind"
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-lg shadow-sm"
          />
          <span className="font-display text-lg font-bold tracking-tight">ChessMind</span>
        </Link>

        {user && (
          <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
            <Link
              to="/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-accent text-foreground", "aria-current": "page" }}
            >
              Dashboard
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Play <ChevronDown className="size-3.5 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2 border-border/80 bg-card">
                <DropdownMenuItem asChild>
                  <Link to="/play/computer" className="flex flex-col items-start gap-0.5 p-2.5 cursor-pointer">
                    <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                      <Bot className="size-4 text-primary" /> Play with Computer
                    </div>
                    <span className="text-xs text-muted-foreground pl-6">Play against Stockfish</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 border-border/40" />
                <DropdownMenuItem asChild>
                  <Link to="/play/friends" className="flex flex-col items-start gap-0.5 p-2.5 cursor-pointer">
                    <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                      <Users className="size-4 text-primary" /> Play with Friends
                    </div>
                    <span className="text-xs text-muted-foreground pl-6">Create or join a private game</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                activeOptions={{ exact: false }}
                activeProps={{ className: "bg-accent text-foreground", "aria-current": "page" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <Skeleton className="h-9 w-24" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 transition-all"
                aria-label="View Profile"
              >
                <Avatar className="size-8 border border-border/60">
                  <AvatarImage src={userAvatar.src} alt={profile?.username || user.displayName || "Profile"} />
                  <AvatarFallback className="text-xs font-bold font-display">
                    {(profile?.username || user.displayName || "P").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="hidden sm:inline-flex">
                <LogOut className="mr-2 size-4" /> Logout
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle asChild>
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo.png"
                    alt="ChessMind"
                    className="h-8 w-8 object-contain rounded-lg shadow-sm"
                  />
                  <span className="font-display text-lg font-bold tracking-tight text-foreground">ChessMind</span>
                </div>
              </SheetTitle>
              {user ? (
                <>
                  <div className="mt-4 flex items-center gap-3 p-2.5 rounded-xl bg-accent/40 border border-border/50">
                    <Avatar className="size-10 border border-border/60 shrink-0">
                      <AvatarImage src={userAvatar.src} alt={profile?.username || user.displayName || "Profile"} />
                      <AvatarFallback className="text-xs font-bold font-display">
                        {(profile?.username || user.displayName || "P").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate text-foreground">{profile?.username || user.displayName}</p>
                      <p className="text-xs text-muted-foreground font-mono">Rating {profile?.rating ?? 1200}</p>
                    </div>
                  </div>
                  <nav className="mt-4 flex flex-col gap-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="min-h-12 rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                    >
                      Dashboard
                    </Link>
                    <div className="py-2 border-y border-border/40 my-1 space-y-1">
                      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Play</p>
                      <Link
                        to="/play/computer"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 min-h-11 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        <Bot className="size-4 text-primary" /> Play with Computer
                      </Link>
                      <Link
                        to="/play/friends"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 min-h-11 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        <Users className="size-4 text-primary" /> Play with Friends
                      </Link>
                    </div>
                    {navLinks.slice(1).map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className="min-h-12 rounded-md px-3 py-3 text-base font-medium hover:bg-accent"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </nav>
                  <Button className="mt-6 w-full" variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 size-4" /> Logout
                  </Button>
                </>
              ) : (
                <div className="mt-6 flex flex-col gap-2">
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
