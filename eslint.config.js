// eslint.config.js (ESM)
import js from "@eslint/js";
import { defineFlatConfig } from "eslint-define-config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default defineFlatConfig([
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**"],
  },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript plugin + parser WITHOUT extends
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules, // safe for flat config
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // React rules (manual, because eslint-config-next cannot be used)
  {
    files: ["**/*.tsx"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
]);
