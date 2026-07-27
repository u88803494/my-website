import { describe, expect, it } from "vitest";

import { buildDictionaryPrompt } from "../dictionary.prompt";

describe("buildDictionaryPrompt", () => {
  it("omits partOfSpeech from the Chinese JSON schema", () => {
    const prompt = buildDictionaryPrompt("學習", false);

    expect(prompt).toContain("每個 definition 都不得包含 partOfSpeech");
    expect(prompt).not.toContain('"partOfSpeech":');
    expect(prompt).not.toContain("//");
    expect(prompt).toContain('"etymologyBlocks"');
  });

  it("requires partOfSpeech in the English JSON schema", () => {
    const prompt = buildDictionaryPrompt("record", true);

    expect(prompt).toContain("每個 definition 都必須包含非空的 partOfSpeech");
    expect(prompt).toContain('"partOfSpeech": "英文詞性');
    expect(prompt).toContain('"meaning"');
    expect(prompt).toContain('"etymologyBlocks"');
    expect(prompt).not.toContain("**外來語複合詞語意結構順序範例:**");
    expect(prompt).not.toContain("//");
  });

  it("keeps Chinese-form loanwords free of partOfSpeech", () => {
    const prompt = buildDictionaryPrompt("咖啡", false);

    expect(prompt).toContain('**使用者詞彙:** "咖啡"');
    expect(prompt).not.toContain('"partOfSpeech":');
    expect(prompt).toContain("歇斯底里的卡拉ok");
    expect(prompt).toContain('"type": "foreign"');
  });
});
