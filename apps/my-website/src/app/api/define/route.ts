import { analyzeWord } from "@packages/ai-dictionary/services";
import { createLogger, logError } from "@packages/shared/utils/logger";
import { type NextRequest, NextResponse } from "next/server";

const logger = createLogger({ context: "api/define" });

// Handle unsupported HTTP methods
export async function GET() {
  logger.warn({ method: "GET" }, "Unsupported HTTP method");
  return NextResponse.json({ error: "此 API 僅支援 POST 請求" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();
    logger.info({ word }, "Word analysis request received");

    // Read environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error("Missing GEMINI_API_KEY in environment variables");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
    }

    // Call service
    const result = await analyzeWord(word, apiKey);
    logger.info({ word, success: true }, "Word analysis completed");
    return NextResponse.json(result);
  } catch (error) {
    logError("Word analysis failed", error, { route: "/api/define" });
    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
