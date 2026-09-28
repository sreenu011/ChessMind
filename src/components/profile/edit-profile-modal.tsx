import { Check, Loader2, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { PRESET_AVATARS, getAvatarById } from "@/lib/avatars";
import { db } from "@/lib/firebase";
import { checkUsernameAvailable, normalizeUsername, validateUsername } from "@/lib/username";
import { cn } from "@/lib/utils";

export function EditProfileModal({
  open,
  onOpenChange,
  username,
  avatarId,
  photoURL,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  avatarId?: string | null;
  photoURL?: string | null;
}) {
  const { user, profile, updateAccount } = useAuth();

  const initialAvatar = getAvatarById(avatarId || photoURL || profile?.avatarId || profile?.photoURL);
  const [name, setName] = useState(username);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(initialAvatar.id);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Live availability states
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [formatError, setFormatError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(username);
      const currentAv = getAvatarById(avatarId || photoURL || profile?.avatarId || profile?.photoURL);
      setSelectedAvatarId(currentAv.id);
      setSaveError(null);
      setFormatError(null);
      setIsAvailable(null);
      setChecking(false);
    }
  }, [open, username, avatarId, photoURL, profile?.avatarId, profile?.photoURL]);

  // Live debounced availability check
  useEffect(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      setFormatError(null);
      setIsAvailable(null);
      setChecking(false);
      return;
    }

    const validation = validateUsername(trimmed);
    if (!validation.valid) {
      setFormatError(validation.error || "Invalid username format.");
      setIsAvailable(null);
      setChecking(false);
      return;
    }

    setFormatError(null);

    const newNormalized = normalizeUsername(trimmed);
    const currentNormalized = normalizeUsername(username);

    if (newNormalized === currentNormalized) {
      setIsAvailable(null);
      setChecking(false);
      return;
    }

    setChecking(true);
    setIsAvailable(null);

    const timer = setTimeout(() => {
      if (!db) {
        setChecking(false);
        return;
      }

      checkUsernameAvailable(db, newNormalized, user?.uid)
        .then((available) => {
          setIsAvailable(available);
        })
        .catch(() => {
          setIsAvailable(false);
        })
        .finally(() => {
          setChecking(false);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [name, username, user?.uid]);

  const normalizedName = normalizeUsername(name);
  const normalizedCurrent = normalizeUsername(username);

  const isUsernameChanged = normalizedName !== normalizedCurrent;
  const currentAvatarObj = getAvatarById(avatarId || photoURL || profile?.avatarId || profile?.photoURL);
  const isAvatarChanged = selectedAvatarId !== currentAvatarObj.id;

  const isNameValid = !isUsernameChanged || (name.trim().length >= 3 && !formatError && isAvailable === true && !checking);
  const canSave = (isUsernameChanged || isAvatarChanged) && isNameValid && !saving;

  const selectedAvatar = getAvatarById(selectedAvatarId);

  const handleCancel = () => {
    // Restore original avatar state and close modal
    const currentAv = getAvatarById(avatarId || photoURL || profile?.avatarId || profile?.photoURL);
    setSelectedAvatarId(currentAv.id);
    onOpenChange(false);
  };

  const save = async () => {
    const trimmedName = name.trim();
    const validation = validateUsername(trimmedName);
    if (!validation.valid) {
      setSaveError(validation.error || "Invalid username format.");
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      await updateAccount({
        username: trimmedName,
        avatarId: selectedAvatarId,
        photoURL: selectedAvatarId,
      });
      toast.success("Profile updated successfully.");
      onOpenChange(false);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);
      if (errMessage.toLowerCase().includes("already taken")) {
        setSaveError("Username is no longer available.");
        setIsAvailable(false);
      } else {
        setSaveError(errMessage || "Unable to save changes. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border/80 bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">Edit Profile</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Customize your avatar and username.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* PROFILE PREVIEW HEADER - UPDATES IMMEDIATELY */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Selected Avatar / Profile Preview
            </Label>
            <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card/60 p-4 shadow-xs">
              <div className="h-20 w-20 rounded-full border-2 border-primary/40 shrink-0 shadow-md overflow-hidden bg-primary/10 flex items-center justify-center">
                <img
                  src={selectedAvatar.src}
                  alt={selectedAvatar.name}
                  className="h-full w-full object-cover"
                  id="avatar-preview-img"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-bold truncate text-foreground">
                  {name.trim() || username}
                </h2>
                <p className="text-xs font-mono text-muted-foreground">@{name.trim() || username}</p>
                <p className="text-xs font-semibold text-primary mt-1">
                  Selected: {selectedAvatar.name}
                </p>
              </div>
            </div>
          </div>

          {/* USERNAME INPUT & LIVE AVAILABILITY */}
          <div className="space-y-2">
            <Label htmlFor="profile-username" className="text-sm font-semibold text-foreground">
              Username
            </Label>
            <Input
              id="profile-username"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              className={cn(
                "bg-background font-mono text-sm border-border/60 transition-colors",
                isUsernameChanged && isAvailable === true && !checking && !formatError && "border-emerald-500/60 focus-visible:ring-emerald-500/40",
                (formatError || (isUsernameChanged && isAvailable === false)) && "border-rose-500/60 focus-visible:ring-rose-500/40",
              )}
            />

            {/* LIVE AVAILABILITY STATUS INDICATORS */}
            {checking ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-1.5" role="status" aria-live="polite">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Checking availability...</span>
              </div>
            ) : formatError ? (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mt-1.5" role="alert">
                <XCircle className="size-3.5 shrink-0 text-rose-500" />
                <span>{formatError}</span>
              </div>
            ) : isUsernameChanged && isAvailable === true ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold mt-1.5" role="status" aria-live="polite">
                <Check className="size-3.5 shrink-0 text-emerald-500" />
                <span>Username available</span>
              </div>
            ) : isUsernameChanged && isAvailable === false ? (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mt-1.5" role="status" aria-live="polite">
                <X className="size-3.5 shrink-0 text-rose-500" />
                <span>Username not available</span>
              </div>
            ) : null}
          </div>

          {/* PREDEFINED PROFILE AVATAR GRID SELECTION (NO URL INPUT) */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-foreground block">
              Profile Photo
            </Label>
            <p className="text-xs text-muted-foreground">Choose your avatar from the preset collection.</p>

            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              role="radiogroup"
              aria-label="Select profile photo avatar"
            >
              {PRESET_AVATARS.map((avatar, index) => {
                const isSelected = selectedAvatarId === avatar.id;

                return (
                  <button
                    key={avatar.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`Select avatar ${index + 1}: ${avatar.name}`}
                    data-avatar-id={avatar.id}
                    onClick={() => setSelectedAvatarId(avatar.id)}
                    className={cn(
                      "relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background shadow-sm"
                        : "border-border/60 bg-card/50 hover:bg-accent/60 hover:border-border",
                    )}
                  >
                    <div className="h-14 w-14 rounded-full overflow-hidden border border-border/40 shrink-0 bg-background/50">
                      <img
                        src={avatar.src}
                        alt={avatar.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-foreground mt-2 truncate max-w-full text-center">
                      {avatar.name}
                    </span>

                    {/* SELECTED CHECKMARK BADGE OVERLAY */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {saveError ? (
            <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 p-2.5 rounded-md border border-rose-500/20" role="alert">
              {saveError}
            </p>
          ) : null}
        </div>

        {/* CANCEL & SAVE BUTTONS */}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={!canSave} className="min-w-[120px] font-semibold">
            {saving ? <Loader2 aria-hidden className="mr-2 size-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
