import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { ExecutionRequest, ExecutionResponse } from "./types";

export class DisabledExecutionProvider extends CodeExecutionProvider {
  name = "disabled" as const;

  async execute(request: ExecutionRequest): Promise<ExecutionResponse> {
    return {
      status: "error",
      stdout: "",
      stderr: "Code execution is currently disabled by administrator configuration.",
      executionTime: 0,
      exitCode: 1,
      provider: this.name,
      executionMode: "simulated",
      language: request.language,
    };
  }
}
