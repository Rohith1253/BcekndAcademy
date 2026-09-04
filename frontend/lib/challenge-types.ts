export type ChallengeDifficulty = "easy" | "medium" | "hard";

export interface VisibleTestItem {
  name: string;
  description?: string;
  testCode?: string;
  expectedOutput?: any;
}

export interface CodingChallengeSummary {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: ChallengeDifficulty;
  language: string;
  xpReward: number;
  estimatedMinutes: number;
  order: number;
  isCompleted?: boolean;
}

export interface CodingChallengeDetail extends CodingChallengeSummary {
  starterCode: string;
  solutionTemplate?: string;
  instructions: string;
  visibleTests: VisibleTestItem[];
}

export interface TestRunResult {
  name: string;
  description?: string;
  passed: boolean;
  expected?: any;
  received?: any;
  error?: string;
}

export interface ExecutionLog {
  type: "log" | "error" | "warn" | "info";
  message: string;
}

export interface RunCodeResponse {
  results: TestRunResult[];
  logs: ExecutionLog[];
  executionTime: number;
}

export interface SubmitSolutionResponse {
  passed: boolean;
  score: number;
  testsPassed: number;
  totalTests: number;
  earnedXP: number;
  alreadyCompleted: boolean;
  visibleResults: TestRunResult[];
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  logs: ExecutionLog[];
  executionTime: number;
  message: string;
}

export interface SubmissionHistoryItem {
  _id: string;
  challengeSlug: string;
  status: "passed" | "failed" | "error";
  score: number;
  testsPassed: number;
  totalTests: number;
  earnedXP: number;
  executionTime: number;
  submittedAt: string;
  code: string;
}

export interface CodingProgressStats {
  totalChallenges: number;
  completedCount: number;
  totalCodingXP: number;
  currentStreak: number;
  userLevel: number;
}
