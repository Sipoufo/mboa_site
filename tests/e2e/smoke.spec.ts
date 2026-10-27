import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", lang: "fr" },
  { path: "/en", lang: "en" },
  { path: "/liste-d-attente", lang: "fr" },
  { path: "/en/waitlist", lang: "en" },
  { path: "/confidentialite", lang: "fr" },
  { path: "/en/privacy", lang: "en" },
  { path: "/mentions-legales", lang: "fr" },
  { path: "/en/legal-notice", lang: "en" },
];

for (const { path, lang } of pages) {
  test.describe(`page ${path}`, () => {
    test("renders without console errors, with SEO tags", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto(path);

      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
      expect(errors).toEqual([]);
    });

    test("has no accessibility violations", async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([]);
    });

    test("has no horizontal scroll", async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test("language switcher goes to the counterpart page", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "English" }).click();
  } else {
    await page.getByRole("banner").getByRole("link", { name: "English" }).click();
  }
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("mobile menu opens and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "Fermer le menu" }).click();
  await expect(menu).toBeHidden();
});

test("unknown pages return the bilingual 404", async ({ page }) => {
  const response = await page.goto("/cette-page-nexiste-pas");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("n'existe pas");
});

test.describe("reduced motion", () => {
  test.use({ colorScheme: "light", reducedMotion: "reduce" });

  test("reveal elements stay visible", async ({ page }) => {
    await page.goto("/");
    const hidden = await page.evaluate(
      () => [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
    await expect(page.locator("html")).not.toHaveClass(/js-reveal/);
  });
});
