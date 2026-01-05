import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createMistral } from "@ai-sdk/mistral";
import {
  AI_MODELS,
  type AIModelId,
  type AIModelProvider,
  DEFAULT_MODEL_ID,
  getModelById,
  isValidModelId,
  RATE_LIMIT_CONFIG,
} from "@packages/shared";
import { createLogger, getErrorStatusCode, logError, parseAIErrorMessage } from "@packages/shared/utils";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { type NextRequest, NextResponse } from "next/server";

import { checkRateLimit, getClientIP } from "@/lib/rateLimit";

const logger = createLogger({ context: "api/chat" });

// =============================================================================
// Configuration Constants
// =============================================================================

// Rate limiting (from shared config)
const {
  limit: RATE_LIMIT,
  unknownIpLimit: RATE_LIMIT_UNKNOWN_IP,
  windowMs: RATE_LIMIT_WINDOW,
} = RATE_LIMIT_CONFIG.chat;

// Request size limits (DoS protection)
const MAX_PAYLOAD_SIZE = 512 * 1024; // 512KB total request size

// Message validation limits
// - MAX_MESSAGES: Prevents context overflow and excessive API costs
// - MAX_MESSAGE_LENGTH: 32KB aligns with typical LLM context chunks
// - MAX_OUTPUT_TOKENS: 4096 balances response quality with API costs
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 32 * 1024; // 32KB per message
const MAX_OUTPUT_TOKENS = 4096;
const VALID_ROLES = ["user", "assistant", "system"] as const;

// =============================================================================
// Provider Configuration
// =============================================================================

interface ProviderConfig {
  apiKey: string | undefined;
  models: AIModelId[];
}

function getProviderConfig(): Record<AIModelProvider, ProviderConfig> {
  return {
    google: {
      apiKey: process.env.GEMINI_API_KEY,
      models: AI_MODELS.filter((m) => m.provider === "google").map((m) => m.id),
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      models: AI_MODELS.filter((m) => m.provider === "groq").map((m) => m.id),
    },
    mistral: {
      apiKey: process.env.MISTRAL_API_KEY,
      models: AI_MODELS.filter((m) => m.provider === "mistral").map((m) => m.id),
    },
  };
}

function getProviderForModel(modelId: AIModelId): {
  provider: AIModelProvider;
  apiKey: string;
} | null {
  const model = getModelById(modelId);
  if (!model) return null;

  const config = getProviderConfig()[model.provider];
  if (!config.apiKey) {
    logger.error({ provider: model.provider, model: modelId }, "API key not configured for provider");
    return null;
  }

  return { provider: model.provider, apiKey: config.apiKey };
}

// Create provider instance based on provider type
function createProviderInstance(provider: AIModelProvider, apiKey: string) {
  switch (provider) {
    case "google":
      return createGoogleGenerativeAI({ apiKey });
    case "groq":
      return createGroq({ apiKey });
    case "mistral":
      return createMistral({ apiKey });
  }
}

// =============================================================================
// Message Validation
// =============================================================================

interface ValidatedMessage {
  role: (typeof VALID_ROLES)[number];
  content: string;
}

interface MessageValidationResult {
  success: boolean;
  messages?: ValidatedMessage[];
  error?: string;
}

function validateMessages(messages: unknown): MessageValidationResult {
  // Check if messages is an array
  if (!Array.isArray(messages)) {
    return { success: false, error: "訊息格式不正確" };
  }

  // Check message count
  if (messages.length === 0) {
    return { success: false, error: "請輸入訊息" };
  }
  if (messages.length > MAX_MESSAGES) {
    return { success: false, error: `訊息數量超過上限 (${MAX_MESSAGES})` };
  }

  // Validate each message
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];

    // Check message structure
    if (typeof msg !== "object" || msg === null) {
      return { success: false, error: `訊息 ${i + 1} 格式不正確` };
    }

    const { role, content } = msg as Record<string, unknown>;

    // Validate role
    if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
      return { success: false, error: `訊息 ${i + 1} 的角色不正確` };
    }

    // Validate content
    if (typeof content !== "string") {
      return { success: false, error: `訊息 ${i + 1} 的內容格式不正確` };
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      return { success: false, error: `訊息 ${i + 1} 超過長度限制 (${MAX_MESSAGE_LENGTH / 1024}KB)` };
    }
  }

  return { success: true, messages: messages as ValidatedMessage[] };
}

