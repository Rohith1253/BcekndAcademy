import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Bookmark } from "../models/Bookmark";
import { validateInput, BookmarkSchema } from "../utils/validation";
import { resolveLesson } from "../utils/resolveLesson";

export async function getBookmarks(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const bookmarks = await Bookmark.find({ userId: req.user.userId })
      .populate("lessonId")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: { bookmarks, count: bookmarks.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch bookmarks" });
  }
}

export async function addBookmark(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { lessonId } = validateInput(BookmarkSchema, req.body);
    const lesson = await resolveLesson(lessonId);
    if (!lesson) {
      return res.status(404).json({ success: false, error: "Lesson not found" });
    }

    let bookmark = await Bookmark.findOne({ userId: req.user.userId, lessonId: lesson._id });
    if (!bookmark) {
      bookmark = new Bookmark({ userId: req.user.userId, lessonId: lesson._id });
      await bookmark.save();
    }

    return res.status(201).json({ success: true, data: { bookmark }, message: "Bookmark added successfully" });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || "Failed to add bookmark" });
  }
}

export async function removeBookmark(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const rawLessonId = req.params.lessonId;
    const lessonIdStr = Array.isArray(rawLessonId) ? rawLessonId[0] : rawLessonId;
    const lesson = await resolveLesson(lessonIdStr);
    if (!lesson) {
      return res.status(404).json({ success: false, error: "Lesson not found" });
    }

    const result = await Bookmark.deleteOne({ userId: req.user.userId, lessonId: lesson._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Bookmark not found" });
    }

    return res.status(200).json({ success: true, message: "Bookmark removed successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to remove bookmark" });
  }
}
