import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import { getContinueLearningController } from "../controllers/learningController";

const router = Router();

router.get("/continue", authenticateUser, getContinueLearningController);

export default router;
