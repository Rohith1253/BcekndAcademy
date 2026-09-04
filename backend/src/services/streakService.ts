import mongoose from "mongoose";
import { User } from "../models/User";
import { NotificationService } from "./notificationService";
import { XPService } from "./xpService";

export type ActivityType = "lesson_completion" | "challenge_completion" | "quiz_completion";

export class StreakService {
  /**
   * Formats a Date to a UTC calendar date string: YYYY-MM-DD
   */
  static getUTCDateString(d: Date = new Date()): string {
    return d.toISOString().split("T")[0];
  }

  /**
   * Calculates difference in calendar days between two UTC dates.
   */
  static getCalendarDayDiff(d1: Date, d2: Date): number {
    const date1 = new Date(this.getUTCDateString(d1) + "T00:00:00Z").getTime();
    const date2 = new Date(this.getUTCDateString(d2) + "T00:00:00Z").getTime();
    return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
  }

  /**
   * Registers a qualifying learning activity for the user's streak.
   */
  static async recordActivity(params: {
    userId: string | mongoose.Types.ObjectId;
    activityType: ActivityType;
    activityId: string;
  }) {
    const { userId } = params;
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const user = await User.findById(userObjId);
    if (!user) return null;

    const now = new Date();
    const lastActivity = user.lastActivityDate;
    let newStreak = user.currentStreak || 0;
    let newLongest = user.longestStreak || 0;
    let totalActiveDays = user.totalActiveDays || 0;
    let streakIncremented = false;

    if (!lastActivity) {
      // First activity ever
      newStreak = 1;
      newLongest = Math.max(newLongest, 1);
      totalActiveDays = 1;
      streakIncremented = true;
    } else {
      const dayDiff = this.getCalendarDayDiff(lastActivity, now);

      if (dayDiff === 0) {
        // Same calendar day -> keep streak, do not increment multiple times
        streakIncremented = false;
      } else if (dayDiff === 1) {
        // Consecutive calendar day -> increment streak!
        newStreak += 1;
        newLongest = Math.max(newLongest, newStreak);
        totalActiveDays += 1;
        streakIncremented = true;
      } else {
        // Missed one or more days -> reset streak to 1
        newStreak = 1;
        newLongest = Math.max(newLongest, 1);
        totalActiveDays += 1;
        streakIncremented = true;
      }
    }

    user.currentStreak = newStreak;
    user.longestStreak = newLongest;
    user.lastActivityDate = now;
    user.totalActiveDays = totalActiveDays;
    await user.save();

    // Check streak milestones (3, 7, 14, 30, 100 days)
    const STREAK_MILESTONES = [3, 7, 14, 30, 100];
    if (streakIncremented && STREAK_MILESTONES.includes(newStreak)) {
      const bonusXP = newStreak * 10;
      await XPService.awardXP({
        userId: userObjId,
        sourceType: "streak_bonus",
        sourceId: `streak_${newStreak}_days`,
        xpAmount: bonusXP,
        metadata: { streakDays: newStreak },
      });

      await NotificationService.createNotification({
        userId: userObjId,
        type: "streak_milestone",
        title: `🔥 ${newStreak}-Day Streak Reached!`,
        message: `Incredible consistency! You earned +${bonusXP} XP for maintaining a ${newStreak}-day learning streak.`,
        metadata: { streakDays: newStreak, bonusXP },
      });
    }

    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalActiveDays,
      lastActivityDate: now,
      streakIncremented,
    };
  }

  /**
   * Returns current streak status for a user.
   */
  static async getStreakStatus(userId: string | mongoose.Types.ObjectId) {
    const userObjId = new mongoose.Types.ObjectId(String(userId));
    const user = await User.findById(userObjId).lean();
    if (!user) return { currentStreak: 0, longestStreak: 0, isActiveToday: false };

    const now = new Date();
    const lastActivity = user.lastActivityDate;
    let currentStreak = user.currentStreak || 0;
    let isActiveToday = false;

    if (lastActivity) {
      const dayDiff = this.getCalendarDayDiff(lastActivity, now);
      if (dayDiff === 0) {
        isActiveToday = true;
      } else if (dayDiff > 1) {
        // Streak expired
        currentStreak = 0;
      }
    }

    return {
      currentStreak,
      longestStreak: user.longestStreak || 0,
      totalActiveDays: user.totalActiveDays || 0,
      lastActivityDate: lastActivity,
      isActiveToday,
    };
  }
}
