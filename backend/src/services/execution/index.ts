import { CodeExecutionProvider } from "./CodeExecutionProvider";
import { MockExecutionProvider } from "./MockExecutionProvider";
import { DisabledExecutionProvider } from "./DisabledExecutionProvider";
import { ChallengeEvaluator } from "./ChallengeEvaluator";

export * from "./types";
export * from "./CodeExecutionProvider";
export * from "./MockExecutionProvider";
export * from "./DisabledExecutionProvider";
export * from "./ChallengeEvaluator";

let currentProvider: CodeExecutionProvider | null = null;

export function getExecutionProvider(): CodeExecutionProvider {
  if (!currentProvider) {
    const providerName = process.env.CODE_EXECUTION_PROVIDER || "mock";
    switch (providerName.toLowerCase()) {
      case "disabled":
        currentProvider = new DisabledExecutionProvider();
        break;
      case "mock":
      default:
        currentProvider = new MockExecutionProvider();
        break;
    }
  }
  return currentProvider;
}

export function getChallengeEvaluator(): ChallengeEvaluator {
  return new ChallengeEvaluator(getExecutionProvider());
}
