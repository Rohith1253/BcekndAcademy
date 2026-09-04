import { User } from "../../backend/src/models/User";
import { Bookmark } from "../../backend/src/models/Bookmark";
import { Lesson } from "../../backend/src/models/Lesson";
import { QuizResult } from "../../backend/src/models/Quiz";
import { ChallengeSubmission } from "../../backend/src/models/Challenge";
import { Progress } from "../../backend/src/models/Progress";
import { Note } from "../../backend/src/models/Note";
import { Achievement } from "../../backend/src/models/Achievement";

export function runDatabaseModelTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Database Schema & Index Integrity Tests ---");

  // 1. User Email Uniqueness & Schema Verification
  const userEmailPath = User.schema.path("email") as any;
  assert(
    userEmailPath && userEmailPath.options.unique === true,
    "User schema defines unique index on email"
  );
  assert(
    userEmailPath && userEmailPath.options.required === true,
    "User schema requires email field"
  );

  // 2. Compound Indexes Verification for Performance
  const bookmarkIndexes = Bookmark.schema.indexes();
  const hasBookmarkCompoundIndex = bookmarkIndexes.some(
    ([fields, options]: [Record<string, number>, any]) =>
      fields.userId === 1 && fields.lessonId === 1 && options?.unique === true
  );
  assert(
    hasBookmarkCompoundIndex,
    "Bookmark schema defines unique compound index on { userId: 1, lessonId: 1 }"
  );

  const progressIndexes = Progress.schema.indexes();
  const hasProgressUniqueIndex = progressIndexes.some(
    ([fields, options]: [Record<string, number>, any]) =>
      fields.userId === 1 && fields.lessonId === 1 && options?.unique === true
  );
  assert(
    hasProgressUniqueIndex,
    "Progress schema defines unique compound index on { userId: 1, lessonId: 1 }"
  );

  const quizResultIndexes = QuizResult.schema.indexes();
  const hasQuizResultCompoundIndex = quizResultIndexes.some(
    ([fields]: [Record<string, number>]) =>
      fields.userId === 1 && fields.lessonId === 1
  );
  assert(
    hasQuizResultCompoundIndex,
    "QuizResult schema defines compound index on { userId: 1, lessonId: 1 }"
  );

  const challengeIndexes = ChallengeSubmission.schema.indexes();
  const hasChallengeCompoundIndex = challengeIndexes.some(
    ([fields]: [Record<string, number>]) =>
      fields.userId === 1 && fields.challengeId === 1
  );
  assert(
    hasChallengeCompoundIndex,
    "ChallengeSubmission schema defines compound index on { userId: 1, challengeId: 1 }"
  );

  const noteIndexes = Note.schema.indexes();
  const hasNoteCompoundIndex = noteIndexes.some(
    ([fields]: [Record<string, number>]) =>
      fields.userId === 1 && fields.lessonId === 1
  );
  assert(
    hasNoteCompoundIndex,
    "Note schema defines compound index on { userId: 1, lessonId: 1 }"
  );

  // 3. Lesson Schema Slug Uniqueness
  const lessonSlugPath = Lesson.schema.path("slug") as any;
  assert(
    lessonSlugPath && lessonSlugPath.options.unique === true,
    "Lesson schema defines unique index on slug"
  );
}
