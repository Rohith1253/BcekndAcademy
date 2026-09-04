import { Router } from "express";
import { submitQuiz, getQuizResults } from "../controllers/quizController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.post("/submit", authenticateUser, submitQuiz);
router.get("/results", authenticateUser, getQuizResults);

export default router;
