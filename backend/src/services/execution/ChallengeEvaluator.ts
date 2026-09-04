import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { ChallengeEvaluationResult, TestCase, TestCaseResult } from "./types";

export interface EvaluateChallengeParams {
  code: string;
  language: string;
  visibleTests: TestCase[];
  hiddenTests?: TestCase[];
  xpReward: number;
  alreadyCompleted?: boolean;
}

export class ChallengeEvaluator {
  private provider: CodeExecutionProvider;

  constructor(provider: CodeExecutionProvider) {
    this.provider = provider;
  }

  async evaluateChallenge(params: EvaluateChallengeParams): Promise<ChallengeEvaluationResult> {
    const { code, language, visibleTests = [], hiddenTests = [], xpReward, alreadyCompleted = false } = params;
    const allTests = [...visibleTests, ...hiddenTests];
    const totalTests = allTests.length;

    if (totalTests === 0) {
      const execResult = await this.provider.execute({ language, code });
      const isSuccess = execResult.status === "success";
      return {
        status: isSuccess ? "passed" : "failed",
        score: isSuccess ? 100 : 0,
        totalTests: 1,
        passedTests: isSuccess ? 1 : 0,
        results: [
          {
            name: "Default Execution Test",
            passed: isSuccess,
            received: execResult.stdout,
            error: execResult.stderr,
            executionTime: execResult.executionTime,
          },
        ],
        earnedXP: isSuccess && !alreadyCompleted ? xpReward : 0,
        alreadyCompleted,
        executionTimeMs: execResult.executionTime,
        provider: this.provider.name,
        executionMode: execResult.executionMode,
        error: execResult.stderr || undefined,
      };
    }

    const results: TestCaseResult[] = [];
    let passedCount = 0;
    let totalTimeMs = 0;

    for (const tc of visibleTests) {
      const testCode = tc.testCode ? `${code}\n${tc.testCode}` : code;
      const execResult = await this.provider.execute({ language, code: testCode });
      totalTimeMs += execResult.executionTime;

      const isPassed = execResult.status === "success" && !execResult.stderr;
      if (isPassed) passedCount++;

      results.push({
        name: tc.name,
        description: tc.description,
        passed: isPassed,
        expected: tc.expectedOutput,
        received: execResult.stdout || undefined,
        error: execResult.stderr || undefined,
        executionTime: execResult.executionTime,
      });
    }

    // Evaluate hidden tests (server-side only, stripped before client return)
    for (const tc of hiddenTests) {
      const testCode = tc.testCode ? `${code}\n${tc.testCode}` : code;
      const execResult = await this.provider.execute({ language, code: testCode });
      totalTimeMs += execResult.executionTime;

      const isPassed = execResult.status === "success" && !execResult.stderr;
      if (isPassed) passedCount++;
    }

    const isAllPassed = passedCount === totalTests;
    const score = Math.round((passedCount / totalTests) * 100);

    const execSample = await this.provider.execute({ language, code });

    return {
      status: isAllPassed ? "passed" : "failed",
      score,
      totalTests,
      passedTests: passedCount,
      results,
      earnedXP: isAllPassed && !alreadyCompleted ? xpReward : 0,
      alreadyCompleted,
      executionTimeMs: totalTimeMs || execSample.executionTime,
      provider: this.provider.name,
      executionMode: execSample.executionMode,
    };
  }
}
