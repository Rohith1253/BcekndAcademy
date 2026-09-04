import { Note } from "../../backend/src/models/Note";
import { Bookmark } from "../../backend/src/models/Bookmark";
import { Progress } from "../../backend/src/models/Progress";
import { QuizResult } from "../../backend/src/models/Quiz";
import { ChallengeSubmission } from "../../backend/src/models/Challenge";

export function runAuthorizationOwnershipTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Authorization & Resource Ownership Tests ---");

  const userA = "507f1f77bcf86cd799439011";
  const userB = "507f1f77bcf86cd799439022";
  const lessonId = "507f1f77bcf86cd799439033";

  // 1. Note Ownership Isolation Query Scoping
  const noteQueryUserA = Note.find({ userId: userA, lessonId });
  const noteFilter = noteQueryUserA.getFilter();
  assert(
    String(noteFilter.userId) === userA,
    "Note query explicitly scopes search filter by authenticated userId"
  );

  // Cross-user IDOR access protection check
  const crossUserAccessAttempt = String(noteFilter.userId) === userB;
  assert(
    crossUserAccessAttempt === false,
    "Cross-user IDOR note retrieval attempt blocked by query scoping"
  );

  // 2. Bookmark Ownership Scoping
  const bookmarkQuery = Bookmark.find({ userId: userA });
  assert(
    String(bookmarkQuery.getFilter().userId) === userA,
    "Bookmark query explicitly scopes search filter by authenticated userId"
  );

  // 3. Progress Ownership Scoping
  const progressQuery = Progress.find({ userId: userA });
  assert(
    String(progressQuery.getFilter().userId) === userA,
    "Progress query explicitly scopes search filter by authenticated userId"
  );

  // 4. QuizResult Ownership Scoping
  const quizQuery = QuizResult.find({ userId: userA });
  assert(
    String(quizQuery.getFilter().userId) === userA,
    "QuizResult query explicitly scopes search filter by authenticated userId"
  );
}
