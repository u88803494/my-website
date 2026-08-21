// Legacy constants (for backwards compatibility)
export const GEMINI_3_1_FLASH_LITE = "gemini-3.1-flash-lite";
export const GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite";
export const GEMINI_2_5_PRO = "gemini-2.5-pro";
export const GEMINI_2_5_FLASH = "gemini-2.5-flash";

export const DICTIONARY_GEMINI_FALLBACK_MODELS = [
  GEMINI_3_1_FLASH_LITE,
  GEMINI_2_5_FLASH_LITE,
  GEMINI_2_5_FLASH,
] as const;

// AI Chat Model Configuration
// Last updated: 2026-08-21
// References:
// - Groq: https://console.groq.com/docs/models
// - Google: https://ai.google.dev/gemini-api/docs/pricing
// - Mistral: https://docs.mistral.ai/models
export const AI_MODEL_IDS = [
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
  "gpt-oss-120b",
  "gpt-oss-20b",
  "mistral-large",
  "mistral-medium",
  "codestral",
] as const;

export type AIModelId = (typeof AI_MODEL_IDS)[number];
export type AIModelProvider = "google" | "groq" | "mistral";

export interface AIModelInfo {
  id: AIModelId;
  name: string;
  provider: AIModelProvider;
  description: string;
  apiName: string; // The actual model name used in API calls
}

export const AI_MODELS: AIModelInfo[] = [
  {
    id: "gemini-3.7-flash",
    name: "Gemini 3.7 Flash",
    provider: "google",
    description: "Google 最新旗艦 Flash 模型，速度與推理能力兼具",
    apiName: "gemini-3.7-flash",
  },
  {
    id: "gemini-3.5-flash-lite",
    name: "Gemini 3.5 Flash-Lite",
    provider: "google",
    description: "最新輕量模型，適合高頻率簡單任務",
    apiName: "gemini-3.5-flash-lite",
  },
  {
    id: "gpt-oss-120b",
    name: "GPT-OSS 120B",
    provider: "groq",
    description: "OpenAI 開權重旗艦模型，具備推理能力",
    apiName: "openai/gpt-oss-120b",
  },
  {
    id: "gpt-oss-20b",
    name: "GPT-OSS 20B",
    provider: "groq",
    description: "OpenAI 開權重輕量模型，速度快",
    apiName: "openai/gpt-oss-20b",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "mistral",
    description: "開源旗艦模型，推理能力強",
    apiName: "mistral-large-latest",
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium 3.5",
    provider: "mistral",
    description: "新一代主力模型，針對 Agentic 與程式碼場景優化",
    apiName: "mistral-medium-latest",
  },
  {
    id: "codestral",
    name: "Codestral",
    provider: "mistral",
    description: "程式碼專用，支援 80+ 語言",
    apiName: "codestral-latest",
  },
] as const;

export const DEFAULT_MODEL_ID: AIModelId = "mistral-large";

// Helper functions
export const getModelById = (id: string): AIModelInfo | undefined => {
  return AI_MODELS.find((model) => model.id === id);
};

export const getModelsByProvider = (provider: AIModelProvider): AIModelInfo[] => {
  return AI_MODELS.filter((model) => model.provider === provider);
};

export const isValidModelId = (id: string): id is AIModelId => {
  return AI_MODEL_IDS.includes(id as AIModelId);
};
