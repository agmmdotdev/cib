import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    // Steps here
    let someComputedState = step.do("step1", async () => {
      return "step1";
    });

    // Optional: return state from our run() method
    return someComputedState;
  }
}
