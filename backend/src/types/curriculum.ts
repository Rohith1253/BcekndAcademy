/**
 * curriculum.ts
 *
 * Canonical Curriculum & Learning Path Architecture for Backend Academy (Backend).
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
  language: string;
  level: string;
  levelOrder: number;
  courseOrder: number;
  moduleOrder: number;
  lessonOrder: number;
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  prerequisites: string[];
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
  language: string;
  frameworks: string[];
  learningPath: string;
  difficulty: DifficultyLevel;
  level: string;
  levelNumber: number;
  languageOrder: number;
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
  hints: string[];
  solution?: string;
  explanation: string;
  options?: string[];
  correctOptionIndex?: number;
  executionSupport: ExecutionSupportType;
}
