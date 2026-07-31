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

const validChineseResponse = {
  queryWord: "學習",
  definitions: [
    {
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

const validEnglishResponse = {
  queryWord: "record",
  definitions: [
    {
      partOfSpeech: "noun",
      meaning: "保存下來的資訊或事件資料。",
    },
    {
      partOfSpeech: "verb",
      meaning: "把聲音、影像或資訊保存下來。",
    },
  ],
  etymologyBlocks: [{ type: "foreign", value: "源自拉丁語 recordari。" }],
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
      "gemini-3.1-flash-lite": validChineseResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validChineseResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(1);
    expect(getGenerativeModel).toHaveBeenCalledWith({
      model: "gemini-3.1-flash-lite",
    });
  });

  it("removes partOfSpeech from Chinese responses without changing definitions or etymology", async () => {
    const chineseResponseWithPartsOfSpeech = {
      ...validChineseResponse,
      definitions: [
        { meaning: "取得知識或技能。", partOfSpeech: "動詞" },
        { meaning: "學習的過程。", partOfSpeech: "名詞" },
      ],
    };
    setupModelResponses({
      "gemini-3.1-flash-lite": chineseResponseWithPartsOfSpeech,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result.definitions).toEqual([
      { meaning: "取得知識或技能。" },
      { meaning: "學習的過程。" },
    ]);
    expect(result.etymologyBlocks).toEqual(validChineseResponse.etymologyBlocks);
  });

  it("treats Chinese-form loanwords as Chinese", async () => {
    const coffeeResponse = {
      queryWord: "咖啡",
      definitions: [{ meaning: "以咖啡豆製成的飲料。", partOfSpeech: "名詞" }],
      etymologyBlocks: [{ type: "foreign", value: "由外語音譯而來。" }],
    };
    setupModelResponses({
      "gemini-3.1-flash-lite": coffeeResponse,
    });

    const result = await analyzeWord("咖啡", "test-api-key");

    expect(result.definitions).toEqual([{ meaning: "以咖啡豆製成的飲料。" }]);
    expect(result.etymologyBlocks).toEqual(coffeeResponse.etymologyBlocks);
  });

  it("preserves mixed foreign and character blocks in query order", async () => {
    const mixedResponse = {
      queryWord: "AI工具",
      definitions: [{ meaning: "使用人工智慧協助工作的工具。" }],
      etymologyBlocks: [
        { type: "foreign", value: "AI 是 artificial intelligence 的縮寫。" },
        { type: "character", char: "工", zhuyin: "ㄍㄨㄥ", pinyin: "gōng", etymology: "本義與工具有關。" },
        { type: "character", char: "具", zhuyin: "ㄐㄩˋ", pinyin: "jù", etymology: "本義為備辦。" },
      ],
    };
    setupModelResponses({
      "gemini-3.1-flash-lite": mixedResponse,
    });

    const result = await analyzeWord("AI工具", "test-api-key");

    expect(result).toEqual(mixedResponse);
  });

  it.each([
    {
      queryWord: "貨幣主義者",
      definitions: [{ meaning: "支持貨幣主義的人。" }],
      characters: ["貨", "幣", "主", "義", "者"],
    },
    {
      queryWord: "越軌產品",
      definitions: [{ meaning: "偏離既定規範的產品。" }],
      characters: ["越", "軌", "產", "品"],
    },
  ])("preserves character-only etymology for $queryWord", async ({ queryWord, definitions, characters }) => {
    const characterResponse = {
      queryWord,
      definitions,
      etymologyBlocks: characters.map((char) => ({
        type: "character",
        char,
        zhuyin: "ㄗˋ",
        pinyin: "zì",
        etymology: `${char}的字源。`,
      })),
    };
    setupModelResponses({
      "gemini-3.1-flash-lite": characterResponse,
    });

    const result = await analyzeWord(queryWord, "test-api-key");

    expect(result).toEqual(characterResponse);
    expect(result.etymologyBlocks.every((block) => block.type === "character")).toBe(true);
  });

  it("preserves partOfSpeech on every English definition", async () => {
    setupModelResponses({
      "gemini-3.1-flash-lite": validEnglishResponse,
    });

    const result = await analyzeWord("record", "test-api-key");

    expect(result).toEqual(validEnglishResponse);
  });

  it("falls back when any English definition is missing partOfSpeech", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": {
        ...validEnglishResponse,
        definitions: [
          validEnglishResponse.definitions[0],
          { meaning: "把聲音、影像或資訊保存下來。" },
        ],
      },
      "gemini-2.5-flash-lite": validEnglishResponse,
    });

    const result = await analyzeWord("record", "test-api-key");

    expect(result).toEqual(validEnglishResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
  });

  it("reports the existing response error when every model omits English partOfSpeech", async () => {
    const incompleteEnglishResponse = {
      ...validEnglishResponse,
      definitions: [{ meaning: "缺少詞性的定義。" }],
    };
    setupModelResponses({
      "gemini-3.1-flash-lite": incompleteEnglishResponse,
      "gemini-2.5-flash-lite": incompleteEnglishResponse,
      "gemini-2.5-flash": incompleteEnglishResponse,
    });

    await expect(analyzeWord("record", "test-api-key")).rejects.toThrow(
      "AI 回應格式暫時異常，請稍後再試。",
    );
  });

  it("falls back when the primary model fails", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": new Error("RESOURCE_EXHAUSTED: quota exceeded"),
      "gemini-2.5-flash-lite": validChineseResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validChineseResponse);
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
      "gemini-2.5-flash-lite": validChineseResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validChineseResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
  });

  it("falls back when the primary model returns an incomplete response", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": {
        queryWord: "學習",
        definitions: [],
        etymologyBlocks: [],
      },
      "gemini-2.5-flash-lite": validChineseResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validChineseResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
  });

  it("falls back when the primary model returns a malformed etymology block", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": {
        ...validChineseResponse,
        etymologyBlocks: [{ type: "foreign", value: "   " }],
      },
      "gemini-2.5-flash-lite": validChineseResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validChineseResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
  });

  it("reports the existing response error when every model returns malformed etymology", async () => {
    const malformedResponse = {
      ...validChineseResponse,
      etymologyBlocks: [{ type: "character", char: "學" }],
    };
    setupModelResponses({
      "gemini-3.1-flash-lite": malformedResponse,
      "gemini-2.5-flash-lite": malformedResponse,
      "gemini-2.5-flash": malformedResponse,
    });

    await expect(analyzeWord("學習", "test-api-key")).rejects.toThrow(
      "AI 回應格式暫時異常，請稍後再試。",
    );
  });

  it("falls back when the primary model has a model-specific access error", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": new Error(
        "User location is not supported for this model or access is denied",
      ),
      "gemini-2.5-flash-lite": validChineseResponse,
    });

    const result = await analyzeWord("學習", "test-api-key");

    expect(result).toEqual(validChineseResponse);
    expect(getGenerativeModel).toHaveBeenCalledTimes(2);
  });

  it("fails fast when the API key is invalid", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": new Error("API key not valid"),
      "gemini-2.5-flash-lite": validChineseResponse,
    });

    await expect(analyzeWord("學習", "test-api-key")).rejects.toThrow(
      "AI 字典服務設定異常，請聯繫管理員。",
    );
    expect(getGenerativeModel).toHaveBeenCalledTimes(1);
  });

  it("fails fast for generic unauthorized errors", async () => {
    const { getGenerativeModel } = setupModelResponses({
      "gemini-3.1-flash-lite": new Error("401 Unauthorized access"),
      "gemini-2.5-flash-lite": validChineseResponse,
    });

    await expect(analyzeWord("學習", "test-api-key")).rejects.toThrow(
      "AI 字典服務設定異常，請聯繫管理員。",
    );
    expect(getGenerativeModel).toHaveBeenCalledTimes(1);
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
      "gemini-3.1-flash-lite": validChineseResponse,
    });

    await expect(analyzeWord("", "test-api-key")).rejects.toThrow(
      "請提供有效的中文詞彙",
    );

    expect(getGenerativeModel).not.toHaveBeenCalled();
  });
});
