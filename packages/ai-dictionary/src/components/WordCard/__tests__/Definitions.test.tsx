import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Definitions from "../Definitions";

describe("Definitions", () => {
  it("renders part-of-speech badges for English definitions", () => {
    const markup = renderToStaticMarkup(
      <Definitions
        definitions={[
          { meaning: "一種紀錄。", partOfSpeech: "noun" },
          { meaning: "把內容記錄下來。", partOfSpeech: "verb" },
        ]}
      />,
    );

    expect(markup).toContain("noun");
    expect(markup).toContain("verb");
    expect(markup).toContain("1. 一種紀錄。");
    expect(markup).toContain("2. 把內容記錄下來。");
    expect(markup).toContain("bg-blue-100");
  });

  it("does not render a badge wrapper when partOfSpeech is missing or blank", () => {
    const markup = renderToStaticMarkup(
      <Definitions
        definitions={[
          { meaning: "第一個中文意思。" },
          { meaning: "第二個中文意思。", partOfSpeech: "   " },
        ]}
      />,
    );

    expect(markup).not.toContain("bg-blue-100");
    expect(markup).not.toContain("mb-2 flex flex-wrap items-center gap-2");
    expect(markup).not.toContain("undefined");
    expect(markup).toContain("1. 第一個中文意思。");
    expect(markup).toContain("2. 第二個中文意思。");
    expect(markup.indexOf("1. 第一個中文意思。")).toBeLessThan(markup.indexOf("2. 第二個中文意思。"));
  });
});
