/**
 * API 錯誤回應介面
 */
export interface APIErrorResponse {
  error: string;
}

/**
 * 字元分析介面
 */
export interface CharacterAnalysis {
  char: string;
  etymology: string;
  pinyin: string;
  zhuyin: string;
}

/**
 * API 請求介面
 */
export interface DefineWordRequest {
  word: string;
}

/**
 * 詞彙分析完整回應介面
 */
export interface WordAnalysisResponse {
  characters: CharacterAnalysis[];
  definitions: WordDefinition[];
  isTransliteration?: boolean; // 新增：是否為音譯詞
  originalForeignWord?: null | string; // 新增：原始外文單詞
  originLanguage?: null | string; // 新增：來源語言
  queryWord: string;
}

/**
 * 詞彙定義介面
 */
export interface WordDefinition {
  meaning: string;
  partOfSpeech: string;
}

/**
 * 檢查是否為錯誤回應
 */
export function isErrorResponse(response: unknown): response is APIErrorResponse {
  return typeof response === "object" && response !== null && "error" in response;
}

/**
 * 檢查是否為有效的詞彙分析回應
 */
export function isValidWordAnalysis(response: unknown): response is WordAnalysisResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "queryWord" in response &&
    typeof (response as { queryWord: unknown }).queryWord === "string" &&
    "definitions" in response &&
    Array.isArray((response as { definitions: unknown }).definitions) &&
    "characters" in response &&
    Array.isArray((response as { characters: unknown }).characters)
  );
}
