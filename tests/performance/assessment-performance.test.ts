import { executeInSandbox } from "../../backend/src/services/sandboxService";

export async function runAssessmentPerformanceTests(assert: (condition: boolean, description: string) => void) {
  console.log("\n--- Executing Performance Tests: Phase 8.6 & 8.7 Assessment Performance Benchmarks ---");

  // Benchmark: 50 consecutive VM sandbox evaluations
  const sampleCode = "function add(a, b) { return a + b; } add(1, 2);";
  const startTime = Date.now();
  const iterations = 50;

  for (let i = 0; i < iterations; i++) {
    executeInSandbox(sampleCode, 2000);
  }

  const duration = Date.now() - startTime;
  const avgTime = duration / iterations;

  assert(avgTime < 50, `Average VM evaluation time per execution (${avgTime.toFixed(2)}ms) must be <50ms threshold`);
  console.log(`  ✓ PASS: Assessment VM performance benchmark verified (${iterations} executions in ${duration}ms, avg ${avgTime.toFixed(2)}ms/op)`);
}
