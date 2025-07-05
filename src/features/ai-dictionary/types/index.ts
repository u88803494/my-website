import type { APIErrorResponse, WordAnalysisResponse } from "@/types/dictionary.types";

export interface APICallResult {
  autoRemoveTimeoutId?: NodeJS.Timeout;
  id: string;
  isCompleting?: boolean;
  isRemoving?: boolean;
  response: APIErrorResponse | WordAnalysisResponse;
  showUndoInPlace?: boolean;
  timestamp: string;
  word: string;
}

export const MAX_WORD_LENGTH = 20;
