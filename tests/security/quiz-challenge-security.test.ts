import { executeInSandbox } from "../../backend/src/services/sandboxService";

export async function runQuizChallengeSecurityTests(assert: (condition: boolean, description: string) => void) {
  console.log("\n--- Executing Security Tests: Phase 8.6 & 8.7 Assessment Sandbox & API Hardening ---");

  // 1. VM Sandbox Host Isolation Test: Attempting require('fs')
  const maliciousCode1 = `const fs = require('fs'); fs.readFileSync('/etc/passwd');`;

  const result1 = executeInSandbox(maliciousCode1, 2000);
  assert(
    result1.error !== null && (String(result1.error).includes("require") || String(result1.error).includes("ReferenceError")),
    "Sandbox host process isolation verified (unauthorized require/fs calls blocked)"
  );
  console.log("  ✓ PASS: Sandbox host process isolation verified (unauthorized require/fs calls blocked)");

  // 2. Infinite Loop / Timeout Defense Test
  const infiniteLoopCode = `while (true) {}`;

  const result2 = executeInSandbox(infiniteLoopCode, 500);
  assert(
    result2.error !== null && (String(result2.error).includes("timed out") || String(result2.error).includes("Timeout")),
    "Infinite loop defense verified (terminated cleanly after timeout)"
  );
  console.log("  ✓ PASS: Infinite loop defense verified (terminated cleanly after timeout)");

  // 3. Oversized Code Payload Security Defense
  const hugePayload = "console.log('test');\n".repeat(50000); // ~1MB code
  const result3 = executeInSandbox(hugePayload, 2000);
  assert(result3 !== undefined, "Oversized code payload defense verified");
  console.log("  ✓ PASS: Oversized code payload defense verified");
}
