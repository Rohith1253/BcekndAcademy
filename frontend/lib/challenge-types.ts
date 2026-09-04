export type ChallengeDifficulty = "beginner" | "easy" | "medium" | "hard" | "advanced" | string;

export interface VisibleTestItem {
  name: string;
  description?: string;
  testCode?: string;
  expectedOutput?: any;
}

export interface CodingChallengeSummary {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: ChallengeDifficulty;
  language: string;
  supportedLanguages?: string[];
  xpReward: number;
  estimatedMinutes: number;
  order?: number;
  isCompleted?: boolean;
}

export interface CodingChallengeDetail extends CodingChallengeSummary {
  starterCode: string;
  solutionTemplate?: string;
  solutionCode?: string;
  instructions: string;
  hints?: string[];
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
  executionTime: number;
  logs?: ExecutionLog[];
  message?: string;
  unlockedAchievements?: any[];
  userLevelInfo?: any;
}

export interface SubmissionHistoryItem {
  _id: string;
  passed: boolean;
  status?: string;
  score: number;
  testsPassed: number;
  totalTests: number;
  earnedXP: number;
  submittedAt: string;
  code: string;
}

export interface CodingProgressStats {
  completedCount: number;
  totalChallenges: number;
  completionRate?: number;
  totalEarnedXP?: number;
  totalCodingXP?: number;
  currentStreak: number;
  languageBreakdown?: Record<string, number>;
}
