import { getAIProvider, getChatProvider, HeuristicAIProvider } from "./ai/aiProvider";
import type { ChatMessage } from "./ai/aiProvider";

// ─── Legacy Action-Based Payload (backward compatibility) ───────────

export interface AIRequestPayload {
  action: "explain" | "hint" | "debug" | "review" | "optimize";
  code: string;
  userMessage?: string;
  error?: string;
  language?: string;
  learningMode?: boolean;
  template?: string;
  consoleOutput?: string[];
  testResults?: Array<{ name: string; passed: boolean; error?: string }>;
  context?: {
    activeFile?: string;
    projectFiles?: Array<{ path: string; content: string }>;
  };
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface AIResponsePayload {
  success: boolean;
  action: string;
  provider: string;
  learningMode: boolean;
  message: string;
}

// ─── New Chat-Based Payload ─────────────────────────────────────────

export interface ChatRequestPayload {
  userMessage: string;
  code?: string;
  activeFile?: string;
  language?: string;
  learningMode?: boolean;
  template?: string;
  consoleOutput?: string[];
  testResults?: Array<{ name: string; passed: boolean; error?: string }>;
  projectFiles?: Array<{ path: string; content: string }>;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface ChatResponsePayload {
  success: boolean;
  provider: string;
  learningMode: boolean;
  message: string;
}

// ─── Security Constants ─────────────────────────────────────────────

const MAX_USER_MESSAGE_LENGTH = 2000;
const MAX_CODE_LENGTH = 50000;
const MAX_CONVERSATION_HISTORY = 20;
const MAX_HISTORY_MESSAGE_LENGTH = 3000;

// ─── New Chat-First Processing ──────────────────────────────────────

export async function processCodingLabChat(
  payload: ChatRequestPayload
): Promise<ChatResponsePayload> {
  // ─── Input Validation ───
  if (!payload.userMessage || typeof payload.userMessage !== "string") {
    throw new Error("userMessage is required");
  }

  if (payload.userMessage.length > MAX_USER_MESSAGE_LENGTH) {
    throw new Error(`Message too long (max ${MAX_USER_MESSAGE_LENGTH} characters)`);
  }

  if (payload.code && payload.code.length > MAX_CODE_LENGTH) {
    throw new Error(`Code too long (max ${MAX_CODE_LENGTH} characters)`);
  }

  const learningMode = payload.learningMode !== false;
  const activeFileName = payload.activeFile || "src/index.js";
  const language = payload.language || "javascript";

  // ─── Build System Prompt with Workspace Context ───
  let systemPrompt = `You are a friendly, knowledgeable Senior Backend Engineering Mentor inside the Backend Academy AI Coding Lab.

Your personality:
- Warm, encouraging, and conversational — like a senior engineer pairing with a junior developer
- You explain complex concepts in simple, relatable terms
- You use analogies and real-world examples when helpful
- You celebrate progress and good thinking
- You ask follow-up questions to deepen understanding when appropriate

Your expertise covers: Node.js, Express.js, REST APIs, databases (MongoDB, PostgreSQL), authentication, middleware, error handling, testing, deployment, and backend architecture patterns.

Response formatting:
- Use markdown for structure (headers, bold, code blocks, lists)
- Keep responses focused and concise — avoid unnecessary padding
- Use code blocks with language tags for code examples
- For errors, clearly identify the problem line and explain why it happens before showing the fix`;

  if (learningMode) {
    systemPrompt += `

LEARNING MODE IS ACTIVE:
- Prioritize teaching concepts and mental models over dumping copy-paste answers
- When an error or question is asked:
  1. Clearly identify the specific line(s) or pattern in their code that causes the behavior
  2. Explain WHY the runtime or framework behaves this way
  3. Give progressive hints and a guided approach to fix it
  4. Provide a small focused illustrative snippet if helpful, but encourage the student to write the actual implementation
- If the user explicitly asks for the complete working code (e.g. "show me the full code", "give me the solution"), provide the complete, clean, production-grade code with thorough explanation`;
  } else {
    systemPrompt += `

DIRECT MODE IS ACTIVE:
- Provide direct, production-grade answers, concrete code corrections, and clear explanations
- Reference the active file and surrounding architecture directly`;
  }

  // ─── Inject Workspace Context into System Prompt ───
  const contextSections: string[] = [];

  if (payload.template) {
    contextSections.push(`Project Template: ${payload.template}`);
  }

  if (payload.code) {
    contextSections.push(
      `Currently Active File: ${activeFileName} (${language})\n\`\`\`${language}\n${payload.code.slice(0, MAX_CODE_LENGTH)}\n\`\`\``
    );
  }

  // Other workspace files
  if (Array.isArray(payload.projectFiles) && payload.projectFiles.length > 0) {
    const otherFiles = payload.projectFiles.filter((f) => f.path !== activeFileName);
    if (otherFiles.length > 0) {
      const fileSummaries = otherFiles
        .slice(0, 5)
        .map((f) => `File: ${f.path}\n\`\`\`javascript\n${f.content.slice(0, 3000)}\n\`\`\``)
        .join("\n\n");
      contextSections.push(`Other Workspace Files:\n${fileSummaries}`);
    }
  }

  // Runtime diagnostics
  const diagnosticLines: string[] = [];
  if (Array.isArray(payload.consoleOutput) && payload.consoleOutput.length > 0) {
    diagnosticLines.push(`Console Output:\n${payload.consoleOutput.slice(-15).join("\n")}`);
  }
  if (Array.isArray(payload.testResults) && payload.testResults.length > 0) {
    const failedTests = payload.testResults.filter((t) => !t.passed);
    if (failedTests.length > 0) {
      diagnosticLines.push(
        `Failed Tests:\n${failedTests.map((t) => `- [FAIL] ${t.name}: ${t.error || "Assertion failed"}`).join("\n")}`
      );
    } else {
      diagnosticLines.push(`Test Suite: All ${payload.testResults.length} test(s) passed.`);
    }
  }

  if (diagnosticLines.length > 0) {
    contextSections.push(`Runtime Diagnostics:\n${diagnosticLines.join("\n\n")}`);
  }

  if (contextSections.length > 0) {
    systemPrompt += `

=== STUDENT'S CURRENT WORKSPACE CONTEXT ===
${contextSections.join("\n\n")}
=== END WORKSPACE CONTEXT ===

Use this workspace context to provide relevant, specific help. Reference actual code from their files when explaining concepts.`;
  }

  // ─── Build Conversation Messages ───
  const chatMessages: ChatMessage[] = [];

  // Add sanitized conversation history
  if (Array.isArray(payload.conversationHistory)) {
    const sanitizedHistory = payload.conversationHistory
      .slice(-MAX_CONVERSATION_HISTORY)
      .filter(
        (h) =>
          h &&
          typeof h.content === "string" &&
          h.content.trim() &&
          (h.role === "user" || h.role === "assistant")
      )
      .map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH),
      }));

    chatMessages.push(...sanitizedHistory);
  }

  // Add current user message
  chatMessages.push({
    role: "user",
    content: payload.userMessage,
  });

  // ─── Ensure valid message ordering for Gemini ───
  // Gemini requires alternating user/model turns. Merge consecutive same-role messages.
  const normalizedMessages: ChatMessage[] = [];
  for (const msg of chatMessages) {
    const last = normalizedMessages[normalizedMessages.length - 1];
    if (last && last.role === msg.role) {
      last.content += "\n\n" + msg.content;
    } else {
      normalizedMessages.push({ ...msg });
    }
  }

  // Gemini requires the first message to be from "user"
  if (normalizedMessages.length > 0 && normalizedMessages[0].role === "assistant") {
    normalizedMessages.shift();
  }

  // Gemini requires the last message to be from "user"
  if (normalizedMessages.length > 0 && normalizedMessages[normalizedMessages.length - 1].role !== "user") {
    normalizedMessages.push({ role: "user", content: payload.userMessage });
  }

  console.log(
    `[CodingLabChat] Processing | Provider: Gemini | Messages: ${normalizedMessages.length} | ActiveFile: ${activeFileName} | LearningMode: ${learningMode}`
  );

  // ─── Send to Gemini ───
  try {
    const provider = getChatProvider();
    const message = await provider.generateChat(normalizedMessages, systemPrompt);
    return {
      success: true,
      provider: provider.name,
      learningMode,
      message,
    };
  } catch (err: any) {
    console.error(`[CodingLabChat] Chat provider failed: ${err.message || String(err)}`);
    throw new Error(
      err.message?.includes("GEMINI_API_KEY")
        ? "AI assistant is not configured. Please add your GEMINI_API_KEY to the backend environment."
        : `AI assistant error: ${err.message || "Unknown error"}`
    );
  }
}

