const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare's public test keys: the site key always passes, in dev only. */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

interface SiteverifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

/** Server-side Turnstile check. Never trust the client-side widget alone. */
export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> {
  if (token === "") return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetchFn(SITEVERIFY_URL, { method: "POST", body });
    if (!response.ok) return false;
    const result = (await response.json()) as SiteverifyResponse;
    return result.success === true;
  } catch {
    return false;
  }
}
