import type { APIErrorResponse, WordAnalysisResponse } from "@packages/shared/types";

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
