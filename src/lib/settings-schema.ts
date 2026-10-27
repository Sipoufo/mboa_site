import { z } from "astro/zod";

const optionalText = z.string().trim().default("");
const optionalUrl = z.union([z.url(), z.literal("")]).default("");
const optionalEmail = z.union([z.email(), z.literal("")]).default("");

export const settingsSchema = z.object({
  launch: z.object({
    mvpDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, { error: "mvpDate must be YYYY-MM" }),
    appsLive: z.boolean(),
  }),
  stores: z.object({
    appStore: optionalUrl,
    playStore: optionalUrl,
  }),
  legal: z.object({
    companyName: optionalText,
    rccm: optionalText,
    address: optionalText,
    privacyEmail: optionalEmail,
    supportEmail: optionalEmail,
    publicationDirector: optionalText,
  }),
  contact: z.object({
    email: optionalEmail,
    whatsapp: optionalText,
    phone: optionalText,
  }),
  socials: z.object({
    instagram: optionalUrl,
    tiktok: optionalUrl,
    facebook: optionalUrl,
    linkedin: optionalUrl,
  }),
  waitlist: z.object({
    showCounter: z.boolean(),
    counterFloor: z.number().int().nonnegative(),
  }),
});

export type Settings = z.infer<typeof settingsSchema>;

/** Legal fields that must be filled before the legal pages are complete. */
export const requiredLegalFields = ["companyName", "rccm", "address", "privacyEmail", "supportEmail"] as const;
