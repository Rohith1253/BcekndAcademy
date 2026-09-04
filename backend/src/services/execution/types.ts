export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "go"
  | "php"
  | "rust"
  | "ruby"
  | "kotlin"
  | "elixir";

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "php",
  "rust",
  "ruby",
  "kotlin",
  "elixir",
];

export interface ExecutionRequest {
  language: string;
  code: string;
  stdin?: string;
  timeoutMs?: number;
}

export interface ExecutionLog {
  type: "log" | "error" | "warn" | "info";
  message: string;
}

export interface ExecutionResponse {
  status: "success" | "error" | "timeout" | "compilation_error";
  stdout: string;
  stderr: string;
  executionTime: number;
  exitCode: number;
  provider: "mock" | "disabled" | "piston" | "judge0";
  language: string;
  compiled?: boolean;
}

export interface TestCase {
  name: string;
  description?: string;
  testCode: string;
  expectedOutput?: any;
}

export interface TestCaseResult {
  name: string;
  description?: string;
  passed: boolean;
  expected?: any;
  received?: any;
  error?: string;
  executionTime?: number;
}

export interface ChallengeEvaluationResult {
  status: "passed" | "failed" | "error";
  score: number;
  passedTests: number;
  totalTests: number;
  earnedXP: number;
  alreadyCompleted: boolean;
  visibleTestResults: TestCaseResult[];
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  executionTime: number;
  logs: ExecutionLog[];
  message: string;
  provider: "mock" | "disabled" | "piston" | "judge0";
}
