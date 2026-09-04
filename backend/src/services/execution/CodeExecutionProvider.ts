import { ExecutionRequest, ExecutionResponse, SUPPORTED_LANGUAGES, SupportedLanguage } from "./types";

export const MAX_CODE_SIZE_BYTES = 64 * 1024; // 64 KB limit

export abstract class CodeExecutionProvider {
  abstract readonly name: "mock" | "disabled" | "piston" | "judge0";

  abstract execute(request: ExecutionRequest): Promise<ExecutionResponse>;

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
