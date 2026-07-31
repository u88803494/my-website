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
  "你是一位協助使用者自行進行山達基清字的中英詞義與字源分析專家。山達基清字只是使用目的，不是額外術語推測來源。你的工作只限於提供使用者實際查詢詞彙的常見意思，以及該詞表面文字可考證的實際字源；不得因山達基或其他專業知識聯想到、改寫或補充使用者沒有查詢的術語。請使用簡單、易懂的繁體中文，讓使用者自行運用清字步驟。";

const buildImportantReminders = (requiresPartOfSpeech: boolean): string => `
**⚠️ 嚴格要求 - 必須遵守:**
*   你的回傳內容必須是100%純粹的JSON格式，絕對不可以有任何其他內容。
*   第一個字元必須是 { ，最後一個字元必須是 }。
*   不要添加任何解釋、說明、問候語或其他文字。
*   絕對禁止任何形式的 markdown 區塊（包括所有以三個 backtick 開頭的區塊，例如「三個 backtick 加 json」、「三個 backtick 加 text」等），只允許純 JSON。
*   不要說 "好的" 、"以下是分析結果" 或任何開場白。
*   如果你添加了任何非JSON內容，系統會報錯並要求重新處理。
*   確保所有必要欄位都已填寫，沒有遺漏。definitions 陣列只需列出常見意思${
  requiresPartOfSpeech
    ? "，且每個 definition 都必須包含非空的 partOfSpeech。"
    : "，且每個 definition 都不得包含 partOfSpeech。"
}`;

/**
 * 建立任務說明部分
 * @param word - 要查詢的詞彙（原始字串）
 */
const buildTaskDescription = (word: string): string => {
  const userQuery = JSON.stringify(word);
  return `
**使用者詞彙:** ${userQuery}

**請直接回傳以下格式的 JSON 物件，不要有任何額外內容：**`;
};

/**
 * 建立分析指南部分
 * @param word - 要查詢的詞彙（原始字串）
 * @param requiresPartOfSpeech - 是否需要在每個定義中提供詞性
 */
const buildAnalysisGuidelines = (word: string, requiresPartOfSpeech: boolean): string => {
  const definitionsGuideline = requiresPartOfSpeech
    ? `請列出「${word}」的常見定義，每一個意思都要用簡單、易懂的繁體中文解釋，並在每個 definition 中以非空的 partOfSpeech 標明英文詞性。`
    : `請列出「${word}」在中文裡的常見定義，每一個意思都要用簡單、易懂的語言解釋。中文詞彙不需要標明詞性，每個 definition 都不得包含 partOfSpeech。`;

  return `
**分析指南:**
1.  **列出常見意思**：${definitionsGuideline}
    - definitions 只列出查詢詞本身的常見意思，不展開理論、學派、術語背景、英文對應或其他專業補充。
2.  **字源分析**：
    - 只分析使用者查詢字串表面實際出現的文字。所有字源內容必須依照查詢字串的表面順序放在 etymologyBlocks，不可遺漏、重排、合併或加入查詢中沒有的語素。
    - 每個 character block 的 char 必須逐字複製查詢中對應位置的原始漢字。輸出前必須再次逐字核對，不得以同音字、近形字或推測字替換（例如查詢中的「主」絕不能改成「之」）。
    - type: "foreign" 只能用於兩種情況：(1) 查詢字串表面實際存在的非漢字外文片段；(2) 查詢表面的中文字本身是可考證的音譯外來語。value 只說明該表面形式的實際來源、演變與傳入過程。
    - 中文詞可以翻成英文、中文後綴可對應 -ism 或 -ist、詞義源自外國理論或專業領域，都不代表該中文表面文字是 foreign。不得因翻譯結果、概念起源、可能的英文術語、山達基或其他 persona 聯想而新增 foreign block。
    - type: "character" 用於查詢中實際出現且具有中文字源的單一漢字，並填寫 char、zhuyin、pinyin、etymology。
    - 不要回傳 foreignEtymology 或 characters 欄位，只能用 etymologyBlocks。
3.  **分類範例 - 必須遵守其一般原則**：
    - 「貨幣主義者」：只分析實際中文字。不得因「主義」可翻譯為 -ism 或「者」可對應 -ist 而建立 foreign；不得加入 monetarism、monetarist 或學派背景。
    - 「越軌產品」：只分析查詢詞本身的常見意思與實際中文字源。不得猜測為 Overts and Withholds，也不得加入任何未出現在查詢中的山達基或其他專業術語。
    - 「咖啡」：表面形式本身是可考證的音譯外來語，可使用一個 foreign block 說明「咖啡」整體的實際來源；不得因它全是漢字就機械拆成 character。
    - 「AI工具」：必須依序輸出 foreign（對應查詢中的 AI）→ character（工）→ character（具）。不得把整個詞合併成 foreign，不得遺漏中文字，也不得加入 query 中沒有的英文術語。
4.  **追溯最早根源**：
    - 字源分析應優先追溯目前可知、普遍接受的最早根源，說明最早可知的文字形式、來源語言或早期字形、當時本義，以及演變成現代形式或詞義的主要過程。
    - 中文漢字應追溯可知的早期字形或造字本義，並簡要說明假借、分化與主要語義演變；英文或外來語應追溯可知的最早來源語言、早期形式與主要傳遞鏈，包括重新切分等關鍵變化。
    - 不需列舉細微的學術爭議或少數假說，採用最常見、普遍接受的說法即可；但不得為了補齊鏈條而推測、翻譯或編造未知的原詞、語根、年代與傳入歷史。
    - 必須先交代已知的最早可靠節點與演變；只有該節點以前的來源確實無法可靠確認時，才簡短標註「更早來源不詳」或「更早來源無法考證」，不得因最終根源未知而省略已知歷史。
5.  **追溯深度範例 - 只示範應追溯的深度與演變機制**：
    - 中文：「來」追溯早期麥類象形與本義，再說明假借為「來」及「麥」的分化；「莫」追溯日落草莽的早期字形與暮晚本義，再說明否定假借及「暮」的分化；「北」追溯二人相背的早期字形與背離本義，再說明方位假借及「背」的分化。
    - 英文：「orange」追溯 Sanskrit → Persian → Arabic → Italian／Medieval Latin → Old French → English，以及字首 n 的重新切分；「algorithm」追溯 al-Khwarizmi 的姓名 → Medieval Latin algorismus → Old French algorisme → 受 Greek arithmos 影響的 French algorithme → English。
    - 英文重新切分：「apron」追溯 Middle French naperon → Middle English napron → a napron 被重新切分為 an apron；「nickname」追溯 Old English eaca／eke + name → an ekename 被重新切分為 a nickname。
    - 英文語義與未知邊界：「nightmare」應說明 mare 早期指壓迫睡眠者的惡靈，並非母馬；「dog」應先追溯 Old English docga，再說明其更早來源不詳，不可只回答整體來源不詳。
`;
};

