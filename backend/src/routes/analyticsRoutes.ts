import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import {
  getAnalyticsOverview,
  getAnalyticsActivity,
  getAnalyticsLanguages,
} from "../controllers/analyticsController";

const router = Router();

router.get("/", authenticateUser, getAnalyticsOverview);
router.get("/overview", authenticateUser, getAnalyticsOverview);
router.get("/activity", authenticateUser, getAnalyticsActivity);
router.get("/languages", authenticateUser, getAnalyticsLanguages);

export default router;
