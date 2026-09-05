/**
 * learning-progression.ts
 *
 * Intelligent Learning Progression Engine for Backend Academy.
 * Strictly adheres to the pedagogical progression rules:
 * 1. ZERO KNOWLEDGE -> Level 0: Computer & Software Foundations
 * 2. Level 0 Completed -> Level 1: Universal Programming Fundamentals
 * 3. Level 1 Completed -> Language Selection (JS, Python, Java, PHP, Go)
 * 4. Language Selected -> First Course in Language Track
 */

import { CANONICAL_COURSES, getCourseBySlug } from "@/data/canonical-curriculum";
import { CANONICAL_LESSONS, getLessonsForCourse } from "@/data/canonical-lessons";
import type { UserLearningState, CurriculumCourse, CurriculumLesson } from "./curriculum-types";

export interface ProgressStateInput {
  completedCourseSlugs?: string[];
  completedLessonSlugs?: string[];
  selectedLanguage?: string;
}

export function computeNextLearningStep(input: ProgressStateInput): UserLearningState {
  const completedCourses = new Set(input.completedCourseSlugs || []);
  const completedLessons = new Set(input.completedLessonSlugs || []);

  const level0Slug = "computer-software-foundations";
  const level1Slug = "universal-programming-fundamentals";

  // Check Level 0 completion
  const level0Lessons = getLessonsForCourse(level0Slug);
  const isLevel0Complete =
    completedCourses.has(level0Slug) ||
    (level0Lessons.length > 0 && level0Lessons.every((l) => completedLessons.has(l.slug)));

  if (!isLevel0Complete) {
    const nextLesson = level0Lessons.find((l) => !completedLessons.has(l.slug)) || level0Lessons[0];
    return {
      currentStage: "level-0-foundation",
      selectedLanguage: undefined,
      recommendedCourseSlug: level0Slug,
      recommendedLessonSlug: nextLesson ? nextLesson.slug : undefined,
      completedCourseSlugs: Array.from(completedCourses),
      completedLessonSlugs: Array.from(completedLessons),
      overallProgressPercentage: Math.round(
        (level0Lessons.filter((l) => completedLessons.has(l.slug)).length /
          Math.max(1, level0Lessons.length)) *
          10
      ),
    };
  }

  // Check Level 1 completion
  const level1Lessons = getLessonsForCourse(level1Slug);
  const isLevel1Complete =
    completedCourses.has(level1Slug) ||
    (level1Lessons.length > 0 && level1Lessons.every((l) => completedLessons.has(l.slug)));

  if (!isLevel1Complete) {
    const nextLesson = level1Lessons.find((l) => !completedLessons.has(l.slug)) || level1Lessons[0];
    return {
      currentStage: "level-1-fundamentals",
      selectedLanguage: undefined,
      recommendedCourseSlug: level1Slug,
      recommendedLessonSlug: nextLesson ? nextLesson.slug : undefined,
      completedCourseSlugs: Array.from(completedCourses),
      completedLessonSlugs: Array.from(completedLessons),
      overallProgressPercentage: 15 + Math.round(
        (level1Lessons.filter((l) => completedLessons.has(l.slug)).length /
          Math.max(1, level1Lessons.length)) *
          15
      ),
    };
  }

  // Level 0 and Level 1 are complete. Now check if language is selected.
  const chosenLang = input.selectedLanguage || "javascript";
  const langCourses = CANONICAL_COURSES.filter(
    (c) => c.language === chosenLang && c.levelNumber >= 2
  ).sort((a, b) => a.courseOrder - b.courseOrder);

  if (langCourses.length === 0) {
    return {
      currentStage: "language-selection",
      selectedLanguage: undefined,
      recommendedCourseSlug: "javascript-foundations",
      recommendedLessonSlug: "js-variables-data-types",
      completedCourseSlugs: Array.from(completedCourses),
      completedLessonSlugs: Array.from(completedLessons),
      overallProgressPercentage: 30,
    };
  }

  // Find first incomplete course in the selected language track
  for (const course of langCourses) {
    if (!completedCourses.has(course.slug)) {
      const lessons = getLessonsForCourse(course.slug);
      const nextLesson = lessons.find((l) => !completedLessons.has(l.slug)) || lessons[0];
      return {
        currentStage: "language-track",
        selectedLanguage: chosenLang,
        recommendedCourseSlug: course.slug,
        recommendedLessonSlug: nextLesson ? nextLesson.slug : undefined,
        completedCourseSlugs: Array.from(completedCourses),
        completedLessonSlugs: Array.from(completedLessons),
        overallProgressPercentage: Math.min(
          95,
          30 + Math.round((completedCourses.size / Math.max(1, CANONICAL_COURSES.length)) * 70)
        ),
      };
    }
  }

  // All courses completed
  return {
    currentStage: "language-track",
    selectedLanguage: chosenLang,
    recommendedCourseSlug: langCourses[langCourses.length - 1]?.slug || "system-architecture-microservices",
    completedCourseSlugs: Array.from(completedCourses),
    completedLessonSlugs: Array.from(completedLessons),
    overallProgressPercentage: 100,
  };
}
