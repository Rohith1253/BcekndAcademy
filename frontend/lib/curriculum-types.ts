/**
 * curriculum-types.ts
 *
 * Canonical Curriculum & Learning Path Architecture for Backend Academy.
 * Enforces explicit ordering (languageOrder, levelOrder, courseOrder, moduleOrder, lessonOrder)
 * and explicit execution support categorization.
 */

export type ExecutionSupportType = "interactive" | "guided" | "content-only";

export type DifficultyLevel = "foundation" | "beginner" | "intermediate" | "advanced";

export type PracticeType =
  | "concept-quiz"
  | "multiple-choice"
  | "predict-output"
  | "fix-bug"
  | "complete-code"
  | "code-challenge"
  | "debugging-challenge"
  | "backend-scenario";

export interface CurriculumLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  courseSlug: string;
  moduleSlug: string;
  language: string; // "agnostic" | "javascript" | "python" | "java" | "php" | "go"
  level: string; // e.g. "Level 0", "Level 1", "Level 2"
  levelOrder: number;
  courseOrder: number;
  moduleOrder: number;
  lessonOrder: number;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  prerequisites: string[]; // lesson slugs or course slugs
  learningObjectives: string[];
  concepts: string[];
  practiceAvailable: boolean;
  executionSupport: ExecutionSupportType;
  whyItMatters?: string;
  realWorldAnalogy?: string;
  codeSnippet?: string;
  commonMistakes?: string[];
  quickRecap?: string[];
  starterCode?: string;
  solutionCode?: string;
}

export interface CurriculumModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  courseSlug: string;
  moduleOrder: number;
  lessonCount: number;
  estimatedHours: number;
  learningObjectives: string[];
  lessons: CurriculumLesson[];
}

export interface CurriculumCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  language: string; // "agnostic" | "javascript" | "python" | "java" | "php" | "go"
  frameworks: string[];
  learningPath: string; // "universal-foundations" | "backend-javascript" | "backend-python" | "backend-java" | "backend-php" | "backend-go"
  difficulty: DifficultyLevel;
  level: string; // "Level 0: Foundation", "Level 1: Universal Fundamentals", "Level 2: Beginner", etc.
  levelNumber: number; // 0, 1, 2, 3, ...
  languageOrder: number; // 0 for agnostic, 1 for JS, 2 for Python, 3 for Java, 4 for PHP, 5 for Go
  levelOrder: number;
  courseOrder: number;
  instructor: string;
  estimatedHours: number;
  totalModules: number;
  totalLessons: number;
  totalXP: number;
  tags: string[];
  prerequisites: string[];
  whyItMatters: string;
  nextCourseSlug?: string;
  published: boolean;
  executionSupport: ExecutionSupportType;
  modules?: CurriculumModule[];
}

export interface CurriculumLanguage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  languageOrder: number;
  primaryFrameworks: string[];
  useCases: string[];
  difficulty: DifficultyLevel;
  executionSupport: ExecutionSupportType;
  executionNote: string;
  courses: CurriculumCourse[];
}

export interface PracticeExercise {
  id: string;
  slug: string;
  title: string;
  type: PracticeType;
  difficulty: DifficultyLevel;
  language: string;
  courseSlug: string;
  lessonSlug?: string;
  concepts: string[];
  question: string;
  prompt: string;
  starterCode?: string;
  expectedOutput?: string;
  hints: string[]; // progressive hints (Level 1: Concept, Level 2: Logic, Level 3: Implementation)
  solution?: string;
  explanation: string;
  options?: string[]; // for multiple choice
  correctOptionIndex?: number;
  executionSupport: ExecutionSupportType;
}

export interface UserLearningState {
  currentStage: "level-0-foundation" | "level-1-fundamentals" | "language-selection" | "language-track";
  selectedLanguage?: string;
  recommendedCourseSlug: string;
  recommendedLessonSlug?: string;
  completedCourseSlugs: string[];
  completedLessonSlugs: string[];
  overallProgressPercentage: number;
}
