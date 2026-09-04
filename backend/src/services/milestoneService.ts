import mongoose from "mongoose";
import { User } from "../models/User";
import { Progress } from "../models/Progress";
import { CodingSubmission } from "../models/CodingSubmission";
import { QuizAttempt } from "../models/QuizAttempt";
import { XPService } from "./xpService";
import { NotificationService } from "./notificationService";

export interface MilestoneDefinition {
  id: string;
  category: "xp" | "lessons" | "challenges" | "quizzes" | "streak";
  title: string;
  description: string;
  target: number;
  xpReward: number;
}

export const MILESTONES_CATALOG: MilestoneDefinition[] = [
  // XP Milestones
  { id: "xp_500", category: "xp", title: "XP Rookie", description: "Earn 500 total XP", target: 500, xpReward: 50 },
  { id: "xp_1000", category: "xp", title: "XP Adventurer", description: "Earn 1,000 total XP", target: 1000, xpReward: 100 },
  { id: "xp_2500", category: "xp", title: "XP Warrior", description: "Earn 2,500 total XP", target: 2500, xpReward: 200 },
  { id: "xp_5000", category: "xp", title: "XP Champion", description: "Earn 5,000 total XP", target: 5000, xpReward: 350 },
  { id: "xp_10000", category: "xp", title: "XP Legend", description: "Earn 10,000 total XP", target: 10000, xpReward: 500 },

  // Lesson Milestones
  { id: "lessons_10", category: "lessons", title: "Scholar I", description: "Complete 10 backend lessons", target: 10, xpReward: 100 },
  { id: "lessons_25", category: "lessons", title: "Scholar II", description: "Complete 25 backend lessons", target: 25, xpReward: 250 },
  { id: "lessons_50", category: "lessons", title: "Scholar III", description: "Complete 50 backend lessons", target: 50, xpReward: 500 },
  { id: "lessons_100", category: "lessons", title: "Grand Scholar", description: "Complete 100 backend lessons", target: 100, xpReward: 1000 },

  // Challenge Milestones
  { id: "challenges_5", category: "challenges", title: "Coder I", description: "Solve 5 coding challenges", target: 5, xpReward: 100 },
  { id: "challenges_10", category: "challenges", title: "Coder II", description: "Solve 10 coding challenges", target: 10, xpReward: 200 },
  { id: "challenges_25", category: "challenges", title: "Master Coder", description: "Solve 25 coding challenges", target: 25, xpReward: 500 },

  // Quiz Milestones
  { id: "quizzes_5", category: "quizzes", title: "Quizzer I", description: "Pass 5 assessment quizzes", target: 5, xpReward: 75 },
  { id: "quizzes_10", category: "quizzes", title: "Quizzer II", description: "Pass 10 assessment quizzes", target: 10, xpReward: 150 },
  { id: "quizzes_25", category: "quizzes", title: "Quiz Grandmaster", description: "Pass 25 assessment quizzes", target: 25, xpReward: 400 },

  // Streak Milestones
  { id: "streak_3", category: "streak", title: "Flame Spark", description: "Reach a 3-day learning streak", target: 3, xpReward: 50 },
  { id: "streak_7", category: "streak", title: "Flame Keeper", description: "Reach a 7-day learning streak", target: 7, xpReward: 100 },
  { id: "streak_30", category: "streak", title: "Eternal Flame", description: "Reach a 30-day learning streak", target: 30, xpReward: 500 },
];

export class MilestoneService {
  /**
   * Evaluates user milestones and awards idempotent bonuses.
   */
  static async evaluateMilestones(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const [userDoc, completedLessons, passedChallenges, quizzes] = await Promise.all([
      User.findById(userObjId).lean(),
      Progress.countDocuments({ userId: userObjId, status: "completed" }),
      CodingSubmission.find({ userId: userObjId, status: "passed" }).distinct("challengeSlug"),
      QuizAttempt.find({ userId: userObjId, score: { $gte: 70 } }).lean(),
    ]);

    if (!userDoc) return [];

    const stats = {
      xp: userDoc.totalXP || 0,
      lessons: completedLessons,
      challenges: passedChallenges.length,
      quizzes: quizzes.length,
      streak: userDoc.longestStreak || userDoc.currentStreak || 0,
    };

    const unlockedMilestones = [];

    for (const milestone of MILESTONES_CATALOG) {
      let isEligible = false;
      switch (milestone.category) {
        case "xp":
          isEligible = stats.xp >= milestone.target;
          break;
        case "lessons":
          isEligible = stats.lessons >= milestone.target;
          break;
        case "challenges":
          isEligible = stats.challenges >= milestone.target;
          break;
        case "quizzes":
          isEligible = stats.quizzes >= milestone.target;
          break;
        case "streak":
          isEligible = stats.streak >= milestone.target;
          break;
      }

      if (isEligible) {
        const rewardRes = await XPService.awardXP({
          userId: userObjId,
          sourceType: "milestone",
          sourceId: milestone.id,
          xpAmount: milestone.xpReward,
          metadata: { milestoneId: milestone.id, category: milestone.category },
        });

        if (!rewardRes.alreadyAwarded) {
          unlockedMilestones.push(milestone);
          await NotificationService.createNotification({
            userId: userObjId,
            type: "achievement_unlocked",
            title: `🏆 Milestone Unlocked: ${milestone.title}`,
            message: `You achieved "${milestone.description}" and earned +${milestone.xpReward} XP!`,
            metadata: { milestoneId: milestone.id },
          });
        }
      }
    }

    return unlockedMilestones;
  }

  /**
   * Retrieves all milestones with user progress.
   */
  static async getUserMilestones(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const [userDoc, completedLessons, passedChallenges, quizzes] = await Promise.all([
      User.findById(userObjId).lean(),
      Progress.countDocuments({ userId: userObjId, status: "completed" }),
      CodingSubmission.find({ userId: userObjId, status: "passed" }).distinct("challengeSlug"),
      QuizAttempt.find({ userId: userObjId, score: { $gte: 70 } }).lean(),
    ]);

    const stats = {
      xp: userDoc?.totalXP || 0,
      lessons: completedLessons,
      challenges: passedChallenges.length,
      quizzes: quizzes.length,
      streak: userDoc?.longestStreak || userDoc?.currentStreak || 0,
    };

    return MILESTONES_CATALOG.map((m) => {
      const current = stats[m.category] || 0;
      const progressPercent = Math.min(100, Math.round((current / m.target) * 100));
      return {
        ...m,
        current,
        progressPercent,
        completed: current >= m.target,
      };
    });
  }
}
