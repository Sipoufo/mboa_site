import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleWaitlistCount } from "@/lib/forms/handlers";
import { settings } from "@/lib/settings";

export const prerender = false;

/** Cached at the edge for an hour (Workers Cache API), so Brevo is called at most hourly per location. */
export const GET = (async ({ request }) => {
  const cache = (globalThis as { caches?: { default?: Cache } }).caches?.default;
  const key = new Request(new URL(request.url).toString(), { method: "GET" });

  const cached = await cache?.match(key);
  if (cached) return cached;

  const response = await handleWaitlistCount({
    env,
    dev: import.meta.env.DEV,
    floor: settings.waitlist.counterFloor,
    enabled: settings.waitlist.showCounter,
  });
  if (cache && response.headers.get("cache-control")?.includes("s-maxage")) {
    await cache.put(key, response.clone());
  }
  return response;
}) satisfies APIRoute;
