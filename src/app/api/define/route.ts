import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

import { buildDictionaryPrompt } from "@/lib/prompts";
import type { WordAnalysisResponse } from "@/types/dictionary.types";

const MAX_WORD_LENGTH = 20;

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

    // 新增：字數長度限制
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. 使用標準的字典 Prompt
    const prompt = buildDictionaryPrompt(word);

    // 4. 呼叫 AI 並取得回應
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // 5. 處理 AI 回應
    // 清理可能的 markdown 標記
    let cleanedText = text;
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
    }

    try {
      const parsedResponse: WordAnalysisResponse = JSON.parse(cleanedText);

      // 簡單驗證回應結構
      if (!parsedResponse.queryWord || !parsedResponse.definitions || !parsedResponse.characters) {
        console.error("AI 回應資料結構不完整:", parsedResponse);
        return NextResponse.json({ error: "AI 回應資料結構不完整" }, { status: 500 });
      }

      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error("JSON 解析失敗:", parseError);
      console.error("從 AI 收到的原始文字:", text);
      return NextResponse.json({ error: "AI 回應格式錯誤，請稍後再試" }, { status: 500 });
    }
  } catch (error) {
    console.error("API 處理錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    return NextResponse.json({ error: `伺服器內部錯誤: ${errorMessage}` }, { status: 500 });
  }
}
