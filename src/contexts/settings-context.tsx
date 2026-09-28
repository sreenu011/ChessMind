import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { useTheme, type Theme } from "@/components/theme-provider";

export type BoardOrientationSetting = "white" | "black" | "auto";
export type PieceStyleSetting = "classic" | "modern" | "tournament" | "minimal";
export type AutoPromotionSetting = "queen" | "ask";

export type UserSettings = {
  theme: Theme;
  boardOrientation: BoardOrientationSetting;
  showCoordinates: boolean;
  showLegalMoves: boolean;
  showLastMove: boolean;
  showCheckHighlight: boolean;
  boardAnimation: boolean;
  pieceStyle: PieceStyleSetting;
  autoPromotion: AutoPromotionSetting;
  confirmBeforeResign: boolean;
  confirmBeforeDraw: boolean;
  showMoveHints: boolean;
  masterSound: boolean;
  moveSound: boolean;
  captureSound: boolean;
  checkSound: boolean;
  gameStartSound: boolean;
  gameEndSound: boolean;
  volume: number; // 0..100
  gameInviteNotifications: boolean;
  gameResultNotifications: boolean;
  learningNotifications: boolean;
  dailyPuzzleNotifications: boolean;
  updatedAt?: string;
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "dark",
  boardOrientation: "auto",
  showCoordinates: true,
  showLegalMoves: true,
  showLastMove: true,
  showCheckHighlight: true,
  boardAnimation: true,
  pieceStyle: "classic",
  autoPromotion: "ask",
  confirmBeforeResign: true,
  confirmBeforeDraw: true,
  showMoveHints: true,
  masterSound: true,
  moveSound: true,
  captureSound: true,
  checkSound: true,
  gameStartSound: true,
  gameEndSound: true,
  volume: 70,
  gameInviteNotifications: true,
  gameResultNotifications: true,
  learningNotifications: true,
  dailyPuzzleNotifications: true,
};

const LOCAL_STORAGE_KEY = "chessmind-user-settings";

type SettingsContextType = {
  settings: UserSettings;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { theme: currentTheme, setTheme } = useTheme();
  const [settings, setSettingsState] = useState<UserSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch {
        /* ignore parse error */
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSettingsRef = useRef<UserSettings>(settings);

  // Load settings on mount or user change
  useEffect(() => {
    let active = true;
    async function loadSettings() {
      if (!db || !user) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "users", user.uid, "settings", "preferences");
        const snap = await getDoc(ref);
        if (active && snap.exists()) {
          const data = snap.data() as Partial<UserSettings>;
          const merged = { ...DEFAULT_SETTINGS, ...data };
          setSettingsState(merged);
          pendingSettingsRef.current = merged;
          if (typeof window !== "undefined") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          }
          if (merged.theme && merged.theme !== currentTheme) {
            setTheme(merged.theme);
          }
        }
      } catch (err) {
        console.warn("[Settings] Failed to fetch settings from Firestore, using local fallback:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      active = false;
    };
  }, [user]);

  // Persist to Firestore helper
  const persistSettings = useCallback(
    async (newSettings: UserSettings) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
      }
      if (!db || !user) return;
      try {
        const ref = doc(db, "users", user.uid, "settings", "preferences");
        await setDoc(
          ref,
          {
            ...newSettings,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      } catch (err) {
        console.error("[Settings] Error saving settings:", err);
        toast.error("Unable to save settings. Please try again.");
      }
    },
    [user],
  );

  const updateSettings = useCallback(
    async (partial: Partial<UserSettings>) => {
      setSettingsState((prev) => {
        const updated = { ...prev, ...partial };
        pendingSettingsRef.current = updated;

        // If theme updated, sync with theme provider
        if (partial.theme && partial.theme !== currentTheme) {
          setTheme(partial.theme);
        }

        // Debounce Firestore persist for quick consecutive toggles/sliders
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => {
          persistSettings(updated);
        }, 300);

        return updated;
      });
    },
    [currentTheme, setTheme, persistSettings],
  );

  const updateSetting = useCallback(
    async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      await updateSettings({ [key]: value } as Partial<UserSettings>);
    },
    [updateSettings],
  );

  const resetSettings = useCallback(async () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSettingsState(DEFAULT_SETTINGS);
    pendingSettingsRef.current = DEFAULT_SETTINGS;
    setTheme(DEFAULT_SETTINGS.theme);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (db && user) {
      try {
        const ref = doc(db, "users", user.uid, "settings", "preferences");
        await setDoc(ref, { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() });
        toast.success("Settings reset to defaults.");
      } catch (err) {
        console.error("[Settings] Error resetting settings:", err);
        toast.error("Unable to reset settings. Please try again.");
      }
    } else {
      toast.success("Settings reset to defaults.");
    }
  }, [user, setTheme]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    // Return safe fallback if used outside provider
    return {
      settings: DEFAULT_SETTINGS,
      updateSetting: async () => {},
      updateSettings: async () => {},
      resetSettings: async () => {},
      loading: false,
    };
  }
  return context;
}
