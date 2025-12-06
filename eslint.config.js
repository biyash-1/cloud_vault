// eslint.config.js
import js from "@eslint/js";
import { defineFlatConfig } from "eslint-define-config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default defineFlatConfig([
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**"],
  },

  js.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        File: "readonly",
        URL: "readonly",
        alert: "readonly",
        HTMLFormElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLDivElement: "readonly",

        // Node globals
        process: "readonly",
        Buffer: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        NodeJS: "readonly",
      },
    },

    env: {
      browser: true,
      node: true,
      es2024: true,
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      ...tsPlugin.configs.recommended.rules, // NO TYPE CHECKING NEEDED
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
