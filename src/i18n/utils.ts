import en from "./en.json";
import fr from "./fr.json";
import { defaultLocale, localeTags, locales, type Locale } from "./locales";
import { routes, type RouteKey } from "./routes";

export { defaultLocale, locales, type Locale } from "./locales";

const dictionaries: Record<Locale, Dictionary> = { fr, en };

type Dictionary = typeof fr;

/** Dot paths of every leaf string in the dictionary, e.g. "nav.home". */
type Leaves<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type TranslationKey = Leaves<Dictionary>;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

/** Locale of a URL: /en/… is English, everything else is French. */
export function getLocale(url: URL): Locale {
  const [first] = url.pathname.split("/").filter(Boolean);
  return isLocale(first) ? first : defaultLocale;
}

/**
 * Translate a key, replacing `{name}` placeholders with `vars`.
 * A missing key fails the build — copy must never silently disappear.
 */
export function t(locale: Locale, key: TranslationKey, vars: Record<string, string | number> = {}): string {
  const value = key.split(".").reduce<unknown>((node, part) => {
    return node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined;
  }, dictionaries[locale]);

  if (typeof value !== "string") {
    throw new Error(`Missing translation "${key}" for locale "${locale}"`);
  }

  return value.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** Bound translator, for components that use many keys. */
export function useTranslations(locale: Locale) {
  return (key: TranslationKey, vars?: Record<string, string | number>) => t(locale, key, vars);
}

export function localizedPath(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}

function normalize(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** Route key matching a pathname, if the path is one of the declared routes. */
export function routeKeyFromPath(pathname: string): RouteKey | undefined {
  const path = normalize(pathname);
  return (Object.keys(routes) as RouteKey[]).find((key) => locales.some((locale) => routes[key][locale] === path));
}

/** Formats a "YYYY-MM" month for display, e.g. "décembre 2026" / "December 2026". */
export function formatMonth(month: string, locale: Locale): string {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1, 1));
  return new Intl.DateTimeFormat(localeTags[locale], { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}
