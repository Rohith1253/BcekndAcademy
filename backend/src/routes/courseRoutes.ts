import { Router } from "express";
import { getCourses, getCourseBySlug, getCourseModules, getCourseProgress } from "../controllers/courseController";
import { optionalAuthenticateUser, authenticateUser } from "../middleware/auth";

const router = Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);
router.get("/:slug/modules", getCourseModules);
router.get("/:slug/progress", authenticateUser, getCourseProgress);

export default router;
