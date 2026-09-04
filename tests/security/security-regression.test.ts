import { checkRateLimit, applyRateLimit } from "../../frontend/lib/rate-limit";
import { isValidObjectId, sanitizeStringParam } from "../../backend/src/utils/validation";
import nextConfig from "../../frontend/next.config";

export async function runSecurityRegressionTests(assert: (cond: boolean, msg: string) => void) {
  console.log("\n--- Executing Security Regression Tests ---");

  // 1. Rate Limiting HTTP 429 Enforcement
  const headersMap = new Map([["x-forwarded-for", "203.0.113.88"]]);
  const req = {
    headers: {
      get: (key: string) => headersMap.get(key.toLowerCase()) || null,
    },
  } as any;
  const rateKey = `sec-reg-${Date.now()}`;

  checkRateLimit(req, rateKey, 2, 60000);
  checkRateLimit(req, rateKey, 2, 60000);
  const exceeded = checkRateLimit(req, rateKey, 2, 60000);
  assert(exceeded.success === false, "Rate limiter detects exceeded request quota");

  const blockedRes = applyRateLimit(req, rateKey, 2, 60000);
  assert(
    blockedRes !== null && blockedRes.status === 429,
    "Rate limiter returns HTTP 429 Too Many Requests when quota is exceeded"
  );

  // 2. Input Sanitization & MongoDB Injection Defense
  const maliciousInput = '<script>alert("xss")</script>';
  const sanitizedInput = sanitizeStringParam(maliciousInput);
  assert(
    !sanitizedInput.includes("<script>"),
    "sanitizeStringParam strips dangerous HTML script tags"
  );

  const mongoNoSQLInjection = { $gt: "" };
  assert(
    isValidObjectId(mongoNoSQLInjection as any) === false,
    "isValidObjectId rejects NoSQL operator injection payloads ({ $gt: '' })"
  );

  const validId = "507f1f77bcf86cd799439011";
  assert(
    isValidObjectId(validId) === true,
    "isValidObjectId accepts valid 24-character hex MongoDB ObjectId"
  );

  // 3. Security Headers Enforcement (in next.config.ts)
  const headersFunc = (nextConfig as any).headers;
  assert(typeof headersFunc === "function", "next.config defines security headers function");

  if (typeof headersFunc === "function") {
    const headersConfig = await headersFunc();
    const globalHeaders = headersConfig[0]?.headers || [];
    const headerNames = globalHeaders.map((h: any) => h.key);

    assert(
      headerNames.includes("X-Frame-Options") &&
        headerNames.includes("X-Content-Type-Options") &&
        headerNames.includes("Content-Security-Policy"),
      "next.config defines X-Frame-Options, X-Content-Type-Options, and Content-Security-Policy"
    );
  }
}
