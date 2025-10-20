import type { WordAnalysisResponse } from "@packages/shared/types";

/**
 * 驗證 AI 回應的結構是否完整
 */
export function validateResponse(response: WordAnalysisResponse): boolean {
  return !!(
    response.queryWord &&
    response.definitions &&
    Array.isArray(response.definitions) &&
    response.etymologyBlocks &&
    Array.isArray(response.etymologyBlocks) &&
    response.definitions.length > 0
  );
}
