/**
 * Waitlist fields (CLAUDE.md › Forms & Lists, Doc 20 §6), shared by the browser island
 * and the server. No Zod here, so the island bundle stays small — the schema lives in waitlist.ts.
 * Every field must be listed in the privacy policy.
 */
export const cities = ["douala", "yaounde", "kribi", "bafoussam", "other"] as const;
export const profiles = ["tenant", "owner", "agency", "agent", "other"] as const;

export type City = (typeof cities)[number];
export type Profile = (typeof profiles)[number];

export const limits = {
  firstName: { min: 2, max: 60 },
  motivation: { max: 500 },
} as const;

/**
 * Normalizes a phone number to E.164. Cameroonian numbers may be typed without
 * the country code (9 digits, e.g. "6 99 00 00 00"). Returns null when invalid.
 */
export function normalizePhone(input: string): string | null {
  let value = input.trim().replace(/[\s.\-()]/g, "");
  if (value === "") return null;
  if (value.startsWith("00")) value = `+${value.slice(2)}`;
  if (!value.startsWith("+")) {
    if (/^[26]\d{8}$/.test(value)) value = `+237${value}`;
    else if (/^237[26]\d{8}$/.test(value)) value = `+${value}`;
    else return null;
  }
  return /^\+[1-9]\d{7,14}$/.test(value) ? value : null;
}

/**
 * Sign-up origin, to know which channel works: `?source=instagram`, `?source=carte` (QR code)…
 * Read from any page of the visit (kept in sessionStorage under SOURCE_KEY), "direct" otherwise.
 */
export const SOURCE_KEY = "mboa-source";
export const DEFAULT_SOURCE = "direct";

/** Lowercase slug (letters, digits, - and _), max 32 characters; anything else is ignored. */
export function normalizeSource(value: string | null | undefined): string | null {
  const source = (value ?? "").trim().toLowerCase();
  return /^[a-z0-9][a-z0-9_-]{0,31}$/.test(source) ? source : null;
}

/** Field names that can carry a validation error back to the form. */
export const waitlistFields = ["firstName", "email", "whatsapp", "city", "profile", "motivation", "consent"] as const;
export type WaitlistField = (typeof waitlistFields)[number];
