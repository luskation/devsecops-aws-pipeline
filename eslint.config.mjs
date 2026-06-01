import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      globals: globals.browser
    },

    rules: {
      "no-var": "error",
      "eqeqeq": "error",
      "semi": ["error", "always"],
      "prefer-const": "error"
    }
  }
]);