// =============================================================================
// System Prompt
// =============================================================================

const SYSTEM_PROMPT = `你是一個友善且專業的 AI 助手。請用繁體中文回答問題。
回答時請注意：
- 清晰且有組織地呈現資訊
- 適當使用 Markdown 格式（標題、列表、程式碼區塊等）
- 對於技術問題，提供具體的程式碼範例
- 保持友善但專業的語氣`;

// Handle unsupported HTTP methods
export async function GET() {
  logger.warn({ method: "GET" }, "Unsupported HTTP method");
  return NextResponse.json({ error: "此 API 僅支援 POST 請求" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  // Payload size check (DoS protection)
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_PAYLOAD_SIZE) {
    logger.warn({ ip: clientIP, size: contentLength }, "Payload too large");
    return NextResponse.json({ error: "請求內容過大，請減少訊息數量" }, { status: 413 });
  }

  // Rate limiting check (stricter for unknown IPs)
  const rateLimit = clientIP === "unknown" ? RATE_LIMIT_UNKNOWN_IP : RATE_LIMIT;
  const rateLimitResult = checkRateLimit(clientIP, rateLimit, RATE_LIMIT_WINDOW);
  if (!rateLimitResult.success) {
    logger.warn({ ip: clientIP, resetTime: rateLimitResult.resetTime }, "Rate limit exceeded");
    return NextResponse.json(
      {
        error: "請求過於頻繁，請稍後再試",
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(rateLimitResult.resetTime / 1000)),
        },
      },
    );
  }

  // Parse JSON body with error handling
  let body: { messages: unknown; model?: string };
  try {
    body = await request.json();
  } catch {
    logger.warn("Invalid JSON body");
    return NextResponse.json({ error: "請求格式不正確" }, { status: 400 });
  }

  const { messages, model = DEFAULT_MODEL_ID } = body;

  try {
    // Validate messages
    const validation = validateMessages(messages);
    if (!validation.success) {
      logger.warn({ error: validation.error }, "Message validation failed");
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    logger.info({ model, messageCount: validation.messages?.length, ip: clientIP }, "Chat request received");

    // Validate and resolve model
    const actualModelId: AIModelId = isValidModelId(model) ? model : DEFAULT_MODEL_ID;
    if (!isValidModelId(model)) {
      logger.warn({ requested: model, using: actualModelId }, "Unknown model, using default");
    }

    // Check provider API key
    const providerInfo = getProviderForModel(actualModelId);
    if (!providerInfo) {
      return NextResponse.json({ error: "此模型目前無法使用，請選擇其他模型" }, { status: 503 });
    }

    // Initialize only the needed provider (security fix: don't pass wrong API key to other providers)
    const provider = createProviderInstance(providerInfo.provider, providerInfo.apiKey);
    const modelInfo = getModelById(actualModelId);

    if (!modelInfo?.apiName) {
      logger.error({ model: actualModelId }, "Unknown API model name");
      return NextResponse.json({ error: "模型設定錯誤" }, { status: 500 });
    }

    // Stream the response with output token limit
    const result = streamText({
      model: provider(modelInfo.apiName),
      messages: await convertToModelMessages(messages as UIMessage[]),
      system: SYSTEM_PROMPT,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    logger.info({ model: actualModelId }, "Streaming response started");

    // Add rate limit and security headers to response
    const response = result.toUIMessageStreamResponse();
    response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    response.headers.set("X-RateLimit-Reset", String(Math.floor(rateLimitResult.resetTime / 1000)));
    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
  } catch (error) {
    logError("Chat request failed", error, { route: "/api/chat" });

    // Parse error for user-friendly messages using shared parser
    const errorMessage = error instanceof Error ? error.message : String(error);
    const parsedError = parseAIErrorMessage(errorMessage);

    logger.warn({ errorType: parsedError.type, model: parsedError.model }, "AI request failed");

    return NextResponse.json(
      {
        error: parsedError.message,
        errorType: parsedError.type,
        suggestAlternative: parsedError.suggestAlternative,
      },
      { status: getErrorStatusCode(parsedError.type) },
    );
  }
}
