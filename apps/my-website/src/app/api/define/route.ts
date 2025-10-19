import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

import { GEMINI_2_5_FLASH_LITE } from "@/constants/aiModels";
import { MAX_WORD_LENGTH } from "@/constants/dictionaryConstants";
import { buildDictionaryPrompt } from "@/lib/prompts/dictionary.prompt";
import type { WordAnalysisResponse } from "@/types/dictionary.types";

// 處理不支援的 HTTP 方法
export async function GET() {
  return NextResponse.json({ error: "此 API 僅支援 POST 請求" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    // 1. 解析和驗證輸入
    const body = await request.json();
    const { word } = body;

    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "請提供有效的中文詞彙" }, { status: 400 });
    }

    if (word.length > MAX_WORD_LENGTH) {
      return NextResponse.json({ error: `查詢詞彙過長，請勿超過 ${MAX_WORD_LENGTH} 個字元。` }, { status: 400 });
    }

    // 2. 初始化 Gemini 客戶端
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("伺服器設定錯誤：缺少 GEMINI_API_KEY");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH_LITE });

    // 3. 呼叫 AI 並取得回應
    const prompt = buildDictionaryPrompt(word);
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // 4. 處理 AI 回應
    const cleanedText = cleanAIResponse(text);

    try {
      const parsedResponse: WordAnalysisResponse = JSON.parse(cleanedText);

      if (!validateResponse(parsedResponse)) {
        console.error("AI 回應資料結構不完整:", parsedResponse);
        if (process.env.NODE_ENV === "development") {
          return NextResponse.json({
            data: parsedResponse,
            debug: { cleanedText, originalText: text, parsedResponse },
            error: "AI 回應資料結構不完整 (dev 模式下仍返回資料)",
          });
        }
        return NextResponse.json({ error: "AI 回應資料結構不完整" }, { status: 500 });
      }

      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("JSON 解析失敗:", parseError);
      console.error("從 AI 收到的原始文字:", text);
      console.error("清理後的文字:", cleanedText);

      return NextResponse.json(
        {
          debug: process.env.NODE_ENV === "development" ? { cleanedText, originalText: text } : undefined,
          error: "AI 回應格式錯誤，請稍後再試",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API 處理錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    return NextResponse.json({ error: `伺服器內部錯誤: ${errorMessage}` }, { status: 500 });
  }
}

/**
 * 清理 AI 回應文本，移除 markdown 標記和額外文字
 */
function cleanAIResponse(text: string): string {
  let cleanedText = text.trim();

  // 強力清理各種可能的 markdown 標記和額外文字
  if (cleanedText.includes("```json")) {
    const startIndex = cleanedText.indexOf("```json") + 7;
    const endIndex = cleanedText.lastIndexOf("```");
    if (endIndex > startIndex) {
      cleanedText = cleanedText.substring(startIndex, endIndex).trim();
    }
  } else if (cleanedText.includes("```")) {
    const startIndex = cleanedText.indexOf("```") + 3;
    const endIndex = cleanedText.lastIndexOf("```");
    if (endIndex > startIndex) {
      cleanedText = cleanedText.substring(startIndex, endIndex).trim();
    }
  }

  // 移除可能的前綴文字（如 "好的，這是分析結果："）
  const jsonStart = cleanedText.indexOf("{");
  const jsonEnd = cleanedText.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
  }

  return cleanedText;
}

/**
 * 驗證 AI 回應的結構是否完整
 */
function validateResponse(response: WordAnalysisResponse): boolean {
  return !!(
    response.queryWord &&
    response.definitions &&
    Array.isArray(response.definitions) &&
    response.etymologyBlocks &&
    Array.isArray(response.etymologyBlocks) &&
    response.definitions.length > 0
  );
}
