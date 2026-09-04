import type { LessonData } from "@/data/lessons/types";
import { ALL_REAL_LESSONS } from "@/data/all-lessons-content";
import { MULTI_LANGUAGE_LESSONS } from "@/data/multi-language-lessons-data";

const lessonDatabase: Record<string, LessonData> = {};

for (const lesson of ALL_REAL_LESSONS) {
  lessonDatabase[lesson.slug] = {
    id: lesson.slug,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty === "beginner" ? "Beginner" : lesson.difficulty === "intermediate" ? "Intermediate" : "Advanced",
    duration: lesson.duration,
    xpReward: lesson.xpReward,
    moduleId: lesson.moduleId,
    moduleName: lesson.moduleName,
    prerequisites: [],
    skillsLearned: lesson.learningPoints,
    content: lesson.content,
    quiz: lesson.quiz,
  };
}

for (const lesson of MULTI_LANGUAGE_LESSONS) {
  if (!lessonDatabase[lesson.slug]) {
    lessonDatabase[lesson.slug] = {
      id: lesson.slug,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description || lesson.summary,
      difficulty: lesson.difficulty === "beginner" ? "Beginner" : lesson.difficulty === "intermediate" ? "Intermediate" : "Advanced",
      duration: lesson.duration,
      xpReward: lesson.xpReward,
      moduleId: 1,
      moduleName: lesson.moduleName,
      prerequisites: [],
      skillsLearned: lesson.learningPoints || [],
      content: lesson.content as any,
      quiz: (lesson.quiz || []).map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correct: q.correctOptionIndex,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
      })),
    };
  }
}

export function getLessonBySlug(slug: string): LessonData | null {
  return lessonDatabase[slug] || null;
}

export function getAllLessons(): LessonData[] {
  return Object.values(lessonDatabase);
}
