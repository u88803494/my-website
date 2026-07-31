import { describe, expect, it } from "vitest";

import { requiresPartOfSpeech } from "../queryLanguage";

describe("requiresPartOfSpeech", () => {
  it.each([
    ["學習", false],
    ["咖啡", false],
    ["AI 工具", false],
    ["卡拉OK", false],
    ["learning", true],
    ["take off", true],
    ["café", true],
    ["ＣＯＦＦＥＥ", true],
    ["state-of-the-art", true],
    ["don't", true],
    ["Web 3.0", true],
    ["カフェ", false],
    ["커피", false],
    ["кофе", false],
    ["123", false],
    ["?!", false],
  ])("returns %s for %s", (query, expected) => {
    expect(requiresPartOfSpeech(query)).toBe(expected);
  });
});
