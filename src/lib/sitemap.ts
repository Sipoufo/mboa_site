import { localeTags, locales } from "../i18n/locales";
import { routes, type RouteKey } from "../i18n/routes";

/** Minimal shape of an @astrojs/sitemap entry (avoids importing the integration's types here). */
interface SitemapItem {
  url: string;
  links?: { url: string; lang: string }[];
}

function pathOf(url: string): string {
  const path = new URL(url).pathname.replace(/\/+$/, "");
  return path === "" ? "/" : path;
}

/**
 * hreflang alternates for every sitemap entry, from the localized route map.
 * The integration's own `i18n` option only pairs pages whose paths match after the
 * locale prefix (`/` ↔ `/en`), so `/liste-d-attente` ↔ `/en/waitlist` was left unpaired.
 * Imported by astro.config.mjs — relative imports only (no `@/` alias at config time).
 */
export function withAlternates<T extends SitemapItem>(item: T): T & Pick<SitemapItem, "links"> {
  const path = pathOf(item.url);
  const key = (Object.keys(routes) as RouteKey[]).find((route) =>
    locales.some((locale) => routes[route][locale] === path),
  );
  if (!key) return item;

  const origin = new URL(item.url).origin;
  const href = (p: string) => (p === "/" ? `${origin}/` : `${origin}${p}`);
  return {
    ...item,
    links: [
      ...locales.map((locale) => ({ lang: localeTags[locale], url: href(routes[key][locale]) })),
      { lang: "x-default", url: href(routes[key].fr) },
    ],
  };
}
