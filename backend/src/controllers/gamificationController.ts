import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { DailyChallengeService } from "../services/dailyChallengeService";
import { DailyGoalService } from "../services/dailyGoalService";
import { RecommendationService } from "../services/recommendationService";
import { AdaptiveLearningService } from "../services/adaptiveLearningService";
import { MilestoneService } from "../services/milestoneService";
import { NotificationService } from "../services/notificationService";
import { StreakService } from "../services/streakService";
import { LevelService } from "../services/levelService";
import { User } from "../models/User";
import { XPService } from "../services/xpService";

export async function getDailyChallenge(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const dailyChallenge = await DailyChallengeService.getDailyChallenge(userId);
    return res.status(200).json({ success: true, data: dailyChallenge });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch daily challenge" });
  }
}

export async function getRecommendations(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const recommendations = await RecommendationService.getRecommendations(userId);
    return res.status(200).json({ success: true, data: recommendations });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch recommendations" });
  }
}

export async function getTodayGoals(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const goals = await DailyGoalService.getTodayGoals(userId);
    return res.status(200).json({ success: true, data: goals });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch daily goals" });
  }
}

export async function getAdaptiveProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const profile = await AdaptiveLearningService.getAdaptiveProfile(userId);
    return res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch adaptive profile" });
  }
}

export async function getUserMilestones(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const milestones = await MilestoneService.getUserMilestones(userId);
    return res.status(200).json({ success: true, data: milestones });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch milestones" });
  }
}

export async function getNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const result = await NotificationService.getUserNotifications(userId);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch notifications" });
  }
}

export async function markNotificationRead(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const id = req.params.id as string;
    const notification = await NotificationService.markAsRead(userId, id);
    if (!notification) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to mark notification as read" });
  }
}

export async function markAllNotificationsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const result = await NotificationService.markAllAsRead(userId);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to mark all notifications as read" });
  }
}

export async function getGamificationSummary(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const [user, streak, dailyChallenge, dailyGoals, milestones, adaptiveProfile, notifications] =
      await Promise.all([
        User.findById(userId).lean(),
        StreakService.getStreakStatus(userId),
        DailyChallengeService.getDailyChallenge(userId),
        DailyGoalService.getTodayGoals(userId),
        MilestoneService.getUserMilestones(userId),
        AdaptiveLearningService.getAdaptiveProfile(userId),
        NotificationService.getUserNotifications(userId, 5),
      ]);

    const levelInfo = LevelService.getLevelInfo(user?.totalXP || 0);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          totalXP: user?.totalXP || 0,
        },
        levelInfo,
        streak,
        dailyChallenge,
        dailyGoals,
        milestones,
        adaptiveProfile,
        notifications,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch gamification summary" });
  }
}


export async function getStreakStatusController(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    const status = await StreakService.getStreakStatus(userId);
    return res.status(200).json({ success: true, data: status });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch streak status" });
  }
}

export async function getLeaderboardController(req: Request, res: Response) {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const users = await User.find({}, { name: 1, email: 1, totalXP: 1, currentLevel: 1, avatar: 1 })
      .sort({ totalXP: -1 })
      .limit(limit)
      .lean();

    const leaderboard = users.map((u, idx) => ({
      rank: idx + 1,
      id: u._id,
      name: u.name || "Anonymous",
      totalXP: u.totalXP || 0,
      currentLevel: u.currentLevel || 1,
    }));

    return res.status(200).json({ success: true, data: { leaderboard, total: leaderboard.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch leaderboard" });
  }
}
