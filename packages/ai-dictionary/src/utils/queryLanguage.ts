const HAN_SCRIPT_PATTERN = /\p{Script=Han}/u;
const LATIN_SCRIPT_PATTERN = /\p{Script=Latin}/u;
const LETTER_PATTERN = /\p{Letter}/u;
const LATIN_OR_NEUTRAL_PATTERN = /^[\p{Script=Latin}\p{Mark}\p{Number}\p{Separator}\p{Punctuation}\p{Symbol}]+$/u;

export const requiresPartOfSpeech = (query: string): boolean => {
  const normalizedQuery = query.normalize("NFKC").trim();

  if (!normalizedQuery || HAN_SCRIPT_PATTERN.test(normalizedQuery)) {
    return false;
  }

  return (
    LETTER_PATTERN.test(normalizedQuery) &&
    LATIN_SCRIPT_PATTERN.test(normalizedQuery) &&
    LATIN_OR_NEUTRAL_PATTERN.test(normalizedQuery)
  );
};
