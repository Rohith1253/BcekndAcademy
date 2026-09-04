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
