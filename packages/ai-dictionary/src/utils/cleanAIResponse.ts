/**
 * 清理 AI 回應文本,移除 markdown 標記和額外文字
 */
export function cleanAIResponse(text: string): string {
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

  // 移除可能的前綴文字(如 "好的,這是分析結果:")
  const jsonStart = cleanedText.indexOf("{");
  const jsonEnd = cleanedText.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
  }

  return cleanedText;
}
