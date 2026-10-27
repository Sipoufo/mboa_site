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
    // eslint-plugin-astro's jsx-a11y config already registers the plugin; only add its rules for React islands.
    files: ["**/*.{jsx,tsx}"],
    languageOptions: jsxA11y.flatConfigs.recommended.languageOptions,
    rules: jsxA11y.flatConfigs.recommended.rules,
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
