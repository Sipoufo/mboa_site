import { describe, expect, it, vi } from "vitest";
import { handleWaitlist, handleWaitlistCount, type FormsEnv } from "@/lib/forms/handlers";
import { normalizePhone, waitlistSchema } from "@/lib/forms/waitlist";

const valid = {
  firstName: "Ines",
  email: "ines@example.com",
  whatsapp: "",
  city: "douala",
  profile: "tenant",
  motivation: "",
  consent: true,
  locale: "fr",
  turnstileToken: "token",
};

const configured: FormsEnv = {
  TURNSTILE_SECRET_KEY: "secret",
  BREVO_API_KEY: "brevo-key",
  BREVO_LIST_WAITLIST: "7",
  PUBLIC_SITE_URL: "https://mboa.cm",
};

const silent = { warn: vi.fn(), error: vi.fn() };

function post(body: unknown): Request {
  return new Request("https://mboa.cm/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/** Fake fetch: Turnstile answers `captcha`, Brevo answers `brevoStatus`. Records every call. */
function fakeFetch({ captcha = true, brevoStatus = 201, listSize = 0 } = {}) {
  const calls: { url: string; body?: unknown }[] = [];
  const fn = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const raw = init?.body;
    calls.push({ url, body: typeof raw === "string" ? JSON.parse(raw) : raw });
    if (url.includes("turnstile")) return Response.json({ success: captcha });
    if (url.includes("/contacts/lists/")) return Response.json({ uniqueSubscribers: listSize });
    if (brevoStatus >= 400) return Response.json({ code: "error", message: "nope" }, { status: brevoStatus });
    return new Response(null, { status: brevoStatus });
  });
  return { fn: fn as unknown as typeof fetch, calls };
}

describe("normalizePhone", () => {
  it.each([
    ["6 99 00 00 00", "+237699000000"],
    ["699000000", "+237699000000"],
    ["237699000000", "+237699000000"],
    ["+237 6 99 00 00 00", "+237699000000"],
    ["00237699000000", "+237699000000"],
    ["+33 6 12 34 56 78", "+33612345678"],
    ["2 22 00 00 00", "+237222000000"],
  ])("%s → %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["12345", "abc", "+0123456789", "99 00 00"])("rejects %s", (input) => {
    expect(normalizePhone(input)).toBeNull();
  });
});

