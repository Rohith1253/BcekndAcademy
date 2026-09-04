import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Achievement } from "../models/Achievement";

export async function getAchievements(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const achievements = await Achievement.find({ userId: req.user.userId }).lean();
    return res.status(200).json({ success: true, data: { achievements, count: achievements.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch achievements" });
  }
}
