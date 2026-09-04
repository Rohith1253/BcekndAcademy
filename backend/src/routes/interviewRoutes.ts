import { Router } from "express";
import { optionalAuthenticateUser } from "../middleware/auth";
import {
  getInterviewCategories,
  getInterviewQuestions,
  answerInterviewQuestion,
} from "../controllers/interviewController";

const router = Router();

router.get("/categories", getInterviewCategories);
router.get("/topics", getInterviewCategories);
router.get("/questions", getInterviewQuestions);
router.post("/answer", optionalAuthenticateUser, answerInterviewQuestion);
router.post("/submit", optionalAuthenticateUser, answerInterviewQuestion);

export default router;
