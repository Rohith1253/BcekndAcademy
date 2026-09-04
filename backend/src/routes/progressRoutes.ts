import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import {
  getProgress,
  updateProgress,
  getLanguageProgressController,
} from "../controllers/progressController";

const router = Router();

router.get("/", authenticateUser, getProgress);
router.post("/", authenticateUser, updateProgress);
router.get("/languages", authenticateUser, getLanguageProgressController);

export default router;
