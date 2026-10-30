// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.PUBLIC_SITE_URL ?? "https://mboacm.com";

export default defineConfig({
  site,
  trailingSlash: "never",
  // "/en/index.astro" → "/en.html", served at "/en" (no trailing slash, no redirect).
  build: { format: "file" },
  // No sessions: nothing on the site needs them, and leaving them on makes the adapter
  // require a "SESSION" KV namespace on the Worker.
  session: false,
  adapter: cloudflare({
    // Images are optimized once at build time — no runtime image binding needed.
    imageService: "compile",
  }),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: "fr",
        locales: { fr: "fr-CM", en: "en-CM" },
      },
    }),
  ],
  i18n: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Plus Jakarta Sans",
      cssVariable: "--font-jakarta",
      weights: [600, 700, 800],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/carte': '/liste-d-attente?source=carte'
  }
});
