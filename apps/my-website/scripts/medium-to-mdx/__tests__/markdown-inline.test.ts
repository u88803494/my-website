import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";

import { convertInline } from "../markdown-inline";

function inline(html: string): string {
  const $ = cheerio.load(`<div id="root">${html}</div>`);
  const root = $("#root").get(0);
  if (!root) throw new Error("fixture has no root");
  return convertInline($, root.children);
}

describe("convertInline", () => {
  it("escapes prose so MDX does not read it as JSX", () => {
    expect(inline("a < b {c}")).toBe("a &lt; b \\{c\\}");
  });

  it("leaves inline code unescaped, where those characters are literal", () => {
    expect(inline("<code>a &lt; b</code>")).toBe("`a < b`");
  });

  it("emits a link", () => {
    expect(inline('<a href="https://example.com">標籤</a>')).toBe("[標籤](https://example.com)");
  });

  it("emits a bare URL when the label is the URL itself", () => {
    expect(inline('<a href="https://example.com">https://example.com</a>')).toBe("https://example.com");
  });

  it("emits a hard line break for <br>", () => {
    expect(inline("a<br>b")).toBe("a  \nb");
  });

  it("wraps emphasis", () => {
    expect(inline("<strong>粗體</strong>")).toBe("**粗體**");
    expect(inline("<em>斜體</em>")).toBe("*斜體*");
  });

  // Medium commonly emits "<strong>Change </strong>directory". Dropping the
  // inner space would yield "**Change **directory", which CommonMark does not
  // read as emphasis at all — the space belongs outside the markers.
  it("moves padding inside emphasis outside the markers", () => {
    expect(inline("<strong>Change </strong>directory")).toBe("**Change** directory");
  });
});