// ─── Legacy Action-Based Processing (Backward Compatibility) ────────

export async function processCodingLabAI(
  payload: AIRequestPayload
): Promise<AIResponsePayload> {
  const provider = getAIProvider();
  const learningMode = payload.learningMode !== false; // default true
  const activeFileName = payload.context?.activeFile || "src/index.js";
  const language = payload.language || "javascript";

  let systemPrompt = `You are a Senior Backend Software Engineering Mentor and Code Teacher inside the Backend Academy AI Coding Lab.
Your goal is to help developers learn backend engineering, Express.js, Node.js, REST APIs, databases, error handling, and architecture.`;

  if (learningMode) {
    systemPrompt += `

LEARNING MODE IS ACTIVE:
- Prioritize teaching concepts and mental models over blindly dumping copy-paste answers.
- When an error or question is asked:
  1. Clearly identify the specific line(s) or pattern in their active code that causes the behavior.
  2. Explain WHY the runtime or framework behaves this way.
  3. Give progressive hints and a guided approach to fix it.
  4. Provide a small focused illustrative snippet if helpful, but encourage the student to write the actual implementation.
- If the user explicitly begs or asks for the complete working code (e.g. "show me the full code", "give me the solution"), provide the complete, clean, production-grade code with thorough explanation.`;
  } else {
    systemPrompt += `

DIRECT MODE IS ACTIVE:
- Provide direct, production-grade answers, concrete code corrections, and clear explanations.
- Reference the active file and surrounding architecture directly.`;
  }

  // Build Comprehensive Context Prompt
  const promptSections: string[] = [];

  // 1. User Intent / Query
  promptSections.push(`## USER REQUEST\nAction: ${payload.action.toUpperCase()}`);
  if (payload.userMessage) {
    promptSections.push(`User Message: "${payload.userMessage}"`);
  }

  // 2. Project & Architecture Context
  if (payload.template) {
    promptSections.push(`Project Template: ${payload.template}`);
  }

  // 3. Active Code
  promptSections.push(
    `## ACTIVE FILE: ${activeFileName} (${language})\n\`\`\`${language}\n${payload.code}\n\`\`\``
  );

  // 4. Other Workspace Files (if available)
  if (Array.isArray(payload.context?.projectFiles) && payload.context.projectFiles.length > 0) {
    const otherFiles = payload.context.projectFiles.filter((f) => f.path !== activeFileName);
    if (otherFiles.length > 0) {
      const fileSummaries = otherFiles
        .map((f) => `### File: ${f.path}\n\`\`\`javascript\n${f.content.slice(0, 4000)}\n\`\`\``)
        .join("\n\n");
      promptSections.push(`## OTHER WORKSPACE FILES\n${fileSummaries}`);
    }
  }

  // 5. Diagnostics: Runtime Errors & Console Output
  const diagnosticLines: string[] = [];
  if (payload.error) {
    diagnosticLines.push(`Reported Error / Stack Trace:\n${payload.error}`);
  }
  if (Array.isArray(payload.consoleOutput) && payload.consoleOutput.length > 0) {
    diagnosticLines.push(`Console Logs:\n${payload.consoleOutput.slice(-20).join("\n")}`);
  }
  if (Array.isArray(payload.testResults) && payload.testResults.length > 0) {
    const failedTests = payload.testResults.filter((t) => !t.passed);
    if (failedTests.length > 0) {
      diagnosticLines.push(
        `Failed Tests:\n${failedTests.map((t) => `- [FAIL] ${t.name}: ${t.error || "Assertion failed"}`).join("\n")}`
      );
    } else {
      diagnosticLines.push(`Test Suite: All ${payload.testResults.length} test(s) passed.`);
    }
  }

  if (diagnosticLines.length > 0) {
    promptSections.push(`## RUNTIME DIAGNOSTICS & TEST OUTPUT\n${diagnosticLines.join("\n\n")}`);
  }

  // 6. Recent Conversation History (if present)
  if (Array.isArray(payload.conversationHistory) && payload.conversationHistory.length > 0) {
    const recentHistory = payload.conversationHistory
      .slice(-6)
      .map((h) => `${h.role === "user" ? "Student" : "AI Mentor"}: ${h.content.slice(0, 500)}`)
      .join("\n\n");
    promptSections.push(`## RECENT CONVERSATION HISTORY\n${recentHistory}`);
  }

  // 7. Action-Specific Instructions
  promptSections.push(`## TASK INSTRUCTIONS FOR ACTION: ${payload.action.toUpperCase()}`);
  if (payload.action === "debug") {
    promptSections.push(
      `Inspect the code and runtime diagnostics above. Specifically address the active file (${activeFileName}):\n` +
        `1. Identify the exact line(s) or pattern causing the failure.\n` +
        `2. Explain the root cause in the context of Node.js/Express.\n` +
        `3. Provide targeted hints and a suggested fix.`
    );
  } else if (payload.action === "hint") {
    promptSections.push(
      `Provide a conceptual hint on how to progress or fix the active file (${activeFileName}) without giving away the complete solution immediately.`
    );
  } else if (payload.action === "explain") {
    promptSections.push(
      `Explain the purpose, request lifecycle, middleware flow, and backend architecture of ${activeFileName} and its relation to the other workspace files.`
    );
  } else if (payload.action === "review") {
    promptSections.push(
      `Review ${activeFileName} for backend best practices, input validation, error handling, security (OWASP), and architectural cleanliness.`
    );
  } else if (payload.action === "optimize") {
    promptSections.push(
      `Analyze ${activeFileName} for performance, asynchronous efficiency, memory leaks, query optimizations, and cleaner idioms.`
    );
  }

  const fullPrompt = promptSections.join("\n\n");

  const hasWorkspaceContext = !!(payload.context?.projectFiles && payload.context.projectFiles.length > 1);
  console.log(
    `[CodingLabAI] Processing request | Action: ${payload.action} | Provider: ${provider.name} | ActiveFile: ${activeFileName} | HasWorkspaceContext: ${hasWorkspaceContext} | LearningMode: ${learningMode}`
  );

  try {
    const message = await provider.generate(fullPrompt, systemPrompt);
    return {
      success: true,
      action: payload.action,
      provider: provider.name,
      learningMode,
      message,
    };
  } catch (err: any) {
    console.error(
      `[CodingLabAI] Provider ${provider.name} failed: ${err.message || String(err)}`
    );
    throw new Error(
      `AI assistant error: ${err.message || "Unknown error"}. Please check your AI provider configuration.`
    );
  }
}
