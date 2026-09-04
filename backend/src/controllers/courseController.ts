import { Request, Response } from "express";
import { Course } from "../models/Course";
import { Module } from "../models/Module";
import { Lesson } from "../models/Lesson";
import { Progress } from "../models/Progress";
import { AuthenticatedRequest } from "../middleware/auth";

export async function getCourses(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;

    const query: any = { published: true };
    if (category && category !== "All") query.category = category;
    if (difficulty && difficulty !== "All") query.difficulty = difficulty.toLowerCase();

    const courses = await Course.find(query).sort({ order: 1 }).lean();

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

export async function getCourseBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug, published: true }).lean();
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const modules = await Module.find({ courseId: course._id }).sort({ order: 1 }).lean();
    const moduleIds = modules.map((m) => m._id);
    const lessons = await Lesson.find({ moduleId: { $in: moduleIds }, published: true }).sort({ order: 1 }).lean();

    const modulesWithLessons = modules.map((mod) => ({
      ...mod,
      lessons: lessons.filter((l) => l.moduleId?.toString() === mod._id.toString()),
    }));

    return res.status(200).json({
      success: true,
      data: {
        course,
        modules: modulesWithLessons,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch course details" });
  }
}

export async function getCourseModules(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).lean();
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const modules = await Module.find({ courseId: course._id }).sort({ order: 1 }).lean();
    return res.status(200).json({ success: true, data: { modules } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch modules" });
  }
}

export async function getCourseProgress(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { slug } = req.params;
    const course = await Course.findOne({ slug }).lean();
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    const progressRecords = await Progress.find({ userId: req.user.userId, courseId: course._id }).lean();
    return res.status(200).json({ success: true, data: { progress: progressRecords } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch course progress" });
  }
}
