import type { WordAnalysisResponse } from "@packages/shared/types";

/**
 * 驗證 AI 回應的結構是否符合當次查詢的詞性契約
 */
export function validateResponse(
  response: unknown,
  requiresPartOfSpeech: boolean,
): response is WordAnalysisResponse {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const candidate = response as Record<string, unknown>;

  if (
    typeof candidate.queryWord !== "string" ||
    !candidate.queryWord.trim() ||
    !Array.isArray(candidate.definitions) ||
    candidate.definitions.length === 0 ||
    !Array.isArray(candidate.etymologyBlocks)
  ) {
    return false;
  }

  return candidate.definitions.every((definition) => {
    if (typeof definition !== "object" || definition === null) {
      return false;
    }

    const candidateDefinition = definition as Record<string, unknown>;

    if (typeof candidateDefinition.meaning !== "string" || !candidateDefinition.meaning.trim()) {
      return false;
    }

    return (
      !requiresPartOfSpeech ||
      (typeof candidateDefinition.partOfSpeech === "string" && !!candidateDefinition.partOfSpeech.trim())
    );
  });
}
