import type { WordAnalysisResponse } from "@packages/shared/types";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && !!value.trim();

const isValidEtymologyBlock = (block: unknown): boolean => {
  if (typeof block !== "object" || block === null) {
    return false;
  }

  const candidateBlock = block as Record<string, unknown>;

  if (candidateBlock.type === "foreign") {
    return isNonEmptyString(candidateBlock.value);
  }

  if (candidateBlock.type === "character") {
    return (
      isNonEmptyString(candidateBlock.char) &&
      isNonEmptyString(candidateBlock.zhuyin) &&
      isNonEmptyString(candidateBlock.pinyin) &&
      isNonEmptyString(candidateBlock.etymology)
    );
  }

  return false;
};

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

  const hasValidDefinitions = candidate.definitions.every((definition) => {
    if (typeof definition !== "object" || definition === null) {
      return false;
    }

    const candidateDefinition = definition as Record<string, unknown>;

    if (!isNonEmptyString(candidateDefinition.meaning)) {
      return false;
    }

    return !requiresPartOfSpeech || isNonEmptyString(candidateDefinition.partOfSpeech);
  });

  return hasValidDefinitions && candidate.etymologyBlocks.every(isValidEtymologyBlock);
}
