import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { ProgressService } from "../services/progressService";

/**
 * GET /api/learning/continue
 * Returns user's next learning target or resume point.
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
