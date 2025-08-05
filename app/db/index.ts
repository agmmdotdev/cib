import { drizzle } from "drizzle-orm/libsql";
import { env } from "cloudflare:workers";
import * as authSchema from "./schema/auth";

export const db = drizzle({
  schema: authSchema,
  logger: true,
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
