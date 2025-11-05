import { analyzeWithAI } from "@packages/ai-analyzer/services";
import { createLogger, logError } from "@packages/shared/utils";
import { type NextRequest, NextResponse } from "next/server";

const logger = createLogger({ context: "api/ai-analyzer" });

export async function POST(request: NextRequest) {
  try {
    const { need, prompt } = await request.json();

    if (!need || !prompt) {
      logger.warn({ hasNeed: !!need, hasPrompt: !!prompt }, "Missing required parameters");
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    logger.info({ need }, "AI analysis request received");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error("Missing GEMINI_API_KEY in environment variables");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
    }

    const result = await analyzeWithAI(need, prompt, apiKey);
    logger.info({ need, success: true }, "AI analysis completed");
    return NextResponse.json(result);
  } catch (error) {
    logError("AI analysis failed", error, { route: "/api/ai-analyzer" });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "分析失敗,請稍後再試" },
      { status: 500 },
    );
  }
}