describe("waitlistSchema", () => {
  it("accepts a valid submission", () => {
    expect(waitlistSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts WhatsApp only and normalizes it", () => {
    const result = waitlistSchema.parse({ ...valid, email: "", whatsapp: "6 99 00 00 00" });
    expect(result.whatsapp).toBe("+237699000000");
  });

  it("requires an email or a WhatsApp number", () => {
    const result = waitlistSchema.safeParse({ ...valid, email: "", whatsapp: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({ path: ["email"], message: "contact_required" });
  });

  it("requires consent", () => {
    expect(waitlistSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });

  it("rejects unknown cities and profiles", () => {
    expect(waitlistSchema.safeParse({ ...valid, city: "paris" }).success).toBe(false);
    expect(waitlistSchema.safeParse({ ...valid, profile: "investor" }).success).toBe(false);
  });
});

describe("handleWaitlist", () => {
  it("subscribes a valid contact to the Brevo list", async () => {
    const { fn, calls } = fakeFetch();
    const response = await handleWaitlist(post(valid), { env: configured, dev: false, fetch: fn, log: silent });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, status: "subscribed" });
    const brevo = calls.find((call) => call.url === "https://api.brevo.com/v3/contacts");
    expect(brevo?.body).toMatchObject({
      email: "ines@example.com",
      listIds: [7],
      updateEnabled: true,
      attributes: { FIRSTNAME: "Ines", CITY: "douala", PROFILE: "tenant", LOCALE: "fr", SOURCE: "site-waitlist" },
    });
  });

  it("identifies a WhatsApp-only contact by ext_id", async () => {
    const { fn, calls } = fakeFetch();
    await handleWaitlist(post({ ...valid, email: "", whatsapp: "699000000" }), {
      env: configured,
      dev: false,
      fetch: fn,
      log: silent,
    });
    const brevo = calls.find((call) => call.url.endsWith("/contacts"));
    expect(brevo?.body).toMatchObject({ ext_id: "wa:+237699000000", attributes: { WHATSAPP: "+237699000000" } });
    expect(brevo?.body).not.toHaveProperty("email");
  });

  it("uses double opt-in when a template is configured", async () => {
    const { fn, calls } = fakeFetch();
    const response = await handleWaitlist(post({ ...valid, locale: "en" }), {
      env: { ...configured, BREVO_DOI_TEMPLATE_ID: "3" },
      dev: false,
      fetch: fn,
      log: silent,
    });
    expect(await response.json()).toEqual({ ok: true, status: "confirmation_sent" });
    const doi = calls.find((call) => call.url.endsWith("/doubleOptinConfirmation"));
    expect(doi?.body).toMatchObject({
      templateId: 3,
      includeListIds: [7],
      redirectionUrl: "https://mboa.cm/en/waitlist?confirmed=1",
    });
  });

  it("returns field errors on invalid input", async () => {
    const { fn } = fakeFetch();
    const response = await handleWaitlist(post({ ...valid, firstName: "I", consent: false }), {
      env: configured,
      dev: false,
      fetch: fn,
      log: silent,
    });
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("validation");
    expect(Object.keys(body.fields)).toEqual(expect.arrayContaining(["firstName", "consent"]));
  });

  it("rejects a failed Turnstile check without calling Brevo", async () => {
    const { fn, calls } = fakeFetch({ captcha: false });
    const response = await handleWaitlist(post(valid), { env: configured, dev: false, fetch: fn, log: silent });
    expect(response.status).toBe(403);
    expect(calls.some((call) => call.url.includes("brevo"))).toBe(false);
  });

  it("silently drops honeypot submissions", async () => {
    const { fn, calls } = fakeFetch();
    const response = await handleWaitlist(post({ ...valid, company: "Spam Inc" }), {
      env: configured,
      dev: false,
      fetch: fn,
      log: silent,
    });
    expect(response.status).toBe(200);
    expect(calls).toEqual([]);
  });

  it("answers 400 on a malformed body", async () => {
    const response = await handleWaitlist(post("{not json"), { env: configured, dev: false, log: silent });
    expect(response.status).toBe(400);
  });

  it("reports a provider failure without leaking details", async () => {
    const { fn } = fakeFetch({ brevoStatus: 500 });
    const log = { warn: vi.fn(), error: vi.fn() };
    const response = await handleWaitlist(post(valid), { env: configured, dev: false, fetch: fn, log });
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ ok: false, error: "provider" });
    expect(String(log.error.mock.calls[0]?.[0])).not.toContain("ines@example.com");
  });

  it("is unavailable in production when not configured", async () => {
    const response = await handleWaitlist(post(valid), { env: {}, dev: false, log: silent });
    expect(response.status).toBe(503);
  });

  it("simulates the submission in dev when not configured", async () => {
    const response = await handleWaitlist(post(valid), { env: {}, dev: true, log: silent });
    expect(await response.json()).toEqual({ ok: true, status: "simulated" });
  });
});

describe("handleWaitlistCount", () => {
  it("hides the count below the floor", async () => {
    const { fn } = fakeFetch({ listSize: 12 });
    const response = await handleWaitlistCount({ env: configured, dev: false, fetch: fn, floor: 50, enabled: true });
    expect(await response.json()).toEqual({ count: null });
  });

  it("returns the count above the floor, cacheable", async () => {
    const { fn } = fakeFetch({ listSize: 150 });
    const response = await handleWaitlistCount({ env: configured, dev: false, fetch: fn, floor: 50, enabled: true });
    expect(await response.json()).toEqual({ count: 150 });
    expect(response.headers.get("cache-control")).toContain("s-maxage=3600");
  });

  it("returns null when disabled", async () => {
    const { fn, calls } = fakeFetch({ listSize: 150 });
    const response = await handleWaitlistCount({ env: configured, dev: false, fetch: fn, floor: 50, enabled: false });
    expect(await response.json()).toEqual({ count: null });
    expect(calls).toEqual([]);
  });
});
