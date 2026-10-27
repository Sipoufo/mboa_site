/**
 * Minimal server-only Brevo API v3 client (CLAUDE.md › Forms & Lists).
 * The API key never reaches the browser.
 */
const API = "https://api.brevo.com/v3";

export interface BrevoContact {
  email?: string;
  /** External identifier, used when the contact has no email. */
  ext_id?: string;
  attributes: Record<string, string>;
}

export class BrevoError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | undefined,
    message: string,
  ) {
    super(message);
    this.name = "BrevoError";
  }
}

export function createBrevoClient(apiKey: string, fetchFn: typeof fetch = fetch) {
  async function call(path: string, init: RequestInit = {}): Promise<Response> {
    const response = await fetchFn(`${API}${path}`, {
      ...init,
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { code?: string; message?: string };
      throw new BrevoError(response.status, payload.code, payload.message ?? `Brevo ${response.status}`);
    }
    return response;
  }

  return {
    /** Creates the contact, or updates it if it already exists, and adds it to the list. */
    async upsertContact(contact: BrevoContact, listId: number): Promise<void> {
      await call("/contacts", {
        method: "POST",
        body: JSON.stringify({ ...contact, listIds: [listId], updateEnabled: true }),
      });
    },

    /** Double opt-in: Brevo emails a confirmation link; the contact joins the list once confirmed. */
    async requestDoubleOptIn(
      contact: BrevoContact & { email: string },
      listId: number,
      templateId: number,
      redirectionUrl: string,
    ): Promise<void> {
      await call("/contacts/doubleOptinConfirmation", {
        method: "POST",
        body: JSON.stringify({ ...contact, includeListIds: [listId], templateId, redirectionUrl }),
      });
    },

    /** Number of subscribers in a list. */
    async listSize(listId: number): Promise<number> {
      const response = await call(`/contacts/lists/${listId}`);
      const list = (await response.json()) as { totalSubscribers?: number; uniqueSubscribers?: number };
      return list.uniqueSubscribers ?? list.totalSubscribers ?? 0;
    },
  };
}
