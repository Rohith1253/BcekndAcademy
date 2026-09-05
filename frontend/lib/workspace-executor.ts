/**
 * workspace-executor.ts
 *
 * Sandboxed JavaScript code runner using an isolated Web Worker.
 *
 * ARCHITECTURAL GUARANTEES:
 * 1. Isolation: User code runs inside a dedicated Web Worker thread.
 * 2. Infinite Loop Safety: Main UI thread enforces a hard timeout and calls worker.terminate().
 * 3. Safe Console Capture: Serializes primitive values, arrays, nested objects, and circular structures safely.
 * 4. Error Structure: Destructures ErrorEvent properties (message, filename, lineno, colno, stack)
 *    and NEVER coercively stringifies raw event objects.
 * 5. Lifecycle Management: Revokes Blob URLs and terminates workers in a settled state machine.
 */

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

export interface ExecutionErrorDetails {
  type: string;
  message: string;
  line?: number;
  column?: number;
  stack?: string;
}

export interface ExecutionResult {
  status: "success" | "error" | "timeout";
  success: boolean;
  logs: ExecutionLog[];
  returnValue?: any;
  error?: string;
  errorDetails?: ExecutionErrorDetails;
  executionTimeMs: number;
  testResults: TestResult[];
}

export interface ExerciseTest {
  description: string;
  /** e.g. "return typeof name === 'string' && name.length > 0;" */
  assertionFnString: string;
}

const TIMEOUT_MS = 3000;

// ---------------------------------------------------------------------------
// Web Worker source string (runs inside separate worker thread)
// ---------------------------------------------------------------------------
const WORKER_SOURCE = `
"use strict";

const logs = [];

function ts() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function safeStringify(arg) {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  if (typeof arg === "symbol") return arg.toString();
  if (typeof arg === "bigint") return arg.toString() + "n";
  if (typeof arg === "function") return arg.toString();
  if (typeof arg === "object") {
    try {
      const seen = new WeakSet();
      return JSON.stringify(arg, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";
          seen.add(value);
        }
        return value;
      }, 2);
    } catch {
      return Object.prototype.toString.call(arg);
    }
  }
  return String(arg);
}

const capture = {
  log:   (...args) => logs.push({ type: "log",   message: args.map(safeStringify).join(" "), timestamp: ts() }),
  warn:  (...args) => logs.push({ type: "warn",  message: args.map(safeStringify).join(" "), timestamp: ts() }),
  error: (...args) => logs.push({ type: "error", message: args.map(safeStringify).join(" "), timestamp: ts() }),
  info:  (...args) => logs.push({ type: "info",  message: args.map(safeStringify).join(" "), timestamp: ts() }),
};

// Global error boundary inside worker
self.onerror = function(message, filename, lineno, colno, error) {
  const msgStr = typeof message === "string" ? message : (error && error.message) ? error.message : "Runtime Error";
  self.postMessage({
    type: "uncaught_error",
    errorDetails: {
      type: (error && error.name) || "Error",
      message: msgStr,
      line: lineno || undefined,
      column: colno || undefined,
      stack: error && error.stack ? String(error.stack) : undefined,
    },
    logs,
  });
  return true;
};

self.onmessage = function(e) {
  const { code, tests } = e.data;
  let returnValue = undefined;
  let executionError = undefined;
  let errorDetails = undefined;
  const testResults = [];

  // Execute user code
  try {
    const userFn = new Function("console", '"use strict";\\n' + code);
    returnValue = userFn(capture);
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    executionError = msg;
    errorDetails = {
      type: (err && err.name) || "RuntimeError",
      message: msg,
      stack: err && err.stack ? String(err.stack) : undefined,
    };
    logs.push({ type: "error", message: msg, timestamp: ts() });
  }

  // Execute unit test assertions if code ran without fatal syntax error
  if (!executionError && Array.isArray(tests)) {
    for (const t of tests) {
      try {
        const testFn = new Function("console", '"use strict";\\n' + code + "\\n" + t.assertionFnString);
        const passed = Boolean(testFn(capture));
        testResults.push({ description: t.description, passed });
      } catch (testErr) {
        testResults.push({
          description: t.description,
          passed: false,
          error: testErr && testErr.message ? testErr.message : String(testErr),
        });
      }
    }
  }

  self.postMessage({
    type: "done",
    logs,
    returnValue,
    error: executionError,
    errorDetails,
    testResults,
  });
};
`;

