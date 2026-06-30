import { GoogleGenerativeAI } from "@google/generative-ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { analyzeWord } from "../dictionary.service";

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: vi.fn(),
}));

vi.mock("@packages/shared/utils", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...(actual as object),
    createLogger: () => ({
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    }),
  };
});

const validDictionaryResponse = {
  queryWord: "學習",
  definitions: [
    {
      partOfSpeech: "動詞",
      meaning: "透過閱讀、練習或經驗取得知識與技能。",
    },
  ],
  etymologyBlocks: [
    {
      type: "character",
      char: "學",
      pinyin: "xué",
      zhuyin: "ㄒㄩㄝˊ",
      etymology: "與求知、模仿相關。",
    },
  ],
};

const createGeminiResult = (response: unknown) => ({
  response: {
    text: () => JSON.stringify(response),
  },
});

const setupModelResponses = (responsesByModel: Record<string, unknown>) => {
  const generateContentByModel = new Map<string, ReturnType<typeof vi.fn>>();
  const getGenerativeModel = vi.fn(({ model }: { model: string }) => {
    const generateContent = vi.fn(async () => {
      const response = responsesByModel[model];

      if (response instanceof Error) {
        throw response;
      }

      if (typeof response === "string") {
        return {
          response: {
            text: () => response,
          },
        };
      }

      return createGeminiResult(response);
    });

    generateContentByModel.set(model, generateContent);

    return { generateContent };
  });

  vi.mocked(GoogleGenerativeAI).mockImplementation(function () {
    return { getGenerativeModel } as unknown as GoogleGenerativeAI;
  });

  return { generateContentByModel, getGenerativeModel };
};

describe("analyzeWord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses the primary Gemini model when it succeeds", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": validDictionaryResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validDictionaryResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(1);
    expect(getGenerativeModel).toHaveBeenCalledWith({
      model: "gemini-3.1-flash-lite",
    });
  });

  it("falls back when the primary model fails", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": new Error("RESOURCE_EXHAUSTED: quota exceeded"),
      "gemini-2.5-flash-lite": validDictionaryResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validDictionaryResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
    expect(getGenerativeModel).toHaveBeenNthCalledWith(1, {
      model: "gemini-3.1-flash-lite",
    });
    expect(getGenerativeModel).toHaveBeenNthCalledWith(2, {
      model: "gemini-2.5-flash-lite",
    });
  });

  it("falls back when the primary model returns invalid JSON", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": "not-json",
      "gemini-2.5-flash-lite": validDictionaryResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validDictionaryResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
  });

  it("falls back when the primary model returns an incomplete response", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": {
        queryWord: "學習",
        definitions: [],
        etymologyBlocks: [],
      },
      "gemini-2.5-flash-lite": validDictionaryResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validDictionaryResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
  });

  it("throws a user-friendly error when all models fail", async () => {
    setupModelResponses({
      "gemini-3.1-flash-lite": new Error("RESOURCE_EXHAUSTED: quota exceeded"),
      "gemini-2.5-flash-lite": new Error("rate-limits exceeded"),
      "gemini-2.5-flash": new Error("quota exceeded"),
    });

    await expect(analyzeWord("學習", "test-api-key")).rejects.toThrow(
      "AI 字典服務目前請求量過高或免費額度已用完，請稍後再試。",
    );
  });

  it("does not call Gemini for invalid input", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": validDictionaryResponse,
    });

    await expect(analyzeWord("", "test-api-key")).rejects.toThrow(
      "請提供有效的中文詞彙",
    );

    expect(getGenerativeModel).not.toHaveBeenCalled();
  });
});
