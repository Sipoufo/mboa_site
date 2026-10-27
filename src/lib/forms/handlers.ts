import { routes } from "@/i18n/routes";
import { BrevoError, createBrevoClient, type BrevoContact } from "./brevo";
import { verifyTurnstile } from "./turnstile";
import { waitlistFields, waitlistSchema, type WaitlistField, type WaitlistSubmission } from "./waitlist";

/**
 * Framework-free request handlers, so they can be unit-tested without the Workers runtime.
 * The Astro endpoints in src/pages/api/ only wire the Cloudflare env into them.
 */
export interface FormsEnv {
  PUBLIC_SITE_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
  BREVO_API_KEY?: string;
  BREVO_LIST_WAITLIST?: string;
  /** Optional: Brevo double opt-in template. Without it, contacts join the list directly. */
  BREVO_DOI_TEMPLATE_ID?: string;
}

export interface HandlerDeps {
  env: FormsEnv;
  /** True in `astro dev`: missing Turnstile/Brevo config is simulated instead of failing. */
  dev: boolean;
  fetch?: typeof fetch;
  log?: Pick<Console, "warn" | "error">;
}

export type WaitlistResponse =
  | { ok: true; status: "subscribed" | "confirmation_sent" | "simulated" }
  | { ok: false; error: "validation"; fields: Partial<Record<WaitlistField, string>> }
  | { ok: false; error: "captcha" | "bad_request" | "unavailable" | "provider" };

function json(body: WaitlistResponse | { count: number | null }, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

/** Brevo attributes. CITY, PROFILE, MOTIVATION, LOCALE and SOURCE must exist in the Brevo account (docs/brevo-setup.md). */
function toContact(data: WaitlistSubmission): BrevoContact {
  const attributes: Record<string, string> = {
    FIRSTNAME: data.firstName,
    CITY: data.city,
    PROFILE: data.profile,
    LOCALE: data.locale,
    SOURCE: "site-waitlist",
  };
  if (data.whatsapp) attributes.WHATSAPP = data.whatsapp;
  if (data.motivation) attributes.MOTIVATION = data.motivation;

  return data.email
    ? { email: data.email, attributes }
    : // No email: the WhatsApp number identifies the contact.
      { ext_id: `wa:${data.whatsapp}`, attributes };
}

export async function handleWaitlist(request: Request, deps: HandlerDeps): Promise<Response> {
  const { env, dev, fetch: fetchFn = fetch, log = console } = deps;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const parsed = waitlistSchema.safeParse(payload);
  if (!parsed.success) {
    const fields: Partial<Record<WaitlistField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && (waitlistFields as readonly string[]).includes(field)) {
        fields[field as WaitlistField] ??= issue.code === "custom" ? issue.message : "invalid";
      }
    }
    // A filled honeypot is a bot: answer like a success, store nothing.
    if (parsed.error.issues.some((issue) => issue.path[0] === "company")) {
      return json({ ok: true, status: "subscribed" });
    }
    return json({ ok: false, error: "validation", fields }, 400);
  }
  const data = parsed.data;

  // 1. Anti-spam
  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get("cf-connecting-ip");
    if (!(await verifyTurnstile(data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip, fetchFn))) {
      return json({ ok: false, error: "captcha" }, 403);
    }
  } else if (!dev) {
    log.error("[waitlist] TURNSTILE_SECRET_KEY is not configured");
    return json({ ok: false, error: "unavailable" }, 503);
  }

  // 2. Storage
  const listId = Number(env.BREVO_LIST_WAITLIST);
  if (!env.BREVO_API_KEY || !Number.isInteger(listId) || listId <= 0) {
    if (dev) {
      log.warn("[waitlist] Brevo not configured — submission simulated (dev only)");
      return json({ ok: true, status: "simulated" });
    }
    log.error("[waitlist] BREVO_API_KEY / BREVO_LIST_WAITLIST are not configured");
    return json({ ok: false, error: "unavailable" }, 503);
  }

  const brevo = createBrevoClient(env.BREVO_API_KEY, fetchFn);
  const contact = toContact(data);
  const templateId = Number(env.BREVO_DOI_TEMPLATE_ID);

  try {
    if (contact.email && Number.isInteger(templateId) && templateId > 0) {
      const site = env.PUBLIC_SITE_URL ?? new URL(request.url).origin;
      const redirectionUrl = new URL(`${routes.waitlist[data.locale]}?confirmed=1`, site).toString();
      await brevo.requestDoubleOptIn({ ...contact, email: contact.email }, listId, templateId, redirectionUrl);
      return json({ ok: true, status: "confirmation_sent" });
    }
    await brevo.upsertContact(contact, listId);
    return json({ ok: true, status: "subscribed" });
  } catch (error) {
    // Never log the payload: it holds personal data.
    const detail = error instanceof BrevoError ? `${error.status} ${error.code ?? ""}` : "network";
    log.error(`[waitlist] Brevo request failed: ${detail}`);
    return json({ ok: false, error: "provider" }, 502);
  }
}

/**
 * Public waitlist size. Returns null below the floor, so small numbers are never exposed.
 */
export async function handleWaitlistCount(deps: HandlerDeps & { floor: number; enabled: boolean }): Promise<Response> {
  const { env, fetch: fetchFn = fetch, log = console, floor, enabled } = deps;
  const cacheHeaders = { "cache-control": "public, max-age=600, s-maxage=3600" };

  const listId = Number(env.BREVO_LIST_WAITLIST);
  if (!enabled || !env.BREVO_API_KEY || !Number.isInteger(listId) || listId <= 0) {
    return json({ count: null }, 200, cacheHeaders);
  }

  try {
    const size = await createBrevoClient(env.BREVO_API_KEY, fetchFn).listSize(listId);
    return json({ count: size >= floor ? size : null }, 200, cacheHeaders);
  } catch (error) {
    const detail = error instanceof BrevoError ? `${error.status}` : "network";
    log.error(`[waitlist-count] Brevo request failed: ${detail}`);
    return json({ count: null }, 200, { "cache-control": "no-store" });
  }
}
