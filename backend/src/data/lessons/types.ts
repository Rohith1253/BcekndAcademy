export type ContentBlockType = "heading" | "paragraph" | "image" | "video" | "code" | "diagram" | "tip" | "warning" | "practice" | "example";

export interface ContentBlock {
  type: ContentBlockType;
  content?: string;
  level?: 1 | 2 | 3;
  src?: string;
  alt?: string;
  language?: string;
  filename?: string;
  code?: string;
  items?: string[];
  title?: string;
  data?: Record<string, unknown>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  correctOptionIndex?: number;
  explanation?: string;
}

export interface LessonData {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  xpReward: number;
  moduleId: number;
  moduleName: string;
  prerequisites: string[];
  skillsLearned: string[];
  content: ContentBlock[];
  quiz: QuizQuestion[];
}
