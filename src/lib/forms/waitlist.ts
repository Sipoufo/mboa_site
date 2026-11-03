import { z } from "astro/zod";
import { locales } from "@/i18n/locales";
import { cities, DEFAULT_SOURCE, limits, normalizePhone, normalizeSource, profiles } from "./waitlist-fields";

export * from "./waitlist-fields";

const optionalTrimmed = z
  .string()
  .trim()
  .optional()
  .transform((value) => value ?? "");

export const waitlistSchema = z
  .object({
    firstName: z.string().trim().min(limits.firstName.min).max(limits.firstName.max),
    email: optionalTrimmed.pipe(z.union([z.literal(""), z.email().max(254)])),
    whatsapp: optionalTrimmed,
    city: z.enum(cities),
    profile: z.enum(profiles),
    motivation: optionalTrimmed.pipe(z.string().max(limits.motivation.max)),
    consent: z.literal(true),
    locale: z.enum(locales),
    turnstileToken: z.string().default(""),
    /** Channel the visitor came from — an unknown or malformed value counts as "direct". */
    source: z
      .string()
      .optional()
      .transform((value) => normalizeSource(value) ?? DEFAULT_SOURCE),
    /** Honeypot — real visitors never see or fill it. */
    // Not named like a real field ("company", "website"…): browsers autofill those even when
    // hidden, which made real visitors look like bots (bug of 2026-11-03).
    hp: z.string().max(0).optional(),
  })
  .transform((data, ctx) => {
    let whatsapp = "";
    if (data.whatsapp !== "") {
      const normalized = normalizePhone(data.whatsapp);
      if (!normalized) {
        ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "invalid_phone" });
        return z.NEVER;
      }
      whatsapp = normalized;
    }
    if (data.email === "" && whatsapp === "") {
      ctx.addIssue({ code: "custom", path: ["email"], message: "contact_required" });
      return z.NEVER;
    }
    return { ...data, whatsapp };
  });

export type WaitlistSubmission = z.output<typeof waitlistSchema>;
