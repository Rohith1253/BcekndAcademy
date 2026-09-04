import {
  generateToken,
  verifyToken,
  hashPassword,
  comparePasswords,
  getJwtSecret,
} from "../../backend/src/utils/auth";

export async function runAuthUnitTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Unit Tests: Authentication & Security ---");

  // 1. JWT Secret Enforcement
  assert(typeof getJwtSecret() === "string" && getJwtSecret().length > 0, "getJwtSecret returns a valid non-empty secret");

  // 2. Token Generation & Verification
  const userId = "507f1f77bcf86cd799439011";
  const email = "unit.test@example.com";
  const token = generateToken({ userId, email });

  assert(typeof token === "string" && token.split(".").length === 3, "generateToken generates a valid 3-part JWT");

  const decoded = verifyToken(token);
  assert(
    decoded !== null && decoded.userId === userId && decoded.email === email,
    "verifyToken correctly decodes JWT payload matching userId and email"
  );

  // 3. Password Hashing & Salting Verification
  const rawPassword = "StrongPassword123!";
  const hash = await hashPassword(rawPassword);

  assert(
    typeof hash === "string" && hash.startsWith("$2") && hash !== rawPassword,
    "hashPassword generates a valid bcrypt salted hash"
  );

  const isValidMatch = await comparePasswords(rawPassword, hash);
  assert(isValidMatch === true, "comparePasswords returns true for correct plaintext password");

  const isInvalidMatch = await comparePasswords("WrongPassword123!", hash);
  assert(isInvalidMatch === false, "comparePasswords returns false for incorrect plaintext password");
}
