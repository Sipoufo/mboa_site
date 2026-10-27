import { expect, test, type Page } from "@playwright/test";

/** The API is mocked: these tests cover the form, not Brevo or Turnstile (see tests/unit/waitlist.test.ts). */
async function mockApi(page: Page, status: number, body: unknown) {
  const requests: unknown[] = [];
  await page.route("**/api/waitlist", async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  });
  return requests;
}

async function fillValidForm(page: Page) {
  await page.getByLabel("Prénom").fill("Ines");
  await page.getByLabel("Numéro WhatsApp").fill("6 99 00 00 00");
  await page.getByLabel("Ville").selectOption("douala");
  await page.getByLabel("Vous êtes").selectOption("tenant");
  await page.getByLabel(/J'accepte que Mboa/).check();
}

test("shows field errors and sends nothing when the form is incomplete", async ({ page }) => {
  const requests = await mockApi(page, 200, { ok: true, status: "subscribed" });
  await page.goto("/liste-d-attente");

  await page.getByRole("button", { name: "Rejoindre la liste d'attente" }).last().click();

  await expect(page.getByRole("alert")).toContainText("Certains champs sont à corriger");
  await expect(page.getByText("Indiquez au moins un email ou un numéro WhatsApp.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Prénom")).toHaveAttribute("aria-invalid", "true");
  expect(requests).toEqual([]);
});

test("submits a valid sign-up and shows the confirmation", async ({ page }) => {
  const requests = await mockApi(page, 200, { ok: true, status: "subscribed" });
  await page.goto("/liste-d-attente");

  await fillValidForm(page);
  await page.getByRole("button", { name: "Rejoindre la liste d'attente" }).last().click();

  await expect(page.getByRole("heading", { name: "C'est noté, Ines !" })).toBeVisible();
  expect(requests[0]).toMatchObject({
    firstName: "Ines",
    whatsapp: "6 99 00 00 00",
    city: "douala",
    profile: "tenant",
    consent: true,
    locale: "fr",
  });
});

test("shows the server's field errors", async ({ page }) => {
  await mockApi(page, 400, { ok: false, error: "validation", fields: { whatsapp: "invalid_phone" } });
  await page.goto("/liste-d-attente");

  await fillValidForm(page);
  await page.getByRole("button", { name: "Rejoindre la liste d'attente" }).last().click();

  await expect(page.getByText("Ce numéro ne semble pas valide.", { exact: false })).toBeVisible();
});

test("shows a retry message when the service is down", async ({ page }) => {
  await mockApi(page, 502, { ok: false, error: "provider" });
  await page.goto("/liste-d-attente");

  await fillValidForm(page);
  await page.getByRole("button", { name: "Rejoindre la liste d'attente" }).last().click();

  await expect(page.getByRole("alert")).toContainText("n'a pas pu être enregistrée");
});

test("preselects the profile from the URL", async ({ page }) => {
  await page.goto("/liste-d-attente?profil=agent");
  await expect(page.getByLabel("Vous êtes")).toHaveValue("agent");
});

test("shows the confirmed state after double opt-in", async ({ page }) => {
  await page.goto("/en/waitlist?confirmed=1");
  await expect(page.getByText("Your sign-up is confirmed.", { exact: false })).toBeVisible();
});

test("legal pages flag missing company details", async ({ page }) => {
  await page.goto("/mentions-legales");
  await expect(page.getByText("[à compléter]").first()).toBeVisible();
});
