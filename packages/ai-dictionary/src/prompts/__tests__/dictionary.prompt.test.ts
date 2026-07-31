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
    expect(prompt).not.toContain("**外來語複合詞表面順序範例:**");
    expect(prompt).not.toContain("//");
  });

  it("limits analysis to the queried term without adding professional background", () => {
    const prompt = buildDictionaryPrompt("越軌產品", false);

    expect(prompt).toContain("山達基清字只是使用目的");
    expect(prompt).toContain("不得因山達基或其他專業知識聯想到、改寫或補充");
    expect(prompt).toContain("不展開理論、學派、術語背景、英文對應或其他專業補充");
    expect(prompt).toContain("不得猜測為 Overts and Withholds");
  });

  it("does not treat translations or foreign concepts as foreign etymology", () => {
    const prompt = buildDictionaryPrompt("貨幣主義者", false);

    expect(prompt).toContain("翻譯結果、概念起源、可能的英文術語");
    expect(prompt).toContain("不得因「主義」可翻譯為 -ism");
    expect(prompt).toContain("不得加入 monetarism、monetarist 或學派背景");
  });

  it("preserves Chinese-form loanwords as foreign etymology", () => {
    const prompt = buildDictionaryPrompt("咖啡", false);

    expect(prompt).toContain('**使用者詞彙:** "咖啡"');
    expect(prompt).not.toContain('"partOfSpeech":');
    expect(prompt).toContain("可使用一個 foreign block");
    expect(prompt).toContain("不得因它全是漢字就機械拆成 character");
  });

  it("keeps literal Latin and Han segments in query order", () => {
    const prompt = buildDictionaryPrompt("AI工具", false);

    expect(prompt).toContain("foreign（對應查詢中的 AI）→ character（工）→ character（具）");
    expect(prompt).toContain("不得把整個詞合併成 foreign");
    expect(prompt).toContain("依查詢表面順序放置");
  });

  it("requires character blocks to copy the original query character exactly", () => {
    const prompt = buildDictionaryPrompt("民主主義者", false);

    expect(prompt).toContain("逐字複製查詢中對應位置的原始漢字");
    expect(prompt).toContain("不得以同音字、近形字或推測字替換");
    expect(prompt).toContain("查詢中的「主」絕不能改成「之」");
  });

  it("describes etymology block shapes as alternatives", () => {
    const prompt = buildDictionaryPrompt("學習", false);

    expect(prompt).toContain("etymologyBlocks 可選物件形狀");
    expect(prompt).toContain("每個元素只能使用上述其中一種物件形狀");
    expect(prompt).toContain("不要求同時包含兩種類型");
  });
});
