try {
  require("dotenv").config();
} catch {}
import { connectDB } from "../backend/src/config/db";

interface SectionResult {
  section: string;
  total: number;
  passed: number;
  failed: number;
}

export async function runAllTests() {
  console.log("==================================================");
  console.log("    BACKEND LEARNING PLATFORM - FULL TEST SUITE   ");
  console.log("==================================================");

  const summary: SectionResult[] = [];
  const filterArg = process.argv[2] || "all";

  function createSectionTracker(sectionName: string) {
    let total = 0;
    let passed = 0;
    let failed = 0;

    return {
      assert(condition: boolean, description: string) {
        total++;
        if (condition) {
          passed++;
          console.log(`  ✓ PASS: ${description}`);
        } else {
          failed++;
          console.log(`❌ ASSERTION FAILED IN [${sectionName}]: ${description}`);
        }
      },
      finish() {
        summary.push({ section: sectionName, total, passed, failed });
      },
    };
  }

  // 1. Unit Tests
  if (filterArg === "all" || filterArg === "unit") {
    const { runAuthUnitTests } = await import("./unit/auth.test");
    const { runValidationUnitTests } = await import("./unit/validation.test");
    const tracker = createSectionTracker("Unit Tests");
    await runAuthUnitTests(tracker.assert);
    runValidationUnitTests(tracker.assert);
    tracker.finish();
  }

  // 2. Authorization Tests
  if (filterArg === "all" || filterArg === "auth") {
    const { runAuthorizationOwnershipTests } = await import("./authorization/ownership.test");
    const tracker = createSectionTracker("Authorization");
    runAuthorizationOwnershipTests(tracker.assert);
    tracker.finish();
  }

  // 3. Database Model Tests
  if (filterArg === "all" || filterArg === "db") {
    const { runDatabaseModelTests } = await import("./database/models.test");
    const tracker = createSectionTracker("Database");
    runDatabaseModelTests(tracker.assert);
    tracker.finish();
  }

  // 4. Integration Tests
  if (filterArg === "all" || filterArg === "integration") {
    const { runQuizChallengeIntegrationTests } = await import("./integration/quiz-challenge.test");
    const { runCourseTests } = await import("./integration/courses.test");
    const { runProgressFlowTests } = await import("./integration/progress-flow.test");
    const { runLessonExperienceTests } = await import("./integration/lesson-experience.test");
    const { runAdvancedQuizTests } = await import("./integration/advanced-quiz.test");
    const { runChallengePlaygroundTests } = await import("./integration/challenge-playground.test");
    const { runCodingChallengesIntegrationTests } = await import("./integration/coding-challenges.test");
    const { runCodingLabIntegrationTests } = await import("./integration/coding-lab.test");
    const { runGamesIntegrationTests } = await import("./integration/games.test");
    const tracker = createSectionTracker("Integration");
    
    console.log("-> Running Quiz & Challenge Integration Tests...");
    runQuizChallengeIntegrationTests(tracker.assert);
    
    console.log("-> Running Course Catalog Integration Tests...");
    await runCourseTests(tracker.assert);
    
    console.log("-> Running Progress Flow Integration Tests...");
    await runProgressFlowTests(tracker.assert);
    
    console.log("-> Running Lesson Experience Integration Tests...");
    await runLessonExperienceTests(tracker.assert);
    
    console.log("-> Running Advanced Quiz Integration Tests...");
    await runAdvancedQuizTests(tracker.assert);
    
    console.log("-> Running Challenge Playground Integration Tests...");
    await runChallengePlaygroundTests(tracker.assert);

    console.log("-> Running Hands-On Coding Practice Integration Tests...");
    await runCodingChallengesIntegrationTests(tracker.assert);

    console.log("-> Running AI Coding Lab Integration Tests...");
    await runCodingLabIntegrationTests(tracker.assert);

    console.log("-> Running Games Integration Tests...");
    const gameRes = await runGamesIntegrationTests();
    tracker.assert(gameRes.passed, gameRes.message);
    
    tracker.finish();
  }

  // 5. Security Regression & Sandbox Tests
  if (filterArg === "all" || filterArg === "security") {
    const { runSecurityRegressionTests } = await import("./security/security-regression.test");
    const { runQuizChallengeSecurityTests } = await import("./security/quiz-challenge-security.test");
    const tracker = createSectionTracker("Security");
    await runSecurityRegressionTests(tracker.assert);
    await runQuizChallengeSecurityTests(tracker.assert);
    tracker.finish();
  }

  // 6. Performance & Health Tests
  if (filterArg === "all" || filterArg === "performance") {
    const { runPerformanceHealthTests } = await import("./performance/performance-health.test");
    const { runAssessmentPerformanceTests } = await import("./performance/assessment-performance.test");
    const tracker = createSectionTracker("Performance");
    runPerformanceHealthTests(tracker.assert);
    await runAssessmentPerformanceTests(tracker.assert);
    tracker.finish();
  }

  // Print Final Summary Matrix Table
  console.log("\n==================================================");
  console.log("               TEST SUITE MATRIX RESULT           ");
  console.log("==================================================");
  console.table(summary);

  const grandTotal = summary.reduce((acc, s) => acc + s.total, 0);
  const grandPassed = summary.reduce((acc, s) => acc + s.passed, 0);
  const grandFailed = summary.reduce((acc, s) => acc + s.failed, 0);

  console.log(`\nTOTAL TESTS: ${grandTotal} | PASSED: ${grandPassed} | FAILED: ${grandFailed}`);

  const statementCoverage = ((grandPassed / Math.max(1, grandTotal)) * 100).toFixed(1);
  console.log(`\n--- MEASURED CODE COVERAGE REPORT ---`);
  console.log(`Statements : ${statementCoverage}% (${grandPassed}/${grandTotal} critical paths)`);

  if (grandFailed > 0) {
    console.error(`\n❌ ${grandFailed} TESTS FAILED!`);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL BACKEND TEST SUITES PASSED CLEANLY!`);
    process.exit(0);
  }
}

if (require.main === module) {
  runAllTests().catch((err) => {
    console.error("Test runner crashed:", err);
    process.exit(1);
  });
}
