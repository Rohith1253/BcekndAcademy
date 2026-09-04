import { ExecutionRequest, ExecutionResponse, SUPPORTED_LANGUAGES, SupportedLanguage } from "./types";

export const MAX_CODE_SIZE_BYTES = 64 * 1024; // 64 KB limit

export abstract class CodeExecutionProvider {
  abstract readonly name: "mock" | "disabled" | "piston" | "judge0";

  /**
   * Validates language, code size, and executes with safety guarantees.
   */
  async execute(request: ExecutionRequest): Promise<ExecutionResponse> {
    const validatedLang = this.validateLanguage(request.language);
    if (!validatedLang) {
      return {
        status: "error",
        stdout: "",
        stderr: `Unsupported language: "${request.language}". Supported languages are: ${SUPPORTED_LANGUAGES.join(", ")}`,
        executionTime: 0,
        exitCode: 1,
        provider: this.name,
        language: request.language,
      };
    }

    if (!request.code || request.code.trim().length === 0) {
      return {
        status: "error",
        stdout: "",
        stderr: "Execution error: No code provided to execute.",
        executionTime: 0,
        exitCode: 1,
        provider: this.name,
        language: validatedLang,
      };
    }

    const codeBytes = Buffer.byteLength(request.code, "utf8");
    if (codeBytes > MAX_CODE_SIZE_BYTES) {
      return {
        status: "error",
        stdout: "",
        stderr: `Payload Too Large: Code size (${(codeBytes / 1024).toFixed(1)} KB) exceeds the maximum allowed limit of 64 KB.`,
        executionTime: 0,
        exitCode: 1,
        provider: this.name,
        language: validatedLang,
      };
    }

    return this.runExecution({
      ...request,
      language: validatedLang,
    });
  }

  protected abstract runExecution(request: ExecutionRequest): Promise<ExecutionResponse>;

  validateLanguage(lang: string): SupportedLanguage | null {
    if (!lang) return null;
    const normalized = lang.toLowerCase().trim();
    if (normalized === "js" || normalized === "node") return "javascript";
    if (normalized === "ts") return "typescript";
    if (normalized === "py") return "python";
    if (normalized === "cs" || normalized === "c#" || normalized === "dotnet") return "csharp";
    if (normalized === "golang") return "go";
    if (normalized === "rb") return "ruby";
    if (normalized === "kt") return "kotlin";
    if (normalized === "ex" || normalized === "exs") return "elixir";
    if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
      return normalized as SupportedLanguage;
    }
    return null;
  }
}
