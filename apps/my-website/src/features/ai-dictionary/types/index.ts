import type { WordAnalysisResponse } from "@packages/shared/types";
import type { APIErrorResponse } from "@packages/shared/types/dictionary.types";

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
