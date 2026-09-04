import { Router } from "express";
import {
  getCourses,
  getCourseBySlug,
  getCourseCurriculum,
  getCourseLesson,
  startCourseLesson,
  updateCourseLessonProgress,
  completeCourseLesson,
  getCourseResume,
  getCourseModules,
  getCourseProgress,
} from "../controllers/courseController";
import { optionalAuthenticateUser, authenticateUser } from "../middleware/auth";

const router = Router();

// Catalog
router.get("/", getCourses);

// Course Resume Target
router.get("/:slug/resume", optionalAuthenticateUser, getCourseResume);

// Course Curriculum
router.get("/:slug/curriculum", optionalAuthenticateUser, getCourseCurriculum);

// Course Detail
router.get("/:slug", optionalAuthenticateUser, getCourseBySlug);
router.get("/:slug/modules", getCourseModules);
router.get("/:slug/progress", optionalAuthenticateUser, getCourseProgress);

// Nested Course Lesson Endpoints
router.get("/:courseSlug/lessons/:lessonSlug", optionalAuthenticateUser, getCourseLesson);
router.post("/:courseSlug/lessons/:lessonSlug/start", authenticateUser, startCourseLesson);
router.patch("/:courseSlug/lessons/:lessonSlug/progress", authenticateUser, updateCourseLessonProgress);
router.post("/:courseSlug/lessons/:lessonSlug/complete", authenticateUser, completeCourseLesson);

export default router;
