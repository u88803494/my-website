import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_2_5_FLASH_LITE } from "@packages/shared/constants";

export async function analyzeWithAI(
  need: string,
  prompt: string,
  apiKey: string
) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_2_5_FLASH_LITE });

  const result = await model.generateContent(`${prompt}\n\n用戶需求：${need}`);
  const response = await result.response;

  return {
    analysisResult: response.text(),
  };
}
