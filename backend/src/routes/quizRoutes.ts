import { Router } from "express";
import { authenticateUser, optionalAuthenticateUser } from "../middleware/auth";
import { submitQuiz, getQuizHistory, getQuizStats, checkQuizStatus } from "../controllers/quizController";

const router = Router();

router.post("/submit", authenticateUser, submitQuiz);
router.get("/check/:lessonSlug", optionalAuthenticateUser, checkQuizStatus);
router.get("/history", authenticateUser, getQuizHistory);
router.get("/stats", authenticateUser, getQuizStats);

export default router;
