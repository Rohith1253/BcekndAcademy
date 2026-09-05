/**
 * canonical-practice.ts
 *
 * Unified Practice System for Backend Academy (Backend).
 */

import type { PracticeExercise } from "../types/curriculum";

export const CANONICAL_PRACTICE_EXERCISES: PracticeExercise[] = [
  // ─── 1. LEVEL 0 FOUNDATION EXERCISES (EASY) ──────────────────────────────
  {
    id: "prac-l0-01-predict-output",
    slug: "l0-predict-memory-sum",
    title: "Predict Output: Memory Calculation",
    type: "predict-output",
    difficulty: "foundation",
    language: "agnostic",
    courseSlug: "computer-software-foundations",
    lessonSlug: "computer-hardware-cpu-ram",
    concepts: ["Memory", "Variables", "Arithmetic"],
    question: "What value will the CPU compute and print to the console?",
    prompt: "Study the code below and determine the exact output value.",
    starterCode: `const a = 10;
const b = 25;
const c = a + b;
console.log(c);`,
    expectedOutput: "35",
    hints: [
      "Level 1 (Concept): The '+' operator sums two numeric values.",
      "Level 2 (Logic): 'a' is 10 and 'b' is 25. Add them together.",
      "Level 3 (Implementation): 10 + 25 = 35."
    ],
    solution: "35",
    explanation: "The variable `a` stores 10 and `b` stores 25 in memory. The CPU adds them together to produce 35 and writes the result to standard output.",
    executionSupport: "interactive"
  },
  {
    id: "prac-l0-02-fix-bug",
    slug: "l0-fix-variable-reassign",
    title: "Fix the Bug: Constant Reassignment",
    type: "fix-bug",
    difficulty: "foundation",
    language: "javascript",
    courseSlug: "computer-software-foundations",
    lessonSlug: "what-is-programming-code",
    concepts: ["const / let", "Syntax Errors"],
    question: "The following code throws a TypeError because a constant variable is being reassigned. Fix it using `let`.",
    prompt: "Change `const` to `let` for variables that must change value during program execution.",
    starterCode: `// Fix the error by using 'let' instead of 'const' for counter
const counter = 1;
counter = 2;
console.log("Updated counter:", counter);`,
    expectedOutput: "Updated counter: 2",
    hints: [
      "Level 1 (Concept): Variables declared with `const` cannot be reassigned.",
      "Level 2 (Logic): Change the declaration keyword of `counter` to `let`.",
      "Level 3 (Implementation): Replace `const counter = 1;` with `let counter = 1;`."
    ],
    solution: `let counter = 1;
counter = 2;
console.log("Updated counter:", counter);`,
    explanation: "`const` declares a read-only immutable binding. When a value must change over time, declare it with `let`.",
    executionSupport: "interactive"
  },
  {
    id: "prac-l0-03-mcq",
    slug: "l0-ram-vs-storage-mcq",
    title: "Concept Quiz: Volatile vs Non-Volatile Memory",
    type: "multiple-choice",
    difficulty: "foundation",
    language: "agnostic",
    courseSlug: "computer-software-foundations",
    lessonSlug: "computer-hardware-cpu-ram",
    concepts: ["RAM", "Storage", "Volatile Memory"],
    question: "What happens to the data stored in RAM when a server reboots or loses electrical power?",
    prompt: "Select the single correct technical behavior.",
    options: [
      "All data in RAM is permanently wiped immediately (Volatile Memory)",
      "Data in RAM is automatically copied to the CPU cache",
      "Data in RAM remains saved permanently until manually deleted",
      "The operating system encrypts RAM data to disk"
    ],
    correctOptionIndex: 0,
    hints: [
      "Level 1 (Concept): Think about why servers need SSDs and hard drives to persist databases.",
      "Level 2 (Logic): RAM relies on constant electrical charge to maintain capacitor state.",
      "Level 3 (Implementation): RAM is volatile; turning off power loses all active memory."
    ],
    explanation: "RAM is volatile memory. Without continuous electrical power, all stored data in RAM is instantly lost. Persistent data must be written to disk/storage.",
    executionSupport: "content-only"
  },

  // ─── 2. LEVEL 1 UNIVERSAL LOGIC EXERCISES (MEDIUM) ────────────────────────
  {
    id: "prac-l1-01-complete-code",
    slug: "l1-complete-discount-logic",
    title: "Complete the Code: Role-Based Authorization Check",
    type: "complete-code",
    difficulty: "beginner",
    language: "javascript",
    courseSlug: "universal-programming-fundamentals",
    lessonSlug: "conditions-branching-logic",
    concepts: ["Conditions", "Boolean Logic", "Security"],
    question: "Complete the conditional check so that admin users with active accounts receive 'Access Granted', while all others receive 'Access Denied'.",
    prompt: "Fill in the condition in the `if` statement.",
    starterCode: `function checkAccess(role, isActive) {
  if (role === "admin" && isActive) {
    return "Access Granted";
  } else {
    return "Access Denied";
  }
}

console.log(checkAccess("admin", true));`,
    expectedOutput: "Access Granted",
    hints: [
      "Level 1 (Concept): Use the logical AND (`&&`) operator to require both conditions.",
      "Level 2 (Logic): Check `role === 'admin' && isActive === true`.",
      "Level 3 (Implementation): `if (role === 'admin' && isActive) { ... }`"
    ],
    solution: `function checkAccess(role, isActive) {
  if (role === "admin" && isActive) {
    return "Access Granted";
  } else {
    return "Access Denied";
  }
}
console.log(checkAccess("admin", true));`,
    explanation: "The logical AND (`&&`) operator ensures that both the role match and account active state are true before allowing access.",
    executionSupport: "interactive"
  },
  {
    id: "prac-l1-02-code-challenge",
    slug: "l1-challenge-array-filter",
    title: "Code Challenge: Filter Active Database Records",
    type: "code-challenge",
    difficulty: "beginner",
    language: "javascript",
    courseSlug: "universal-programming-fundamentals",
    lessonSlug: "algorithms-computational-steps",
    concepts: ["Array Filtering", "Algorithms"],
    question: "Write a function `filterActiveUsers(users)` that takes an array of user objects and returns only those with `status === 'active'`.",
    prompt: "Implement the filtering algorithm using a loop or `Array.prototype.filter`.",
    starterCode: `function filterActiveUsers(users) {
  return users.filter(u => u.status === "active");
}

const sampleUsers = [
  { id: 1, name: "Alice", status: "active" },
  { id: 2, name: "Bob", status: "suspended" },
  { id: 3, name: "Charlie", status: "active" }
];

console.log(filterActiveUsers(sampleUsers));`,
    expectedOutput: '[ { id: 1, name: "Alice", status: "active" }, { id: 3, name: "Charlie", status: "active" } ]',
    hints: [
      "Level 1 (Concept): Filtering means inspecting each item and keeping only those that satisfy a predicate.",
      "Level 2 (Logic): Check each user object's `status` property for equality with `'active'`.",
      "Level 3 (Implementation): `users.filter(u => u.status === 'active')`."
    ],
    solution: `function filterActiveUsers(users) {
  return users.filter(u => u.status === "active");
}`,
    explanation: "Filtering database collections based on status predicates is one of the most fundamental operations in backend services.",
    executionSupport: "interactive"
  },

  // ─── 3. LEVEL 6-8 BACKEND ENGINEERING SCENARIOS (HARD) ───────────────────
  {
    id: "prac-l6-01-backend-scenario",
    slug: "l6-backend-scenario-rate-limiter",
    title: "Backend Scenario: Express Auth Guard & Token Verification",
    type: "backend-scenario",
    difficulty: "intermediate",
    language: "javascript",
    courseSlug: "express-rest-apis",
    lessonSlug: "express-middleware-chain",
    concepts: ["Express Middleware", "Security", "JWT Header Guard"],
    question: "Simulate an Express authentication guard that verifies the Bearer token in request headers.",
    prompt: "Inspect the Authorization header. If invalid, return 401 Unauthorized; if valid, attach the user object and proceed.",
    starterCode: `function authGuard(req, res, next) {
  const authHeader = req.headers && req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer Token" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== "valid-token-123") {
    return res.status(403).json({ error: "Invalid Token" });
  }

  req.user = { id: 42, role: "member" };
  next();
}

// Test request:
const mockReq = { headers: { authorization: "Bearer valid-token-123" } };
const mockRes = {
  status(code) { this.statusCode = code; return this; },
  json(data) { this.body = data; return this; }
};

let nextCalled = false;
authGuard(mockReq, mockRes, () => { nextCalled = true; });
console.log("Auth Passed:", nextCalled);
console.log("Attached User:", mockReq.user);`,
    expectedOutput: "Auth Passed: true\nAttached User: { id: 42, role: 'member' }",
    hints: [
      "Level 1 (Concept): Express middleware intercepts HTTP requests before they reach the route controller.",
      "Level 2 (Logic): Check the `authorization` header for the `Bearer ` prefix and extract the token string.",
      "Level 3 (Implementation): Call `next()` on success, or return `res.status(401).json(...)` on failure."
    ],
    solution: `function authGuard(req, res, next) {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer Token" });
  }
  const token = authHeader.split(" ")[1];
  if (token !== "valid-token-123") {
    return res.status(403).json({ error: "Invalid Token" });
  }
  req.user = { id: 42, role: "member" };
  next();
}`,
    explanation: "Bearer token extraction and validation inside a reusable middleware function prevents unauthorized requests from touching database controllers.",
    executionSupport: "interactive"
  },

  // ─── 4. MULTI-LANGUAGE PRACTICE (GUIDED / CONTENT-ONLY) ──────────────────
  {
    id: "prac-python-01-syntax",
    slug: "py-pydantic-validation-concept",
    title: "Python Concept: Pydantic Schema Validation",
    type: "backend-scenario",
    difficulty: "beginner",
    language: "python",
    courseSlug: "python-backend-foundations",
    lessonSlug: "fastapi-pydantic-models",
    concepts: ["Python", "FastAPI", "Pydantic", "Type Hints"],
    question: "How does FastAPI use Pydantic models to validate incoming HTTP JSON request bodies?",
    prompt: "Analyze the Python model definition.",
    starterCode: `# Python FastAPI Pydantic Model (Interactive Python execution planned)
from pydantic import BaseModel, EmailStr

class CreateUserPayload(BaseModel):
    username: str
    email: EmailStr
    age: int`,
    hints: [
      "Level 1 (Concept): Pydantic parses incoming JSON into validated Python class instances.",
      "Level 2 (Logic): If a client sends 'age': 'not-a-number', Pydantic automatically returns a 422 Unprocessable Entity error.",
      "Level 3 (Implementation): FastAPI uses Python type annotations to generate OpenAPI documentation automatically."
    ],
    explanation: "In FastAPI, Pydantic models automatically validate client payloads at runtime, serialize response data, and generate Swagger documentation.",
    executionSupport: "guided"
  }
];

export function getPracticeExercisesForCourse(courseSlug: string): PracticeExercise[] {
  return CANONICAL_PRACTICE_EXERCISES.filter((e) => e.courseSlug === courseSlug);
}

export function getPracticeExerciseBySlug(slug: string): PracticeExercise | undefined {
  return CANONICAL_PRACTICE_EXERCISES.find((e) => e.slug === slug || e.id === slug);
}
