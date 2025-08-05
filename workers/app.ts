import { createRequestHandler } from "react-router";
import { db } from "~/db";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: typeof db;
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
      db: db,
    });
  },
} satisfies ExportedHandler<Env>;
