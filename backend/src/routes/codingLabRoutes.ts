import { Router } from "express";
import { authenticateUser } from "../middleware/auth";
import {
  runCode,
  runTests,
  askAI,
  chatWithAI,
  getWorkspaces,
  createWorkspace,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/codingLabController";

const router = Router();

// Execution & Testing Endpoints
router.post("/run", runCode);
router.post("/test", runTests);
router.post("/ai", askAI);
router.post("/ai/chat", chatWithAI);

// Protected Workspace Persistence Endpoints
router.get("/workspaces", authenticateUser, getWorkspaces);
router.post("/workspaces", authenticateUser, createWorkspace);
router.get("/workspaces/:id", authenticateUser, getWorkspaceById);
router.put("/workspaces/:id", authenticateUser, updateWorkspace);
router.delete("/workspaces/:id", authenticateUser, deleteWorkspace);

export default router;
