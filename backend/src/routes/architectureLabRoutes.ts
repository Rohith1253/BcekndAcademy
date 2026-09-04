import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import {
  getArchitectureLabs,
  getArchitectureLabBySlug,
  runArchitectureLab,
  submitArchitectureLab,
} from "../controllers/architectureLabController";

const router = Router();

router.get("/", getArchitectureLabs);
router.get("/:slug", getArchitectureLabBySlug);
router.post("/:slug/run", runArchitectureLab);
router.post("/:slug/simulate", runArchitectureLab);
router.post("/:slug/submit", authenticateUser, submitArchitectureLab);

export default router;
