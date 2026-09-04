import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { AchievementService } from "../services/achievementService";
import { MASTER_ACHIEVEMENTS } from "../data/master-achievements";

/**
 * GET /api/achievements
 * Returns all available platform achievements.
 */
export async function getAchievements(req: Request, res: Response) {
  try {
    return res.status(200).json({
      success: true,
      data: MASTER_ACHIEVEMENTS,
      total: MASTER_ACHIEVEMENTS.length,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch achievements",
    });
  }
}

/**
 * GET /api/achievements/user
 * Returns achievements unlocked by the authenticated user with completion stats.
 */
export async function getUserAchievementsController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const data = await AchievementService.getUserAchievements(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch user achievements",
    });
  }
}
