import {
  RegisterSchema,
  LoginSchema,
  QuizSubmissionSchema,
  NoteSchema,
  validateInput,
  isValidObjectId,
  sanitizeStringParam,
} from "../../backend/src/utils/validation";

export function runValidationUnitTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Unit Tests: Input Validation & Sanitization ---");

  // 1. Register Schema Validation
  const validRegister = RegisterSchema.safeParse({
    email: "user@example.com",
    password: "Password123!",
    name: "Valid User",
  });
  assert(validRegister.success === true, "RegisterSchema accepts valid registration payload");

  const invalidRegisterEmail = RegisterSchema.safeParse({
    email: "not-an-email",
    password: "Password123!",
    name: "Valid User",
  });
  assert(invalidRegisterEmail.success === false, "RegisterSchema rejects invalid email format");

  const invalidRegisterPassword = RegisterSchema.safeParse({
    email: "user@example.com",
    password: "short",
    name: "Valid User",
  });
  assert(invalidRegisterPassword.success === false, "RegisterSchema rejects password shorter than 8 chars");

  // 2. Login Schema Validation
  const validLogin = LoginSchema.safeParse({
    email: "user@example.com",
    password: "Password123!",
  });
  assert(validLogin.success === true, "LoginSchema accepts valid login payload");

  // 3. Quiz Submission Schema Validation
  const validQuizSub = QuizSubmissionSchema.safeParse({
    lessonId: "http-basics",
    answers: [{ questionId: "q1", selectedOptionIndex: 0 }],
    timeSpent: 45,
  });
  assert(validQuizSub.success === true, "QuizSubmissionSchema accepts valid quiz submission");

  // 4. Note Schema Validation
  const validNote = NoteSchema.safeParse({
    lessonId: "http-basics",
    content: "Important note about HTTP status 200 OK",
  });
  assert(validNote.success === true, "NoteSchema accepts valid note payload");

  // 6. ObjectId Validator
  assert(isValidObjectId("507f1f77bcf86cd799439011") === true, "isValidObjectId accepts valid 24-hex ObjectId string");
  assert(isValidObjectId("invalid-hex-id") === false, "isValidObjectId rejects non-hex ObjectId string");
  assert(isValidObjectId(null as any) === false, "isValidObjectId handles null gracefully without throwing");

  // 7. Input String Sanitizer
  assert(sanitizeStringParam("  hello  ") === "hello", "sanitizeStringParam trims leading and trailing whitespace");
  assert(
    sanitizeStringParam('<script>alert("xss")</script>') === "",
    "sanitizeStringParam strips dangerous script tags"
  );
  assert(sanitizeStringParam({ $gt: "" } as any) === "", "sanitizeStringParam neutralizes NoSQL operator objects");
}
