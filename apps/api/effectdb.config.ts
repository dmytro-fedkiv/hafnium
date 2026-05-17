import { defineConfig } from "effect-db";

export default defineConfig({
  dialect: "postgres",
  db: {
    url: process.env.POSTGRES_URL,
  },
  source: {
    include: ["src/database/schema/*.ts"],
  },
  migrations: {
    dir: "migrations",
    table: "migrations",
  },
  safety: {
    nonDestructiveDefault: true,
  },
});
