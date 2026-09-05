/**
 * Invariants over the committed article corpus (apps/my-website/content/blog).
 *
 * Unlike the golden-file tests, this reads only what is already checked in —
 * no medium-source/ fixtures, no converter invocation. It exists so a change
 * to the converter (or a hand-edit of an .mdx file) that reintroduces a known
 * defect fails CI immediately, without needing the original Medium export to
 * reproduce it.
 */
import { promises as fs } from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";

const CONTENT_DIR = path.join(__dirname, "../../../content/blog");

interface Article {
  file: string;
  frontmatter: Record<string, string>;
  body: string;
}

async function loadCorpus(): Promise<Article[]> {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith(".mdx"));

  return Promise.all(
    files.map(async (file) => {
      const text = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
      const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
      if (!match) throw new Error(`${file}: no frontmatter block found`);

      const frontmatter: Record<string, string> = {};
      for (const line of (match[1] ?? "").split("\n")) {
        const field = /^(\w+): (.*)$/.exec(line);
        if (field) frontmatter[field[1] ?? ""] = (field[2] ?? "").replace(/^"(.*)"$/, "$1");
      }

      return { body: match[2] ?? "", file, frontmatter };
    }),
  );
}

/**
 * Strip fenced code blocks so their contents aren't mistaken for prose.
 *
 * A single replace-with-regex (`/^(\`{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm`) looks
 * right but silently mispairs fences once a file has more than one code block:
 * the engine is free to match a *later* block's closing fence against an
 * *earlier* block's opening fence when the lengths agree, which either merges
 * two separate blocks into one (swallowing the prose between them) or, as
 * found here, leaves a block's closing fence unconsumed so its content reads
 * as prose. A single left-to-right scan pairs each opening fence with the very
 * next line whose backtick run is at least as long — the same rule
 * convertPre's fence-lengthening in markdown-blocks.ts assumes.
 */
