export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

/** BCP 47 tags used for Intl formatting and hreflang. */
export const localeTags: Record<Locale, string> = {
  fr: "fr-CM",
  en: "en-CM",
};
