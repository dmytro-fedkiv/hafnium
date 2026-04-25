import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { livestoreDevtoolsPlugin } from "@livestore/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  worker: {
    format: "es",
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    livestoreDevtoolsPlugin({ schemaPath: "../../libs/livestore-schema/src/index.ts" }),
  ],
});
