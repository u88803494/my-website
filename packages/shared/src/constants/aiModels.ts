// Legacy constants (for backwards compatibility)
export const GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite";
export const GEMINI_2_5_PRO = "gemini-2.5-pro";
export const GEMINI_2_5_FLASH = "gemini-2.5-flash";

// AI Chat Model Configuration
// Last updated: 2025-01-05
// References:
// - Groq: https://console.groq.com/docs/models
// - Google: https://ai.google.dev/gemini-api/docs/models
// - Mistral: https://docs.mistral.ai/getting-started/models
export const AI_MODEL_IDS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "llama-3.3-70b",
  "llama-3.1-8b",
  "mistral-large",
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
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Google 最新穩定版，推理與程式碼能力強",
    apiName: "gemini-2.5-flash",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    description: "最強大模型，複雜推理與程式碼",
    apiName: "gemini-2.5-pro",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "groq",
    description: "Meta 70B 開源模型，131K context",
    apiName: "llama-3.3-70b-versatile",
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    provider: "groq",
    description: "輕量快速，適合簡單任務",
    apiName: "llama-3.1-8b-instant",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "mistral",
    description: "123B 旗艦模型，推理能力強",
    apiName: "mistral-large-latest",
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
