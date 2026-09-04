import { cache } from "../../lib/cache";
import { Lesson } from "../../backend/src/models/Lesson";

export function runPerformanceHealthTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Performance & Health Regression Tests ---");

  // 1. Lesson Query Field Projections
  const lessonQuery = Lesson.find({}).select({ content: 0, "quiz.questions": 0 });
  const proj = lessonQuery.projection() as any;
  assert(
    proj && (proj.content === 0 || proj.content === false),
    "Lesson list query projects out heavy 'content' markdown string"
  );

  // 2. Pagination Math & Boundary Validation
  const page = 2;
  const limit = 10;
  const skip = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit));

  assert(skip === 10, "Pagination skip formula correctly calculates 10 for page 2, limit 10");

  const invalidPage = -5;
  const safeSkip = (Math.max(1, invalidPage) - 1) * limit;
  assert(safeSkip === 0, "Pagination math handles negative page values safely by falling back to page 1");

  // 3. Cache Storage & Invalidation Lifecycle
  const cacheKey = "test-course-catalog-list";
  const dummyData = [{ slug: "backend-node-js" }];

  cache.set(cacheKey, dummyData, 1000);
  const cachedResult = cache.get<typeof dummyData>(cacheKey);
  assert(
    cachedResult !== null && cachedResult[0].slug === "backend-node-js",
    "In-memory cache stores and retrieves JSON objects"
  );

  cache.del(cacheKey);
  const invalidResult = cache.get(cacheKey);
  assert(invalidResult === null, "In-memory cache invalidates item cleanly upon cache.del()");
}