// ---------------------------------------------------------------------------
// Main thread executor
// ---------------------------------------------------------------------------
export async function executeCodeSafely(
  code: string,
  tests: ExerciseTest[] = []
): Promise<ExecutionResult> {
  const startTime = performance.now();

  return new Promise<ExecutionResult>((resolve) => {
    let settled = false;
    let worker: Worker | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let blobUrl: string | null = null;

    const cleanup = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (worker) {
        try {
          worker.terminate();
        } catch {
          // ignore termination error
        }
        worker = null;
      }
      if (blobUrl) {
        try {
          URL.revokeObjectURL(blobUrl);
        } catch {
          // ignore revocation error
        }
        blobUrl = null;
      }
    };

    const finish = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    try {
      if (typeof window === "undefined" || typeof Worker === "undefined") {
        throw new Error("Execution environment does not support Web Workers.");
      }

      const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
      blobUrl = URL.createObjectURL(blob);
      worker = new Worker(blobUrl);

      worker.onmessage = (e: MessageEvent) => {
        const endTime = performance.now();
        const durationMs = Math.round((endTime - startTime) * 10) / 10;
        const data = e.data;

        if (data.type === "uncaught_error") {
          const details: ExecutionErrorDetails = data.errorDetails || {
            type: "UncaughtError",
            message: "Uncaught runtime exception in worker",
          };
          const formattedMsg = `${details.type}: ${details.message}${details.line ? ` (Line ${details.line})` : ""}`;

          finish({
            status: "error",
            success: false,
            logs: data.logs || [],
            error: formattedMsg,
            errorDetails: details,
            executionTimeMs: durationMs,
            testResults: [],
          });
          return;
        }

        if (data.type === "done") {
          const hasError = Boolean(data.error);
          const testsPassed = Array.isArray(data.testResults) && data.testResults.length > 0
            ? (data.testResults as TestResult[]).every((t) => t.passed)
            : true;

          finish({
            status: hasError ? "error" : "success",
            success: !hasError && testsPassed,
            logs: data.logs || [],
            returnValue: data.returnValue,
            error: data.error,
            errorDetails: data.errorDetails,
            executionTimeMs: durationMs,
            testResults: data.testResults || [],
          });
        }
      };

      worker.onerror = (event: ErrorEvent) => {
        const endTime = performance.now();
        const durationMs = Math.round((endTime - startTime) * 10) / 10;

        // Structured extraction of ErrorEvent fields
        const errType = event.error?.name || "Syntax/WorkerError";
        const message = event.message || (event.error && event.error.message) || "Worker execution failed";
        const line = event.lineno || undefined;
        const column = event.colno || undefined;
        const formatted = `${errType}: ${message}${line ? ` (Line ${line}${column ? `:${column}` : ""})` : ""}`;

        finish({
          status: "error",
          success: false,
          logs: [
            {
              type: "error",
              message: formatted,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            },
          ],
          error: formatted,
          errorDetails: {
            type: errType,
            message,
            line,
            column,
            stack: event.error?.stack,
          },
          executionTimeMs: durationMs,
          testResults: [],
        });
      };

      // Post payload to worker
      worker.postMessage({ code, tests });

      // Hard timeout on main thread to kill infinite loops
      timeoutId = setTimeout(() => {
        const endTime = performance.now();
        const durationMs = Math.round((endTime - startTime) * 10) / 10;

        finish({
          status: "timeout",
          success: false,
          logs: [
            {
              type: "error",
              message: `⏱ Execution Timed Out after ${TIMEOUT_MS}ms. The process was terminated to protect the browser. Check for infinite loops (e.g. while(true){} without exit).`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            },
          ],
          error: `Execution timed out (${TIMEOUT_MS}ms limit exceeded)`,
          errorDetails: {
            type: "TimeoutError",
            message: `Execution exceeded safety limit of ${TIMEOUT_MS}ms`,
          },
          executionTimeMs: durationMs,
          testResults: [],
        });
      }, TIMEOUT_MS);

    } catch (err: any) {
      const endTime = performance.now();
      finish({
        status: "error",
        success: false,
        logs: [
          {
            type: "error",
            message: err?.message || "Sandbox Initialization Failed",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
        error: err?.message || "Sandbox initialization failed",
        errorDetails: {
          type: "SandboxError",
          message: err?.message || "Failed to initialize worker sandbox",
        },
        executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
        testResults: [],
      });
    }
  });
}
