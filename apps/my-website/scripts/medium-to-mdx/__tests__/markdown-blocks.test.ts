import * as cheerio from "cheerio";
import { describe, expect, it } from "vitest";

import { convertBlockquote, convertBody, convertFigure, convertList, convertPre } from "../markdown-blocks";
import { loadBody } from "./helpers";

/** Load a single element and hand it to a block converter. */
function el(html: string) {
  const $ = cheerio.load(`<div id="root">${html}</div>`);
  const node = $("#root").children().first().get(0);
  if (!node) throw new Error("fixture has no element");
  return { $, node };
}

describe("convertPre", () => {
  it("restores <br> as real newlines", () => {
    const { $, node } = el("<pre>line one<br>line two</pre>");
    expect(convertPre($, node)).toBe("```\nline one\nline two\n```");
  });

  it("lengthens the fence past any backtick run in the code", () => {
    const { $, node } = el("<pre>```<br>nested</pre>");
    expect(convertPre($, node)).toBe("````\n```\nnested\n````");
  });

  it("keeps growing the fence for longer runs", () => {
    const { $, node } = el("<pre>`````</pre>");
    expect(convertPre($, node)).toBe("``````\n`````\n``````");
  });

  it("emits nothing for an empty block, which would otherwise swallow the next one", () => {
    const { $, node } = el("<pre>   </pre>");
    expect(convertPre($, node)).toBe("");
  });

  it("decodes entities without re-escaping them for MDX", () => {
    const { $, node } = el("<pre>&lt;div&gt;{a}&lt;/div&gt;</pre>");
    expect(convertPre($, node)).toBe("```\n<div>{a}</div>\n```");
  });

  it("uses the language annotation when present", () => {
    const { $, node } = el('<pre data-code-block-lang="typescript">const a = 1;</pre>');
    expect(convertPre($, node)).toBe("```typescript\nconst a = 1;\n```");
  });

  it("strips trailing whitespace inside the fence", () => {
    const { $, node } = el("<pre>a   <br>b\t</pre>");
    expect(convertPre($, node)).toBe("```\na\nb\n```");
  });
});

describe("convertFigure", () => {
  it("downgrades a Gist embed to a link, since document.write fails under React", () => {
    const { $, node } = el('<figure><script src="https://gist.github.com/u/abc123.js"></script></figure>');
    expect(convertFigure($, node)).toBe("[📄 在 GitHub Gist 查看完整程式碼](https://gist.github.com/u/abc123)");
  });

  it("keeps a real iframe", () => {
    const { $, node } = el('<figure><iframe src="https://www.youtube.com/embed/abc" width="700" height="393"></iframe></figure>');
    expect(convertFigure($, node)).toContain('<iframe src="https://www.youtube.com/embed/abc"');
  });

  it("emits an image with its caption both as alt and as visible text", () => {
    const { $, node } = el('<figure><img src="https://cdn/x.png"><figcaption>圖說</figcaption></figure>');
    expect(convertFigure($, node)).toBe("![圖說](https://cdn/x.png)\n\n*圖說*");
  });

  it("emits a bare image when there is no caption", () => {
    const { $, node } = el('<figure><img src="https://cdn/x.png"></figure>');
    expect(convertFigure($, node)).toBe("![](https://cdn/x.png)");
  });
});

describe("convertList", () => {
  it("indents a nested list and numbers an ordered one from 1", () => {
    const { $, node } = el("<ul><li>a<ol><li>a1</li><li>a2</li></ol></li><li>b</li></ul>");
    expect(convertList($, node, 0)).toBe("- a\n  1. a1\n  2. a2\n- b");
  });
});

describe("convertBody", () => {
  it("drops the heading that merely repeats the post title", () => {
    const { $, body } = loadBody('<h3 class="graf graf--h3 graf--title">測試標題</h3><p>內文</p>');
    expect(convertBody($, body, "測試標題")).toBe("內文");
  });

  it("maps Medium's h3/h4 to ## and ###", () => {
    const { $, body } = loadBody("<h3>章節</h3><p>x</p><h4>子章節</h4><p>y</p>");
    expect(convertBody($, body, "測試標題")).toBe("## 章節\n\nx\n\n### 子章節\n\ny");
  });

  it("skips Medium's empty paragraphs and section dividers", () => {
    const { $, body } = loadBody('<hr class="section-divider"><p class="graf graf--p graf--empty"><br></p><p>內文</p>');
    expect(convertBody($, body, "測試標題")).toBe("內文");
  });
});

describe("convertBlockquote", () => {
  it("prefixes every line", () => {
    const { $, node } = el("<blockquote>引用內容</blockquote>");
    expect(convertBlockquote($, node)).toBe("> 引用內容");
  });
});
