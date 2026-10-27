import type { Locale } from "./locales";

/**
 * Localized slug map (CLAUDE.md › Site Map). FR is unprefixed, EN lives under /en/.
 * Every page of the site is declared here, built or not.
 */
export const routes = {
  home: { fr: "/", en: "/en" },
  project: { fr: "/le-projet", en: "/en/the-project" },
  market: { fr: "/le-marche", en: "/en/the-market" },
  audiences: { fr: "/pour-qui", en: "/en/who-its-for" },
  owners: { fr: "/proprietaires", en: "/en/owners" },
  agents: { fr: "/devenir-agent", en: "/en/become-an-agent" },
  apps: { fr: "/applications", en: "/en/apps" },
  appMboa: { fr: "/applications/mboa", en: "/en/apps/mboa" },
  appMboaPro: { fr: "/applications/mboa-pro", en: "/en/apps/mboa-pro" },
  trust: { fr: "/confiance", en: "/en/trust" },
  pricing: { fr: "/tarifs", en: "/en/pricing" },
  roadmap: { fr: "/feuille-de-route", en: "/en/roadmap" },
  vision: { fr: "/vision", en: "/en/vision" },
  about: { fr: "/a-propos", en: "/en/about" },
  investors: { fr: "/investisseurs", en: "/en/investors" },
  news: { fr: "/actualites", en: "/en/news" },
  press: { fr: "/presse", en: "/en/press" },
  faq: { fr: "/faq", en: "/en/faq" },
  waitlist: { fr: "/liste-d-attente", en: "/en/waitlist" },
  contact: { fr: "/contact", en: "/en/contact" },
  legalNotice: { fr: "/mentions-legales", en: "/en/legal-notice" },
  terms: { fr: "/cgu", en: "/en/terms" },
  privacy: { fr: "/confidentialite", en: "/en/privacy" },
  cancellation: { fr: "/annulation", en: "/en/cancellation" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/**
 * Pages that actually exist. Navigation only links to these, so the site never
 * points to an empty page. Add a key here in the same change that adds its pages.
 */
export const liveRoutes: readonly RouteKey[] = ["home"];

export function isLive(key: RouteKey): boolean {
  return liveRoutes.includes(key);
}
