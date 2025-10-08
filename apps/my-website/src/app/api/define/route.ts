import { analyzeWord } from "@packages/ai-dictionary/services";
import { type NextRequest, NextResponse } from "next/server";

// 處理不支援的 HTTP 方法
export async function GET() {
  return NextResponse.json({ error: "此 API 僅支援 POST 請求" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();

    // 讀取環境變數
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("伺服器設定錯誤:缺少 GEMINI_API_KEY");
      return NextResponse.json({ error: "伺服器設定錯誤" }, { status: 500 });
    }

    // 調用 service
    const result = await analyzeWord(word, apiKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API 處理錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
