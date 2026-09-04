import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Progress } from "../models/Progress";
import { User } from "../models/User";
import { Lesson } from "../models/Lesson";
import { addXP } from "../services/xpService";
import { sanitizeStringParam } from "../utils/validation";

export async function getProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const lessonId = req.query.lessonId as string;
    const courseId = req.query.courseId as string;
    const status = req.query.status as string;

    const query: any = { userId: req.user.userId };
    if (lessonId) query.lessonId = sanitizeStringParam(lessonId);
    if (courseId) query.courseId = sanitizeStringParam(courseId);
    if (status) query.status = sanitizeStringParam(status);

    const progressRecords = await Progress.find(query).lean();
    return res.status(200).json({ success: true, data: { progress: progressRecords, count: progressRecords.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch progress" });
  }
}

export async function updateProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { lessonId, courseId, status, timeSpent } = req.body;
    if (!lessonId) {
      return res.status(400).json({ success: false, error: "Lesson ID is required" });
    }

    const sanitizedLessonId = sanitizeStringParam(lessonId);
    if (!sanitizedLessonId) {
      return res.status(400).json({ success: false, error: "Invalid lesson ID" });
    }

    // Normalize status: accept underscore variants (in_progress) and convert to hyphen (in-progress)
    const VALID_STATUSES = ["not-started", "in-progress", "completed"] as const;
    type ProgressStatus = (typeof VALID_STATUSES)[number];
    const normalizeStatus = (s: string): ProgressStatus => {
      const normalized = s.replace(/_/g, "-") as ProgressStatus;
      return VALID_STATUSES.includes(normalized) ? normalized : "in-progress";
    };
    const normalizedStatus: ProgressStatus | undefined = status ? normalizeStatus(status) : undefined;

    let progressRecord = await Progress.findOne({
      userId: req.user.userId,
      lessonId: sanitizedLessonId,
    });

    const isFirstTimeCompletion =
      normalizedStatus === "completed" && (!progressRecord || progressRecord.status !== "completed");

    if (!progressRecord) {
      progressRecord = new Progress({
        userId: req.user.userId,
        lessonId: sanitizedLessonId,
        courseId: courseId ? sanitizeStringParam(courseId) : undefined,
        status: normalizedStatus || "in-progress",
        progressPercentage: normalizedStatus === "completed" ? 100 : 0,
        timeSpent: timeSpent || 0,
        completedAt: normalizedStatus === "completed" ? new Date() : undefined,
      });
    } else {
      if (normalizedStatus) {
        progressRecord.status = normalizedStatus;
        if (normalizedStatus === "completed") {
          progressRecord.progressPercentage = 100;
          if (!progressRecord.completedAt) {
            progressRecord.completedAt = new Date();
          }
        }
      }
      if (timeSpent) {
        progressRecord.timeSpent = (progressRecord.timeSpent || 0) + timeSpent;
      }
    }

    await progressRecord.save();

    let xpResult = null;
    if (isFirstTimeCompletion) {
      const dbUser = await User.findById(req.user.userId);
      if (dbUser) {
        const lesson = await Lesson.findOne({ slug: sanitizedLessonId }).lean();
        const xpToAward = lesson?.xpReward || 100;

        xpResult = addXP(dbUser.totalXP || 0, xpToAward);
        dbUser.totalXP = xpResult.newXP;
        dbUser.currentLevel = xpResult.newLevel;
        await dbUser.save();
      }
    }

    const updatedUser = await User.findById(req.user.userId)
      .select("totalXP currentLevel currentStreak longestStreak")
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        progress: progressRecord,
        xpEarned: isFirstTimeCompletion ? xpResult?.xpGained || 100 : 0,
        userStats: updatedUser,
      },
      message: isFirstTimeCompletion ? "Lesson completed! XP awarded." : "Progress updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update progress" });
  }
}
