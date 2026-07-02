import { analyzeWord } from "@packages/ai-dictionary/services";
import { createLogger, logError } from "@packages/shared/utils";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

const logger = createLogger({ context: "api/define" });

const isClientInputError = (message: string): boolean => {
  return message === "請提供有效的中文詞彙" || message.startsWith("查詢詞彙過長");
};

// Handle unsupported HTTP methods
export async function GET() {
  logger.warn({ method: "GET" }, "Unsupported HTTP method");
  return NextResponse.json({ error: "此 API 僅支援 POST 請求" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    let body: { word?: unknown };

    try {
      body = (await request.json()) as { word?: unknown };
    } catch {
      return NextResponse.json({ error: "請提供有效的 JSON 請求內容" }, { status: 400 });
    }

    const { word } = body;

    if (typeof word !== "string") {
      throw new Error("請提供有效的中文詞彙");
    }

    logger.info({ word }, "Word analysis request received");

    // Get validated API key from env
    const apiKey = env.GEMINI_API_KEY;

    // Call service
    const result = await analyzeWord(word, apiKey);
    logger.info({ word, success: true }, "Word analysis completed");
    return NextResponse.json(result);
  } catch (error) {
    logError("Word analysis failed", error, { route: "/api/define" });
    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    const status = isClientInputError(errorMessage) ? 400 : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
