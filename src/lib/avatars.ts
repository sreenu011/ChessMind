export type PresetAvatar = {
  id: string;
  name: string;
  src: string;
};

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: "avatar-01",
    name: "Knight",
    src: "/avatars/avatar-01.png",
  },
  {
    id: "avatar-02",
    name: "Rook",
    src: "/avatars/avatar-02.png",
  },
  {
    id: "avatar-03",
    name: "Queen",
    src: "/avatars/avatar-03.png",
  },
  {
    id: "avatar-04",
    name: "King",
    src: "/avatars/avatar-04.png",
  },
  {
    id: "avatar-05",
    name: "Bishop",
    src: "/avatars/avatar-05.png",
  },
  {
    id: "avatar-06",
    name: "Pawn",
    src: "/avatars/avatar-06.png",
  },
  {
    id: "avatar-07",
    name: "Grandmaster",
    src: "/avatars/avatar-07.png",
  },
  {
    id: "avatar-08",
    name: "Engine",
    src: "/avatars/avatar-08.png",
  },
];

/**
 * Single canonical avatar resolver.
 * Accepts avatarId, legacy ID, or photoURL and returns the corresponding PresetAvatar object.
 */
export function getAvatarById(avatarIdOrLegacyUrl?: string | null): PresetAvatar {
  if (!avatarIdOrLegacyUrl) return PRESET_AVATARS[0]!;

  const match = PRESET_AVATARS.find(
    (a) => a.id === avatarIdOrLegacyUrl || a.src === avatarIdOrLegacyUrl,
  );
  if (match) return match;

  // Backward compatibility heuristics for old IDs/URLs
  const lower = avatarIdOrLegacyUrl.toLowerCase();
  if (lower.includes("knight") || lower.includes("01")) return PRESET_AVATARS[0]!;
  if (lower.includes("rook") || lower.includes("02")) return PRESET_AVATARS[1]!;
  if (lower.includes("queen") || lower.includes("03")) return PRESET_AVATARS[2]!;
  if (lower.includes("king") || lower.includes("04")) return PRESET_AVATARS[3]!;
  if (lower.includes("bishop") || lower.includes("05")) return PRESET_AVATARS[4]!;
  if (lower.includes("pawn") || lower.includes("06")) return PRESET_AVATARS[5]!;
  if (lower.includes("grandmaster") || lower.includes("07")) return PRESET_AVATARS[6]!;
  if (lower.includes("bot") || lower.includes("engine") || lower.includes("08")) return PRESET_AVATARS[7]!;

  return PRESET_AVATARS[0]!;
}

/**
 * Convenience helper to get the avatar image src directly.
 */
export function getAvatarUrl(avatarIdOrLegacyUrl?: string | null): string {
  return getAvatarById(avatarIdOrLegacyUrl).src;
}
