import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Course } from "../models/Course";
import { Module } from "../models/Module";
import { Lesson } from "../models/Lesson";
import { ALL_COURSES } from "../data/multi-language-courses-data";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";

// Set of 12 lessons belonging to Course 1 (Backend Development with Node.js)
const COURSE1_SLUGS = new Set([
  "http-basics",
  "rest-apis",
  "http-methods-status-codes",
  "nodejs",
  "nodejs-modules",
  "npm-package-management",
  "express-fundamentals",
  "express-routing",
  "express-middleware",
  "mongodb-fundamentals",
  "mongoose-odm",
  "crud-apis",
]);

export async function seedMultiCourseCatalog() {
  console.log("==================================================");
  console.log("  SEEDING FULL MULTI-LANGUAGE BACKEND CURRICULUM  ");
  console.log("==================================================");

  await connectDB();

  // 1. Seed All 26 Multi-Language Courses
  const savedCourses: Record<string, any> = {};

  for (const cData of ALL_COURSES) {
    let course = await Course.findOne({ slug: cData.slug });
    if (!course) {
      course = new Course(cData);
      await course.save();
    } else {
      Object.assign(course, cData);
      await course.save();
    }
    savedCourses[cData.slug] = course;
    console.log(`✓ Course [${course.order}]: "${course.title}" (${course.slug}) [${course.language}]`);
  }

  // 2. Clear existing modules and lessons for clean deterministic seed
  await Module.deleteMany({});
  await Lesson.deleteMany({});

  let totalLessonsSeeded = 0;
  let totalQuizzesSeeded = 0;

  // Group lessons by course and module
  const modulesByCourse: Record<string, Map<string, any[]>> = {};

  // Process existing 60 core lessons
  ALL_REAL_LESSONS.forEach((lesson) => {
    let courseSlug = "backend-node-js";
    if (COURSE1_SLUGS.has(lesson.slug)) {
      courseSlug = "backend-node-js";
    } else if (lesson.slug.startsWith("ts-")) {
      courseSlug = "typescript-backend";
    } else if (
      lesson.slug.startsWith("express-") ||
      lesson.slug.startsWith("rest-") ||
      lesson.slug.startsWith("validation-") ||
      lesson.slug.startsWith("centralized-") ||
      lesson.slug.startsWith("api-") ||
      lesson.slug.startsWith("service-layer") ||
      lesson.slug.startsWith("production-api") ||
      lesson.slug.startsWith("logging-")
    ) {
      courseSlug = "express-rest-api";
    } else if (
      lesson.slug.startsWith("mongodb-") ||
      lesson.slug.startsWith("mongoose-") ||
      lesson.slug.startsWith("embedding-") ||
      lesson.slug.startsWith("schema-") ||
      lesson.slug.startsWith("database-") ||
      lesson.slug.startsWith("indexes-") ||
      lesson.slug.startsWith("aggregation-") ||
      lesson.slug.startsWith("large-dataset-") ||
      lesson.slug.startsWith("relationships-") ||
      lesson.slug.startsWith("transactions-")
    ) {
      courseSlug = "mongodb-database";
    } else if (
      lesson.slug.startsWith("auth-") ||
      lesson.slug.startsWith("password-") ||
      lesson.slug.startsWith("sessions-") ||
      lesson.slug.startsWith("jwt-") ||
      lesson.slug.startsWith("access-") ||
      lesson.slug.startsWith("token-") ||
      lesson.slug.startsWith("input-") ||
      lesson.slug.startsWith("nosql-") ||
      lesson.slug.startsWith("rate-") ||
      lesson.slug.startsWith("rbac-") ||
      lesson.slug.startsWith("ownership-") ||
      lesson.slug.startsWith("secure-")
    ) {
      courseSlug = "backend-auth-security";
    }

    if (!modulesByCourse[courseSlug]) {
      modulesByCourse[courseSlug] = new Map();
    }
    const moduleMap = modulesByCourse[courseSlug];
    if (!moduleMap.has(lesson.moduleSlug)) {
      moduleMap.set(lesson.moduleSlug, []);
    }
    moduleMap.get(lesson.moduleSlug)!.push(lesson);
  });

  // Process new multi-language lessons
  MULTI_LANGUAGE_LESSONS.forEach((lesson) => {
    const courseSlug = lesson.courseSlug;
    if (!modulesByCourse[courseSlug]) {
      modulesByCourse[courseSlug] = new Map();
    }
    const moduleMap = modulesByCourse[courseSlug];
    if (!moduleMap.has(lesson.moduleSlug)) {
      moduleMap.set(lesson.moduleSlug, []);
    }
    moduleMap.get(lesson.moduleSlug)!.push(lesson);
  });

  // Ensure every course has at least baseline modules if not populated
  for (const cData of ALL_COURSES) {
    const parentCourse = savedCourses[cData.slug];
    if (!parentCourse) continue;

    let moduleMap = modulesByCourse[cData.slug];
    if (!moduleMap || moduleMap.size === 0) {
      moduleMap = new Map();
      moduleMap.set(`${cData.slug}-module-1`, [
        {
          title: `${cData.title} - Core Architecture`,
          slug: `${cData.slug}-intro`,
          description: `Introduction to ${cData.title}`,
          moduleSlug: `${cData.slug}-module-1`,
          moduleName: `${cData.title} Foundations`,
          order: 1,
          category: cData.category,
          difficulty: cData.difficulty,
          xpReward: 100,
          duration: 15,
          content: [
            {
              type: "text",
              title: `Introduction to ${cData.title}`,
              body: cData.description,
            },
            {
              type: "code",
              title: "Initial Code Architecture",
              language: cData.language === "csharp" ? "csharp" : cData.language,
              code: cData.codeSnippet || "// Production server configuration",
            },
          ],
          quiz: [
            {
              id: `${cData.slug}-q1`,
              question: `What is the primary architectural focus of ${cData.title}?`,
              options: [
                cData.shortDescription,
                "Front-end CSS styling",
                "Mobile UI layouts",
                "Desktop window managers",
              ],
              correctOptionIndex: 0,
              explanation: `${cData.title} focuses on ${cData.shortDescription.toLowerCase()}.`,
            },
          ],
        },
      ]);
    }

    let modOrder = 1;
    for (const [modSlug, lessons] of moduleMap.entries()) {
      const firstLesson = lessons[0];
      const moduleDoc = new Module({
        courseId: parentCourse._id,
        title: firstLesson.moduleName || `Module ${modOrder}`,
        description: `Master ${firstLesson.moduleName || modSlug}`,
        slug: modSlug,
        order: modOrder++,
      });
      await moduleDoc.save();
      console.log(`  ✓ Module [${moduleDoc.order}]: "${moduleDoc.title}" (${moduleDoc.slug})`);

      for (const lessonContent of lessons) {
        const lessonDoc = new Lesson({
          courseId: parentCourse._id,
          moduleId: moduleDoc._id,
          title: lessonContent.title,
          description: lessonContent.description || lessonContent.summary || lessonContent.title,
          slug: lessonContent.slug,
          order: lessonContent.order || 1,
          category: lessonContent.category || parentCourse.category,
          difficulty: lessonContent.difficulty || parentCourse.difficulty,
          xpReward: lessonContent.xpReward || 100,
          readingTimeMinutes: lessonContent.duration || 12,
          summary: lessonContent.description || lessonContent.summary,
          content: lessonContent.content,
          contentSections: lessonContent.content,
          quiz: {
            title: `${lessonContent.title} Quiz`,
            questions: lessonContent.quiz || [],
          },
          published: true,
        });

        await lessonDoc.save();
        totalLessonsSeeded++;
        totalQuizzesSeeded += lessonContent.quiz?.length || 0;
        console.log(
          `    • Lesson [${lessonDoc.order}]: "${lessonDoc.title}" (${lessonDoc.slug}) - ${
            lessonContent.quiz?.length || 0
          } Quizzes`
        );
      }
    }
  }

  console.log("\n==================================================");
  console.log(" ✅ MULTI-LANGUAGE CURRICULUM SEEDING COMPLETE!");
  console.log(`    • Total Courses: ${ALL_COURSES.length}`);
  console.log(`    • Total Lessons Seeded: ${totalLessonsSeeded}`);
  console.log(`    • Total Quiz Questions Seeded: ${totalQuizzesSeeded}`);
  console.log("==================================================");
}

export const seedCourses = seedMultiCourseCatalog;

if (require.main === module) {
  seedMultiCourseCatalog()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Multi-course seeding error:", err);
      process.exit(1);
    });
}
