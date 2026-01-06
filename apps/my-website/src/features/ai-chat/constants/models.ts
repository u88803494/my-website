// Re-export from shared package (Single Source of Truth)
export type { AIModelId, AIModelInfo, AIModelProvider } from "@packages/shared";
export {
  AI_MODEL_IDS,
  AI_MODELS,
  DEFAULT_MODEL_ID,
  getModelById,
  getModelsByProvider,
  isValidModelId,
} from "@packages/shared";
