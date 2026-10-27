import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleWaitlist } from "@/lib/forms/handlers";

export const prerender = false;

export const POST = (({ request }) => handleWaitlist(request, { env, dev: import.meta.env.DEV })) satisfies APIRoute;
