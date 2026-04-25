import js from "@eslint/js";
import tseslint from "typescript-eslint";

const globals = {
  console: "readonly",
  document: "readonly",
  fetch: "readonly",
  module: "readonly",
  navigator: "readonly",
  process: "readonly",
  Request: "readonly",
  Response: "readonly",
  setTimeout: "readonly",
  URL: "readonly",
  window: "readonly",
};

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", ".nx/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];
