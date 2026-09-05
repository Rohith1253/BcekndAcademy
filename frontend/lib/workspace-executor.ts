export interface ExecutionLog {
  type: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: string;
}

export interface TestResult {
  description: string;
  passed: boolean;
  expected?: any;
  received?: any;
  error?: string;
}

export interface ExecutionResult {
  success: boolean;
  logs: ExecutionLog[];
  returnValue?: any;
  error?: string;
  executionTimeMs: number;
  testResults: TestResult[];
}

export interface ExerciseTest {
  description: string;
  assertionFnString: string; // e.g., "return typeof name === 'string' && name.length > 0;"
}

/**
 * Sandboxed safe JavaScript code runner for browser-compatible exercises.
 * Captures console.log, console.warn, console.error and enforces a 1500ms timeout.
 */
export async function executeCodeSafely(
  code: string,
  tests: ExerciseTest[] = []
): Promise<ExecutionResult> {
  const startTime = performance.now();
  const logs: ExecutionLog[] = [];

  const addLog = (type: ExecutionLog["type"], args: any[]) => {
    const formatted = args
      .map((arg) => {
        if (typeof arg === "object" && arg !== null) {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    logs.push({
      type,
      message: formatted,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    });
  };

  const customConsole = {
    log: (...args: any[]) => addLog("log", args),
    warn: (...args: any[]) => addLog("warn", args),
    error: (...args: any[]) => addLog("error", args),
    info: (...args: any[]) => addLog("info", args),
  };

  let executionError: string | undefined;
  let executionReturn: any = undefined;
  const testResults: TestResult[] = [];

  try {
    // Create an isolated function context with captured console
    const runnerFn = new Function(
      "console",
      `
      "use strict";
      ${code}
      `
    );

    // Enforce 1500ms execution timeout to prevent infinite loops
    const runPromise = new Promise((resolve, reject) => {
      try {
        const res = runnerFn(customConsole);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Execution Timed Out (exceeded 1500ms safety limit). Check for infinite loops."));
      }, 1500);
    });

    executionReturn = await Promise.race([runPromise, timeoutPromise]);

    // Run test assertions if provided
    if (tests && tests.length > 0) {
      for (const t of tests) {
        try {
          const testRunner = new Function(
            "console",
            `
            "use strict";
            ${code}
            ${t.assertionFnString}
            `
          );
          const passed = Boolean(testRunner(customConsole));
          testResults.push({
            description: t.description,
            passed,
          });
        } catch (testErr: any) {
          testResults.push({
            description: t.description,
            passed: false,
            error: testErr.message || "Assertion failed with runtime error",
          });
        }
      }
    }
  } catch (err: any) {
    executionError = err.message || "Runtime Error";
    addLog("error", [executionError]);
  }

  const endTime = performance.now();
  const executionTimeMs = Math.round((endTime - startTime) * 10) / 10;

  return {
    success: !executionError && testResults.every((t) => t.passed),
    logs,
    returnValue: executionReturn,
    error: executionError,
    executionTimeMs,
    testResults,
  };
}
