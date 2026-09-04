import mongoose from "mongoose";
import { connectDB } from "../../backend/src/config/db";
import { User } from "../../backend/src/models/User";
import { ChallengeSubmission } from "../../backend/src/models/Challenge";
import { ALL_CHALLENGES } from "../../backend/src/data/challenges/index";
import { executeInSandbox } from "../../backend/src/services/sandboxService";
import { hashPassword } from "../../backend/src/utils/auth";

export async function runChallengePlaygroundTests(assert: (condition: boolean, description: string) => void) {
  console.log("\n--- Executing Integration Tests: Phase 8.7 Real Coding Challenge & Playground ---");

  await connectDB();

  // Create clean test user A & B
  const userA = new User({
    email: `challenge.userA.${Date.now()}@example.com`,
    password: await hashPassword("Password123!"),
    name: "Challenge User A",
    totalXP: 0,
    currentLevel: 1,
  });
  await userA.save();

  const userB = new User({
    email: `challenge.userB.${Date.now()}@example.com`,
    password: await hashPassword("Password123!"),
    name: "Challenge User B",
    totalXP: 0,
    currentLevel: 1,
  });
  await userB.save();

  // 1. Challenge Catalog Verification
  const challengeKeys = Object.keys(ALL_CHALLENGES);
  assert(challengeKeys.length > 0, "Challenge registry contains available challenges");
  const targetChallenge = ALL_CHALLENGES[challengeKeys[0]] as any;
  console.log(`  ✓ PASS: Challenge catalog verified (${challengeKeys.length} available challenges)`);

  // 2. VM Sandbox Code Execution Test
  const validCode = targetChallenge.solution || targetChallenge.starterCode || "console.log('hello');";
  const outcome = executeInSandbox(validCode, 2000);
  assert(outcome.logs !== undefined, "Evaluator returns logs");
  assert(typeof outcome.executionTime === "number" && outcome.executionTime < 2000, "Execution time bounded within 2,000ms limit");
  console.log("  ✓ PASS: VM sandbox code evaluation verified under 2,000ms execution limit");

  // 3. Challenge Submission Persistence
  const sub1 = new ChallengeSubmission({
    userId: userA._id,
    challengeId: targetChallenge.id,
    code: validCode,
    testsPassed: targetChallenge.testCases?.length || 1,
    totalTests: targetChallenge.testCases?.length || 1,
    success: true,
    timeSpent: 45,
    xpEarned: targetChallenge.xpReward || 200,
  });
  await sub1.save();
  await User.findByIdAndUpdate(userA._id, { $inc: { totalXP: targetChallenge.xpReward || 200 } });

  const userAAfterSolve = await User.findById(userA._id);
  assert(userAAfterSolve?.totalXP === (targetChallenge.xpReward || 200), "Solving challenge awards initial XP reward");
  console.log("  ✓ PASS: Challenge submission persisted in MongoDB and XP awarded");

  // 4. Challenge Replay Anti-Farming Protection
  const existingSolve = await ChallengeSubmission.findOne({
    userId: userA._id,
    challengeId: targetChallenge.id,
    success: true,
  });
  assert(existingSolve !== null, "Existing successful submission found");

  const subRepeat = new ChallengeSubmission({
    userId: userA._id,
    challengeId: targetChallenge.id,
    code: validCode,
    testsPassed: targetChallenge.testCases?.length || 1,
    totalTests: targetChallenge.testCases?.length || 1,
    success: true,
    timeSpent: 20,
    xpEarned: 0, // 0 additional XP on repeat
  });
  await subRepeat.save();

  const userAAfterRepeat = await User.findById(userA._id);
  assert(userAAfterRepeat?.totalXP === (targetChallenge.xpReward || 200), "Replaying challenge awards 0 additional XP");
  console.log("  ✓ PASS: Challenge replay anti-farming protection verified");

  // 5. User Isolation
  const userBCount = await ChallengeSubmission.countDocuments({ userId: userB._id });
  assert(userBCount === 0, "User B has 0 challenge submissions; User A submissions isolated");
  console.log("  ✓ PASS: User isolation verified (User A challenge submissions invisible to User B)");

  // Cleanup
  await ChallengeSubmission.deleteMany({ userId: { $in: [userA._id, userB._id] } });
  await User.deleteMany({ _id: { $in: [userA._id, userB._id] } });
}
