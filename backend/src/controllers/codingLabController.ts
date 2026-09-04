import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { CodingWorkspace } from "../models/CodingWorkspace";
import { executeCodingLabCode } from "../services/codingLabExecution.service";
import { runCodingLabTests } from "../services/codingLabTest.service";
import { processCodingLabAI, processCodingLabChat } from "../services/codingLabAI.service";

/**
 * POST /api/coding-lab/run
 * Runs virtual project files in the sandbox.
 */
export async function runCode(req: Request, res: Response) {
  try {
    const { files, entryFile } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ success: false, error: "Files array is required" });
    }

    const outcome = executeCodingLabCode(files, entryFile || "src/index.js", 2000);

    return res.status(200).json({
      success: outcome.success,
      data: outcome,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to execute code in lab sandbox",
    });
  }
}

/**
 * POST /api/coding-lab/test
 * Evaluates code against user-defined tests.
 */
export async function runTests(req: Request, res: Response) {
  try {
    const { files, tests, entryFile } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ success: false, error: "Files array is required" });
    }

    if (!Array.isArray(tests)) {
      return res.status(400).json({ success: false, error: "Tests array is required" });
    }

    const outcome = runCodingLabTests(files, tests, entryFile || "src/index.js", 2000);

    return res.status(200).json({
      success: outcome.success,
      data: outcome,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to run test suite",
    });
  }
}

/**
 * POST /api/coding-lab/ai
 * Dedicated AI Assistant for the Coding Lab.
 */
export async function askAI(req: Request, res: Response) {
  try {
    const {
      action,
      code,
      userMessage,
      error,
      language,
      learningMode,
      template,
      consoleOutput,
      testResults,
      context,
      conversationHistory,
    } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, error: "Action is required" });
    }

    if (typeof code !== "string") {
      return res.status(400).json({ success: false, error: "Code string is required" });
    }

    const outcome = await processCodingLabAI({
      action,
      code,
      userMessage,
      error,
      language: language || "javascript",
      learningMode,
      template,
      consoleOutput,
      testResults,
      context,
      conversationHistory,
    });

    return res.status(200).json({
      success: true,
      data: outcome,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "AI Assistant service error",
    });
  }
}

/**
 * POST /api/coding-lab/ai/chat
 * Chat-first AI Assistant endpoint for natural multi-turn conversations.
 */
export async function chatWithAI(req: Request, res: Response) {
  try {
    const {
      userMessage,
      code,
      activeFile,
      language,
      learningMode,
      template,
      consoleOutput,
      testResults,
      projectFiles,
      conversationHistory,
    } = req.body;

    if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    if (userMessage.length > 2000) {
      return res.status(400).json({ success: false, error: "Message too long (max 2000 characters)" });
    }

    if (Array.isArray(conversationHistory) && conversationHistory.length > 20) {
      return res.status(400).json({ success: false, error: "Conversation history too long (max 20 messages)" });
    }

    const outcome = await processCodingLabChat({
      userMessage: userMessage.trim(),
      code,
      activeFile,
      language: language || "javascript",
      learningMode,
      template,
      consoleOutput,
      testResults,
      projectFiles,
      conversationHistory,
    });

    return res.status(200).json({
      success: true,
      data: outcome,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "AI Chat service error",
    });
  }
}

/**
 * GET /api/coding-lab/workspaces
 * List saved workspaces for authenticated user.
 */
export async function getWorkspaces(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const workspaces = await CodingWorkspace.find({ userId: req.user.userId })
      .select("name template activeFile createdAt updatedAt files.path")
      .sort({ updatedAt: -1 })
      .lean();

    const formatted = workspaces.map((w) => ({
      _id: w._id,
      name: w.name,
      template: w.template,
      activeFile: w.activeFile,
      fileCount: w.files?.length || 0,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: { workspaces: formatted },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch workspaces",
    });
  }
}

/**
 * POST /api/coding-lab/workspaces
 * Create a new saved workspace.
 */
export async function createWorkspace(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { name, template, files, activeFile } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, error: "Workspace name is required" });
    }

    const count = await CodingWorkspace.countDocuments({ userId: req.user.userId });
    if (count >= 20) {
      return res.status(400).json({
        success: false,
        error: "Workspace limit reached (maximum 20 workspaces per user)",
      });
    }

    const workspace = new CodingWorkspace({
      userId: req.user.userId,
      name: name.trim(),
      template: template || "custom",
      files: Array.isArray(files) ? files : [],
      activeFile: activeFile || "src/index.js",
    });

    await workspace.save();

    return res.status(201).json({
      success: true,
      data: { workspace },
      message: "Workspace saved successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create workspace",
    });
  }
}

/**
 * GET /api/coding-lab/workspaces/:id
 * Retrieve full workspace by ID.
 */
export async function getWorkspaceById(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const workspace = await CodingWorkspace.findOne({
      _id: id,
      userId: req.user.userId,
    }).lean();

    if (!workspace) {
      return res.status(404).json({ success: false, error: "Workspace not found" });
    }

    return res.status(200).json({
      success: true,
      data: { workspace },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch workspace",
    });
  }
}

/**
 * PUT /api/coding-lab/workspaces/:id
 * Update workspace code, name, or files.
 */
export async function updateWorkspace(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, files, activeFile } = req.body;

    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name.trim();
    if (Array.isArray(files)) updateFields.files = files;
    if (activeFile) updateFields.activeFile = activeFile;

    const workspace = await CodingWorkspace.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { $set: updateFields },
      { new: true }
    );

    if (!workspace) {
      return res.status(404).json({ success: false, error: "Workspace not found" });
    }

    return res.status(200).json({
      success: true,
      data: { workspace },
      message: "Workspace updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update workspace",
    });
  }
}

/**
 * DELETE /api/coding-lab/workspaces/:id
 * Delete workspace.
 */
export async function deleteWorkspace(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const result = await CodingWorkspace.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!result) {
      return res.status(404).json({ success: false, error: "Workspace not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to delete workspace",
    });
  }
}
