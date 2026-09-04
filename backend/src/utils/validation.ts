import { z } from "zod";
import mongoose from "mongoose";

export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
}

export function sanitizeStringParam(param: unknown): string {
  if (typeof param !== "string") return "";
  const trimmed = param.trim();
  if (trimmed.startsWith("$")) return "";
  return trimmed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email address too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email address too long"),
  password: z.string().min(1, "Password is required").max(100, "Password too long"),
});

export const NoteSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
  content: z.string().min(1, "content is required").max(2000, "content too long"),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1, "content is required").max(2000, "content too long"),
});

export const BookmarkSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
});

export const QuizSubmissionSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptionIndex: z.number(),
    })
  ),
  timeSpent: z.number().default(0),
});
