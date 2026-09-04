import mongoose from "mongoose";
import { INITIAL_CODING_CHALLENGES, ChallengeSeedItem } from "../data/coding-challenges-data";
import { CodingSubmission } from "../models/CodingSubmission";
import { XPTransaction } from "../models/XPTransaction";
import { XPService } from "./xpService";
import { StreakService } from "./streakService";

export class DailyChallengeService {
  /**
   * Deterministically selects a daily challenge for a given date string (YYYY-MM-DD).
   * Rotates difficulty by day of week.
   */
  static getDailyChallengeForDate(dateStr: string = StreakService.getUTCDateString()): {
    challenge: ChallengeSeedItem;
    difficulty: "beginner" | "easy" | "medium" | "hard";
    date: string;
    xpReward: number;
    bonusXP: number;
  } {
    const dateObj = new Date(dateStr + "T00:00:00Z");
    const dayOfWeek = dateObj.getUTCDay(); // 0: Sunday, 1: Monday, ...

    // Rotation: Mon: beginner, Tue: easy, Wed: medium, Thu: easy, Fri: medium, Sat: hard, Sun: mixed
    const difficultyMap: Record<number, "beginner" | "easy" | "medium" | "hard"> = {
      1: "beginner",
      2: "easy",
      3: "medium",
      4: "easy",
      5: "medium",
      6: "hard",
      0: "medium",
    };

    const targetDifficulty = difficultyMap[dayOfWeek] || "easy";
    const matchingChallenges = INITIAL_CODING_CHALLENGES.filter(
      (c: ChallengeSeedItem) => c.difficulty.toLowerCase() === targetDifficulty
    );

    const pool = matchingChallenges.length > 0 ? matchingChallenges : INITIAL_CODING_CHALLENGES;

    // Deterministic hash based on date string
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % pool.length;
    const selectedChallenge = pool[index];

    return {
      challenge: selectedChallenge,
      difficulty: targetDifficulty,
      date: dateStr,
      xpReward: selectedChallenge.xpReward || 150,
      bonusXP: 50, // Daily challenge bonus
    };
  }

  /**
   * Retrieves today's daily challenge and user completion status.
   */
  static async getDailyChallenge(userId?: string | mongoose.Types.ObjectId) {
    const todayStr = StreakService.getUTCDateString();
    const daily = this.getDailyChallengeForDate(todayStr);

    let alreadyCompleted = false;
    if (userId) {
      const userObjId = new mongoose.Types.ObjectId(String(userId));
      const submission = await CodingSubmission.findOne({
        userId: userObjId,
        challengeSlug: daily.challenge.slug,
        status: "passed",
        createdAt: {
          $gte: new Date(todayStr + "T00:00:00Z"),
          $lte: new Date(todayStr + "T23:59:59.999Z"),
        },
      }).lean();

      const tx = await XPTransaction.findOne({
        userId: userObjId,
        sourceType: "daily_challenge",
        sourceId: `daily_${todayStr}`,
      }).lean();

      alreadyCompleted = !!submission || !!tx;
    }

    return {
      ...daily,
      alreadyCompleted,
    };
  }

  /**
   * Awards daily challenge bonus XP upon completion.
   */
  static async completeDailyChallenge(userId: string | mongoose.Types.ObjectId, challengeSlug: string) {
    const todayStr = StreakService.getUTCDateString();
    const daily = this.getDailyChallengeForDate(todayStr);

    if (daily.challenge.slug !== challengeSlug) {
      return { isDailyChallenge: false };
    }

    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const xpRes = await XPService.awardXP({
      userId: userObjId,
      sourceType: "daily_challenge",
      sourceId: `daily_${todayStr}`,
      xpAmount: daily.bonusXP,
      metadata: { date: todayStr, challengeSlug },
    });

    return {
      isDailyChallenge: true,
      bonusXPAwarded: xpRes.xpEarned,
      alreadyCompleted: xpRes.alreadyAwarded,
      totalXP: xpRes.totalXP,
    };
  }
}
