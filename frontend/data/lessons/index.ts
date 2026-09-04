import type { LessonData } from "@/data/lessons/types";
import { ALL_REAL_LESSONS } from "@/data/all-lessons-content";

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

export function getLessonBySlug(slug: string): LessonData | null {
  return lessonDatabase[slug] || null;
}

export function getAllLessons(): LessonData[] {
  return Object.values(lessonDatabase);
}
