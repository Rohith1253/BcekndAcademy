import { Router } from "express";
import { getProgress, updateProgress } from "../controllers/progressController";
import { authenticateUser } from "../middleware/auth";

const router = Router();

router.get("/", authenticateUser, getProgress);
router.post("/", authenticateUser, updateProgress);

export default router;
