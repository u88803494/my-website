import { describe, expect, it } from "vitest";

import { validateResponse } from "../validateResponse";

const createResponse = (definitions: unknown, etymologyBlocks: unknown = []) => ({
  queryWord: "word",
  definitions,
  etymologyBlocks,
});

describe("validateResponse", () => {
  it("accepts Chinese definitions without partOfSpeech", () => {
    expect(validateResponse(createResponse([{ meaning: "一個常見意思。" }]), false)).toBe(true);
  });

  it("accepts Chinese definitions that will be normalized later", () => {
    expect(
      validateResponse(createResponse([{ meaning: "一個常見意思。", partOfSpeech: "名詞" }]), false),
    ).toBe(true);
  });

  it("requires a non-empty partOfSpeech on every English definition", () => {
    expect(
      validateResponse(
        createResponse([
          { meaning: "第一個意思。", partOfSpeech: "noun" },
          { meaning: "第二個意思。", partOfSpeech: "verb" },
        ]),
        true,
      ),
    ).toBe(true);

    expect(
      validateResponse(
        createResponse([
          { meaning: "第一個意思。", partOfSpeech: "noun" },
          { meaning: "第二個意思。" },
        ]),
        true,
      ),
    ).toBe(false);

    expect(validateResponse(createResponse([{ meaning: "一個意思。", partOfSpeech: "   " }]), true)).toBe(
      false,
    );
  });

  it("accepts valid foreign, character, and mixed etymology blocks", () => {
    const definition = [{ meaning: "一個常見意思。" }];
    const foreignBlock = { type: "foreign", value: "源自外語音譯。" };
    const characterBlock = {
      type: "character",
      char: "工",
      zhuyin: "ㄍㄨㄥ",
      pinyin: "gōng",
      etymology: "本義與工具製作有關。",
    };

    expect(validateResponse(createResponse(definition, [foreignBlock]), false)).toBe(true);
    expect(validateResponse(createResponse(definition, [characterBlock]), false)).toBe(true);
    expect(validateResponse(createResponse(definition, [foreignBlock, characterBlock]), false)).toBe(true);
  });

  it.each([
    null,
    "foreign",
    {},
    { type: "unknown", value: "內容" },
    { type: "foreign" },
    { type: "foreign", value: "   " },
    { type: "character", char: "字", zhuyin: "ㄗˋ", pinyin: "zì" },
    { type: "character", char: " ", zhuyin: "ㄗˋ", pinyin: "zì", etymology: "字源" },
    { type: "character", char: "字", zhuyin: " ", pinyin: "zì", etymology: "字源" },
    { type: "character", char: "字", zhuyin: "ㄗˋ", pinyin: " ", etymology: "字源" },
    { type: "character", char: "字", zhuyin: "ㄗˋ", pinyin: "zì", etymology: " " },
  ])("rejects malformed etymology block %#", (block) => {
    expect(validateResponse(createResponse([{ meaning: "一個常見意思。" }], [block]), false)).toBe(false);
  });

  it("rejects malformed responses and empty meanings", () => {
    expect(validateResponse(null, false)).toBe(false);
    expect(validateResponse(createResponse([]), false)).toBe(false);
    expect(validateResponse(createResponse([{ meaning: "" }]), false)).toBe(false);
    expect(validateResponse({ queryWord: "word", definitions: [{}] }, false)).toBe(false);
  });
});
