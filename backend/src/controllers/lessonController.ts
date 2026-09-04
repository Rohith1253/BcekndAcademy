import { Request, Response } from "express";
import { Lesson } from "../models/Lesson";
import { Module } from "../models/Module";

export async function getLessons(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;

    const query: any = { published: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const lessons = await Lesson.find(query).sort({ order: 1 }).lean();
    return res.status(200).json({ success: true, data: { lessons, total: lessons.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch lessons" });
  }
}

export async function getLessonBySlug(req: Request, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const lesson = await Lesson.findOne({ slug, published: true }).lean();
    if (!lesson) {
      return res.status(404).json({ success: false, error: "Lesson not found" });
    }

    const courseModules = await Module.find({ courseId: lesson.courseId }).sort({ order: 1 }).lean();
    const moduleOrderMap = new Map(courseModules.map((m, idx) => [String(m._id), idx]));

    const rawLessons = await Lesson.find({ courseId: lesson.courseId, published: true }).lean();
    const allLessons = rawLessons.sort((a, b) => {
      const modA = moduleOrderMap.get(String(a.moduleId)) ?? 0;
      const modB = moduleOrderMap.get(String(b.moduleId)) ?? 0;
      if (modA !== modB) return modA - modB;
      return (a.order || 0) - (b.order || 0);
    });

    const currentIndex = allLessons.findIndex((l) => l.slug === lesson.slug);

    const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return res.status(200).json({
      success: true,
      data: {
        lesson,
        previousLesson,
        nextLesson,
        isFirstLesson: currentIndex === 0,
        isLastLesson: currentIndex === allLessons.length - 1,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch lesson" });
  }
}
