const messages: Record<string, string> = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account already uses that email.",
  "auth/weak-password": "Password must be at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again in a few minutes.",
  "auth/network-request-failed": "Network problem — check your connection and try again.",
  "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
  "auth/popup-blocked": "Sign-in popup was blocked by browser. Please allow popups for Google Sign-In.",
  "auth/account-exists-with-different-credential": "An account already exists with this email address using a different sign-in method.",
  "auth/operation-not-allowed": "Google Sign-In provider is not enabled in Firebase Console for this project.",
};

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code && messages[code]) return messages[code];
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}