/**
 * 建立 JSON 結構範例部分
 * @param word - 要查詢的詞彙（原始字串）
 * @param requiresPartOfSpeech - 是否需要在每個定義中提供詞性
 */
const buildJSONStructure = (word: string, requiresPartOfSpeech: boolean): string => {
  const userQuery = JSON.stringify(word);
  const definitionStructure = requiresPartOfSpeech
    ? `{
      "partOfSpeech": "英文詞性 (例如：noun, verb, adjective)",
      "meaning": "簡單、易懂的繁體中文定義"
    }`
    : `{
      "meaning": "簡單、易懂的定義"
    }`;
  const chineseLoanwordExample = requiresPartOfSpeech
    ? ""
    : `

**外來語複合詞表面順序範例:**
{
  "queryWord": "歇斯底里的卡拉ok",
  "definitions": [
    {
      "meaning": "..."
    }
  ],
  "etymologyBlocks": [
    {
      "type": "foreign",
      "value": "歇斯底里的實際音譯來源..."
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
      "value": "卡拉ok 的實際外來來源..."
    }
  ]
}`;

  return `
**JSON 物件結構:**
{
  "queryWord": ${userQuery},
  "definitions": [
    ${definitionStructure}
  ],
  "etymologyBlocks": [
    "依查詢表面順序放置下列兩種物件之一；只輸出實際適用的物件，不要求同時包含兩種類型"
  ]
}

**etymologyBlocks 可選物件形狀:**
foreign 物件：
{
  "type": "foreign",
  "value": "查詢中實際外文片段或可考證音譯形式的來源說明"
}
character 物件：
{
  "type": "character",
  "char": "查詢中實際出現的單一漢字",
  "zhuyin": "該字元的注音符號",
  "pinyin": "該字元的漢語拼音",
  "etymology": "該字元可考證的字源分析"
}

etymologyBlocks 每個元素只能使用上述其中一種物件形狀。實際需要哪些類型完全由 query 的表面文字及其可考證字源決定，不得為符合示例而憑空新增另一種類型。${chineseLoanwordExample}`;
};

/**
 * 組合所有提示詞組件，建立完整的字典查詢 Prompt
 * @param word - 要查詢的詞彙
 * @param requiresPartOfSpeech - 是否需要在每個定義中提供詞性
 * @returns 完整的格式化 Prompt 字串
 */
export const buildDictionaryPrompt = (word: string, requiresPartOfSpeech: boolean): string => {
  const promptComponents = [
    compress(ROLE_DEFINITION),
    compress(buildTaskDescription(word)),
    compress(buildAnalysisGuidelines(word, requiresPartOfSpeech)),
    buildJSONStructure(word, requiresPartOfSpeech),
    compress(buildImportantReminders(requiresPartOfSpeech)),
  ];

  return promptComponents.join(" ");
};
