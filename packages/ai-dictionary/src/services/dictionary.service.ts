import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  DICTIONARY_GEMINI_FALLBACK_MODELS,
  MAX_WORD_LENGTH,
} from "@packages/shared/constants";
import type { WordAnalysisResponse } from "@packages/shared/types";
import type { AIErrorType } from "@packages/shared/utils";
import { createLogger, parseAIErrorMessage } from "@packages/shared/utils";

import { buildDictionaryPrompt } from "../prompts";
import { cleanAIResponse, validateResponse } from "../utils";

const logger = createLogger({ context: "ai-dictionary/service" });
const AUTH_ERROR_MESSAGE = "AI 字典服務設定異常，請聯繫管理員。";
const DEFAULT_FAILURE_MESSAGE = "AI 字典服務暫時無法完成分析，請稍後再試。";

type DictionaryAttemptErrorType = AIErrorType | "invalid_response";

interface DictionaryAttemptError {
  model: string;
  type: DictionaryAttemptErrorType;
  message: string;
}

class DictionaryResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DictionaryResponseError";
  }
}

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const isFatalAuthError = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();

  return (
    lowerMessage.includes("api key not valid") ||
    lowerMessage.includes("invalid api key") ||
    lowerMessage.includes("api_key_invalid") ||
    lowerMessage.includes("authentication failed")
  );
};

const toDictionaryAttemptError = (
  model: string,
  error: unknown,
): DictionaryAttemptError => {
  const message = getErrorMessage(error);

  if (error instanceof DictionaryResponseError) {
    return {
      model,
      type: "invalid_response",
      message,
    };
  }

  const parsedError = parseAIErrorMessage(message);
  const type =
    parsedError.type === "auth_error" && !isFatalAuthError(message)
      ? "model_unavailable"
      : parsedError.type;

  return {
    model,
    type,
    message,
  };
};

const buildFailureMessage = (attemptErrors: DictionaryAttemptError[]): string => {
  const errorTypes = new Set(attemptErrors.map((error) => error.type));

  if (errorTypes.size === 0) {
    return DEFAULT_FAILURE_MESSAGE;
  }

  if (
    [...errorTypes].every((type) =>
      type === "quota_exceeded" || type === "rate_limited"
    )
  ) {
    return "AI 字典服務目前請求量過高或免費額度已用完，請稍後再試。";
  }

  if (errorTypes.has("model_unavailable")) {
    return "AI 字典模型暫時不可用，請稍後再試。";
  }

  if (errorTypes.has("invalid_response")) {
    return "AI 回應格式暫時異常，請稍後再試。";
  }

  if (errorTypes.has("network_error")) {
    return "AI 字典服務連線暫時異常，請稍後再試。";
  }

  return DEFAULT_FAILURE_MESSAGE;
};

async function analyzeWordWithModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string,
): Promise<WordAnalysisResponse> {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleanedText = cleanAIResponse(text);

  let parsedResponse: WordAnalysisResponse;

  try {
    parsedResponse = JSON.parse(cleanedText) as WordAnalysisResponse;
  } catch {
    throw new DictionaryResponseError("AI 回應格式錯誤");
  }

  if (!validateResponse(parsedResponse)) {
    throw new DictionaryResponseError("AI 回應資料結構不完整");
  }

  return parsedResponse;
}

export async function analyzeWord(
  word: string,
  apiKey: string,
): Promise<WordAnalysisResponse> {
  if (!word || typeof word !== "string") {
    throw new Error("請提供有效的中文詞彙");
  }

  if (word.length > MAX_WORD_LENGTH) {
    throw new Error(`查詢詞彙過長,請勿超過 ${MAX_WORD_LENGTH} 個字元。`);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildDictionaryPrompt(word);
  const attemptErrors: DictionaryAttemptError[] = [];

  for (const [index, modelName] of DICTIONARY_GEMINI_FALLBACK_MODELS.entries()) {
    const attempt = index + 1;

    try {
      const response = await analyzeWordWithModel(genAI, modelName, prompt);

      logger.info(
        { word, model: modelName, attempt },
        "Dictionary analysis completed with model",
      );

      return response;
    } catch (error) {
      const attemptError = toDictionaryAttemptError(modelName, error);
      attemptErrors.push(attemptError);

      if (attemptError.type === "auth_error") {
        logger.error(
          { word, model: modelName, attempt, errorType: attemptError.type },
          "Dictionary model attempt failed due to authentication error",
        );
        throw new Error(AUTH_ERROR_MESSAGE);
      }

      const nextModel = DICTIONARY_GEMINI_FALLBACK_MODELS[index + 1];

      logger.warn(
        {
          word,
          model: modelName,
          attempt,
          errorType: attemptError.type,
          nextModel,
        },
        nextModel
          ? "Dictionary model attempt failed; trying fallback"
          : "Dictionary model attempt failed",
      );
    }
  }

  logger.error(
    {
      word,
      attemptedModels: DICTIONARY_GEMINI_FALLBACK_MODELS,
      errors: attemptErrors.map((error) => ({
        model: error.model,
        type: error.type,
        message: error.message,
      })),
    },
    "Dictionary model chain failed",
  );

  throw new Error(buildFailureMessage(attemptErrors));
}
