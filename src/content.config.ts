import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Legal pages, one Markdown file per locale: src/content/legal/{fr,en}/<page>.md.
 * Entry ids look like "fr/privacy". Company identifiers (RCCM, address, emails) are NOT
 * written here — LegalLayout reads them from settings/site.yaml.
 */
const legal = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    /** Shown as "provisional, pending validation" until the lawyer has reviewed the text. */
    draft: z.boolean().default(true),
  }),
});

export const collections = { legal };
