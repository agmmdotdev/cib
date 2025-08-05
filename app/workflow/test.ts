import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
export class MyWorkflow extends WorkflowEntrypoint<Env, { amm: string }> {
  async run(event: WorkflowEvent<{ amm: string }>, step: WorkflowStep) {
    console.log("run");
    // Steps here
    let someComputedState = await step.do("step1", async () => {
      console.log("step1");
      return "step1";
    });
    let someComputedState2 = await step.do("step2", async () => {
      console.log("step2");
      return "step2";
    });
  }
}
