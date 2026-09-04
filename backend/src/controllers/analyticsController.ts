import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Progress } from "../models/Progress";
import { QuizAttempt } from "../models/QuizAttempt";
import { CodingSubmission } from "../models/CodingSubmission";
import { User } from "../models/User";
import { ProgressService } from "../services/progressService";
import { calculateLevelProgress } from "../services/xpService";

/**
 * GET /api/analytics/overview
 * Returns comprehensive learning analytics overview.
 */
export async function getAnalyticsOverview(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const [userDoc, completedLessons, passedChallenges, allSubmissions, quizAttempts] = await Promise.all([
      User.findById(userId).lean(),
      Progress.find({ userId, status: "completed" }).lean(),
      CodingSubmission.find({ userId, status: "passed" }).distinct("challengeSlug"),
      CodingSubmission.find({ userId }).lean(),
      QuizAttempt.find({ userId }).lean(),
    ]);

    const totalXP = userDoc?.totalXP || 0;
    const levelInfo = calculateLevelProgress(totalXP);
    const passedQuizzesCount = quizAttempts.filter((q) => q.score >= 70).length;
    const avgQuizScore =
      quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((acc, q) => acc + q.score, 0) / quizAttempts.length)
        : 0;

    const challengeSuccessRate =
      allSubmissions.length > 0
        ? Math.round((passedChallenges.length / allSubmissions.length) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalXP,
        levelInfo: {
          ...levelInfo,
          currentLevel: levelInfo.level,
          levelTitle: levelInfo.levelName,
        },
        streak: {
          currentStreak: userDoc?.currentStreak || 0,
          longestStreak: userDoc?.longestStreak || 0,
        },
        lessonsCompleted: completedLessons.length,
        challengesSolved: passedChallenges.length,
        challengesCompleted: passedChallenges.length,
        quizzesPassed: passedQuizzesCount,
        quizzesCompleted: quizAttempts.length,
        quizStats: {
          totalAttempts: quizAttempts.length,
          averageScore: avgQuizScore,
          passRate: quizAttempts.length > 0 ? Math.round((passedQuizzesCount / quizAttempts.length) * 100) : 0,
        },
        challengeStats: {
          totalSubmissions: allSubmissions.length,
          solvedCount: passedChallenges.length,
          successRate: challengeSuccessRate,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch analytics overview",
    });
  }
}

/**
 * GET /api/analytics/activity
 * Returns 7-day and 30-day activity logs (lessons, quizzes, XP gains).
 */
export async function getAnalyticsActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const days = Number(req.query.days) || 7;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const [quizAttempts, progressDocs, submissions] = await Promise.all([
      QuizAttempt.find({ userId, completedAt: { $gte: sinceDate } }).lean(),
      Progress.find({ userId, updatedAt: { $gte: sinceDate } }).lean(),
      CodingSubmission.find({ userId, submittedAt: { $gte: sinceDate } }).lean(),
    ]);

    const activityByDay: Record<string, { date: string; day: string; xp: number; events: number }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      activityByDay[key] = {
        date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        xp: 0,
        events: 0,
      };
    }

    quizAttempts.forEach((q) => {
      const key = new Date(q.completedAt).toISOString().split("T")[0];
      if (activityByDay[key]) {
        activityByDay[key].xp += q.xpEarned || 0;
        activityByDay[key].events += 1;
      }
    });

    submissions.forEach((s) => {
      const key = new Date(s.submittedAt).toISOString().split("T")[0];
      if (activityByDay[key]) {
        activityByDay[key].xp += s.earnedXP || 0;
        activityByDay[key].events += 1;
      }
    });

    return res.status(200).json({
      success: true,
      data: Object.values(activityByDay),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch activity history",
    });
  }
}

/**
 * GET /api/analytics/languages
 * Returns 11-language distribution telemetry.
 */
export async function getAnalyticsLanguages(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const result = await ProgressService.calculateLanguageProgress(userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch language analytics",
    });
  }
}

export const getActivityHistory = getAnalyticsActivity;
export const getLanguageAnalytics = getAnalyticsLanguages;
