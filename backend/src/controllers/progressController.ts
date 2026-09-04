import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Progress } from "../models/Progress";
import { User } from "../models/User";
import { calculateLevelProgress } from "../services/xpService";
import { ProgressService } from "../services/progressService";

/**
 * GET /api/progress
 * Returns user progress overview or course-specific progress, plus level and streak info.
 */
export async function getProgress(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const { courseId, lessonId } = req.query;
    const query: Record<string, any> = { userId };

    if (courseId) query.courseId = courseId;
    if (lessonId) query.lessonId = lessonId;

    const progressRecords = await Progress.find(query).lean();
    const userDoc = await User.findById(userId).lean();
    const totalXP = userDoc?.totalXP || 0;
    const levelInfo = calculateLevelProgress(totalXP);
    const streak = {
      currentStreak: userDoc?.currentStreak || 0,
      longestStreak: userDoc?.longestStreak || 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        records: progressRecords,
        levelInfo: {
          ...levelInfo,
          currentLevel: levelInfo.level,
          levelTitle: levelInfo.levelName,
          xpInCurrentLevel: levelInfo.currentLevelXP,
          xpRequiredForNextLevel: levelInfo.neededXP,
          isMaxLevel: levelInfo.level >= 10,
        },
        streak,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch progress",
    });
  }
}

/**
 * POST /api/progress
 * Idempotently updates or completes lesson progress and awards XP.
 */
export async function updateProgress(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const { lessonId, courseId, moduleId, status, progressPercentage, timeSpent } = req.body;

    if (!lessonId) {
      return res.status(400).json({ success: false, error: "Missing required 'lessonId'" });
    }

    const result = await ProgressService.completeLesson({
      userId,
      lessonId,
      courseId,
      moduleId,
      status: status || "completed",
      progressPercentage: progressPercentage !== undefined ? Number(progressPercentage) : 100,
      timeSpent: Number(timeSpent) || 0,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update progress",
    });
  }
}

/**
 * GET /api/progress/languages
 * Returns 11-language competency progress metrics.
 */
export async function getLanguageProgressController(req: AuthenticatedRequest, res: Response) {
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
      error: error.message || "Failed to calculate language progress",
    });
  }
}

export const getLanguageProgress = getLanguageProgressController;
