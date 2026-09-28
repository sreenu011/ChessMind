import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { auth, db, initializeFirebase } from "@/lib/firebase";
import { logSecurityEvent } from "@/lib/security-logger";
import {
  checkUsernameAvailable,
  normalizeUsername,
  registerUserWithUniqueUsername,
  updateUsernameWithReservation,
  validateUsername,
} from "@/lib/username";

export type UserProfile = {
  uid: string;
  username: string;
  email: string;
  avatarId?: string | null;
  photoURL?: string | null;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  configured: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  /** Only the cosmetic fields the security rules allow a user to change. */
  updateAccount: (changes: {
    username?: string;
    avatarId?: string;
    photoURL?: string | null;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Fetch the Firestore profile for a user.
async function loadProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const ref = doc(db, "users", uid);
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const effectiveAvatarId = data["avatarId"] || data["photoURL"] || "avatar-01";
        const loaded: UserProfile = {
          uid: snap.id,
          username: typeof data["username"] === "string" ? data["username"] : "Player",
          email: typeof data["email"] === "string" ? data["email"] : "",
          avatarId: effectiveAvatarId,
          photoURL: effectiveAvatarId,
          rating: typeof data["rating"] === "number" ? data["rating"] : 1200,
          gamesPlayed: typeof data["gamesPlayed"] === "number" ? data["gamesPlayed"] : 0,
          wins: typeof data["wins"] === "number" ? data["wins"] : 0,
          losses: typeof data["losses"] === "number" ? data["losses"] : 0,
          draws: typeof data["draws"] === "number" ? data["draws"] : 0,
        };
        try {
          localStorage.setItem(`chess_profile_${uid}`, JSON.stringify(loaded));
        } catch {
          // Ignore localStorage errors
        }
        return loaded;
      }
    } catch {
      return null;
    }
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem("chess_active_profile");
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;

    const setupAuth = (ready: boolean) => {
      if (!active) return;
      setConfigured(ready);
      if (!ready || !auth) {
        setLoading(false);
        return;
      }
      if (unsubscribe) return;
      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        if (!active) return;
        setUser(nextUser);
        if (nextUser) {
          try {
            const cached = localStorage.getItem(`chess_profile_${nextUser.uid}`);
            if (cached) {
              setProfile(JSON.parse(cached));
            }
          } catch {}
        }
        // Never block the session check on profile read
        setLoading(false);
        if (nextUser && db) {
          void loadProfile(nextUser.uid).then((next) => {
            if (active && next) {
              setProfile(next);
              try {
                localStorage.setItem("chess_active_profile", JSON.stringify(next));
              } catch {}
            }
          });
        }
      });
    };

    // Direct, canonical client initialization from import.meta.env.VITE_FIREBASE_*
    void initializeFirebase()
      .then((ready) => {
        if (!active) return;
        setupAuth(ready);
      })
      .catch((err) => {
        if (active) {
          console.error("[AuthProvider] Firebase initialization error:", err);
          setConfigured(false);
          setLoading(false);
        }
      });

    return () => {
      active = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      configured,
      register: async (username, email, password) => {
        if (!auth || !db) throw new Error("Firebase is not configured yet.");

        const validation = validateUsername(username);
        if (!validation.valid) {
          throw new Error(validation.error || "Invalid username format.");
        }
        const normalized = normalizeUsername(username);
        const isAvailable = await checkUsernameAvailable(db, normalized);
        if (!isAvailable) {
          throw new Error("Username already taken");
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await registerUserWithUniqueUsername(db, cred.user.uid, username, email, "avatar-01");
          await updateProfile(cred.user, { displayName: username.trim(), photoURL: "avatar-01" });

          // Send Firebase Email Verification
          try {
            await sendEmailVerification(cred.user);
            logSecurityEvent("AUTH_EMAIL_VERIFICATION_SENT", { uid: cred.user.uid, email });
          } catch (e) {
            console.warn("[Auth] Email verification send warning:", e);
          }

          logSecurityEvent("AUTH_REGISTER", { uid: cred.user.uid, email });

          if (auth.currentUser) setUser(auth.currentUser);
          const newProfile: UserProfile = {
            uid: cred.user.uid,
            username: username.trim(),
            email,
            avatarId: "avatar-01",
            photoURL: "avatar-01",
            rating: 1200,
            gamesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
          };
          setProfile(newProfile);
          try {
            localStorage.setItem(`chess_profile_${cred.user.uid}`, JSON.stringify(newProfile));
            localStorage.setItem("chess_active_profile", JSON.stringify(newProfile));
          } catch {}
        } catch (err) {
          try {
            await cred.user.delete();
          } catch {
            // Ignore cleanup errors
          }
          logSecurityEvent("AUTH_LOGIN_FAILURE", { email, reason: (err as Error)?.message });
          throw err;
        }
      },
      login: async (email, password) => {
        if (!auth) throw new Error("Firebase is not configured yet.");
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          logSecurityEvent("AUTH_LOGIN_SUCCESS", { uid: cred.user.uid, email });
        } catch (err) {
          logSecurityEvent("AUTH_LOGIN_FAILURE", { email, reason: (err as Error)?.message });
          throw err;
        }
      },
      loginWithGoogle: async () => {
        if (!auth || !db) throw new Error("Firebase is not configured yet.");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
          const cred = await signInWithPopup(auth, provider);
          const user = cred.user;
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);

          if (!snap.exists()) {
            const userEmail = user.email;
            const userDisplayName = user.displayName;
            let baseUsername = "player";

            if (userDisplayName) {
              baseUsername = userDisplayName.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
            } else if (userEmail) {
              const parts = userEmail.split("@");
              if (parts[0]) {
                baseUsername = parts[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
              }
            }

            if (baseUsername.length < 3) baseUsername = "player";
            if (baseUsername.length > 20) baseUsername = baseUsername.slice(0, 20);

            let candidate = baseUsername;
            let counter = 1;
            let available = await checkUsernameAvailable(db, candidate);
            while (!available && counter < 100) {
              candidate = `${baseUsername.slice(0, 18)}${counter}`;
              available = await checkUsernameAvailable(db, candidate);
              counter++;
            }
            if (!available) {
              candidate = `player_${Math.floor(1000 + Math.random() * 9000)}`;
            }

            const avatarId = "avatar-01";
            await registerUserWithUniqueUsername(
              db,
              user.uid,
              candidate,
              user.email || "",
              avatarId,
            );
            await updateProfile(user, { displayName: candidate, photoURL: avatarId });

            logSecurityEvent("AUTH_REGISTER", {
              uid: user.uid,
              email: user.email || "",
              provider: "google.com",
            });

            const newProfile: UserProfile = {
              uid: user.uid,
              username: candidate,
              email: user.email || "",
              avatarId,
              photoURL: avatarId,
              rating: 1200,
              gamesPlayed: 0,
              wins: 0,
              losses: 0,
              draws: 0,
            };
            setProfile(newProfile);
            try {
              localStorage.setItem(`chess_profile_${user.uid}`, JSON.stringify(newProfile));
              localStorage.setItem("chess_active_profile", JSON.stringify(newProfile));
            } catch {}
          } else {
            logSecurityEvent("AUTH_LOGIN_SUCCESS", {
              uid: user.uid,
              email: user.email || "",
              provider: "google.com",
            });
            const existingProfile = await loadProfile(user.uid);
            if (existingProfile) {
              setProfile(existingProfile);
            }
          }
          if (auth.currentUser) setUser(auth.currentUser);
        } catch (err) {
          logSecurityEvent("AUTH_LOGIN_FAILURE", {
            reason: (err as Error)?.message,
            provider: "google.com",
          });
          throw err;
        }
      },
      logout: async () => {
        if (!auth) return;
        const currentUid = auth.currentUser?.uid;
        try {
          localStorage.removeItem("chess_active_profile");
        } catch {}
        await signOut(auth);
        logSecurityEvent("AUTH_LOGOUT", { uid: currentUid });
      },
      resetPassword: async (email) => {
        if (!auth) throw new Error("Firebase is not configured yet.");
        await sendPasswordResetEmail(auth, email);
        logSecurityEvent("AUTH_PASSWORD_RESET", { email });
      },
      resendVerificationEmail: async () => {
        if (!auth?.currentUser) throw new Error("No user is currently signed in.");
        await sendEmailVerification(auth.currentUser);
        logSecurityEvent("AUTH_EMAIL_VERIFICATION_SENT", {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || "",
        });
      },
      updateAccount: async ({ username, avatarId, photoURL }) => {
        const uid = auth?.currentUser?.uid || profile?.uid || "demo_user";
        const currentUsername = profile?.username || auth?.currentUser?.displayName || "Player";
        const targetUsername = username !== undefined ? username : currentUsername;
        const finalDisplayName = targetUsername.trim();

        const selectedAvatarId =
          avatarId !== undefined && avatarId !== null
            ? avatarId
            : photoURL !== undefined && photoURL !== null
              ? photoURL
              : (profile?.avatarId ?? profile?.photoURL ?? "avatar-01");

        const updatedProfile: UserProfile = {
          uid,
          username: finalDisplayName,
          email: profile?.email ?? "",
          avatarId: selectedAvatarId,
          photoURL: selectedAvatarId,
          rating: profile?.rating ?? 1200,
          gamesPlayed: profile?.gamesPlayed ?? 0,
          wins: profile?.wins ?? 0,
          losses: profile?.losses ?? 0,
          draws: profile?.draws ?? 0,
        };

        try {
          localStorage.setItem(`chess_profile_${uid}`, JSON.stringify(updatedProfile));
          localStorage.setItem("chess_active_profile", JSON.stringify(updatedProfile));
        } catch {}

        if (db) {
          if (
            auth?.currentUser &&
            username !== undefined &&
            normalizeUsername(username) !== normalizeUsername(currentUsername)
          ) {
            await updateUsernameWithReservation(
              db,
              uid,
              currentUsername,
              targetUsername,
              selectedAvatarId,
            );
          } else {
            const userRef = doc(db, "users", uid);
            const updateData: Record<string, any> = {};
            if (username !== undefined) updateData["username"] = finalDisplayName;
            updateData["avatarId"] = selectedAvatarId;
            updateData["photoURL"] = selectedAvatarId;

            await setDoc(userRef, updateData, { merge: true });
          }

          if (auth?.currentUser) {
            await updateProfile(auth.currentUser, {
              displayName: finalDisplayName,
              photoURL: selectedAvatarId,
            });
            setUser({ ...auth.currentUser });
          }
        }

        setProfile(updatedProfile);
      },
    }),
    [user, profile, loading, configured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
