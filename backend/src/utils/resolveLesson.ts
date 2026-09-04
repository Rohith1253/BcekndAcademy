import { Lesson } from "../models/Lesson";
import { isValidObjectId } from "./validation";

/**
 * Safely resolves a lesson identifier (whether a 24-char MongoDB ObjectId OR a string slug)
 * to its authoritative Lesson Mongoose document.
 */
export async function resolveLesson(idOrSlug: string) {
  if (!idOrSlug || typeof idOrSlug !== "string") return null;
  const trimmed = idOrSlug.trim();
  if (!trimmed) return null;

  if (isValidObjectId(trimmed)) {
    const lessonByObjId = await Lesson.findById(trimmed);
    if (lessonByObjId) return lessonByObjId;
  }

  return await Lesson.findOne({ slug: trimmed.toLowerCase() });
}
