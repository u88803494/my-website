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

  it("prioritizes the earliest known root before marking deeper origins unknown", () => {
    const prompt = buildDictionaryPrompt("dog", true);

    expect(prompt).toContain("追溯最早根源");
    expect(prompt).toContain("目前可知、普遍接受的最早根源");
    expect(prompt).toContain("最早可知的文字形式、來源語言或早期字形、當時本義");
    expect(prompt).toContain("演變成現代形式或詞義的主要過程");
    expect(prompt).toContain("不需列舉細微的學術爭議或少數假說");
    expect(prompt).toContain("不得為了補齊鏈條而推測、翻譯或編造");
    expect(prompt).toContain("必須先交代已知的最早可靠節點與演變");
    expect(prompt).toContain("不得因最終根源未知而省略已知歷史");
  });

  it.each([
    {
      query: "來",
      requiresPartOfSpeech: false,
      expectedFragments: ["早期麥類象形與本義", "假借為「來」", "「麥」的分化"],
    },
    {
      query: "莫",
      requiresPartOfSpeech: false,
      expectedFragments: ["日落草莽的早期字形與暮晚本義", "否定假借", "「暮」的分化"],
    },
    {
      query: "北",
      requiresPartOfSpeech: false,
      expectedFragments: ["二人相背的早期字形與背離本義", "方位假借", "「背」的分化"],
    },
    {
      query: "orange",
      requiresPartOfSpeech: true,
      expectedFragments: [
        "Sanskrit → Persian → Arabic → Italian／Medieval Latin → Old French → English",
        "字首 n 的重新切分",
      ],
    },
    {
      query: "algorithm",
      requiresPartOfSpeech: true,
      expectedFragments: [
        "al-Khwarizmi 的姓名",
        "Medieval Latin algorismus",
        "Old French algorisme",
        "Greek arithmos",
        "French algorithme",
      ],
    },
    {
      query: "apron",
      requiresPartOfSpeech: true,
      expectedFragments: [
        "Middle French naperon",
        "Middle English napron",
        "a napron 被重新切分為 an apron",
      ],
    },
    {
      query: "nickname",
      requiresPartOfSpeech: true,
      expectedFragments: [
        "Old English eaca／eke + name",
        "an ekename 被重新切分為 a nickname",
      ],
    },
    {
      query: "nightmare",
      requiresPartOfSpeech: true,
      expectedFragments: ["mare 早期指壓迫睡眠者的惡靈", "並非母馬"],
    },
    {
      query: "dog",
      requiresPartOfSpeech: true,
      expectedFragments: ["Old English docga", "更早來源不詳", "不可只回答整體來源不詳"],
    },
  ])("includes the expected etymology depth guidance for $query", ({
    query,
    requiresPartOfSpeech,
    expectedFragments,
  }) => {
    const prompt = buildDictionaryPrompt(query, requiresPartOfSpeech);

    expect(prompt).toContain(`**使用者詞彙:** ${JSON.stringify(query)}`);
    expectedFragments.forEach((fragment) => expect(prompt).toContain(fragment));
  });

  it("describes etymology block shapes as alternatives", () => {
    const prompt = buildDictionaryPrompt("學習", false);

    expect(prompt).toContain("etymologyBlocks 可選物件形狀");
    expect(prompt).toContain("每個元素只能使用上述其中一種物件形狀");
    expect(prompt).toContain("不要求同時包含兩種類型");
  });
});
