import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { ExecutionRequest, ExecutionResponse, SUPPORTED_LANGUAGES } from "./types";

const PISTON_LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  csharp: { language: "csharp.net", version: "7.0.400" },
  go: { language: "go", version: "1.16.2" },
  php: { language: "php", version: "8.2.3" },
  rust: { language: "rust", version: "1.68.2" },
  ruby: { language: "ruby", version: "3.0.1" },
  kotlin: { language: "kotlin", version: "1.8.20" },
  elixir: { language: "elixir", version: "1.11.3" },
};

export class PistonExecutionProvider extends CodeExecutionProvider {
  name = "piston" as const;
  private apiUrl: string;
  private defaultTimeoutMs: number;

  constructor(apiUrl?: string, timeoutMs?: number) {
    super();
    this.apiUrl = apiUrl || process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";
    this.defaultTimeoutMs = timeoutMs || Number(process.env.CODE_EXECUTION_TIMEOUT_MS) || 5000;
  }

  async execute(request: ExecutionRequest): Promise<ExecutionResponse> {
    const { language, code, stdin = "", timeoutMs = this.defaultTimeoutMs } = request;
    const langLower = language.toLowerCase();

    if (!SUPPORTED_LANGUAGES.includes(langLower as any)) {
      return {
        status: "error",
        stdout: "",
        stderr: `Unsupported language: ${language}`,
        executionTime: 0,
        exitCode: 1,
        provider: this.name,
        executionMode: "sandboxed",
        language,
      };
    }

    const pistonLang = PISTON_LANGUAGE_MAP[langLower] || { language: langLower, version: "*" };
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.apiUrl}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: pistonLang.language,
          version: pistonLang.version,
          files: [{ content: code }],
          stdin,
          run_timeout: Math.round(timeoutMs / 1000),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutHandle);

      if (!response.ok) {
        throw new Error(`Piston API error: ${response.statusText} (HTTP ${response.status})`);
      }

      const data: any = await response.json();
      const executionTime = Date.now() - startTime;
      const runResult = data.run || {};
      const compileResult = data.compile || {};

      if (compileResult.code && compileResult.code !== 0) {
        return {
          status: "compilation_error",
          stdout: compileResult.stdout || "",
          stderr: compileResult.stderr || compileResult.output || "Compilation failed",
          executionTime,
          exitCode: compileResult.code,
          provider: this.name,
          executionMode: "sandboxed",
          language,
          compiled: false,
        };
      }

      const isError = runResult.code !== 0;
      return {
        status: isError ? "error" : "success",
        stdout: runResult.stdout || runResult.output || "",
        stderr: runResult.stderr || "",
        executionTime,
        exitCode: runResult.code ?? 0,
        provider: this.name,
        executionMode: "sandboxed",
        language,
        compiled: true,
      };
    } catch (err: any) {
      clearTimeout(timeoutHandle);
      const isTimeout = err.name === "AbortError";
      return {
        status: isTimeout ? "timeout" : "error",
        stdout: "",
        stderr: isTimeout
          ? `Execution timed out after ${timeoutMs}ms`
          : `Sandbox provider error: ${err.message || "Failed to reach execution sandbox"}`,
        executionTime: Date.now() - startTime,
        exitCode: 1,
        provider: this.name,
        executionMode: "sandboxed",
        language,
      };
    }
  }
}
