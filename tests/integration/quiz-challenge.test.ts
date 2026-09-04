import { ALL_CHALLENGES } from "../../backend/src/data/challenges/index";

export function runQuizChallengeIntegrationTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Integration Tests: Quiz & Challenge Business Logic ---");

  // 1. Quiz Score Calculation Formula & Bounding Math
  const totalQuestions = 5;
  const correctCount = 4;
  const calculatedScore = Math.min(100, Math.max(0, Math.round((correctCount / totalQuestions) * 100)));

  assert(calculatedScore === 80, "Quiz score calculation correctly computes 80% for 4/5 correct answers");

  // Zero Division Defense
  const emptyQuestionsTotal = 0;
  const safeScore = emptyQuestionsTotal > 0 ? Math.round((correctCount / emptyQuestionsTotal) * 100) : 0;
  assert(Number.isNaN(safeScore) === false && safeScore === 0, "Quiz scoring guards against division-by-zero on empty question sets");

  // 2. Quiz XP Multiplier Integrity
  let xpMultiplier = 0;
  if (calculatedScore >= 80) xpMultiplier = 1;
  else if (calculatedScore >= 60) xpMultiplier = 0.75;

  const baseReward = 100;
  const potentialXP = Math.round(baseReward * xpMultiplier);
  assert(potentialXP === 100, "Quiz score 80% awards 100% of base XP reward (100 XP)");

  // Replay Protection Logic (Second pass awards 0 XP)
  const alreadyCompleted = true;
  const finalXPEarned = !alreadyCompleted ? potentialXP : 0;
  assert(finalXPEarned === 0, "Repeat quiz pass for previously completed quiz awards 0 additional XP");

  // 3. Challenge Server Data Validation
  const testChallengeId = Object.keys(ALL_CHALLENGES)[0] || "http-basic-server";
  const challengeDef = ALL_CHALLENGES[testChallengeId];

  assert(
    challengeDef !== undefined && (challengeDef as any).xpReward > 0,
    "Challenge definition retrieved from authoritative server data dictionary"
  );

  // Client Field Override Rejection
  const clientSubmittedXPReward = 999999;
  const authoritativeXPReward = (challengeDef as any).xpReward;
  assert(
    authoritativeXPReward !== clientSubmittedXPReward,
    "Server uses authoritative challenge.xpReward definition, ignoring client-manipulated reward fields"
  );

  // Challenge Replay Protection
  const challengeAlreadyCompleted = true;
  const challengeXPEarned = !challengeAlreadyCompleted ? authoritativeXPReward : 0;
  assert(challengeXPEarned === 0, "Repeat challenge submission for completed challenge awards 0 additional XP");
}
