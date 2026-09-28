/**
 * Security Event Logger for ChessMind Production Monitoring
 * Formats structured JSON security logs for ingestion into Sentry, Cloudflare Logpush,
 * or Datadog while strictly guaranteeing zero leakage of credentials, tokens, or raw secrets.
 */

export type SecurityEventType =
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILURE"
  | "AUTH_REGISTER"
  | "AUTH_LOGOUT"
  | "AUTH_PASSWORD_RESET"
  | "AUTH_EMAIL_VERIFICATION_SENT"
  | "AUTH_MFA_ENROLLED"
  | "AUTH_MFA_CHALLENGE"
  | "SECURITY_UNAUTHORIZED_ACCESS"
  | "SECURITY_FIRESTORE_DENIED";

export interface SecurityEventDetails {
  uid?: string | undefined;
  email?: string | undefined;
  reason?: string | undefined;
  path?: string | undefined;
  ip?: string | undefined;
  userAgent?: string | undefined;
  [key: string]: unknown;
}

/**
 * Mask sensitive email address e.g. "player@chessmind.com" -> "p***r@c***d.com"
 */

export function maskEmail(email?: string): string {
  if (!email || !email.includes("@")) return "anonymous";
  const [local, domain] = email.split("@");
  if (!local || !domain) return "anonymous";

  const maskedLocal =
    local.length <= 2
      ? `${local[0]}*`
      : `${local[0]}***${local[local.length - 1]}`;

  const domainParts = domain.split(".");
  const domainName = domainParts[0] ?? "";
  const ext = domainParts.slice(1).join(".");

  const maskedDomain =
    domainName.length <= 2
      ? `${domainName[0]}*`
      : `${domainName[0]}***${domainName[domainName.length - 1]}`;

  return `${maskedLocal}@${maskedDomain}.${ext}`;
}

/**
 * Safely log security event to console & monitoring sinks
 */
export function logSecurityEvent(type: SecurityEventType, details: SecurityEventDetails = {}) {
  const timestamp = new Date().toISOString();

  // Create sanitized payload excluding passwords, tokens, or auth headers
  const sanitizedPayload = {
    event: type,
    timestamp,
    uid: details.uid || "anonymous",
    maskedEmail: details.email ? maskEmail(details.email) : undefined,
    reason: details.reason,
    path: typeof window !== "undefined" ? window.location.pathname : details.path,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };

  // 1. Structured Console Output
  const logPrefix = `[SECURITY LOG ${type}]`;
  if (type.includes("FAILURE") || type.includes("DENIED") || type.includes("UNAUTHORIZED")) {
    console.warn(logPrefix, JSON.stringify(sanitizedPayload));
  } else {
    console.log(logPrefix, JSON.stringify(sanitizedPayload));
  }

  // 2. Production Monitoring Dispatch Hook (e.g. Sentry / Datadog / Cloudflare Logpush)
  if (typeof window !== "undefined" && (window as any).Sentry) {
    (window as any).Sentry.addBreadcrumb({
      category: "security",
      message: `${type}: ${details.reason || "event logged"}`,
      level: type.includes("FAILURE") ? "warning" : "info",
      data: sanitizedPayload,
    });
  }
}
