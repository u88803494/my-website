import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_2_5_FLASH_LITE } from "@packages/shared/constants";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { need, prompt } = await request.json();

    if (!need || !prompt) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    // 金鑰檢查
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("伺服器設定錯誤：缺少 GEMINI_API_KEY");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH_LITE });

    const result = await model.generateContent(`${prompt}\n\n用戶需求：${need}`);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      analysisResult: text,
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "分析失敗，請稍後再試" },
      { status: 500 },
    );
  }
}
