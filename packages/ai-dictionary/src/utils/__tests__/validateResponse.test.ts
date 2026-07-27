import { describe, expect, it } from "vitest";

import { validateResponse } from "../validateResponse";

const createResponse = (definitions: unknown) => ({
  queryWord: "word",
  definitions,
  etymologyBlocks: [],
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

  it("rejects malformed responses and empty meanings", () => {
    expect(validateResponse(null, false)).toBe(false);
    expect(validateResponse(createResponse([]), false)).toBe(false);
    expect(validateResponse(createResponse([{ meaning: "" }]), false)).toBe(false);
    expect(validateResponse({ queryWord: "word", definitions: [{}] }, false)).toBe(false);
  });
});
