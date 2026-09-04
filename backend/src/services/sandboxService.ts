import vm from "vm";

export interface ExecutionResult {
  logs: string[];
  result: any;
  error: string | null;
  executionTime: number; // milliseconds
}

export function executeInSandbox(userCode: string, timeoutMs: number = 2000): ExecutionResult {
  const startTime = Date.now();
  const logs: string[] = [];
  let executionResult: any = undefined;

  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => {
        logs.push(args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "));
      },
      error: (...args: any[]) => {
        logs.push("[ERROR] " + args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "));
      },
      warn: (...args: any[]) => {
        logs.push("[WARN] " + args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "));
      },
      info: (...args: any[]) => {
        logs.push("[INFO] " + args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" "));
      },
    },
    setTimeout: undefined,
    setInterval: undefined,
    process: undefined,
    require: undefined,
  };

  const context = vm.createContext(sandbox);

  try {
    const script = new vm.Script(userCode);
    executionResult = script.runInContext(context, { timeout: timeoutMs });
    const executionTime = Date.now() - startTime;

    return {
      logs,
      result: executionResult !== undefined ? String(executionResult) : null,
      error: null,
      executionTime,
    };
  } catch (err: any) {
    const executionTime = Date.now() - startTime;
    return {
      logs,
      result: null,
      error: err.message || "Execution Error",
      executionTime,
    };
  }
}
