import vm from "vm";

/**
 * IMPORTANT SANDBOX DISCLAIMER:
 * Development learning sandbox. Production execution requires container isolation.
 */

export interface VirtualFile {
  path: string;
  content: string;
  language?: string;
}

export interface HttpResponseCapture {
  method: string;
  path: string;
  status: number;
  data: any;
}

export interface CodingLabExecutionResult {
  success: boolean;
  output: string[];
  httpResponses: HttpResponseCapture[];
  errors: string[];
  executionTime: number; // ms
}

/**
 * Executes a virtual project or single file in a safe, simulated backend environment.
 */
export function executeCodingLabCode(
  files: VirtualFile[],
  entryFilePath: string = "src/index.js",
  timeoutMs: number = 2000
): CodingLabExecutionResult {
  const startTime = Date.now();
  const output: string[] = [];
  const errors: string[] = [];
  const httpResponses: HttpResponseCapture[] = [];

  // Locate active entry file or fallback to first file
  const entryFile =
    files.find((f) => f.path === entryFilePath) ||
    files.find((f) => f.path.endsWith("index.js")) ||
    files[0];

  if (!entryFile) {
    return {
      success: false,
      output: [],
      httpResponses: [],
      errors: ["No entry file found to execute."],
      executionTime: 0,
    };
  }

  // Safe argument stringifier
  const stringify = (val: any) => {
    if (val === undefined) return "undefined";
    if (val === null) return "null";
    if (typeof val === "object") {
      try {
        return JSON.stringify(val);
      } catch {
        return String(val);
      }
    }
    return String(val);
  };

  // Mock Express Routing and Response Environment
  const registeredRoutes: Array<{ method: string; path: string; handlers: Function[] }> = [];

  const createMockRes = (method: string, path: string) => {
    const resObj: any = {
      statusCode: 200,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        httpResponses.push({
          method,
          path,
          status: this.statusCode,
          data,
        });
        output.push(`[HTTP Response] ${method} ${path} -> Status ${this.statusCode} | JSON: ${JSON.stringify(data)}`);
        return this;
      },
      send(body: any) {
        httpResponses.push({
          method,
          path,
          status: this.statusCode,
          data: body,
        });
        output.push(`[HTTP Response] ${method} ${path} -> Status ${this.statusCode} | Body: ${body}`);
        return this;
      },
    };
    return resObj;
  };

  const mockApp = {
    use: (...args: any[]) => {
      output.push("[Express] Middleware registered");
    },
    get: (path: string, ...handlers: Function[]) => {
      registeredRoutes.push({ method: "GET", path, handlers });
      output.push(`[Express Route] GET ${path}`);
    },
    post: (path: string, ...handlers: Function[]) => {
      registeredRoutes.push({ method: "POST", path, handlers });
      output.push(`[Express Route] POST ${path}`);
    },
    put: (path: string, ...handlers: Function[]) => {
      registeredRoutes.push({ method: "PUT", path, handlers });
      output.push(`[Express Route] PUT ${path}`);
    },
    delete: (path: string, ...handlers: Function[]) => {
      registeredRoutes.push({ method: "DELETE", path, handlers });
      output.push(`[Express Route] DELETE ${path}`);
    },
    listen: (port: any, callback?: Function) => {
      output.push(`[Mock Server] Server listening on http://localhost:${port || 3000}`);
      if (typeof callback === "function") {
        callback();
      }
    },
  };

  const mockExpress: any = () => mockApp;
  mockExpress.json = () => (req: any, res: any, next: any) => { if (next) next(); };
  mockExpress.urlencoded = () => (req: any, res: any, next: any) => { if (next) next(); };
  mockExpress.Router = () => mockApp;

  const BLOCKED_MODULES = [
    "fs",
    "child_process",
    "cluster",
    "net",
    "http",
    "https",
    "os",
    "dgram",
    "dns",
    "tls",
    "v8",
    "vm",
    "worker_threads",
  ];

  // Safe Virtual Require Mock
  const mockRequire = (moduleName: string) => {
    if (BLOCKED_MODULES.includes(moduleName)) {
      throw new Error(`Module '${moduleName}' is blocked for security in the sandbox.`);
    }
    if (moduleName === "express") {
      return mockExpress;
    }
    // Check if requiring another virtual file in project
    const normalized = moduleName.replace(/^\.\//, "").replace(/\.js$/, "");
    const localFile = files.find(
      (f) =>
        f.path.replace(/\.js$/, "").endsWith(normalized) ||
        f.path === moduleName ||
        f.path === `${moduleName}.js`
    );

    if (localFile) {
      // Execute the required virtual module inside its own mini context
      const subExports: any = {};
      const subContext = vm.createContext({
        exports: subExports,
        module: { exports: subExports },
        require: mockRequire,
        console: { log: (...args: any[]) => output.push(args.map(stringify).join(" ")) },
      });
      const subScript = new vm.Script(localFile.content);
      subScript.runInContext(subContext, { timeout: 1000 });
      return subContext.module.exports;
    }

    output.push(`[Mock Import] Virtual require('${moduleName}') simulated`);
    return {};
  };

  const sandbox: Record<string, any> = {
    console: {
      log: (...args: any[]) => output.push(args.map(stringify).join(" ")),
      error: (...args: any[]) => {
        const msg = args.map(stringify).join(" ");
        output.push(`[ERROR] ${msg}`);
        errors.push(msg);
      },
      warn: (...args: any[]) => output.push(`[WARN] ${args.map(stringify).join(" ")}`),
      info: (...args: any[]) => output.push(`[INFO] ${args.map(stringify).join(" ")}`),
    },
    express: mockExpress,
    require: mockRequire,
    module: { exports: {} },
    exports: {},
    // Block sensitive host globals
    process: undefined,
    setTimeout: undefined,
    setInterval: undefined,
    setImmediate: undefined,
    eval: undefined,
    Function: undefined,
  };

  const context = vm.createContext(sandbox);

  try {
    const script = new vm.Script(entryFile.content);
    script.runInContext(context, { timeout: timeoutMs });

    // Auto-invoke registered routes to simulate incoming test requests
    if (registeredRoutes.length > 0) {
      output.push(`--- Simulating Express Dispatch Pipeline (${registeredRoutes.length} route(s)) ---`);
      for (const r of registeredRoutes) {
        const req = {
          method: r.method,
          url: r.path,
          path: r.path,
          body: { sample: "data" },
          query: {},
          params: {},
          headers: { "content-type": "application/json" },
        };
        const res = createMockRes(r.method, r.path);
        const lastHandler = r.handlers[r.handlers.length - 1];
        if (typeof lastHandler === "function") {
          try {
            lastHandler(req, res, () => {});
          } catch (handlerErr: any) {
            output.push(`[Route Error] ${r.method} ${r.path}: ${handlerErr.message}`);
          }
        }
      }
    }

    const executionTime = Date.now() - startTime;
    return {
      success: errors.length === 0,
      output,
      httpResponses,
      errors,
      executionTime,
    };
  } catch (err: any) {
    const executionTime = Date.now() - startTime;
    const errMsg = err.message || "Execution Error";
    errors.push(errMsg);
    output.push(`[Runtime Error] ${errMsg}`);

    return {
      success: false,
      output,
      httpResponses,
      errors,
      executionTime,
    };
  }
}
