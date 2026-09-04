import mongoose from "mongoose";
import { connectDB } from "../../backend/src/config/db";
import { User } from "../../backend/src/models/User";
import { CodingChallenge } from "../../backend/src/models/CodingChallenge";
import { CodingSubmission } from "../../backend/src/models/CodingSubmission";
import { executeCode, runTests, evaluateSubmission } from "../../backend/src/services/codeExecution.service";
import { hashPassword } from "../../backend/src/utils/auth";
import { INITIAL_CODING_CHALLENGES } from "../../backend/src/data/coding-challenges-data";

export async function runCodingChallengesIntegrationTests(
  assert: (condition: boolean, description: string) => void
) {
  console.log("\n--- Executing Integration Tests: Hands-On Coding Practice System ---");

  await connectDB();

  // 1. Verify Catalog Seeding & Count
  const totalChallenges = await CodingChallenge.countDocuments({ isPublished: true });
  assert(totalChallenges >= 15, `CodingChallenge catalog has at least 15 seeded challenges (Found: ${totalChallenges})`);

  // 2. Hidden Test Protection Verification
  const helloChallenge = await CodingChallenge.findOne({ slug: "create-hello-api-response" });
  assert(helloChallenge !== null, "Found 'create-hello-api-response' in MongoDB");
  assert((helloChallenge?.hiddenTests?.length || 0) > 0, "Challenge model contains backend-only hidden tests");

  // Verify that querying without hiddenTests strictly omits them
  const publicChallenge = await CodingChallenge.findOne({ slug: "create-hello-api-response" })
    .select("-hiddenTests")
    .lean();
  assert((publicChallenge as any).hiddenTests === undefined, "Hidden tests are protected and omitted from public projection");

  // 3. VM Sandbox Execution & Isolation Tests
  const logTestCode = `console.log("Testing console stream"); console.warn("A warning");`;
  const logOutcome = executeCode(logTestCode, 2000);
  assert(logOutcome.logs.length === 2, "Sandbox captures console logs in memory");
  assert(logOutcome.logs[0].message === "Testing console stream", "Log message content captured accurately");

  // 4. Sandbox Infinite Loop Defense
  const infiniteLoopCode = `while(true) {}`;
  const loopOutcome = executeCode(infiniteLoopCode, 500);
  assert(loopOutcome.error !== null, "Sandbox halts infinite loop safely within execution timeout");

  // 5. Sandbox Host Isolation Defense
  const hostileCode = `
try {
  const fs = require('fs');
} catch (e) {
  console.log('require blocked');
}
`;
  const hostileOutcome = executeCode(hostileCode, 1000);
  assert(hostileOutcome.error === null && hostileOutcome.logs[0]?.message === "require blocked", "Sandbox host process and require calls are blocked");

  // 6. Visible Tests Execution Test
  const correctHelloCode = `
function helloHandler(req, res) {
  return res.status(200).json({ message: "Hello Backend" });
}
`;
  const visibleRun = runTests(correctHelloCode, helloChallenge!.visibleTests, 2000);
  assert(visibleRun.testResults.every((t) => t.passed), "Visible tests pass for correct user solution");

  // 7. Full Evaluation & XP Anti-Farming Protection
  const testUser = new User({
    email: `coding.student.${Date.now()}@example.com`,
    password: await hashPassword("Password123!"),
    name: "Coding Student",
    totalXP: 0,
    currentLevel: 1,
  });
  await testUser.save();

  // First Attempt (Passing)
  const firstEval = await evaluateSubmission(testUser._id.toString(), helloChallenge!, correctHelloCode);
  assert(firstEval.success === true, "Submission marked as passed (score >= 70%)");
  assert(firstEval.score === 100, "Perfect solution achieves 100% score");
  assert(firstEval.earnedXP === helloChallenge!.xpReward, `First pass awards full XP reward (+${helloChallenge!.xpReward} XP)`);
  assert(firstEval.alreadyCompleted === false, "First pass flags alreadyCompleted as false");

  // Verify User totalXP increased in DB
  const updatedUser = await User.findById(testUser._id);
  assert(updatedUser?.totalXP === helloChallenge!.xpReward, `User totalXP updated in MongoDB (+${helloChallenge!.xpReward})`);

  // Second Attempt (Replay with same correct code)
  const secondEval = await evaluateSubmission(testUser._id.toString(), helloChallenge!, correctHelloCode);
  assert(secondEval.success === true, "Second submission evaluates as passed");
  assert(secondEval.alreadyCompleted === true, "Second pass flags alreadyCompleted as true (anti-farming)");
  assert(secondEval.earnedXP === 0, "Second pass awards 0 additional XP (anti-farming protection verified)");

  // Verify totalXP did not increase again
  const userAfterReplay = await User.findById(testUser._id);
  assert(userAfterReplay?.totalXP === helloChallenge!.xpReward, "User totalXP remains unchanged on duplicate submission");

  // 8. Submission History Persistence
  const submissionsCount = await CodingSubmission.countDocuments({
    userId: testUser._id,
    challengeSlug: helloChallenge!.slug,
  });
  assert(submissionsCount === 2, "Both submissions persisted in CodingSubmission history");
}
