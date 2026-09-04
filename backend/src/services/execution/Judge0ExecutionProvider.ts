import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { ExecutionRequest, ExecutionResponse, SUPPORTED_LANGUAGES } from "./types";

// Standard Judge0 language IDs
const JUDGE0_LANGUAGE_ID_MAP: Record<string, number> = {
  javascript: 63, // Node.js
  typescript: 74, // TypeScript
  python: 71, // Python 3
  java: 62, // OpenJDK
  csharp: 51, // C# Mono
  go: 60, // Go
  php: 68, // PHP
  rust: 73, // Rust
  ruby: 72, // Ruby
  kotlin: 78, // Kotlin
  elixir: 57, // Elixir
};

export class Judge0ExecutionProvider extends CodeExecutionProvider {
  name = "judge0" as const;
  private apiUrl: string;
  private apiKey?: string;
  private maxPollAttempts: number;
  private pollIntervalMs: number;

  constructor() {
    super();
    this.apiUrl = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
    this.apiKey = process.env.JUDGE0_API_KEY;
    this.maxPollAttempts = Number(process.env.JUDGE0_MAX_POLL_ATTEMPTS) || 10;
    this.pollIntervalMs = Number(process.env.JUDGE0_POLL_INTERVAL_MS) || 500;
  }

  async execute(request: ExecutionRequest): Promise<ExecutionResponse> {
    const { language, code, stdin = "", timeoutMs = 5000 } = request;
    const langLower = language.toLowerCase();

    const languageId = JUDGE0_LANGUAGE_ID_MAP[langLower];
    if (!languageId) {
      return {
        status: "error",
        stdout: "",
        stderr: `Unsupported language for Judge0: ${language}`,
        executionTime: 0,
        exitCode: 1,
        provider: this.name,
        executionMode: "sandboxed",
        language,
      };
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers["X-RapidAPI-Key"] = this.apiKey;
      headers["X-RapidAPI-Host"] = new URL(this.apiUrl).host;
    }

    const startTime = Date.now();

    try {
      // 1. Submit code
      const subRes = await fetch(`${this.apiUrl}/submissions?base64_encoded=false&wait=false`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin,
          cpu_time_limit: Math.round(timeoutMs / 1000),
        }),
      });

      if (!subRes.ok) {
        throw new Error(`Judge0 submission error: ${subRes.statusText}`);
      }

      const subData: any = await subRes.json();
      const token = subData.token;
      if (!token) {
        throw new Error("Judge0 did not return a submission token");
      }

      // 2. Poll for results
      let attempts = 0;
      while (attempts < this.maxPollAttempts) {
        await new Promise((r) => setTimeout(r, this.pollIntervalMs));
        attempts++;

        const pollRes = await fetch(`${this.apiUrl}/submissions/${token}?base64_encoded=false`, {
          headers,
        });

        if (!pollRes.ok) continue;

        const pollData: any = await pollRes.json();
        const statusId = pollData.status?.id;

        // Status 1 = In Queue, 2 = Processing
        if (statusId === 1 || statusId === 2) {
          continue;
        }

        // Status 3 = Accepted
        const executionTime = Math.round(parseFloat(pollData.time || "0") * 1000) || (Date.now() - startTime);

        if (statusId === 3) {
          return {
            status: "success",
            stdout: pollData.stdout || "",
            stderr: pollData.stderr || "",
            executionTime,
            exitCode: 0,
            provider: this.name,
            executionMode: "sandboxed",
            language,
          };
        } else if (statusId === 6) {
          // Compilation error
          return {
            status: "compilation_error",
            stdout: "",
            stderr: pollData.compile_output || "Compilation error",
            executionTime,
            exitCode: 1,
            provider: this.name,
            executionMode: "sandboxed",
            language,
          };
        } else if (statusId === 5) {
          // Time limit exceeded
          return {
            status: "timeout",
            stdout: pollData.stdout || "",
            stderr: "Time limit exceeded",
            executionTime,
            exitCode: 1,
            provider: this.name,
            executionMode: "sandboxed",
            language,
          };
        } else {
          return {
            status: "error",
            stdout: pollData.stdout || "",
            stderr: pollData.stderr || pollData.message || pollData.status?.description || "Runtime error",
            executionTime,
            exitCode: 1,
            provider: this.name,
            executionMode: "sandboxed",
            language,
          };
        }
      }

      return {
        status: "timeout",
        stdout: "",
        stderr: `Judge0 polling exceeded maximum attempts (${this.maxPollAttempts})`,
        executionTime: Date.now() - startTime,
        exitCode: 1,
        provider: this.name,
        executionMode: "sandboxed",
        language,
      };
    } catch (err: any) {
      return {
        status: "error",
        stdout: "",
        stderr: `Judge0 provider error: ${err.message || "Failed to reach Judge0"}`,
        executionTime: Date.now() - startTime,
        exitCode: 1,
        provider: this.name,
        executionMode: "sandboxed",
        language,
      };
    }
  }
}
