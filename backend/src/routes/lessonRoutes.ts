import { Router } from "express";
import { getLessons, getLessonBySlug } from "../controllers/lessonController";

const router = Router();

router.get("/", getLessons);
router.get("/:slug", getLessonBySlug);

export default router;
