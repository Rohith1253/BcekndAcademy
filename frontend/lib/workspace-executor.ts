/**
 * workspace-executor.ts
 *
 * Sandboxed JavaScript code runner using a real Web Worker.
 *
 * WHY WEB WORKER:
 * The previous implementation used new Function() + Promise.race(setTimeout(...)).
 * This does NOT stop infinite loops. When JS is stuck in while(true){}, the main thread
 * is blocked and the setTimeout callback never fires.
 *
 * The correct fix is a Web Worker:
 *   - Code runs in a separate thread (Worker)
 *   - Main thread calls worker.terminate() after the timeout deadline
 *   - terminate() actually kills the worker thread regardless of what it is doing
 *
 * The worker is created from a Blob URL to avoid needing a separate worker file on disk.
 *
 * ERROR CAPTURE:
 * Inside the worker, self.onerror captures ErrorEvent objects and extracts
 * structured properties: message, filename, lineno, colno, error?.stack.
 * We NEVER do String(event) or `${event}` — that produces "[object Event]".
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
  /** e.g. "return typeof name === 'string' && name.length > 0;" */
  assertionFnString: string;
}

const TIMEOUT_MS = 3000;

// ---------------------------------------------------------------------------
// Web Worker source (runs in a separate thread)
// ---------------------------------------------------------------------------
// This string is compiled into a Blob URL. It:
//   1. Intercepts console.log/warn/error/info
//   2. Captures self.onerror with structured error fields
//   3. Executes the user's code via new Function(...)
//   4. Runs each assertion string
//   5. Posts results back to the main thread
// ---------------------------------------------------------------------------
const WORKER_SOURCE = `
"use strict";

const logs = [];

function ts() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatArg(arg) {
  if (arg === null) return "null";
  if (arg === undefined) return "undefined";
  if (typeof arg === "object") {
    try { return JSON.stringify(arg, null, 2); } catch { return Object.prototype.toString.call(arg); }
  }
  return String(arg);
}

const capture = {
  log:   (...args) => logs.push({ type: "log",   message: args.map(formatArg).join(" "), timestamp: ts() }),
  warn:  (...args) => logs.push({ type: "warn",  message: args.map(formatArg).join(" "), timestamp: ts() }),
  error: (...args) => logs.push({ type: "error", message: args.map(formatArg).join(" "), timestamp: ts() }),
  info:  (...args) => logs.push({ type: "info",  message: args.map(formatArg).join(" "), timestamp: ts() }),
};

// Capture uncaught errors — NEVER stringify the ErrorEvent object.
// Extract structured fields from the ErrorEvent.
self.onerror = function(message, filename, lineno, colno, error) {
  const details = [];
  if (typeof message === "string") details.push(message);
  if (lineno != null)  details.push("Line " + lineno);
  if (colno  != null)  details.push("Col "  + colno);
  if (error && error.stack) details.push(error.stack);
  const structured = details.join(" — ");
  self.postMessage({
    type: "uncaught_error",
    message: structured || "Unknown runtime error",
    logs,
  });
  return true; // prevent default worker error propagation
};

self.onmessage = function(e) {
  const { code, tests } = e.data;
  let returnValue = undefined;
  let executionError = undefined;
  const testResults = [];

  // ---- Run user code ----
  try {
    const userFn = new Function("console", '"use strict";\\n' + code);
    returnValue = userFn(capture);
  } catch (err) {
    executionError = err && err.message ? err.message : String(err);
    logs.push({ type: "error", message: executionError, timestamp: ts() });
  }

  // ---- Run test assertions ----
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

    const finish = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (worker) {
        try { worker.terminate(); } catch {}
        worker = null;
      }
      resolve(result);
    };

    try {
      const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      worker = new Worker(workerUrl);
      URL.revokeObjectURL(workerUrl); // safe to revoke after Worker is created

      worker.onmessage = (e: MessageEvent) => {
        const endTime = performance.now();
        const data = e.data;

        if (data.type === "uncaught_error") {
          finish({
            success: false,
            logs: data.logs || [],
            error: data.message,
            executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
            testResults: [],
          });
          return;
        }

        if (data.type === "done") {
          finish({
            success: !data.error && (data.testResults as TestResult[]).every((t) => t.passed),
            logs: data.logs || [],
            returnValue: data.returnValue,
            error: data.error,
            executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
            testResults: data.testResults || [],
          });
        }
      };

      worker.onerror = (event: ErrorEvent) => {
        // ErrorEvent fields — never use String(event) or `${event}`
        const parts: string[] = [];
        if (event.message) parts.push(event.message);
        if (event.lineno)  parts.push(`line ${event.lineno}`);
        if (event.colno)   parts.push(`col ${event.colno}`);
        if (event.filename && event.filename !== "blob:") parts.push(`in ${event.filename}`);
        const errorMessage = parts.length > 0 ? parts.join(", ") : "Worker error";
        const endTime = performance.now();
        finish({
          success: false,
          logs: [{ type: "error", message: errorMessage, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }],
          error: errorMessage,
          executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
          testResults: [],
        });
      };

      // Post the code to the worker
      worker.postMessage({ code, tests });

      // Real timeout: terminate() kills the worker thread unconditionally,
      // even if it is stuck in while(true){}.
      timeoutId = setTimeout(() => {
        const endTime = performance.now();
        finish({
          success: false,
          logs: [{
            type: "error",
            message: `⏱ Execution timed out after ${TIMEOUT_MS}ms. Check for infinite loops (e.g., while(true){} with no exit condition).`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          }],
          error: `Execution timed out after ${TIMEOUT_MS}ms`,
          executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
          testResults: [],
        });
      }, TIMEOUT_MS);

    } catch (err: any) {
      // Blob/Worker API not available (SSR context — should not happen in workspace)
      const endTime = performance.now();
      finish({
        success: false,
        logs: [{ type: "error", message: err?.message || "Failed to create execution sandbox", timestamp: new Date().toLocaleTimeString() }],
        error: err?.message || "Sandbox unavailable",
        executionTimeMs: Math.round((endTime - startTime) * 10) / 10,
        testResults: [],
      });
    }
  });
}
