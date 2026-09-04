import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/auth";
import {
  getContinueLearningController,
  completeLessonController,
  getCourseLearningSummaryController,
} from "../controllers/learningController";

const router = Router();

// Smart Continue Learning target
router.get("/continue", authenticateUser, getContinueLearningController);

// Complete lesson
router.post("/lessons/:lessonId/complete", authenticateUser, completeLessonController);
router.post("/complete", authenticateUser, completeLessonController);

// Course learning summary
router.get("/courses/:courseSlug/summary", optionalAuthenticateUser, getCourseLearningSummaryController);

export default router;
