import { GAME_DEFINITIONS, getGameById, getGameScenarios } from "../../backend/src/games/registry";
import { evaluateGameSubmission } from "../../backend/src/games/game-engine";

export async function runGamesIntegrationTests(): Promise<{ passed: boolean; message: string }> {
  try {
    // 1. Verify Game Registry System
    if (GAME_DEFINITIONS.length !== 8) {
      return { passed: false, message: `Expected 8 registered games, found ${GAME_DEFINITIONS.length}` };
    }

    const httpStatusGame = getGameById("http-status");
    if (!httpStatusGame || httpStatusGame.title !== "HTTP Status Code Challenge") {
      return { passed: false, message: "HTTP Status Code Game definition resolution failed" };
    }

    const scenarios = getGameScenarios("http-status");
    if (scenarios.length !== 5) {
      return { passed: false, message: `Expected 5 scenarios for http-status, found ${scenarios.length}` };
    }

    // 2. Verify Server Score Evaluation & Gold Star Determination
    const mockUserId = "650000000000000000000001";
    const perfectAnswers = {
      s1: "201 Created",
      s2: "400 Bad Request",
      s3: "401 Unauthorized",
      s4: "409 Conflict",
      s5: "204 No Content",
    };

    const evalResult = await evaluateGameSubmission(mockUserId, "http-status", {
      answers: perfectAnswers,
      timeSpent: 45,
    });

    if (evalResult.score !== 100 || evalResult.stars !== "gold" || !evalResult.passed) {
      return {
        passed: false,
        message: `Evaluation failed: score=${evalResult.score}, stars=${evalResult.stars}, passed=${evalResult.passed}`,
      };
    }

    // 3. Verify Anti-Farming Protection on Replay
    const replayResult = await evaluateGameSubmission(mockUserId, "http-status", {
      answers: perfectAnswers,
      timeSpent: 30,
    });

    if (!replayResult.alreadyCompleted || replayResult.xpEarned !== 0) {
      return {
        passed: false,
        message: `Anti-farming check failed: alreadyCompleted=${replayResult.alreadyCompleted}, xpEarned=${replayResult.xpEarned}`,
      };
    }

    return { passed: true, message: "All Educational Game System integration tests passed cleanly (8 games, server scoring, anti-farming)." };
  } catch (error: any) {
    return { passed: false, message: `Games integration test error: ${error?.message || error}` };
  }
}
