import vm from "vm";
import { User } from "../models/User";
import { CodingSubmission, ITestResultItem } from "../models/CodingSubmission";
import { ICodingChallenge, ITestItem } from "../models/CodingChallenge";
import { addXP } from "./xpService";

/**
 * IMPORTANT SANDBOX DISCLAIMER:
 * This sandbox provides a development-level evaluation environment for the local learning platform.
 * For production environments, untrusted code execution must use isolated containers,
 * worker infrastructure, or dedicated sandbox services.
 */

export interface ExecutionLog {
  type: "log" | "error" | "warn" | "info";
  message: string;
}

export interface SandboxResult {
  logs: ExecutionLog[];
  rawOutput: string;
  result: any;
  error: string | null;
  executionTime: number; // ms
}

export interface TestRunResult {
  name: string;
  description?: string;
  passed: boolean;
  expected?: any;
  received?: any;
  error?: string;
}

export interface EvaluationOutcome {
  success: boolean;
  score: number;
  testsPassed: number;
  totalTests: number;
  earnedXP: number;
  alreadyCompleted: boolean;
  visibleTestResults: TestRunResult[];
  hiddenTestsPassed: number;
  hiddenTestsTotal: number;
  logs: ExecutionLog[];
  executionTime: number;
  message: string;
}

/**
 * Safely executes JavaScript code inside a restricted Node.js VM context.
 */
export function executeCode(userCode: string, timeoutMs: number = 2000): SandboxResult {
  const startTime = Date.now();
  const logs: ExecutionLog[] = [];

  const stringifyArg = (arg: any): string => {
    if (arg === undefined) return "undefined";
    if (arg === null) return "null";
    if (typeof arg === "object") {
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    }
    return String(arg);
  };

  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => {
        logs.push({ type: "log", message: args.map(stringifyArg).join(" ") });
      },
      error: (...args: any[]) => {
        logs.push({ type: "error", message: args.map(stringifyArg).join(" ") });
      },
      warn: (...args: any[]) => {
        logs.push({ type: "warn", message: args.map(stringifyArg).join(" ") });
      },
      info: (...args: any[]) => {
        logs.push({ type: "info", message: args.map(stringifyArg).join(" ") });
      },
    },
    // Block sensitive host globals
    process: undefined,
    require: undefined,
    setTimeout: undefined,
    setInterval: undefined,
    setImmediate: undefined,
    eval: undefined,
    Function: undefined,
  };

  const context = vm.createContext(sandbox);

  try {
    const script = new vm.Script(userCode);
    const result = script.runInContext(context, { timeout: timeoutMs });
    const executionTime = Date.now() - startTime;

    return {
      logs,
      rawOutput: logs.map((l) => l.message).join("\n"),
      result: result !== undefined ? result : null,
      error: null,
      executionTime,
    };
  } catch (err: any) {
    const executionTime = Date.now() - startTime;
    return {
      logs,
      rawOutput: logs.map((l) => l.message).join("\n"),
      result: null,
      error: err.message || "Execution Error",
      executionTime,
    };
  }
}

/**
 * Runs a set of test cases against user code inside the sandbox.
 */
export function runTests(
  userCode: string,
  tests: ITestItem[],
  timeoutMs: number = 2000
): { testResults: TestRunResult[]; logs: ExecutionLog[]; executionTime: number } {
  const overallStart = Date.now();
  const testResults: TestRunResult[] = [];
  const accumulatedLogs: ExecutionLog[] = [];

  for (const test of tests) {
    // Harness wrap user code with test assertion
    const harness = `
${userCode}

(function __runSingleTest() {
  ${test.testCode}
})();
`;
    const exec = executeCode(harness, timeoutMs);
    accumulatedLogs.push(...exec.logs);

    if (exec.error) {
      testResults.push({
        name: test.name,
        description: test.description,
        passed: false,
        error: exec.error,
        expected: test.expectedOutput,
      });
    } else {
      testResults.push({
        name: test.name,
        description: test.description,
        passed: true,
        expected: test.expectedOutput,
        received: test.expectedOutput,
      });
    }
  }

  const executionTime = Date.now() - overallStart;
  return { testResults, logs: accumulatedLogs, executionTime };
}

/**
 * Evaluates full submission (visible + hidden tests), applies anti-farming XP rules,
 * and saves the submission record.
 */
export async function evaluateSubmission(
  userId: string,
  challenge: ICodingChallenge,
  userCode: string
): Promise<EvaluationOutcome> {
  const visibleTests = challenge.visibleTests || [];
  const hiddenTests = challenge.hiddenTests || [];

  // 1. Run visible tests
  const visibleRun = runTests(userCode, visibleTests, 2000);

  // 2. Run hidden tests
  const hiddenRun = runTests(userCode, hiddenTests, 2000);

  const visiblePassed = visibleRun.testResults.filter((t) => t.passed).length;
  const hiddenPassed = hiddenRun.testResults.filter((t) => t.passed).length;

  const totalTests = visibleTests.length + hiddenTests.length;
  const totalPassed = visiblePassed + hiddenPassed;

  const score = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
  const isPassed = score >= 70; // 70% threshold for passing
  const isPerfect = score === 100;

  // 3. Anti-Farming check: Check if user already passed this challenge
  const previousPass = await CodingSubmission.findOne({
    userId,
    challengeSlug: challenge.slug,
    status: "passed",
  });

  const alreadyCompleted = !!previousPass;
  let earnedXP = 0;

  if (isPassed && !alreadyCompleted) {
    // Award XP proportional to score or full reward for perfect
    earnedXP = isPerfect ? challenge.xpReward : Math.round(challenge.xpReward * (score / 100));

    const dbUser = await User.findById(userId);
    if (dbUser) {
      const xpResult = addXP(dbUser.totalXP || 0, earnedXP);
      dbUser.totalXP = xpResult.newXP;
      dbUser.currentLevel = xpResult.newLevel;
      await dbUser.save();
    }
  }

  const totalExecutionTime = visibleRun.executionTime + hiddenRun.executionTime;
  const combinedLogs = [...visibleRun.logs, ...hiddenRun.logs];

  // 4. Record submission in database
  const submissionRecord = new CodingSubmission({
    userId,
    challengeId: challenge._id,
    challengeSlug: challenge.slug,
    code: userCode,
    language: "javascript",
    status: isPassed ? "passed" : "failed",
    testsPassed: totalPassed,
    totalTests,
    score,
    earnedXP,
    executionTime: totalExecutionTime,
    testResults: visibleRun.testResults.map((t) => ({
      name: t.name,
      passed: t.passed,
      expected: t.expected,
      received: t.received,
      error: t.error,
    })),
    submittedAt: new Date(),
  });

  await submissionRecord.save();

  return {
    success: isPassed,
    score,
    testsPassed: totalPassed,
    totalTests,
    earnedXP,
    alreadyCompleted,
    visibleTestResults: visibleRun.testResults,
    hiddenTestsPassed: hiddenPassed,
    hiddenTestsTotal: hiddenTests.length,
    logs: combinedLogs,
    executionTime: totalExecutionTime,
    message: isPerfect
      ? "Perfect Solution 🎉 All tests passed!"
      : isPassed
      ? `Great job! Passed ${totalPassed}/${totalTests} tests (${score}%).`
      : `Some tests failed (${totalPassed}/${totalTests} passed). Check test results and try again!`,
  };
}
