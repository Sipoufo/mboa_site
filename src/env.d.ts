/// <reference types="astro/client" />

declare module "cloudflare:workers" {
  /** Worker bindings: wrangler.jsonc `vars` + secrets (`wrangler secret put`), `.dev.vars` locally. */
  export const env: import("@/lib/forms/handlers").FormsEnv & Record<string, string | undefined>;
}

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_CF_ANALYTICS_TOKEN?: string;
}

declare module "*.yaml?raw" {
  const content: string;
  export default content;
}
