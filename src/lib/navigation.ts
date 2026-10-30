import { isLive, type RouteKey } from "@/i18n/routes";

/** Main navigation, in display order. Only built pages are shown. */
const mainNav: RouteKey[] = ["project", "apps", "audiences", "trust", "pricing", "roadmap", "news"];

/** Footer columns, in display order. Only built pages are shown. */
const footerColumns = {
  colDiscover: ["project", "market", "apps", "trust", "pricing", "roadmap", "vision", "about", "news", "faq"],
  colJoin: ["waitlist", "owners", "agents", "investors", "press", "contact"],
  colLegal: ["legalNotice", "terms", "privacy", "cancellation"],
} as const satisfies Record<string, RouteKey[]>;

export function mainNavItems(): RouteKey[] {
  return mainNav.filter(isLive);
}

export function footerNavColumns() {
  return (Object.keys(footerColumns) as (keyof typeof footerColumns)[])
    .map((column) => ({ column, items: (footerColumns[column] as readonly RouteKey[]).filter(isLive) }))
    .filter(({ items }) => items.length > 0);
}
