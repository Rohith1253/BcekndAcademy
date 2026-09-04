import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import {
  getApiLabs,
  getApiLabBySlug,
  runApiLab,
  submitApiLab,
} from "../controllers/apiLabController";

const router = Router();

router.get("/", getApiLabs);
router.get("/:slug", getApiLabBySlug);
router.post("/:slug/run", runApiLab);
router.post("/:slug/execute", runApiLab);
router.post("/:slug/submit", authenticateUser, submitApiLab);

export default router;
