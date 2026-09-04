import { z } from "zod";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// ObjectId format validator helper
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== "string") return false;
  return OBJECT_ID_REGEX.test(id);
}

// Sanitization helper for safe string parameters (prevents NoSQL object parameter injection)
export function sanitizeStringParam(param: unknown): string | null {
  if (typeof param !== "string") return null;
  const trimmed = param.trim();
  if (!trimmed || trimmed.startsWith("$")) return null;
  return trimmed;
}

// Auth Schemas
export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email address too long"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address").max(100, "Email address too long"),
  password: z.string().min(1, "Password is required").max(100, "Password too long"),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(100, "Password too long"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

// Quiz Schemas
export const QuizSubmissionSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required").max(100, "lessonId too long"),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, "questionId is required").max(100, "questionId too long"),
        selectedOptionIndex: z.number().int().min(0, "selectedOptionIndex must be non-negative"),
      })
    )
    .min(1, "Answers array cannot be empty")
    .max(100, "Too many answers submitted"),
  timeSpent: z.number().min(0, "timeSpent must be non-negative"),
});

// Note Schemas
export const NoteSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required").max(100, "lessonId too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content exceeds maximum limit of 10,000 characters"),
});

export const UpdateNoteSchema = z.object({
  content: z.string().min(1, "Note content is required").max(10000, "Note content exceeds maximum limit of 10,000 characters"),
});

// Bookmark Schemas
export const BookmarkSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required").max(100, "lessonId too long"),
});

// Challenge Submission
export const ChallengeSubmissionSchema = z.object({
  challengeId: z.string().min(1, "challengeId is required").max(100, "challengeId too long"),
  code: z.string().min(1, "Code is required").max(50000, "Code exceeds maximum limit of 50,000 characters"),
  testsPassed: z.number().int().min(0, "testsPassed must be a non-negative integer").optional(),
  totalTests: z.number().int().min(1, "totalTests must be at least 1").optional(),
  timeSpent: z.number().min(0, "timeSpent cannot be negative").optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type QuizSubmissionInput = z.infer<typeof QuizSubmissionSchema>;
export type NoteInput = z.infer<typeof NoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
export type BookmarkInput = z.infer<typeof BookmarkSchema>;
export type ChallengeSubmissionInput = z.infer<typeof ChallengeSubmissionSchema>;

// Validation helper
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
}
