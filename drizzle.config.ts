import { defineConfig } from "drizzle-kit";
import { env } from "node:process";

export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL!,
    authToken: env.TURSO_AUTH_TOKEN!,
  },
});
