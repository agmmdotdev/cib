import { oc } from "@orpc/contract";
import { z } from "zod";

export const exampleContract = oc
  .input(
    z.object({
      name: z.string(),
      age: z.number().int().min(0),
    })
  )
  .output(
    z.object({
      id: z.number().int().min(0),
      name: z.string(),
      age: z.number().int().min(0),
    })
  );
