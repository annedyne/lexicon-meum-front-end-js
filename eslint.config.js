import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginBoundaries from "eslint-plugin-boundaries";

export default defineConfig([
    eslintPluginUnicorn.configs["flat/recommended"],
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
      import: eslintPluginImport,
      boundaries: eslintPluginBoundaries,
    },
    extends: ["js/recommended"],
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".mjs", ".cjs"],
        },
      },
      "boundaries/elements": [
        {
          type: "directory",
          pattern: "src/*",
          mode: "folder",
        },
      ],
    },
    rules: {
      // Warn when importing anything from another directory that's not from index.js
      "boundaries/element-types": [
        "warn",
        {
          default: "disallow",
          rules: [
            {
              from: ["directory"],
              // Allow only imports from index.js in other directories
              allow: ["index.js"],
            },
          ],
        },
      ],

      // Warn when a module/file name is used in an import when not needed
      // (i.e., importing from index.js explicitly instead of just the directory)
      "import/no-useless-path-segments": [
        "warn",
        {
          noUselessIndex: true,
        },
      ],

      // Warn when importing from a barrel (index.js) inside the same directory
      "import/no-self-import": "warn",
      
      // Additional rule to catch relative imports within same directory to index
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["./index", "./index.js"],
              message: "Do not import from the barrel file (index.js) within the same directory.",
            },
          ],
        },
      ],
        "unicorn/filename-case": [
            "error",
            {
                case: "kebabCase",
            }
        ],
        "unicorn/switch-case-braces": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
]);
