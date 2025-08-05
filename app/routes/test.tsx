import type { Route } from "./+types/test";

export async function loader({ context, request }: Route.LoaderArgs) {
  let url = new URL(request.url);

  // Get the status of an existing instance, if provided
  let id = url.searchParams.get("id");
  if (id) {
    let instance = await context.cloudflare.env.MY_WORKFLOW.get(id);
    const status = await instance.status();
    return Response.json(status);
  }
  return Response.json({
    message: "No instance id provided",
  });
}
