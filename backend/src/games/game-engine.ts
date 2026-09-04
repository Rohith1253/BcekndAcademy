import { connectDB } from "../config/db";
import { GameAttempt } from "../models/GameAttempt";
import { User } from "../models/User";
import { addXP } from "../services/xpService";
import { getGameById, getGameScenarios } from "./registry";
import {
  GameStarRating,
  GameSubmissionPayload,
  GameSubmissionResult,
} from "./types";

/**
 * Server-side score validation and anti-farming XP engine
 */
export async function evaluateGameSubmission(
  userId: string,
  gameId: string,
  payload: GameSubmissionPayload
): Promise<GameSubmissionResult> {
  await connectDB();

  const game = getGameById(gameId);
  if (!game) {
    throw new Error(`Game '${gameId}' not found in registry`);
  }

  const scenarios = getGameScenarios(game.id);
  if (scenarios.length === 0) {
    throw new Error(`No scenarios configured for game '${gameId}'`);
  }

  // 1. Calculate Score & Accuracy
  const totalScenarios = scenarios.length;
  let correctCount = 0;
  const breakdown: Array<{
    scenarioId: string;
    isCorrect: boolean;
    userAnswer: any;
    correctAnswer: any;
    explanation: string;
  }> = [];

  scenarios.forEach((scenario) => {
    const userAns = payload.answers[scenario.id];
    let isCorrect = false;
    if (userAns !== undefined && userAns !== null) {
      if (String(userAns).trim().toLowerCase() === String(scenario.correctAnswer).trim().toLowerCase()) {
        isCorrect = true;
        correctCount++;
      }
    }
    breakdown.push({
      scenarioId: scenario.id,
      isCorrect,
      userAnswer: userAns,
      correctAnswer: scenario.correctAnswer,
      explanation: scenario.explanation,
    });
  });

  const accuracy = Math.round((correctCount / totalScenarios) * 100);
  const score = accuracy;
  const passed = accuracy >= 60;

  // 2. Calculate Star Rating
  let stars: GameStarRating = "none";
  if (accuracy >= 90) stars = "gold";
  else if (accuracy >= 75) stars = "silver";
  else if (accuracy >= 60) stars = "bronze";

  // 3. Anti-Farming Replay Check (query completed: true)
  const previousPassedAttempt = await GameAttempt.findOne({
    userId,
    gameId,
    completed: true,
  });

  const isFirstTimePass = passed && !previousPassedAttempt;
  let xpEarned = 0;

  if (isFirstTimePass) {
    const user = await User.findById(userId);
    if (user) {
      xpEarned = game.xpReward;
      const xpCalc = addXP(user.totalXP || 0, xpEarned);

      user.totalXP = xpCalc.newXP;
      user.currentLevel = xpCalc.newLevel;
      await user.save();
    }
  }

  // 4. Record / Update Game Attempt (Upsert)
  await GameAttempt.findOneAndUpdate(
    { userId, gameId },
    {
      score,
      maxScore: 100,
      stars,
      completed: passed,
      timeSpent: payload.timeSpent || 0,
      xpEarned: isFirstTimePass ? xpEarned : 0,
      answers: payload.answers,
      completedAt: new Date(),
      $inc: { attemptsCount: 1 },
    },
    { upsert: true, returnDocument: "after" }
  );

  return {
    score,
    passed,
    stars,
    xpEarned: isFirstTimePass ? xpEarned : 0,
    alreadyCompleted: !!previousPassedAttempt,
    correctAnswersCount: correctCount,
    totalQuestions: totalScenarios,
    breakdown,
    message: isFirstTimePass ? `Game passed! You earned +${xpEarned} XP!` : passed ? "Game passed!" : "Game failed. Try again!",
  };
}
