import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import * as os from "os";
import * as path from "path";
import { describe, expect, it } from "vitest";

import { collectContentBlocks } from "../markdown-blocks";
import { isAutoExcerptOfHeading, parsePost } from "../parse";
import { mediumEntry } from "./helpers";

async function withFixture<T>(html: string, run: (filePath: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "medium-fixture-"));
  const filePath = path.join(dir, "2019-01-01_post-abcdef012345.html");
  await fs.writeFile(filePath, html, "utf8");
  try {
    return await run(filePath);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

describe("isAutoExcerptOfHeading", () => {
  it("matches a summary that is the heading title, ellipsis and punctuation aside", () => {
    expect(isAutoExcerptOfHeading("前言", { tag: "h3", text: "前言" }, "文章標題")).toBe(true);
    expect(isAutoExcerptOfHeading("什麼是後端？", { tag: "h3", text: "什麼是後端？" }, "文章標題")).toBe(true);
  });

  it("matches a truncated heading (summary is a prefix of it)", () => {
    expect(isAutoExcerptOfHeading("ES5 ES6", { tag: "h3", text: "ES5 . ES6 的差異比較說明" }, "文章標題")).toBe(true);
  });

  it("does not match when the first block is a paragraph and unrelated to the title", () => {
    expect(
      isAutoExcerptOfHeading(
        "這是真的摘要文字",
        { tag: "p", text: "這是真的摘要文字，作者自己寫的" },
        "完全不同的標題",
      ),
    ).toBe(false);
  });

  it("does not match unrelated text", () => {
    expect(isAutoExcerptOfHeading("完全不相關的句子", { tag: "h3", text: "章節標題" }, "文章標題")).toBe(false);
  });

  // The body's first heading is usually a graf--title repeat of the post title
  // and gets filtered out of contentBlocks before this ever runs, so the only
  // way to catch a summary excerpted from the title itself is to check title
  // as a second candidate.
  it("matches a fragment excerpted from the post title, not from a body heading", () => {
    const first = { tag: "p", text: "先簡單提一下背景。" };
    expect(isAutoExcerptOfHeading("入職前", first, "轉職全端工程師三個月的心得 — 入職前")).toBe(true);
  });

  it("does not match a genuine authored subtitle merely for sharing a word with the title", () => {
    const first = { tag: "p", text: "這篇文章要講解一個新工具。" };
    expect(isAutoExcerptOfHeading("這是作者自己寫的完整摘要句子，內容與標題不同", first, "Gulp 入門教學")).toBe(false);
  });
});

describe("collectContentBlocks", () => {
  it("returns tag and plain text for each block, skipping the repeated title", () => {
    const $ = cheerio.load(mediumEntry('<h3 class="graf graf--title">測試標題</h3><p>第一段</p><h4>子標題</h4>'));
    const body = $('section[data-field="body"]').first().get(0)!;
    expect(collectContentBlocks($, body)).toEqual([
      { tag: "p", text: "第一段" },
      { tag: "h4", text: "子標題" },
    ]);
  });
});

describe("parsePost: description derivation", () => {
  it("discards a p-summary that merely excerpts the opening heading", async () => {
    const html = mediumEntry(
      "<h3>前言</h3><p>這是真正的內文，長度足夠當作備援摘要來使用，超過四十個字元以上才會被單獨採用。</p>",
      {
        subtitle: "前言",
      },
    );
    await withFixture(html, async (filePath) => {
      const post = await parsePost(filePath);
      expect(post.description).not.toBe("前言");
      expect(post.description).toContain("這是真正的內文");
      expect(post.subtitle).toBeUndefined();
    });
  });

  it("keeps an authored summary that is real prose, not a heading excerpt", async () => {
    const html = mediumEntry("<h3>章節</h3><p>內文</p>", { subtitle: "這是作者自己寫的摘要文字" });
    await withFixture(html, async (filePath) => {
      const post = await parsePost(filePath);
      expect(post.description).toBe("這是作者自己寫的摘要文字");
    });
  });

  it("concatenates a second block when the first prose block is short", async () => {
    const html = mediumEntry(
      "<h3>前言</h3><p>簡短的開場白，帶過去。</p><p>這一段補足了描述所需的長度，讓合併後的摘要讀起來完整而不是斷句。</p>",
    );
    await withFixture(html, async (filePath) => {
      const post = await parsePost(filePath);
      expect(post.description).toContain("簡短的開場白");
      expect(post.description).toContain("這一段補足了描述所需的長度");
    });
  });

  it("falls back to the title when the body has no usable prose", async () => {
    const html = mediumEntry("<p>-</p>");
    await withFixture(html, async (filePath) => {
      const post = await parsePost(filePath);
      expect(post.description).toBe(post.title);
    });
  });
});
