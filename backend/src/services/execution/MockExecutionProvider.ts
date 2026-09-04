import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { ExecutionRequest, ExecutionResponse } from "./types";

export class MockExecutionProvider extends CodeExecutionProvider {
  readonly name = "mock" as const;

  protected async runExecution(request: ExecutionRequest): Promise<ExecutionResponse> {
    const startTime = Date.now();
    const { code, language } = request;

    // Simulate realistic execution timing (30ms - 85ms)
    await new Promise((resolve) => setTimeout(resolve, 40));

    // Analyze code patterns safely (without host execution or eval)
    const analysis = this.analyzeCode(code, language);
    const executionTime = Date.now() - startTime;

    return {
      status: analysis.hasError ? "error" : "success",
      stdout: analysis.stdout,
      stderr: analysis.stderr,
      executionTime,
      exitCode: analysis.hasError ? 1 : 0,
      provider: this.name,
      language,
      compiled: ["java", "csharp", "go", "rust", "kotlin"].includes(language),
    };
  }

  private analyzeCode(code: string, language: string): { stdout: string; stderr: string; hasError: boolean } {
    const lines = code.split("\n");

    // Check basic bracket / parentheses balancing
    let parenCount = 0;
    let braceCount = 0;
    for (const char of code) {
      if (char === "(") parenCount++;
      if (char === ")") parenCount--;
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;
    }

    if (parenCount !== 0 || braceCount !== 0) {
      return {
        stdout: "",
        stderr: `SyntaxError: Unmatched brackets or parentheses detected in ${language} source code.`,
        hasError: true,
      };
    }

    // Extract print/log statements or simulate backend server boot
    const outputs: string[] = [];

    // Language-specific standard logging extraction
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("#")) continue;

      // JS / TS console.log
      const jsLog = trimmed.match(/console\.(log|info|warn|error)\s*\((.*)\)/);
      if (jsLog) {
        outputs.push(this.cleanLogArg(jsLog[2]));
      }

      // Python print
      const pyPrint = trimmed.match(/print\s*\((.*)\)/);
      if (pyPrint) {
        outputs.push(this.cleanLogArg(pyPrint[1]));
      }

      // Go fmt.Println / fmt.Printf / log.Println
      const goPrint = trimmed.match(/(?:fmt|log)\.(?:Println|Printf|Print)\s*\((.*)\)/);
      if (goPrint) {
        outputs.push(this.cleanLogArg(goPrint[1]));
      }

      // Java / Kotlin System.out.println / println
      const javaPrint = trimmed.match(/(?:System\.out\.println|println)\s*\((.*)\)/);
      if (javaPrint) {
        outputs.push(this.cleanLogArg(javaPrint[1]));
      }

      // C# Console.WriteLine
      const csPrint = trimmed.match(/Console\.WriteLine\s*\((.*)\)/);
      if (csPrint) {
        outputs.push(this.cleanLogArg(csPrint[1]));
      }

      // Rust println!
      const rustPrint = trimmed.match(/println!\s*\((.*)\)/);
      if (rustPrint) {
        outputs.push(this.cleanLogArg(rustPrint[1]));
      }

      // PHP echo / var_dump
      const phpPrint = trimmed.match(/(?:echo|var_dump)\s*(.*);/);
      if (phpPrint) {
        outputs.push(this.cleanLogArg(phpPrint[1]));
      }

      // Ruby puts / p
      const rbPrint = trimmed.match(/(?:puts|p)\s+(.*)/);
      if (rbPrint) {
        outputs.push(this.cleanLogArg(rbPrint[1]));
      }

      // Elixir IO.puts / IO.inspect
      const exPrint = trimmed.match(/IO\.(?:puts|inspect)\s*\((.*)\)/);
      if (exPrint) {
        outputs.push(this.cleanLogArg(exPrint[1]));
      }
    }

    // If server boilerplate detected (Express, FastAPI, Gin, Spring Boot, etc.), append server initialization logs
    if (code.includes("app.listen") || code.includes("uvicorn.run") || code.includes("r.Run") || code.includes("SpringApplication.run") || code.includes("app.Run") || code.includes("HttpServer::new") || code.includes("Endpoint.start")) {
      outputs.unshift(`[${language.toUpperCase()}_SERVER] Initializing application framework...`);
      outputs.push(`[${language.toUpperCase()}_SERVER] ✓ HTTP Server active and listening on port 8080 (simulated).`);
    }

    if (outputs.length === 0) {
      outputs.push(`✓ ${language.toUpperCase()} script compiled and executed successfully with 0 exit code.`);
      outputs.push(`[Note] Simulated execution via safe MockExecutionProvider (no host execution).`);
    }

    return {
      stdout: outputs.join("\n"),
      stderr: "",
      hasError: false,
    };
  }

  private cleanLogArg(raw: string): string {
    let clean = raw.trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'")) || (clean.startsWith("`") && clean.endsWith("`"))) {
      clean = clean.slice(1, -1);
    }
    return clean;
  }
}
