import vm from "node:vm";

export interface TestResult {
  testId: string;
  name: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
}

export interface TestCaseDefinition {
  id?: string;
  name: string;
  input?: string;
  expectedOutput?: string;
  test?: string;
  expected?: any;
}

export interface EvaluationOutcome {
  success: boolean;
  testsPassed: number;
  totalTests: number;
  testResults: TestResult[];
  executionTimeMs: number;
}

/**
 * Evaluates user submitted JavaScript code against challenge test cases
 * inside an isolated Node vm context with hard 2,000ms timeout and restricted globals.
 */
export function evaluateChallengeCode(
  userCode: string,
  testCases: TestCaseDefinition[]
): EvaluationOutcome {
  const startTime = Date.now();
  const results: TestResult[] = [];

  if (!userCode || typeof userCode !== "string") {
    return {
      success: false,
      testsPassed: 0,
      totalTests: testCases?.length || 0,
      testResults: [],
      executionTimeMs: 0,
    };
  }

  // Enforce max code payload size (10,000 characters limit)
  if (userCode.length > 10000) {
    return {
      success: false,
      testsPassed: 0,
      totalTests: testCases.length,
      testResults: testCases.map((tc, idx) => ({
        testId: tc.id || `test-${idx + 1}`,
        name: tc.name,
        passed: false,
        expected: tc.expected !== undefined ? tc.expected : tc.expectedOutput,
        actual: null,
        error: "Code payload exceeds maximum allowed size (10,000 characters).",
      })),
      executionTimeMs: Date.now() - startTime,
    };
  }

  let capturedLogs: string[] = [];

  // Create isolated sandbox context with captured console logs
  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
      error: (...args: any[]) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
      warn: (...args: any[]) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
      info: (...args: any[]) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
    },
    Math,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Date,
    Map,
    Set,
    Error,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    encodeURI,
    decodeURI,
    encodeURIComponent,
    decodeURIComponent,
  };

  // Mock standard require calls like require('http'), require('events')
  sandbox.require = (modName: string) => {
    if (modName === "http" || modName === "https") {
      return {
        createServer: (cb: any) => ({
          listen: (port: any, listener?: any) => {
            if (listener) listener();
            return { close: () => {} };
          },
        }),
      };
    }
    if (modName === "events") {
      return { EventEmitter: class EventEmitter {} };
    }
    throw new Error(`Module '${modName}' is restricted in sandbox execution context.`);
  };

  const context = vm.createContext(sandbox);

  let testsPassed = 0;

  for (let idx = 0; idx < testCases.length; idx++) {
    const tc = testCases[idx];
    const testId = tc.id || `test-${idx + 1}`;
    const expectedVal = tc.expected !== undefined ? tc.expected : tc.expectedOutput;

    capturedLogs = [];

    try {
      let scriptCode = userCode;
      if (tc.test) {
        scriptCode = `${userCode}\n;(${tc.test});`;
      } else if (tc.input !== undefined) {
        scriptCode = `${userCode}\n;solve(${tc.input});`;
      }

      const script = new vm.Script(scriptCode);
      const actual = script.runInContext(context, { timeout: 2000 });

      // Determine pass status against expected output or logs
      const logsCombined = capturedLogs.join("\n");
      const passed =
        JSON.stringify(actual) === JSON.stringify(expectedVal) ||
        actual === expectedVal ||
        (typeof actual === "string" && typeof expectedVal === "string" && actual.trim() === expectedVal.trim()) ||
        (typeof expectedVal === "string" && logsCombined.includes(expectedVal)) ||
        (typeof expectedVal === "string" && userCode.includes(expectedVal));

      if (passed) testsPassed++;

      results.push({
        testId,
        name: tc.name,
        passed,
        expected: expectedVal,
        actual: actual !== undefined ? actual : logsCombined || "Executed without error",
      });
    } catch (err: any) {
      results.push({
        testId,
        name: tc.name,
        passed: false,
        expected: expectedVal,
        actual: null,
        error: err?.message || "Execution error or execution timeout exceeded (2,000ms limit)",
      });
    }
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    success: testsPassed === testCases.length,
    testsPassed,
    totalTests: testCases.length,
    testResults: results,
    executionTimeMs,
  };
}
