import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { ExecutionRequest, ExecutionResponse, SUPPORTED_LANGUAGES } from "./types";

export class MockExecutionProvider extends CodeExecutionProvider {
  name = "mock" as const;

  async execute(request: ExecutionRequest): Promise<ExecutionResponse> {
    const { language, code, timeoutMs = 2000 } = request;

    if (!SUPPORTED_LANGUAGES.includes(language.toLowerCase() as any)) {
      return {
        status: "error",
        stdout: "",
        stderr: `Unsupported language: ${language}. Supported languages are: ${SUPPORTED_LANGUAGES.join(", ")}`,
        executionTime: 0,
        exitCode: 1,
        provider: this.name,
        executionMode: "simulated",
        language,
      };
    }

    if (!code || !code.trim()) {
      return {
        status: "error",
        stdout: "",
        stderr: "Code content cannot be empty",
        executionTime: 0,
        exitCode: 1,
        provider: this.name,
        executionMode: "simulated",
        language,
      };
    }

    const startTime = Date.now();
    const simulatedOutput = this.simulateOutput(language.toLowerCase(), code);
    const executionTime = Math.min(Date.now() - startTime + Math.floor(Math.random() * 25) + 10, timeoutMs);

    return {
      status: "success",
      stdout: simulatedOutput,
      stderr: "",
      executionTime,
      exitCode: 0,
      provider: this.name,
      executionMode: "simulated",
      language,
    };
  }

  private simulateOutput(language: string, code: string): string {
    const lines = code.split("\n");
    const printLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      const jsMatch = trimmed.match(/console\.log\((['"`]?)(.*?)\1?\)/);
      if (jsMatch && jsMatch[2]) {
        printLines.push(jsMatch[2].replace(/['"`]/g, ""));
        continue;
      }
      const pyMatch = trimmed.match(/print\((['"]?)(.*?)\1?\)/);
      if (pyMatch && pyMatch[2]) {
        printLines.push(pyMatch[2].replace(/['"]/g, ""));
        continue;
      }
      const goMatch = trimmed.match(/fmt\.Print(?:ln|f)?\((['"]?)(.*?)\1?\)/);
      if (goMatch && goMatch[2]) {
        printLines.push(goMatch[2].replace(/['"]/g, ""));
        continue;
      }
    }

    if (printLines.length > 0) {
      return printLines.join("\n");
    }

    return `[Simulation Mode: ${language.toUpperCase()}] Code structured cleanly. Return/execution simulated successfully.`;
  }
}
