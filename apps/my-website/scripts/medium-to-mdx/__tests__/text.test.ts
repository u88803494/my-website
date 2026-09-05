import { describe, expect, it } from "vitest";

import { escapeMdx, normalizeText, slugify, stripEmphasis, truncate, wrapWithPadding, yamlString } from "../text";

describe("slugify", () => {
  it("keeps CJK characters", () => {
    expect(slugify("前端中階：gulp")).toBe("前端中階-gulp");
  });

  it("collapses runs of separators and trims them", () => {
    expect(slugify("---A---B---")).toBe("a-b");
  });

  it("lowercases only the ASCII half", () => {
    expect(slugify("Client 端啟動 HTTP/2")).toBe("client-端啟動-http-2");
  });

  it("returns empty for input with no letters or digits", () => {
    expect(slugify("...!!!")).toBe("");
  });
});

describe("truncate", () => {
  it("leaves input at the limit untouched", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });

  it("appends an ellipsis past the limit", () => {
    expect(truncate("123456", 5)).toBe("12345…");
  });
});

describe("yamlString", () => {
  it("escapes quotes and backslashes", () => {
    expect(yamlString('他說 "嗨" \\ 結束')).toBe('"他說 \\"嗨\\" \\\\ 結束"');
  });

  it("folds newlines, which would otherwise terminate the scalar", () => {
    expect(yamlString("第一行\n第二行")).toBe('"第一行 第二行"');
  });
});

describe("stripEmphasis", () => {
  it("removes paired markers", () => {
    expect(stripEmphasis("**總結：**")).toBe("總結：");
  });

  it("leaves an unpaired asterisk alone", () => {
    expect(stripEmphasis("SELECT * FROM t")).toBe("SELECT * FROM t");
  });
});

describe("wrapWithPadding", () => {
  it("moves interior padding outside the markers", () => {
    expect(wrapWithPadding("Change ", "**")).toBe("**Change** ");
  });

  it("leaves already-tight content unchanged in shape", () => {
    expect(wrapWithPadding("粗體", "**")).toBe("**粗體**");
  });

  it("collapses to a single space when the span is whitespace-only", () => {
    expect(wrapWithPadding("   ", "**")).toBe(" ");
  });

  it("returns empty for a genuinely empty span", () => {
    expect(wrapWithPadding("", "**")).toBe("");
  });
});

describe("escapeMdx", () => {
  it("escapes the characters MDX would read as JSX", () => {
    expect(escapeMdx("a < b {c}")).toBe("a &lt; b \\{c\\}");
  });
});

describe("normalizeText", () => {
  it("folds non-breaking spaces and newlines into single spaces", () => {
    expect(normalizeText("a b\nc")).toBe("a b c");
  });
});
