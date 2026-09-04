import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Note } from "../models/Note";
import { validateInput, NoteSchema, UpdateNoteSchema } from "../utils/validation";
import { resolveLesson } from "../utils/resolveLesson";

export async function getNotes(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const lessonIdParam = req.query.lessonId as string;
    const query: any = { userId: req.user.userId };

    if (lessonIdParam) {
      const lesson = await resolveLesson(lessonIdParam);
      if (lesson) {
        query.lessonId = lesson._id;
      } else {
        return res.status(200).json({ success: true, data: { notes: [], count: 0 } });
      }
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 }).lean();
    return res.status(200).json({ success: true, data: { notes, count: notes.length } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch notes" });
  }
}

export async function createNote(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { lessonId, content } = validateInput(NoteSchema, req.body);

    let resolvedLessonId = undefined;
    if (lessonId) {
      const lesson = await resolveLesson(lessonId);
      if (!lesson) {
        return res.status(404).json({ success: false, error: "Lesson not found" });
      }
      resolvedLessonId = lesson._id;
    }

    const note = new Note({
      userId: req.user.userId,
      lessonId: resolvedLessonId,
      content,
    });
    await note.save();

    return res.status(201).json({ success: true, data: { note }, message: "Note created successfully" });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || "Failed to create note" });
  }
}

export async function updateNote(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { id } = req.params;
    const { content } = validateInput(UpdateNoteSchema, req.body);

    const note = await Note.findOne({ _id: id, userId: req.user.userId });
    if (!note) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    note.content = content;
    await note.save();

    return res.status(200).json({ success: true, data: { note }, message: "Note updated successfully" });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message || "Failed to update note" });
  }
}

export async function deleteNote(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { id } = req.params;
    const result = await Note.deleteOne({ _id: id, userId: req.user.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    return res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to delete note" });
  }
}
