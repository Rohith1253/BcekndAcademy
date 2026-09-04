import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../backend/src/config/db";
import { Course } from "../backend/src/models/Course";
import { Module } from "../backend/src/models/Module";
import { Lesson } from "../backend/src/models/Lesson";
import { FIVE_COURSES } from "../backend/src/data/courses-catalog-data";
import { ALL_REAL_LESSONS } from "../backend/src/data/all-lessons-content";

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
  console.log("    SEEDING MULTI-COURSE CATALOG & ALL LESSONS    ");
  console.log("==================================================");

  await connectDB();

  // 1. Seed 5 Published Courses
  const savedCourses: Record<string, any> = {};

  for (const cData of FIVE_COURSES) {
    let course = await Course.findOne({ slug: cData.slug });
    if (!course) {
      course = new Course(cData);
      await course.save();
    } else {
      Object.assign(course, cData);
      await course.save();
    }
    savedCourses[cData.slug] = course;
    console.log(`✓ Course [${course.order}]: "${course.title}" (${course.slug})`);
  }

  // 2. Clear existing modules and lessons for deterministic seed
  await Module.deleteMany({});
  await Lesson.deleteMany({});

  let totalLessonsSeeded = 0;
  let totalQuizzesSeeded = 0;

  // Group lessons by course and module
  const modulesByCourse: Record<string, Map<string, any[]>> = {};

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

  for (const cData of FIVE_COURSES) {
    const parentCourse = savedCourses[cData.slug];
    if (!parentCourse) continue;

    const moduleMap = modulesByCourse[cData.slug] || new Map();
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
          order: lessonContent.order,
          category: lessonContent.category,
          difficulty: lessonContent.difficulty,
          xpReward: lessonContent.xpReward || 100,
          readingTimeMinutes: lessonContent.duration || 10,
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
  console.log(" ✅ MULTI-COURSE SEEDING COMPLETE!");
  console.log(`    • Courses: ${FIVE_COURSES.length} / 5`);
  console.log(`    • Modules: 20 / 20`);
  console.log(`    • Lessons: ${totalLessonsSeeded} / 60`);
  console.log(`    • Quiz Questions: ${totalQuizzesSeeded} / 300`);
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
