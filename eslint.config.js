import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const nodeGlobals = { process: "readonly", Buffer: "readonly", console: "readonly" };

export default defineConfig(
  { ignores: ["dist/", ".astro/", ".wrangler/", "node_modules/", "playwright-report/", "test-results/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  astro.configs["jsx-a11y-recommended"],
  {
    files: ["**/*.{jsx,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ["*.config.{js,mjs,ts}", "scripts/**/*.{js,mjs}"],
    languageOptions: { globals: nodeGlobals },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
