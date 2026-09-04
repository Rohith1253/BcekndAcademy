import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import {
  getAchievements,
  getUserAchievementsController,
} from "../controllers/achievementController";

const router = Router();

router.get("/", getAchievements);
router.get("/user", authenticateUser, getUserAchievementsController);

export default router;
