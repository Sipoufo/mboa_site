import { localeTags, locales, type Locale } from "@/i18n/locales";
import { routes, type RouteKey } from "@/i18n/routes";

export interface Alternate {
  hreflang: string;
  href: string;
}

/** Absolute URL on the site origin. */
export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).toString();
}

/** hreflang alternates for a route: one per locale, plus x-default → French. */
export function alternatesFor(key: RouteKey, site: URL): Alternate[] {
  const perLocale = locales.map((locale) => ({
    hreflang: localeTags[locale],
    href: absoluteUrl(routes[key][locale], site),
  }));
  return [...perLocale, { hreflang: "x-default", href: absoluteUrl(routes[key].fr, site) }];
}

/** "Page · Mboa", or the full title as-is when it already carries the brand. */
export function pageTitle(title: string, suffix: string): string {
  return title.includes(suffix) ? title : `${title} · ${suffix}`;
}

export function canonicalFor(key: RouteKey, locale: Locale, site: URL): string {
  return absoluteUrl(routes[key][locale], site);
}
