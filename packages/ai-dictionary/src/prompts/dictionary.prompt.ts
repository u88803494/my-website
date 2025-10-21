/**
 * AI 字典查詢提示詞工具函數
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
  "你是一位山達基清字專家，對中文詞彙和字源非常了解，熟悉多種語言的詞源，擅長用簡單、易懂的方式，幫助使用者徹底理解每個字詞的常見意思與來源，協助他們清除誤字，真正學會並能運用這個字詞。";

/**
 * 重要提醒 - 靜態內容
 */
const IMPORTANT_REMINDERS = `
**⚠️ 嚴格要求 - 必須遵守:**
*   你的回傳內容必須是100%純粹的JSON格式，絕對不可以有任何其他內容。
*   第一個字元必須是 { ，最後一個字元必須是 }。
*   不要添加任何解釋、說明、問候語或其他文字。
*   絕對禁止任何形式的 markdown 區塊（包括所有以三個 backtick 開頭的區塊，例如「三個 backtick 加 json」、「三個 backtick 加 text」等），只允許純 JSON。
*   不要說 "好的" 、"以下是分析結果" 或任何開場白。
*   如果你添加了任何非JSON內容，系統會報錯並要求重新處理。
*   確保所有欄位都已填寫，沒有遺漏。definitions 陣列只需列出常見意思（包含詞性）。`;

/**
 * 建立任務說明部分
 * @param word - 要查詢的中文詞彙（原始字串）
 */
const buildTaskDescription = (word: string): string => {
  const userQuery = JSON.stringify(word);
  return `
**使用者詞彙:** ${userQuery}

**請直接回傳以下格式的 JSON 物件，不要有任何額外內容：**`;
};

/**
 * 建立分析指南部分
 * @param word - 要查詢的中文詞彙（原始字串）
 */
const buildAnalysisGuidelines = (word: string): string => {
  return `
**分析指南:**
1.  **列出常見意思**：請列出「${word}」在中文裡的常見定義，每一個意思都要用簡單、易懂的語言解釋，並標明詞性。
2.  **字源分析**：
    - 請將所有字源分析內容（包含外來語來源、每個中文字的字源）**依照查詢詞彙的語意結構順序**，全部放在 etymologyBlocks 陣列中，不可自行調整或合併。
    - 例如：「歇斯底里的卡拉ok」必須依序為：「歇斯底里」的外來語來源 →「的」的中文字源 →「卡拉ok」的外來語來源。
    - 外來語請用 type: "foreign"，value 欄位填寫來源、語意、演變、傳入中文的過程等。
    - 有中文字源的字請用 type: "character"，並填寫 char、zhuyin、pinyin、etymology。
    - 不要回傳 foreignEtymology 或 characters 欄位，只能用 etymologyBlocks。
3.  **嚴格對應每一字或語素**：
    - etymologyBlocks 必須與查詢詞彙的每一個字或語素一一對應，不能省略、不能多加。
    - 若某字來源不詳，請明確標註「來源不詳」或「無法考證」。
`;
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
  "definitions": [
    {
      "partOfSpeech": "詞性 (例如：名詞, 動詞, 形容詞)",
      "meaning": "簡單、易懂的定義"
    }
  ],
  "etymologyBlocks": [
    {
      "type": "foreign",
      "value": "外來語來源說明..."
    },
    {
      "type": "character",
      "char": "有實際中文字源的單一字元",
      "zhuyin": "該字元的注音符號",
      "pinyin": "該字元的漢語拼音",
      "etymology": "該字元的字源學分析"
    }
    // ...依照語意結構順序排列，且每一個字或語素都必須有對應區塊，不能省略、不能多加
  ]
}

// 外來語複合詞語意結構順序範例：
{
  "queryWord": "歇斯底里的卡拉ok",
  "definitions": [
    {
      "partOfSpeech": "形容詞",
      "meaning": "..."
    }
  ],
  "etymologyBlocks": [
    {
      "type": "foreign",
      "value": "歇斯底里..."
    },
    {
      "type": "character",
      "char": "的",
      "zhuyin": "...",
      "pinyin": "...",
      "etymology": "..."
    },
    {
      "type": "foreign",
      "value": "卡拉ok..."
    }
    // 每一個字或語素都必須有對應區塊，不能省略、不能多加
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
    buildJSONStructure(word),
    compress(IMPORTANT_REMINDERS),
  ];

  return promptComponents.join(" ");
};
