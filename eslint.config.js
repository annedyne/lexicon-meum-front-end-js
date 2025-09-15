import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";


export default defineConfig([
    ...eslintPluginUnicorn.configs.recommended,
    {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest, // exposes describe, it, beforeEach, vi, expect, etc.
      },
    },
    plugins: {
        js,
        unicorn: eslintPluginUnicorn,
    },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
]);
