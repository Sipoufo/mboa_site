import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import fr from "@/i18n/fr.json";
import { locales } from "@/i18n/locales";
import { liveRoutes, routes, type RouteKey } from "@/i18n/routes";
import { formatMonth, getLocale, localizedPath, routeKeyFromPath, t } from "@/i18n/utils";

function leafKeys(node: unknown, prefix = ""): string[] {
  if (typeof node !== "object" || node === null) return [prefix];
  return Object.entries(node).flatMap(([key, value]) => leafKeys(value, prefix ? `${prefix}.${key}` : key));
}

/** File that builds a route path: "/" → index.astro, "/en/apps" → en/apps.astro or en/apps/index.astro. */
function pageFileExists(path: string): boolean {
  const base = path === "/" ? "src/pages/index" : `src/pages${path}`;
  return [`${base}.astro`, `${base}/index.astro`].some((file) => existsSync(file));
}

describe("dictionaries", () => {
  it("fr.json and en.json have exactly the same keys", () => {
    expect(leafKeys(en).sort()).toEqual(leafKeys(fr).sort());
  });

  it("has no empty string", () => {
    for (const [name, dict] of Object.entries({ fr, en })) {
      const empty = leafKeys(dict).filter((key) => t(name as "fr" | "en", key as never).trim() === "");
      expect(empty, `empty keys in ${name}`).toEqual([]);
    }
  });
});

describe("t()", () => {
  it("replaces placeholders", () => {
    expect(t("fr", "topbar.launch", { date: "décembre 2026" })).toBe("Lancement du MVP : décembre 2026");
  });

  it("throws on a missing key", () => {
    expect(() => t("fr", "nav.nope" as never)).toThrow(/Missing translation/);
  });
});

describe("routes", () => {
  it("every route has a path per locale, EN under /en", () => {
    for (const [key, paths] of Object.entries(routes)) {
      for (const locale of locales) expect(paths[locale], `${key}.${locale}`).toBeTruthy();
      expect(paths.en.startsWith("/en"), key).toBe(true);
      expect(paths.fr.startsWith("/en"), key).toBe(false);
    }
  });

  it("paths are unique", () => {
    const all = Object.values(routes).flatMap((paths) => Object.values(paths));
    expect(new Set(all).size).toBe(all.length);
  });

  it("every live route has a page file in both locales", () => {
    for (const key of liveRoutes) {
      for (const locale of locales) {
        expect(pageFileExists(routes[key][locale]), `${key} (${locale})`).toBe(true);
      }
    }
  });

  it("maps a path back to its key, with or without trailing slash", () => {
    expect(routeKeyFromPath("/en/waitlist/")).toBe<RouteKey>("waitlist");
    expect(routeKeyFromPath("/liste-d-attente")).toBe<RouteKey>("waitlist");
    expect(routeKeyFromPath("/")).toBe<RouteKey>("home");
    expect(routeKeyFromPath("/unknown")).toBeUndefined();
  });

  it("localizedPath returns the locale's slug", () => {
    expect(localizedPath("about", "fr")).toBe("/a-propos");
    expect(localizedPath("about", "en")).toBe("/en/about");
  });
});

describe("getLocale / formatMonth", () => {
  it("detects the locale from the URL", () => {
    expect(getLocale(new URL("https://mboa.cm/en/apps"))).toBe("en");
    expect(getLocale(new URL("https://mboa.cm/applications"))).toBe("fr");
    expect(getLocale(new URL("https://mboa.cm/entreprise"))).toBe("fr");
  });

  it("formats the MVP month", () => {
    expect(formatMonth("2026-12", "fr")).toBe("décembre 2026");
    expect(formatMonth("2026-12", "en")).toBe("December 2026");
  });
});
