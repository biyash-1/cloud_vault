// eslint.config.mjs

import next from "eslint-plugin-next";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules/", ".next/", "dist/"],
    
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      next,
    },

    rules: {
      // Next.js recommended rules
      ...next.configs.recommended.rules,
    },
  },
];
