import mongoose from "mongoose";
import { Progress } from "../models/Progress";
import { CodingSubmission } from "../models/CodingSubmission";
import { XPTransaction } from "../models/XPTransaction";
import { StreakService } from "./streakService";
import { NotificationService } from "./notificationService";

export interface DailyGoalItem {
  id: string;
  title: string;
  current: number;
  target: number;
  completed: boolean;
  unit: string;
}

export class DailyGoalService {
  /**
   * Aggregates real user activity for the current calendar day.
   */
  static async getTodayGoals(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const todayStr = StreakService.getUTCDateString();
    const startOfDay = new Date(todayStr + "T00:00:00Z");
    const endOfDay = new Date(todayStr + "T23:59:59.999Z");

    const [lessonsCompleted, challengesCompleted, xpTransactions] = await Promise.all([
      Progress.countDocuments({
        userId: userObjId,
        status: "completed",
        completedAt: { $gte: startOfDay, $lte: endOfDay },
      }),
      CodingSubmission.find({
        userId: userObjId,
        status: "passed",
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }).distinct("challengeSlug"),
      XPTransaction.find({
        userId: userObjId,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }).lean(),
    ]);

    const xpEarned = xpTransactions.reduce((acc, tx) => acc + (tx.xpAmount || 0), 0);

    const goals: DailyGoalItem[] = [
      {
        id: "daily_lesson",
        title: "Complete 1 Lesson",
        current: lessonsCompleted,
        target: 1,
        completed: lessonsCompleted >= 1,
        unit: "lessons",
      },
      {
        id: "daily_challenge",
        title: "Solve 1 Coding Challenge",
        current: challengesCompleted.length,
        target: 1,
        completed: challengesCompleted.length >= 1,
        unit: "challenges",
      },
      {
        id: "daily_xp",
        title: "Earn 100 XP",
        current: xpEarned,
        target: 100,
        completed: xpEarned >= 100,
        unit: "XP",
      },
    ];

    const completedCount = goals.filter((g) => g.completed).length;
    const completionPercentage = Math.round((completedCount / goals.length) * 100);
    const allCompleted = completedCount === goals.length;

    // Check if notification should be sent
    if (allCompleted) {
      await NotificationService.createNotification({
        userId: userObjId,
        type: "daily_goal_completed",
        title: "🎯 All Daily Goals Completed!",
        message: "Fantastic work! You have finished all your daily learning goals for today.",
        metadata: { date: todayStr },
      });
    }

    return {
      date: todayStr,
      goals,
      completedCount,
      totalGoals: goals.length,
      completionPercentage,
      allCompleted,
    };
  }
}
