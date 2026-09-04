import { Request, Response } from "express";
import { getExecutionProvider, MAX_CODE_SIZE_BYTES } from "../services/execution";

/**
 * POST /api/code/execute
 * Safely simulates or executes code via pluggable CodeExecutionProvider.
 * Strictly guarantees no arbitrary host execution.
 */
export async function executeCodeController(req: Request, res: Response) {
  try {
    const { language, code, stdin, timeoutMs } = req.body;

    if (!language || typeof language !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'language' parameter.",
      });
    }

    if (code === undefined || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid 'code' parameter.",
      });
    }

    const codeBytes = Buffer.byteLength(code, "utf8");
    if (codeBytes > MAX_CODE_SIZE_BYTES) {
      return res.status(413).json({
        success: false,
        error: `Payload too large: Code exceeds the 64 KB limit (${(codeBytes / 1024).toFixed(1)} KB).`,
      });
    }

    const provider = getExecutionProvider();
    const result = await provider.execute({
      language,
      code,
      stdin,
      timeoutMs: Math.min(Number(timeoutMs) || 5000, 10000),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("[CODE EXECUTION ERROR]", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to execute code.",
    });
  }
}
