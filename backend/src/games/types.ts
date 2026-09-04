export type GameCategory =
  | "HTTP & APIs"
  | "Express & Routing"
  | "Database"
  | "Authentication"
  | "Debugging"
  | "Security";

export type GameDifficulty = "beginner" | "intermediate" | "advanced";

export type GameStarRating = "bronze" | "silver" | "gold" | "none";

export interface GameDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  xpReward: number;
  estimatedMinutes: number;
  moduleId: string;
  courseSlug: string;
  lessonSlug: string;
  instructions: string;
  gameType:
    | "http-status"
    | "api-flow"
    | "route-matcher"
    | "middleware-maze"
    | "database-puzzle"
    | "jwt-flow"
    | "bug-hunter"
    | "security-defender";
}

export interface GameScenario {
  id: string;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: string | number | string[];
  explanation: string;
  hints?: string[];
  wrongOptionExplanations?: Record<string, string>;
}

export interface GameSubmissionPayload {
  answers: Record<string, any>;
  timeSpent: number; // in seconds
  difficulty?: GameDifficulty;
}

export interface GameSubmissionResult {
  score: number; // 0 to 100
  passed: boolean;
  stars: GameStarRating;
  xpEarned: number;
  alreadyCompleted: boolean;
  correctAnswersCount: number;
  totalQuestions: number;
  breakdown: Array<{
    scenarioId: string;
    isCorrect: boolean;
    userAnswer: any;
    correctAnswer: any;
    explanation: string;
  }>;
  message: string;
}

export interface UserGameProgress {
  gameId: string;
  completed: boolean;
  score: number;
  stars: GameStarRating;
  attemptsCount: number;
  xpEarned: number;
}
