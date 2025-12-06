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
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules, // <<— FIXED (no type info required)
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  {
    files: ["**/*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
