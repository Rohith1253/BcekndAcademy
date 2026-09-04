import vm from "vm";
import { VirtualFile, executeCodingLabCode } from "./codingLabExecution.service";

export interface LabTestCase {
  id: string;
  name: string;
  input?: any;
  expectedStatus?: number;
  expectedBody?: any;
  customCode?: string;
}

export interface LabTestResult {
  id: string;
  name: string;
  passed: boolean;
  expected?: any;
  received?: any;
  error?: string;
}

export interface CodingLabTestOutcome {
  success: boolean;
  testsPassed: number;
  totalTests: number;
  testResults: LabTestResult[];
  executionTime: number;
}

/**
 * Runs user-defined or template tests against the virtual workspace code.
 */
export function runCodingLabTests(
  files: VirtualFile[],
  tests: LabTestCase[],
  entryFile: string = "src/index.js",
  timeoutMs: number = 2000
): CodingLabTestOutcome {
  const overallStart = Date.now();
  const testResults: LabTestResult[] = [];

  const mainFile = files.find((f) => f.path === entryFile) || files[0];
  if (!mainFile) {
    return {
      success: false,
      testsPassed: 0,
      totalTests: tests.length,
      testResults: tests.map((t) => ({
        id: t.id,
        name: t.name,
        passed: false,
        error: "Missing entry file",
      })),
      executionTime: 0,
    };
  }

  // Pre-execute code to check for baseline runtime errors
  const baseRun = executeCodingLabCode(files, entryFile, timeoutMs);

  for (const tc of tests) {
    if (tc.expectedStatus !== undefined) {
      // Check captured HTTP responses from mock Express
      const matchedRes = baseRun.httpResponses.find((r) => r.status === tc.expectedStatus);
      if (matchedRes) {
        testResults.push({
          id: tc.id,
          name: tc.name,
          passed: true,
          expected: `Status ${tc.expectedStatus}`,
          received: `Status ${matchedRes.status}`,
        });
      } else {
        const receivedStatuses = baseRun.httpResponses.map((r) => r.status).join(", ") || "None";
        testResults.push({
          id: tc.id,
          name: tc.name,
          passed: false,
          expected: `Status ${tc.expectedStatus}`,
          received: `Status ${receivedStatuses}`,
          error: `Expected status ${tc.expectedStatus} was not sent`,
        });
      }
    } else if (tc.customCode) {
      // Execute custom JS assertion against the sandbox
      const testHarness = `
${mainFile.content}

(function __runCustomLabTest() {
  ${tc.customCode}
})();
`;
      try {
        const script = new vm.Script(testHarness);
        const context = vm.createContext({
          console: { log: () => {} },
          require: () => ({}),
        });
        script.runInContext(context, { timeout: 1000 });
        testResults.push({
          id: tc.id,
          name: tc.name,
          passed: true,
          expected: tc.expectedBody || "Valid Execution",
          received: tc.expectedBody || "Valid Execution",
        });
      } catch (err: any) {
        testResults.push({
          id: tc.id,
          name: tc.name,
          passed: false,
          expected: tc.expectedBody || "Valid Execution",
          received: err.message,
          error: err.message,
        });
      }
    } else {
      // Basic execution survival test
      testResults.push({
        id: tc.id,
        name: tc.name,
        passed: baseRun.success,
        expected: "Successful execution with 0 errors",
        received: baseRun.success ? "Passed" : baseRun.errors[0] || "Failed",
        error: baseRun.errors[0],
      });
    }
  }

  const testsPassed = testResults.filter((t) => t.passed).length;
  const executionTime = Date.now() - overallStart;

  return {
    success: testsPassed === tests.length && tests.length > 0,
    testsPassed,
    totalTests: tests.length,
    testResults,
    executionTime,
  };
}
