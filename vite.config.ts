import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["**/dist/**", "**/node_modules/**", "apps/web/src/routeTree.gen.ts"],
    semi: true,
    singleQuote: false,
    sortPackageJson: true,
  },
  lint: {
    ignorePatterns: ["**/dist/**", "**/node_modules/**", "apps/web/src/routeTree.gen.ts"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["**/*.{ts,tsx}"],
        globals: {
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
        },
        rules: {
          "typescript/no-empty-object-type": "off",
          "typescript/no-explicit-any": "off",
        },
      },
    ],
  },
});
