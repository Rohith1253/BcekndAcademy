import { Request, Response } from "express";
import { Course } from "../models/Course";
import { Module } from "../models/Module";
import { Lesson } from "../models/Lesson";
import { Progress } from "../models/Progress";
import { AuthenticatedRequest } from "../middleware/auth";
import { ProgressService, getLessonsForCourse } from "../services/progressService";
import { ALL_COURSES } from "../data/multi-language-courses-data";
import { MULTI_LANGUAGE_LESSONS } from "../data/multi-language-lessons-data";
import { ALL_REAL_LESSONS } from "../data/all-lessons-content";

function getParamString(param: string | string[] | undefined, defaultVal = ""): string {
  if (Array.isArray(param)) return param[0] || defaultVal;
  return param || defaultVal;
}

export async function getCourses(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;
    const language = req.query.language as string;
    const framework = req.query.framework as string;
    const learningPath = req.query.learningPath as string;
    const search = req.query.search as string;

    const query: any = { published: true };

    if (language && language !== "All" && language !== "all") {
      query.language = language.toLowerCase().trim();
    }

    if (category && category !== "All" && category !== "all") {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    }

    if (difficulty && difficulty !== "All" && difficulty !== "all") {
      query.difficulty = difficulty.toLowerCase().trim();
    }

    if (learningPath && learningPath !== "All") {
      query.learningPath = learningPath.trim();
    }

    if (framework) {
      query.frameworks = { $in: [new RegExp(framework.trim(), "i")] };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { tags: { $in: [searchRegex] } },
        { frameworks: { $in: [searchRegex] } },
      ];
    }

    let courses = await Course.find(query).sort({ order: 1 }).lean();
    if (courses.length === 0) {
      courses = ALL_COURSES as any;
    }

    return res.status(200).json({
      success: true,
      data: {
        courses,
        total: courses.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch courses" });
  }
}

export async function getCourseBySlug(req: AuthenticatedRequest, res: Response) {
  try {
    const slug = getParamString(req.params.slug);
    let course = await Course.findOne({ slug, published: true }).lean();
    if (!course) {
      course = ALL_COURSES.find((c) => c.slug === slug) as any;
    }

    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const curriculum = await ProgressService.getCourseCurriculum({
      userId: req.user?.userId,
      courseSlug: slug,
    });

    return res.status(200).json({
      success: true,
      data: {
        course: curriculum.course,
        modules: curriculum.modules,
        totalLessons: curriculum.totalLessons,
        completedLessons: curriculum.completedLessons,
        progressPercentage: curriculum.progressPercentage,
        isCourseCompleted: curriculum.isCourseCompleted,
        resumeLesson: curriculum.resumeLesson,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch course details" });
  }
}

export async function getCourseCurriculum(req: AuthenticatedRequest, res: Response) {
  try {
    const slug = getParamString(req.params.slug);
    const curriculum = await ProgressService.getCourseCurriculum({
      userId: req.user?.userId,
      courseSlug: slug,
    });

    return res.status(200).json({
      success: true,
      data: curriculum,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch curriculum" });
  }
}

export async function getCourseLesson(req: AuthenticatedRequest, res: Response) {
  try {
    const courseSlug = getParamString(req.params.courseSlug);
    const lessonSlug = getParamString(req.params.lessonSlug);
    const userId = req.user?.userId;

    const courseLessons = getLessonsForCourse(courseSlug);
    const targetIndex = courseLessons.findIndex((l) => l.slug === lessonSlug);
    if (targetIndex === -1) {
      return res.status(404).json({ success: false, error: "Lesson not found in course" });
    }

    const lesson = courseLessons[targetIndex];

    // Check lock status
    const lockCheck = await ProgressService.checkLessonLock({
      userId,
      courseSlug,
      lessonSlug,
    });

    if (lockCheck.isLocked) {
      return res.status(403).json({
        success: false,
        error: "Lesson is locked",
        reason: lockCheck.reason || "Complete the previous lesson first",
        requiredLessonSlug: lockCheck.requiredLessonSlug,
      });
    }

    const previousLesson = targetIndex > 0 ? courseLessons[targetIndex - 1] : null;
    const nextLesson = targetIndex < courseLessons.length - 1 ? courseLessons[targetIndex + 1] : null;

    let userProgress = null;
    if (userId) {
      userProgress = await Progress.findOne({
        userId,
        lessonId: lessonSlug,
      }).lean();
    }

    const course = ALL_COURSES.find((c) => c.slug === courseSlug) || { slug: courseSlug, title: courseSlug };

    return res.status(200).json({
      success: true,
      data: {
        lesson,
        course,
        previousLesson: previousLesson ? { slug: previousLesson.slug, title: previousLesson.title } : null,
        nextLesson: nextLesson ? { slug: nextLesson.slug, title: nextLesson.title } : null,
        lessonIndex: targetIndex + 1,
        totalLessons: courseLessons.length,
        progress: userProgress ? {
          status: userProgress.status,
          scrollPosition: userProgress.scrollPosition || 0,
          readingProgress: userProgress.readingProgress || 0,
          progressPercentage: userProgress.progressPercentage || 0,
          exerciseProgress: userProgress.exerciseProgress || {},
          quizScore: userProgress.quizScore || 0,
          timeSpent: userProgress.timeSpent || 0,
        } : null,
        userProgress: userProgress ? {
          status: userProgress.status,
          scrollPosition: userProgress.scrollPosition || 0,
          readingProgress: userProgress.readingProgress || 0,
          progressPercentage: userProgress.progressPercentage || 0,
          exerciseProgress: userProgress.exerciseProgress || {},
          quizScore: userProgress.quizScore || 0,
          timeSpent: userProgress.timeSpent || 0,
        } : null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to load lesson" });
  }
}

export async function startCourseLesson(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const courseSlug = getParamString(req.params.courseSlug);
    const lessonSlug = getParamString(req.params.lessonSlug);

    const lockCheck = await ProgressService.checkLessonLock({
      userId,
      courseSlug,
      lessonSlug,
    });

    if (lockCheck.isLocked) {
      return res.status(403).json({
        success: false,
        error: "Lesson is locked",
        reason: lockCheck.reason || "Complete the previous lesson first",
        requiredLessonSlug: lockCheck.requiredLessonSlug,
      });
    }

    const progress = await ProgressService.updateLessonProgress({
      userId,
      lessonId: lessonSlug,
      courseId: courseSlug,
    });

    return res.status(200).json({
      success: true,
      data: progress,
      message: "Lesson marked as in-progress",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to start lesson" });
  }
}

export async function updateCourseLessonProgress(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const courseSlug = getParamString(req.params.courseSlug);
    const lessonSlug = getParamString(req.params.lessonSlug);
    const {
      scrollPosition,
      readingProgress,
      progressPercentage,
      exerciseProgress,
      quizScore,
      timeSpent,
    } = req.body;

    if (scrollPosition !== undefined && (Number(scrollPosition) < 0 || Number(scrollPosition) > 100)) {
      return res.status(400).json({ success: false, error: "scrollPosition must be between 0 and 100" });
    }
    if (readingProgress !== undefined && (Number(readingProgress) < 0 || Number(readingProgress) > 100)) {
      return res.status(400).json({ success: false, error: "readingProgress must be between 0 and 100" });
    }

    const progress = await ProgressService.updateLessonProgress({
      userId,
      lessonId: lessonSlug,
      courseId: courseSlug,
      scrollPosition: scrollPosition !== undefined ? Number(scrollPosition) : undefined,
      readingProgress: readingProgress !== undefined ? Number(readingProgress) : undefined,
      progressPercentage: progressPercentage !== undefined ? Number(progressPercentage) : undefined,
      exerciseProgress,
      quizScore: quizScore !== undefined ? Number(quizScore) : undefined,
      timeSpent: timeSpent !== undefined ? Number(timeSpent) : undefined,
    });

    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to save lesson progress" });
  }
}

export async function completeCourseLesson(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const courseSlug = getParamString(req.params.courseSlug);
    const lessonSlug = getParamString(req.params.lessonSlug);
    const { timeSpent, exerciseProgress, quizScore } = req.body;

    // Check lock status
    const lockCheck = await ProgressService.checkLessonLock({
      userId,
      courseSlug,
      lessonSlug,
    });

    if (lockCheck.isLocked) {
      return res.status(403).json({
        success: false,
        error: "Lesson is locked",
        reason: lockCheck.reason || "Complete the previous lesson first",
        requiredLessonSlug: lockCheck.requiredLessonSlug,
      });
    }

    const result = await ProgressService.completeLesson({
      userId,
      lessonId: lessonSlug,
      courseId: courseSlug,
      status: "completed",
      progressPercentage: 100,
      scrollPosition: 100,
      readingProgress: 100,
      exerciseProgress,
      quizScore: quizScore !== undefined ? Number(quizScore) : undefined,
      timeSpent: Number(timeSpent) || 0,
      validateLock: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        alreadyCompleted: !result.isFirstTimeCompleted,
        earnedXP: result.xpAwarded,
        isCourseCompleted: result.isCourseCompleted,
        courseBonusXP: result.courseBonusXP,
        userLevelInfo: result.userLevelInfo,
        progress: result.progress,
        unlockedAchievements: result.unlockedAchievements,
        nextLesson: result.nextLesson,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to complete lesson" });
  }
}

export async function getCourseResume(req: AuthenticatedRequest, res: Response) {
  try {
    const slug = getParamString(req.params.slug);
    const resumeData = await ProgressService.getCourseResume({
      userId: req.user?.userId,
      courseSlug: slug,
    });

    if (!resumeData) {
      return res.status(404).json({ success: false, error: "No resume target available" });
    }

    return res.status(200).json({
      success: true,
      data: resumeData,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to resolve resume target" });
  }
}

export async function getCourseModules(req: Request, res: Response) {
  try {
    const slug = getParamString(req.params.slug);
    const curriculum = await ProgressService.getCourseCurriculum({ courseSlug: slug });
    return res.status(200).json({ success: true, data: { modules: curriculum.modules } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch modules" });
  }
}

export async function getCourseProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const slug = getParamString(req.params.slug);
    const curriculum = await ProgressService.getCourseCurriculum({
      userId: req.user.userId,
      courseSlug: slug,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalLessons: curriculum.totalLessons,
        completedLessons: curriculum.completedLessons,
        progressPercentage: curriculum.progressPercentage,
        isCourseCompleted: curriculum.isCourseCompleted,
        modules: curriculum.modules,
        resumeLesson: curriculum.resumeLesson,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch course progress" });
  }
}