function stripCodeFences(body: string): string {
  const lines = body.split("\n");
  const kept: string[] = [];
  let fenceLength: number | null = null;

  for (const line of lines) {
    const fence = /^(`{3,})/.exec(line);
    if (fenceLength === null) {
      if (fence) {
        fenceLength = (fence[1] ?? "").length;
      } else {
        kept.push(line);
      }
    } else if (fence && (fence[1] ?? "").length >= fenceLength) {
      fenceLength = null;
    }
  }

  return kept.join("\n");
}

describe("content corpus invariants", () => {
  it("loads the full corpus", async () => {
    const corpus = await loadCorpus();
    expect(corpus.length).toBeGreaterThan(200);
  });

  it("every slug matches its filename", async () => {
    const corpus = await loadCorpus();
    const mismatches = corpus.filter((a) => a.frontmatter.slug !== a.file.replace(/\.mdx$/, ""));
    expect(mismatches.map((a) => a.file)).toEqual([]);
  });

  it("every slug is unique", async () => {
    const corpus = await loadCorpus();
    const slugs = corpus.map((a) => a.frontmatter.slug);
    const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
    expect(duplicates).toEqual([]);
  });

  it("no two articles share a sourceFile", async () => {
    const corpus = await loadCorpus();
    const sources = corpus.map((a) => a.frontmatter.sourceFile).filter((s): s is string => Boolean(s));
    const duplicates = sources.filter((s, i) => sources.indexOf(s) !== i);
    expect(duplicates).toEqual([]);
  });

  // Regression guard for the auto-excerpt-of-heading bug: 107 articles had a
  // description like "前言" or "緣由" because parsePost trusted Medium's
  // p-summary verbatim, and p-summary is often just the post's first heading
  // truncated with an ellipsis.
  it("no published article's description matches one of its own headings", async () => {
    const corpus = await loadCorpus();
    const offenders = corpus
      .filter((a) => a.frontmatter.draft !== "true")
      .filter((a) => {
        const headingLines = a.body.match(/^#{2,6} .+$/gm) ?? [];
        const headings = headingLines.map((h) => h.replace(/^#{2,6} /, "").trim());
        return headings.includes(a.frontmatter.description ?? "");
      })
      .map((a) => a.file);
    expect(offenders).toEqual([]);
  });

  it("no published article's description is empty or equal to its title", async () => {
    const corpus = await loadCorpus();
    const offenders = corpus
      .filter((a) => a.frontmatter.draft !== "true")
      .filter((a) => !a.frontmatter.description || a.frontmatter.description === a.frontmatter.title)
      .map((a) => a.file);
    expect(offenders).toEqual([]);
  });

  // Regression guard: a lone "-" or "1." paragraph is Medium's plain-text
  // divider between sections, not a Markdown list. Left unescaped it renders
  // as an empty bullet.
  //
  // The lv2/lv3 exercise articles are a verified exception, not a converter
  // bug: their source is `<p>tree(1) 預期輸出：<br>*</p>` — a bare "*" that is
  // the author's literal expected stdout for a "print a Christmas tree"
  // practice problem, reached by a hard line break *within* an existing
  // paragraph, not a standalone block. Because the paragraph is already open,
  // CommonMark's "list can interrupt paragraph" rule never applies — compiling
  // this exact fixture through @mdx-js/mdx confirms it renders as literal text
  // ("*") inside the <p>, never as a <ul>. escapeBareListMarker (Stage 3)
  // rightly leaves it alone: it only escapes a marker that is its own
  // standalone paragraph.
  const KNOWN_SAFE_BARE_MARKER_FILES = new Set([
    "javascript-基礎-綜合題目練習-lv2.mdx",
    "javascript-基礎-綜合題目練習-lv3.mdx",
  ]);
  it("has no bare/empty list markers", async () => {
    const corpus = await loadCorpus();
    const offenders = corpus
      .filter((a) => !KNOWN_SAFE_BARE_MARKER_FILES.has(a.file))
      .filter((a) => /^\s*(?:[-*+]|\d{1,3}\.)\s*$/m.test(stripCodeFences(a.body)))
      .map((a) => a.file);
    expect(offenders).toEqual([]);
  });

  // Regression guard for the two malformed pseudo-links downgraded in an
  // earlier fix: an <a href> that was never a URL (the author had typed the
  // article's own title into href by mistake).
  //
  // Strips inline code spans too: inline `arr[0]()` reads identically to an
  // empty-destination link to a naive `](...)` scan, but it's a function
  // call, not a link.
  it("has no markdown link pointing at a non-http(s)/mailto destination", async () => {
    const corpus = await loadCorpus();
    const offenders: string[] = [];
    for (const article of corpus) {
      const prose = stripCodeFences(article.body).replace(/`[^`\n]*`/g, "");
      for (const match of prose.matchAll(/\]\(([^)]*)\)/g)) {
        const url = match[1] ?? "";
        if (!/^(https?:|mailto:)/.test(url)) {
          offenders.push(`${article.file}: ${url.slice(0, 60)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  // Regression guard for the injection fix: an iframe embed must only ever
  // come from the allow-listed hosts convertFigure restricts embeds to.
  const EMBEDDABLE_HOSTS = ["codepen.io", "codesandbox.io", "player.vimeo.com", "youtube-nocookie.com", "youtube.com"];
  it("every iframe embed points at an allow-listed host over https", async () => {
    const corpus = await loadCorpus();
    const offenders: string[] = [];
    for (const article of corpus) {
      // An article that teaches HTML (e.g. 前端網頁基礎-html.mdx) legitimately
      // shows <iframe> inside a code sample — that is documentation, not an
      // embed the converter produced. Only a real (non-fenced) iframe matters
      // here: convertFigure only ever emits one outside a fence.
      for (const match of stripCodeFences(article.body).matchAll(/<iframe\s+src="([^"]*)"/g)) {
        const src = match[1] ?? "";
        const isSafe = src.startsWith("https://") && EMBEDDABLE_HOSTS.some((host) => src.includes(host));
        if (!isSafe) offenders.push(`${article.file}: ${src}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  // Only counts a line that is *only* a fence marker (what convertPre actually
  // emits) — a line like "```lang``` 高亮顯示" is prose demonstrating fence
  // syntax (present in the one article that documents Markdown itself), not
  // an unpaired fence.
  it("has no unfenced code fence markers (odd number of standalone ``` lines per file)", async () => {
    const corpus = await loadCorpus();
    const offenders = corpus
      .filter((a) => (a.body.match(/^`{3,}[^`\n]*$/gm)?.length ?? 0) % 2 !== 0)
      .map((a) => a.file);
    expect(offenders).toEqual([]);
  });

  it("every draft's date does not read as a future migration artifact beyond today", async () => {
    const corpus = await loadCorpus();
    const now = Date.now();
    const offenders = corpus.filter((a) => new Date(a.frontmatter.date ?? "").getTime() > now).map((a) => a.file);
    expect(offenders).toEqual([]);
  });
});
