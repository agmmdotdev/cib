import { createRequestHandler } from "react-router";
// Re-export the Workflow class so that Wrangler can detect it and include it in the Worker bundle
export { MyWorkflow } from "~/workflow/test";
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
