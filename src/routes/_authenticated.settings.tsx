import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Eye,
  Gamepad2,
  KeyRound,
  LogOut,
  Palette,
  RotateCcw,
  Shield,
  Sparkles,
  User,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { useTheme, type Theme } from "@/components/theme-provider";
import {
  useSettings,
  type BoardOrientationSetting,
  type PieceStyleSetting,
  type AutoPromotionSetting,
} from "@/contexts/settings-context";
import { PIECE_STYLES, PieceStylePreviewGrid } from "@/lib/piece-styles";
import { playChessSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAvatarById } from "@/lib/avatars";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ChessMind" },
      { name: "description", content: "Manage your ChessMind appearance, board, gameplay, sound, and notification preferences." },
      { property: "og:title", content: "Settings — ChessMind" },
      { property: "og:description", content: "Manage appearance, board, gameplay, sound and notification settings." },
    ],
  }),
  component: SettingsPage,
});

type CategorySection =
  | "appearance"
  | "chessboard"
  | "gameplay"
  | "sound"
  | "notifications"
  | "account"
  | "danger";

const CATEGORIES: { id: CategorySection; label: string; icon: typeof Palette; description: string }[] = [
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme & visual preferences" },
  { id: "chessboard", label: "Chess Board", icon: Eye, description: "Coordinates, highlights & piece style" },
  { id: "gameplay", label: "Gameplay", icon: Gamepad2, description: "Promotion & move confirmations" },
  { id: "sound", label: "Sound", icon: Volume2, description: "Audio feedback & volume" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "App notification preferences" },
  { id: "account", label: "Account & Security", icon: Shield, description: "Sign-in details & password" },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, description: "Account management" },
];

function SettingsPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();

  const [activeCategory, setActiveCategory] = useState<CategorySection>("appearance");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  const triggerSavedFeedback = () => {
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
  };

  const handleToggle = (key: keyof typeof settings, val: boolean) => {
    updateSetting(key, val);
    triggerSavedFeedback();
  };

  const handleSelect = <T extends string>(key: keyof typeof settings, val: T) => {
    updateSetting(key, val as unknown as typeof settings[typeof key]);
    triggerSavedFeedback();
  };

  const handlePasswordReset = async () => {
    if (!auth || !user?.email) {
      toast.error("No email associated with this account.");
      return;
    }
    setResetPasswordLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success(`Password reset email sent to ${user.email}`);
    } catch (err) {
      console.error("[Settings] Password reset error:", err);
      toast.error("Unable to send password reset email. Please try again.");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    toast.success("Signed out successfully.");
    navigate({ to: "/", replace: true });
  };

  const userAvatar = getAvatarById(profile?.avatarId || profile?.photoURL || user?.photoURL);
  const createdDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tune how ChessMind looks, sounds, and behaves.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedBadge && (
            <Badge variant="outline" className="gap-1 border-primary/40 bg-primary/10 text-primary animate-fade-in">
              <CheckCircle2 className="size-3.5" /> Saved
            </Badge>
          )}

          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <RotateCcw className="size-4" /> Reset to Defaults
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-xl font-bold">Reset all settings?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  This will restore all appearance, board, gameplay, sound, and notification settings to their default values. Your profile data (username, avatar, rating, and game history) will not be affected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await resetSettings();
                    triggerSavedFeedback();
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Reset Settings
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Main Settings Layout */}
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Navigation Sidebar (Desktop) / Dropdown (Mobile) */}
        <aside className="space-y-2">
          {/* Mobile Category Select Dropdown */}
          <div className="block lg:hidden space-y-1.5">
            <Label htmlFor="category-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Settings Category
            </Label>
            <Select
              value={activeCategory}
              onValueChange={(v) => {
                setActiveCategory(v as CategorySection);
              }}
            >
              <SelectTrigger id="category-select" className="w-full h-11 bg-card border-border/80">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-primary" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Category Navigation List */}
          <nav aria-label="Settings Categories" className="hidden space-y-1 lg:block">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent text-foreground shadow-sm ring-1 ring-border/60 font-semibold"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`size-4.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{cat.label}</span>
                  </div>
                  <ChevronRight className={`size-4 transition-transform ${isActive ? "opacity-100" : "opacity-0"}`} />
                </button>
              );
            })}
          </nav>

          {/* Profile Card link in sidebar */}
          <Card className="mt-6 border-border/60 bg-muted/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-border/60">
                  <AvatarImage src={userAvatar.src} alt={profile?.username || user?.displayName || "User"} />
                  <AvatarFallback className="font-bold">
                    {(profile?.username || user?.displayName || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{profile?.username || user?.displayName || "Player"}</p>
                  <p className="text-xs text-muted-foreground">Rating {profile?.rating ?? 1200}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 h-8">
                <Link to="/profile">
                  <User className="size-3.5" /> Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Content Pane - Renders ONLY the currently active category */}
        <main className="space-y-6">
          {/* 1. APPEARANCE */}
          {activeCategory === "appearance" && (
            <Card id="appearance" className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display">
                  <Palette className="size-5 text-primary" /> Appearance
                </CardTitle>
                <CardDescription>Customize the overall look and color mode of ChessMind.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Label htmlFor="theme-select" className="text-base font-semibold">
                      Theme
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Select Light mode, Dark mode, or follow your System settings.
                    </p>
                  </div>
                  <Select
                    value={theme}
                    onValueChange={(val: string) => {
                      const t = val as Theme;
                      setTheme(t);
                      handleSelect("theme", t);
                    }}
                  >
                    <SelectTrigger id="theme-select" className="w-full sm:w-48">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. CHESS BOARD & PIECE STYLE */}
          {activeCategory === "chessboard" && (
            <Card id="chessboard" className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display">
                  <Eye className="size-5 text-primary" /> Chess Board & Piece Style
                </CardTitle>
                <CardDescription>
                  Configure board orientation, notation coordinates, move indicators, highlights, and piece set styles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Board Orientation */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Label htmlFor="orientation-select" className="text-base font-semibold">
                      Board Orientation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Choose board view perspective or automatically adapt to your played color.
                    </p>
                  </div>
                  <Select
                    value={settings.boardOrientation}
                    onValueChange={(val) => handleSelect("boardOrientation", val as BoardOrientationSetting)}
                  >
                    <SelectTrigger id="orientation-select" className="w-full sm:w-48">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatic</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Show Coordinates */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-coordinates" className="text-base font-semibold">
                      Show Board Coordinates
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display files (a-h) and ranks (1-8) along board edges.
                    </p>
                  </div>
                  <Switch
                    id="toggle-coordinates"
                    checked={settings.showCoordinates}
                    onCheckedChange={(val) => handleToggle("showCoordinates", val)}
                  />
                </div>

                <Separator />

                {/* Legal Move Indicators */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-legal-moves" className="text-base font-semibold">
                      Legal Move Indicators
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display hint dots on squares you can legally move to.
                    </p>
                  </div>
                  <Switch
                    id="toggle-legal-moves"
                    checked={settings.showLegalMoves}
                    onCheckedChange={(val) => handleToggle("showLegalMoves", val)}
                  />
                </div>

                <Separator />

                {/* Last Move Highlight */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-last-move" className="text-base font-semibold">
                      Last Move Highlight
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight the source and destination squares of the previous move.
                    </p>
                  </div>
                  <Switch
                    id="toggle-last-move"
                    checked={settings.showLastMove}
                    onCheckedChange={(val) => handleToggle("showLastMove", val)}
                  />
                </div>

                <Separator />

                {/* Check Highlight */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-check-highlight" className="text-base font-semibold">
                      Check Highlight
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight the king's square in red when under check.
                    </p>
                  </div>
                  <Switch
                    id="toggle-check-highlight"
                    checked={settings.showCheckHighlight}
                    onCheckedChange={(val) => handleToggle("showCheckHighlight", val)}
                  />
                </div>

                <Separator />

                {/* Board Animation */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-board-animation" className="text-base font-semibold">
                      Board Piece Animation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Smoothly animate piece transitions across squares.
                    </p>
                  </div>
                  <Switch
                    id="toggle-board-animation"
                    checked={settings.boardAnimation}
                    onCheckedChange={(val) => handleToggle("boardAnimation", val)}
                  />
                </div>

                <Separator />

                {/* Piece Style Selection & Interactive Preview Card Grid */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold">Piece Style</Label>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred chess piece design set. Click any style to activate it across all game boards.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PIECE_STYLES.map((st) => {
                      const isSelected = settings.pieceStyle === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          role="button"
                          aria-label={`Select ${st.name} piece style`}
                          aria-pressed={isSelected}
                          onClick={() => handleSelect("pieceStyle", st.id)}
                          className={cn(
                            "flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer space-y-3",
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/40 shadow-sm"
                              : "border-border/80 bg-card hover:border-border hover:bg-accent/40"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-base text-foreground">{st.name}</span>
                            {isSelected && (
                              <Badge variant="default" className="text-[10px] px-2 py-0.5 bg-primary text-primary-foreground font-semibold">
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed min-h-[2.5rem]">{st.description}</p>
                          <PieceStylePreviewGrid style={st.id} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. GAMEPLAY SETTINGS */}
          {activeCategory === "gameplay" && (
            <Card id="gameplay" className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display">
                  <Gamepad2 className="size-5 text-primary" /> Gameplay Settings
                </CardTitle>
                <CardDescription>
                  Configure move behavior, pawn promotion, resignation, draw offer confirmations, and learning hints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Promote Pawn */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Label htmlFor="autopromote-select" className="text-base font-semibold">
                      Auto Promote Pawn
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically promote to Queen or prompt for piece selection every time.
                    </p>
                  </div>
                  <Select
                    value={settings.autoPromotion}
                    onValueChange={(val) => handleSelect("autoPromotion", val as AutoPromotionSetting)}
                  >
                    <SelectTrigger id="autopromote-select" className="w-full sm:w-48">
                      <SelectValue placeholder="Select promotion option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ask">Ask Every Time</SelectItem>
                      <SelectItem value="queen">Always Queen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Confirm Before Resign */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-confirm-resign" className="text-base font-semibold">
                      Confirm Before Resigning
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Prompt a confirmation dialog before forfeiting a game.
                    </p>
                  </div>
                  <Switch
                    id="toggle-confirm-resign"
                    checked={settings.confirmBeforeResign}
                    onCheckedChange={(val) => handleToggle("confirmBeforeResign", val)}
                  />
                </div>

                <Separator />

                {/* Confirm Before Draw */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-confirm-draw" className="text-base font-semibold">
                      Confirm Before Offering Draw
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Prompt a confirmation dialog before sending a draw request.
                    </p>
                  </div>
                  <Switch
                    id="toggle-confirm-draw"
                    checked={settings.confirmBeforeDraw}
                    onCheckedChange={(val) => handleToggle("confirmBeforeDraw", val)}
                  />
                </div>

                <Separator />

                {/* Show Move Hints */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-move-hints" className="text-base font-semibold">
                      Show Move Hints in Training
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable hint suggestions in learning lessons and tactical exercises.
                    </p>
                  </div>
                  <Switch
                    id="toggle-move-hints"
                    checked={settings.showMoveHints}
                    onCheckedChange={(val) => handleToggle("showMoveHints", val)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. SOUND SETTINGS */}
          {activeCategory === "sound" && (
            <Card id="sound" className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display">
                  <Volume2 className="size-5 text-primary" /> Sound Settings
                </CardTitle>
                <CardDescription>
                  Control master sound, specific move/capture audio triggers, and overall volume.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Master Sound */}
                <div className="flex items-center justify-between rounded-xl bg-accent/40 p-3.5 border border-border/60">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-master-sound" className="text-base font-bold">
                      Master Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable or disable all audio playback in ChessMind.
                    </p>
                  </div>
                  <Switch
                    id="toggle-master-sound"
                    checked={settings.masterSound}
                    onCheckedChange={(val) => {
                      handleToggle("masterSound", val);
                      if (val) playChessSound("move", { ...settings, masterSound: true });
                    }}
                  />
                </div>

                <Separator />

                {/* Volume Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume-slider" className="text-base font-semibold">
                      Volume: <span className="font-mono text-primary font-bold">{settings.volume}%</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 gap-1"
                      onClick={() => playChessSound("move", settings)}
                    >
                      <Sparkles className="size-3.5 text-primary" /> Test Sound
                    </Button>
                  </div>
                  <Slider
                    id="volume-slider"
                    min={0}
                    max={100}
                    step={1}
                    value={[settings.volume]}
                    onValueChange={([val]) => {
                      if (val !== undefined) {
                        updateSetting("volume", val);
                      }
                    }}
                    aria-label="Volume level"
                    disabled={!settings.masterSound}
                  />
                </div>

                <Separator />

                {/* Move Sound */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-move-sound" className="text-base font-semibold">
                      Move Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">Play sound when pieces are moved.</p>
                  </div>
                  <Switch
                    id="toggle-move-sound"
                    checked={settings.moveSound}
                    disabled={!settings.masterSound}
                    onCheckedChange={(val) => {
                      handleToggle("moveSound", val);
                      if (val) playChessSound("move", settings);
                    }}
                  />
                </div>

                <Separator />

                {/* Capture Sound */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-capture-sound" className="text-base font-semibold">
                      Capture Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">Play sound when a piece is captured.</p>
                  </div>
                  <Switch
                    id="toggle-capture-sound"
                    checked={settings.captureSound}
                    disabled={!settings.masterSound}
                    onCheckedChange={(val) => {
                      handleToggle("captureSound", val);
                      if (val) playChessSound("capture", settings);
                    }}
                  />
                </div>

                <Separator />

                {/* Check Sound */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-check-sound" className="text-base font-semibold">
                      Check Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">Play chime when king is in check.</p>
                  </div>
                  <Switch
                    id="toggle-check-sound"
                    checked={settings.checkSound}
                    disabled={!settings.masterSound}
                    onCheckedChange={(val) => {
                      handleToggle("checkSound", val);
                      if (val) playChessSound("check", settings);
                    }}
                  />
                </div>

                <Separator />

                {/* Game Start Sound */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-gamestart-sound" className="text-base font-semibold">
                      Game Start Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">Play fanfare when a game begins.</p>
                  </div>
                  <Switch
                    id="toggle-gamestart-sound"
                    checked={settings.gameStartSound}
                    disabled={!settings.masterSound}
                    onCheckedChange={(val) => {
                      handleToggle("gameStartSound", val);
                      if (val) playChessSound("gameStart", settings);
                    }}
                  />
                </div>

                <Separator />

                {/* Game End Sound */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-gameend-sound" className="text-base font-semibold">
                      Game End Sound
                    </Label>
                    <p className="text-xs text-muted-foreground">Play audio when a game concludes.</p>
                  </div>
                  <Switch
                    id="toggle-gameend-sound"
                    checked={settings.gameEndSound}
                    disabled={!settings.masterSound}
                    onCheckedChange={(val) => {
                      handleToggle("gameEndSound", val);
                      if (val) playChessSound("gameEnd", settings);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5. NOTIFICATIONS */}
          {activeCategory === "notifications" && (
            <Card id="notifications" className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display">
                  <Bell className="size-5 text-primary" /> Notifications
                </CardTitle>
                <CardDescription>
                  Manage in-app alert preferences for game invites, game results, learning reminders, and daily puzzles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Game Invite Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-invite-notif" className="text-base font-semibold">
                      Game Invite Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts when friends challenge you to a game.
                    </p>
                  </div>
                  <Switch
                    id="toggle-invite-notif"
                    checked={settings.gameInviteNotifications}
                    onCheckedChange={(val) => handleToggle("gameInviteNotifications", val)}
                  />
                </div>

                <Separator />

                {/* Game Result Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-result-notif" className="text-base font-semibold">
                      Game Result Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when opponent finishes or forfeits.
                    </p>
                  </div>
                  <Switch
                    id="toggle-result-notif"
                    checked={settings.gameResultNotifications}
                    onCheckedChange={(val) => handleToggle("gameResultNotifications", val)}
                  />
                </div>

                <Separator />

                {/* Learning Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-learn-notif" className="text-base font-semibold">
                      Learning & Streak Reminders
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      In-app reminders to maintain your chess learning progress.
                    </p>
                  </div>
                  <Switch
                    id="toggle-learn-notif"
                    checked={settings.learningNotifications}
                    onCheckedChange={(val) => handleToggle("learningNotifications", val)}
                  />
                </div>

                <Separator />

                {/* Daily Puzzle Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="toggle-puzzle-notif" className="text-base font-semibold">
                      Daily Puzzle Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified when new daily tactical puzzles are published.
                    </p>
                  </div>
                  <Switch
                    id="toggle-puzzle-notif"
                    checked={settings.dailyPuzzleNotifications}
                    onCheckedChange={(val) => handleToggle("dailyPuzzleNotifications", val)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 6. ACCOUNT & SECURITY */}
          {activeCategory === "account" && (
            <Card id="account" className="border-border/80 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display">
                  <Shield className="size-5 text-primary" /> Account & Security
                </CardTitle>
                <CardDescription>
                  View read-only account details, change password, or sign out. Username editing is managed in your Profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Account Details */}
                <div className="grid gap-4 rounded-xl border border-border/60 bg-muted/30 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Email Address</p>
                    <p className="mt-1 font-mono text-sm font-medium text-foreground truncate">
                      {user?.email || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Username</p>
                    <p className="mt-1 font-sans text-sm font-medium text-foreground truncate">
                      {profile?.username || user?.displayName || "Player"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Account Created</p>
                    <p className="mt-1 font-sans text-sm font-medium text-foreground">
                      {createdDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Profile Management</p>
                    <Link
                      to="/profile"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <User className="size-3.5" /> Edit Profile (Username & Avatar)
                    </Link>
                  </div>
                </div>

                <Separator />

                {/* Password Reset */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold">Change Password</p>
                    <p className="text-xs text-muted-foreground">
                      Send a password reset link to your registered email address ({user?.email || "email"}).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handlePasswordReset}
                    disabled={resetPasswordLoading || !user?.email}
                    className="gap-2 sm:w-auto"
                  >
                    <KeyRound className="size-4 text-primary" />
                    {resetPasswordLoading ? "Sending..." : "Change Password"}
                  </Button>
                </div>

                <Separator />

                {/* Sign Out */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold">Sign Out</p>
                    <p className="text-xs text-muted-foreground">
                      Log out of your current session on this device.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleSignOut} className="gap-2 sm:w-auto text-destructive hover:bg-destructive/10">
                    <LogOut className="size-4" /> Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 7. DANGER ZONE */}
          {activeCategory === "danger" && (
            <Card id="danger" className="border-destructive/40 bg-destructive/5 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display text-destructive">
                  <AlertTriangle className="size-5" /> Danger Zone
                </CardTitle>
                <CardDescription className="text-destructive/80">
                  Critical account actions and account deletion requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-foreground">Delete Account</p>
                    <p className="text-xs text-muted-foreground">
                      Permanent account deletion requires identity verification to protect player rating and history integrity.
                    </p>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="sm:w-auto"
                  >
                    Delete Account
                  </Button>
                </div>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-display text-xl font-bold text-destructive flex items-center gap-2">
                        <AlertTriangle className="size-5" /> Account Deletion Request
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        Account deletion requires additional verification to prevent accidental data loss and protect leaderboards.
                        <br /><br />
                        Please contact <span className="font-semibold text-foreground">support@chessmind.app</span> with your registered email ({user?.email || "your email"}) to process permanent account deletion.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => setDeleteDialogOpen(false)}>Got it</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
