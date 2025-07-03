/**
 * AI Prompts 工具函數
 * 採用提示詞組合 (Prompt Composition) 的最佳實踐
 */

/**
 * 壓縮提示詞的輔助函數
 * 將連續的空白（包括換行、tab）替換為單一空格，並修剪頭尾空白
 * @param prompt - 原始提示詞
 * @returns 壓縮後的提示詞
 */
const compress = (prompt: string): string => {
  return prompt.replace(/\s+/g, " ").trim();
};

/**
 * 角色定義 - 靜態內容
 */
const ROLE_DEFINITION =
  "你是一個專業的中文語言學家和字源學家。你的唯一任務是針對使用者提供的中文詞彙，進行深入且結構化的分析。";

/**
 * 重要提醒 - 靜態內容
 */
const IMPORTANT_REMINDERS = `
**⚠️ 嚴格要求 - 必須遵守:**
*   你的回傳內容必須是100%純粹的JSON格式，絕對不可以有任何其他內容。
*   第一個字元必須是 { ，最後一個字元必須是 }。
*   不要添加任何解釋、說明、問候語或其他文字。
*   絕對禁止使用 markdown 程式碼區塊（\`\`\`json 或 \`\`\`）。
*   不要說 "好的" 、"以下是分析結果" 或任何開場白。
*   如果你添加了任何非JSON內容，系統會報錯並要求重新處理。
*   確保所有欄位都已填寫，沒有遺漏。如果不是音譯詞，\`isTransliteration\` 應為 \`false\`，\`originalForeignWord\` 和 \`originLanguage\` 應為 \`null\`。`;

/**
 * 建立任務說明部分
 * @param word - 要查詢的中文詞彙（原始字串）
 */
const buildTaskDescription = (word: string): string => {
  const userQuery = JSON.stringify(word);
  return `
**使用者詞彙:** ${userQuery}

**直接回傳以下格式的 JSON 物件，不要有任何額外內容:**`;
};

/**
 * 建立分析指南部分
 * @param word - 要查詢的中文詞彙（原始字串）
 */
const buildAnalysisGuidelines = (word: string): string => {
  return `
**分析指南:**
1.  **判斷詞彙類型**: 首先判斷 \`${word}\` 是中文固有詞彙還是音譯詞。
2.  **definitions**: 如果一個詞有多個詞性或多個意義，請在 \`definitions\` 陣列中為每一個建立一個獨立的物件。定義必須清晰、完整。
3.  **characters**: 將查詢詞彙中的每一個字都拆開，為每個字建立一個物件。
    *   **etymology**: 這是最重要的部分。
        *   **如果詞彙是中文固有詞彙**：請提供深入的字源學解釋，追溯其根源，解釋字形結構（形聲、指事、會意、象形）及其意義的演變。
        *   **如果詞彙是音譯詞**：請解釋該字在此音譯詞中主要取其發音，並說明其在此詞中無獨立的字源學意義。如果可能，簡要提及該字在音譯中的選擇原因（例如：發音相似、字義吉祥等）。`;
};

/**
 * 建立 JSON 結構範例部分
 * @param word - 要查詢的中文詞彙（原始字串）
 */
const buildJSONStructure = (word: string): string => {
  const userQuery = JSON.stringify(word);
  return `
**JSON 物件結構:**
{
  "queryWord": ${userQuery},
  "isTransliteration": false, // 如果是音譯詞，請設為 true
  "originalForeignWord": null, // 如果是音譯詞，請填寫原始外文單詞 (例如: "coffee")
  "originLanguage": null, // 如果是音譯詞，請填寫來源語言 (例如: "English")
  "definitions": [
    {
      "partOfSpeech": "詞性 (例如：名詞, 動詞, 形容詞)",
      "meaning": "在該詞性下的完整、清晰的中文定義"
    }
  ],
  "characters": [
    {
      "char": "單一字元",
      "zhuyin": "該字元的注音符號",
      "pinyin": "該字元的漢語拼音",
      "etymology": "該字元的字源學分析，根據詞彙類型提供不同解釋"
    }
  ]
}`;
};

/**
 * 組合所有提示詞組件，建立完整的字典查詢 Prompt
 * @param word - 要查詢的中文詞彙
 * @returns 完整的格式化 Prompt 字串
 */
export const buildDictionaryPrompt = (word: string): string => {
  const promptComponents = [
    compress(ROLE_DEFINITION),
    compress(buildTaskDescription(word)),
    compress(buildAnalysisGuidelines(word)),
    buildJSONStructure(word), // JSON 結構保持原樣以確保 AI 能正確理解格式
    compress(IMPORTANT_REMINDERS),
  ];

  return promptComponents.join(" ");
};
