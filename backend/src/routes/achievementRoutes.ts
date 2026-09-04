import { Router } from "express";
import { getAchievements } from "../controllers/achievementController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.get("/", authenticateUser, getAchievements);

export default router;
