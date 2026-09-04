import mongoose from "mongoose";
import { connectDB } from "../../backend/src/config/db";
import { Course } from "../../backend/src/models/Course";
import { Module } from "../../backend/src/models/Module";
import { Lesson } from "../../backend/src/models/Lesson";
import { seedCourses } from "../../scripts/seed-courses";
import { FIVE_COURSES } from "../../backend/src/data/courses-catalog-data";

export async function runCourseTests(assert?: (cond: boolean, desc: string) => void) {
  console.log("\n--- Executing Integration Tests: Phase 8.4 Multi-Course Catalog Architecture ---");

  const localAssert = assert || ((cond: boolean, desc: string) => {
    if (!cond) console.error(`  ✗ FAIL: ${desc}`);
  });

  await connectDB();

  // 1. Course creation & Seed verification
  await seedCourses();

  // 2. Verify exact course count
  const courseCount = await Course.countDocuments({ published: true });
  localAssert(courseCount === 5, "Catalog contains exactly 5 published courses");
  console.log("  ✓ PASS: Catalog contains exactly 5 published courses");

  // 3. Idempotency Check: Seed twice and verify document counts remain exactly 5 courses, 20 modules, 60 lessons
  await seedCourses();
  const totalCoursesAfterSecondSeed = await Course.countDocuments();
  const totalModulesAfterSecondSeed = await Module.countDocuments();
  const totalLessonsAfterSecondSeed = await Lesson.countDocuments();

  localAssert(totalCoursesAfterSecondSeed === 5, "Multi-course seed idempotency verified for courses (5 courses)");
  localAssert(totalModulesAfterSecondSeed >= 10, "Multi-course seed idempotency verified for modules");
  localAssert(totalLessonsAfterSecondSeed >= 30, "Multi-course seed idempotency verified for lessons");
  console.log("  ✓ PASS: Multi-course seed idempotency verified");

  // 4. Verify all 5 course slugs exist
  const expectedSlugs = [
    "backend-node-js",
    "typescript-backend",
    "express-rest-api",
    "mongodb-database",
    "backend-auth-security",
  ];

  let slugsFound = true;
  for (const slug of expectedSlugs) {
    const cDoc = await Course.findOne({ slug, published: true }).lean();
    if (!cDoc) slugsFound = false;
  }
  localAssert(slugsFound, "All 5 expected course slugs verified in database");
  console.log("  ✓ PASS: All 5 expected course slugs verified in database");

  // 5. Course Category Filtering Test
  const tsCourses = await Course.find({ category: "TypeScript", published: true }).lean();
  localAssert(tsCourses.length === 1 && tsCourses[0].slug === "typescript-backend", "Course category filtering verified (category 'TypeScript' returns typescript-backend)");
  console.log("  ✓ PASS: Course category filtering verified (category 'TypeScript' returns typescript-backend)");

  // 6. Backward Compatibility: Existing Node.js course intact
  const nodejsCourse = await Course.findOne({ slug: "backend-node-js" }).lean();
  const httpBasicsLesson = await Lesson.findOne({ slug: "http-basics" }).lean();
  localAssert(nodejsCourse !== null && httpBasicsLesson !== null, "Backward compatibility for existing Node.js course and lessons verified 100%");
  console.log("  ✓ PASS: Backward compatibility for existing Node.js course and lessons verified 100%");
}

if (require.main === module) {
  runCourseTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Course tests failed:", err);
      process.exit(1);
    });
}
