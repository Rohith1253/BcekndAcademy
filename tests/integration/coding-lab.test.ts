import mongoose from "mongoose";
import { connectDB } from "../../backend/src/config/db";
import { User } from "../../backend/src/models/User";
import { CodingWorkspace } from "../../backend/src/models/CodingWorkspace";
import { executeCodingLabCode, VirtualFile } from "../../backend/src/services/codingLabExecution.service";
import { runCodingLabTests, LabTestCase } from "../../backend/src/services/codingLabTest.service";
import { processCodingLabAI } from "../../backend/src/services/codingLabAI.service";
import { hashPassword } from "../../backend/src/utils/auth";

export async function runCodingLabIntegrationTests(
  assert: (condition: boolean, description: string) => void
) {
  console.log("\n--- Executing Integration Tests: AI Coding Lab System ---");

  await connectDB();

  // 1. Multi-file Virtual Execution with Express Mocking
  const virtualFiles: VirtualFile[] = [
    {
      path: "/server.js",
      content: `
        const express = require('express');
        const app = express();
        app.use(express.json());

        app.get('/api/health', (req, res) => {
          res.status(200).json({ status: "ok", timestamp: 12345 });
        });

        app.post('/api/users', (req, res) => {
          res.status(201).json({ id: "usr_101", created: true });
        });

        console.log("Mock Express server initialized successfully");
      `,
    },
    {
      path: "/utils.js",
      content: `console.log("Utils loaded");`,
    },
  ];

  const execResult = executeCodingLabCode(virtualFiles, "/server.js", 2000);
  assert(execResult.errors.length === 0, "Sandbox executes virtual multi-file project without uncaught errors");
  assert(execResult.output.some((l) => l.includes("Mock Express server initialized")), "Captured console output from virtual files");
  assert(execResult.httpResponses.length >= 2, `Mock Express captured registered endpoints (Found: ${execResult.httpResponses.length})`);

  // 2. Sandbox Infinite Loop Defense
  const infiniteLoopFiles: VirtualFile[] = [
    {
      path: "/loop.js",
      content: "while (true) {}",
    },
  ];
  const loopResult = executeCodingLabCode(infiniteLoopFiles, "/loop.js", 500);
  assert(loopResult.errors.length > 0 || !loopResult.success, "Sandbox successfully intercepts and terminates infinite loop execution");

  // 3. Sandbox Host Isolation Defense
  const hostileFiles: VirtualFile[] = [
    {
      path: "/attack.js",
      content: `
        try {
          const fs = require('fs');
          console.log('fs acquired');
        } catch (e) {
          console.log('require fs blocked');
        }
      `,
    },
  ];
  const hostileResult = executeCodingLabCode(hostileFiles, "/attack.js", 1000);
  assert(
    hostileResult.output.some((l) => l.includes("blocked") || l.includes("require fs blocked")),
    "Host filesystem module require is safely blocked in sandbox"
  );

  // 4. Lab Test Runner Execution
  const testCases: LabTestCase[] = [
    {
      id: "test-1",
      name: "GET /api/health returns status 200",
      input: { method: "GET", path: "/api/health" },
      expectedStatus: 200,
    },
    {
      id: "test-2",
      name: "POST /api/users returns 201",
      input: { method: "POST", path: "/api/users" },
      expectedStatus: 201,
    },
  ];

  const testOutcome = runCodingLabTests(virtualFiles, testCases, "/server.js", 2000);
  assert(testOutcome.totalTests === 2, "Test harness ran both configured test cases");
  assert(testOutcome.testsPassed === 2, "Both simulated API tests passed with matching status");

  // 5. AI Assistant Service (Testing Heuristic Fallback & Learning Mode)
  const aiExplanation = await processCodingLabAI({
    action: "explain",
    code: virtualFiles[0].content,
    language: "javascript",
    learningMode: true,
    context: { activeFile: "/server.js" },
  });
  assert(Boolean(aiExplanation.success && aiExplanation.message.length > 20), "AI Assistant returns pedagogical explanation");
  assert(aiExplanation.learningMode === true, "AI Assistant respects Learning Mode flag");

  const aiDebug = await processCodingLabAI({
    action: "debug",
    code: "const a = ;",
    error: "SyntaxError: Unexpected token ';'",
    language: "javascript",
    learningMode: true,
  });
  assert(Boolean(aiDebug.success && aiDebug.message.length > 20), "AI Assistant diagnoses error context cleanly");

  // 6. MongoDB CodingWorkspace Persistence & Isolation
  const testEmail = `lab_user_${Date.now()}@example.com`;
  const testPassword = await hashPassword("Password123!");
  const userA = await User.create({
    name: "Lab Tester A",
    email: testEmail,
    password: testPassword,
    xp: 100,
    level: 1,
  });

  const workspace = await CodingWorkspace.create({
    userId: userA._id,
    name: "My Test Workspace",
    template: "express-api",
    activeFile: "/app.js",
    files: [
      {
        name: "app.js",
        path: "/app.js",
        language: "javascript",
        content: "console.log('hello workspace');",
      },
    ],
  });

  assert(Boolean(workspace._id), "Successfully created CodingWorkspace in MongoDB");

  // Query workspace
  const retrieved = await CodingWorkspace.findOne({ _id: workspace._id, userId: userA._id });
  assert(retrieved?.name === "My Test Workspace", "Retrieved workspace belongs to user");

  // User isolation check: query with a different user ID
  const fakeUserId = new mongoose.Types.ObjectId();
  const isolatedQuery = await CodingWorkspace.findOne({ _id: workspace._id, userId: fakeUserId });
  assert(isolatedQuery === null, "Workspace is strictly isolated by userId");

  // Update workspace
  await CodingWorkspace.updateOne(
    { _id: workspace._id, userId: userA._id },
    { $set: { name: "Updated Workspace Name" } }
  );
  const updated = await CodingWorkspace.findById(workspace._id);
  assert(updated?.name === "Updated Workspace Name", "Workspace name updated successfully");

  // Cleanup
  await CodingWorkspace.deleteOne({ _id: workspace._id });
  await User.deleteOne({ _id: userA._id });

  const finalCheck = await CodingWorkspace.findById(workspace._id);
  assert(finalCheck === null, "Workspace cleaned up successfully");
}
