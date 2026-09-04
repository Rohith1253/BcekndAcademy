import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { ExecutionRequest, ExecutionResponse } from "./types";

export class DisabledExecutionProvider extends CodeExecutionProvider {
  readonly name = "disabled" as const;

  protected async runExecution(request: ExecutionRequest): Promise<ExecutionResponse> {
    return {
      status: "error",
      stdout: "",
      stderr: "Code execution is currently disabled in this environment.",
      executionTime: 0,
      exitCode: 1,
      provider: this.name,
      language: request.language,
    };
  }
}
