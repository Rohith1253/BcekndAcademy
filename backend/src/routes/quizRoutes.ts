import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import { submitQuiz, getQuizHistory, getQuizStats } from "../controllers/quizController";

const router = Router();

router.post("/submit", authenticateUser, submitQuiz);
router.get("/history", authenticateUser, getQuizHistory);
router.get("/stats", authenticateUser, getQuizStats);

export default router;
