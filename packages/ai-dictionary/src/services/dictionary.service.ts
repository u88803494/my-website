import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_2_5_FLASH_LITE, MAX_WORD_LENGTH } from "@packages/shared/constants";
import type { WordAnalysisResponse } from "@packages/shared/types";

import { buildDictionaryPrompt } from "../prompts";
import { cleanAIResponse, validateResponse } from "../utils";

export async function analyzeWord(
  word: string,
  apiKey: string
): Promise<WordAnalysisResponse> {
  // 1. 驗證輸入
  if (!word || typeof word !== "string") {
    throw new Error("請提供有效的中文詞彙");
  }

  if (word.length > MAX_WORD_LENGTH) {
    throw new Error(`查詢詞彙過長,請勿超過 ${MAX_WORD_LENGTH} 個字元。`);
  }

  // 2. 初始化 AI
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH_LITE });

  // 3. 調用 AI
  const prompt = buildDictionaryPrompt(word);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // 4. 處理回應
  const cleanedText = cleanAIResponse(text);

  try {
    const parsedResponse: WordAnalysisResponse = JSON.parse(cleanedText);

    if (!validateResponse(parsedResponse)) {
      console.error("AI 回應資料結構不完整:", parsedResponse);
      throw new Error("AI 回應資料結構不完整");
    }

    return parsedResponse;
  } catch (parseError) {
    console.error("JSON 解析失敗:", parseError);
    console.error("原始文字:", text);
    console.error("清理後:", cleanedText);
    throw new Error("AI 回應格式錯誤");
  }
}
