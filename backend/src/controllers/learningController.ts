import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { ProgressService } from "../services/progressService";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";

/**
 * GET /api/learning/continue
 * Returns user's next learning target (in-progress lesson, next lesson, quiz, or challenge).
 */
export async function getContinueLearningController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const continueData = await ProgressService.getContinueLearning(userId);

    return res.status(200).json({
      success: true,
      data: continueData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch continue learning target",
    });
  }
}

/**
 * POST /api/learning/lessons/:lessonId/complete
 * Idempotently marks a lesson complete, awards XP once, updates course progress and streaks.
 */
export async function completeLessonController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const lessonId = req.params.lessonId || req.body.lessonId;
    if (!lessonId) {
      return res.status(400).json({ success: false, error: "Missing required 'lessonId' parameter." });
    }

    const { courseId, moduleId, timeSpent, progressPercentage } = req.body;

    const result = await ProgressService.completeLesson({
      userId,
      lessonId,
      courseId,
      moduleId,
      status: "completed",
      progressPercentage: progressPercentage !== undefined ? Number(progressPercentage) : 100,
      timeSpent: Number(timeSpent) || 0,
    });

    return res.status(200).json({
      success: true,
      data: {
        alreadyCompleted: !result.isFirstTimeCompleted,
        earnedXP: result.xpAwarded,
        isCourseCompleted: result.isCourseCompleted,
        courseBonusXP: result.courseBonusXP,
        userLevelInfo: result.userLevelInfo,
        progress: result.progress,
        unlockedAchievements: result.unlockedAchievements,
        nextLesson: result.nextLesson,
      },
    });
  } catch (error: any) {
    console.error("[COMPLETE LESSON ERROR]", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to complete lesson",
    });
  }
}

/**
 * GET /api/learning/courses/:courseSlug/summary
 * Returns course learning summary, module progression, quiz unlock states, and challenge.
 */
export async function getCourseLearningSummaryController(req: AuthenticatedRequest, res: Response) {
  try {
    const courseSlug = Array.isArray(req.params.courseSlug) ? req.params.courseSlug[0] : req.params.courseSlug;
    const userId = req.user?.userId;

    const summary = await ProgressService.getCourseLearningSummary({
      userId,
      courseSlug: String(courseSlug),
    });

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch course learning summary",
    });
  }
}
