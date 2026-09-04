import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/auth";
import {
  getDailyChallenge,
  getRecommendations,
  getTodayGoals,
  getAdaptiveProfile,
  getUserMilestones,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getGamificationSummary,
} from "../controllers/gamificationController";

const router = Router();

// Gamification hub summary
router.get("/gamification/summary", authenticateUser, getGamificationSummary);

// Daily challenge
router.get("/daily-challenge", optionalAuthenticateUser, getDailyChallenge);

// Recommendations
router.get("/recommendations", authenticateUser, getRecommendations);

// Goals
router.get("/goals/today", authenticateUser, getTodayGoals);

// Adaptive learning
router.get("/adaptive-learning/profile", authenticateUser, getAdaptiveProfile);

// Milestones
router.get("/milestones", authenticateUser, getUserMilestones);

// Notifications
router.get("/notifications", authenticateUser, getNotifications);
router.patch("/notifications/read-all", authenticateUser, markAllNotificationsRead);
router.patch("/notifications/:id/read", authenticateUser, markNotificationRead);

export default router;
