import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Plain Vite config: Astro's getViteConfig() would load the Cloudflare plugin, which
// refuses Vitest's Node environment. Unit tests only cover framework-free modules.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
});
