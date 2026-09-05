import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import * as path from "path";

import { CONFIG } from "./config";
import type { ContentBlock } from "./markdown-blocks";
import { collectContentBlocks, convertBody } from "./markdown-blocks";
import { normalizeText, slugify, truncate } from "./text";
import type { ParsedPost } from "./types";

/** Minimum length for a block to be worth using as (part of) a description. */
const MIN_BLOCK_LENGTH = 8;
/** Below this, a lone first block reads as a fragment rather than a summary. */
const SHORT_BLOCK_THRESHOLD = 40;

const normalizeForComparison = (text: string): string => text.replace(/[\s\p{P}]+/gu, "").toLowerCase();

/**
 * Whether Medium's p-summary is really just an auto-excerpt of a heading,
 * rather than something the author wrote as a summary.
 *
 * Medium generates p-summary by excerpting the first content block; when that
 * block is a heading, the "summary" is just the section title truncated with
 * an ellipsis — useless as a description, and it is what produced entries like
 * "前言" or "緣由". The post title is checked too: the body's first heading is
 * usually a graf--title repeat of it and gets filtered out of contentBlocks
 * before this ever sees it, but Medium can still excerpt a fragment of the
 * *title* as the summary (e.g. subtitle "入職前" from title "...心得 — 入職前").
 * A real subtitle the author wrote is always prose distinct from both, so this
 * only ever fires against a heading or the title itself.
 */
export function isAutoExcerptOfHeading(summary: string, first: ContentBlock | undefined, title: string): boolean {
  const normalizedSummary = normalizeForComparison(summary.replace(/…$/, ""));
  if (!normalizedSummary) return false;

  const headingText = first && /^h[1-6]$/.test(first.tag) ? first.text : undefined;

  return [headingText, title].some((candidate) => {
    if (!candidate) return false;
    const normalizedCandidate = normalizeForComparison(candidate);
    return normalizedCandidate === normalizedSummary || normalizedCandidate.includes(normalizedSummary);
  });
}

/**
 * Derive a description from the article's prose. Not truncated — the caller
 * applies that once, after choosing between this and an authored summary.
 *
 * Used when there is no authored summary to fall back on. A single short
 * first paragraph (Medium often opens with "前言" or a one-line hook) reads as
 * a fragment on its own, so a second prose block is appended — but list blocks
 * are skipped for this, since "1. 介面：… 2. 事件：…" concatenated onto a
 * heading reads as a list fragment, not a summary.
 */
function deriveDescription(blocks: ContentBlock[]): string {
  const prose = blocks.filter((block) => block.tag === "p" || block.tag === "blockquote");
  const usable = prose.filter((block) => block.text.length >= MIN_BLOCK_LENGTH);

  const first = usable[0];
  if (!first) return "";
  if (first.text.length >= SHORT_BLOCK_THRESHOLD) return first.text;

  const second = usable[1];
  return second ? `${first.text} ${second.text}` : first.text;
}

/**
 * Resolve the publication date.
 *
 * Drafts carry no <time class="dt-published">, so they fall back to a date the
 * caller pins — re-extracting the export would otherwise change file mtimes and
 * silently move every draft's date.
 */
async function resolveDate($: cheerio.CheerioAPI, filePath: string, pinnedDate?: string): Promise<string> {
  const publishedAttr = $("time.dt-published").first().attr("datetime");
  if (publishedAttr) return new Date(publishedAttr).toISOString();
  if (pinnedDate) return pinnedDate;

  const stat = await fs.stat(filePath);
  return stat.mtime.toISOString();
}

/** Parse one Medium export file (microformats2 h-entry) into a ParsedPost. */
export interface ParseOptions {
  /** Date to use for drafts, normally carried over from a previous conversion. */
  pinnedDate?: string;
}

export async function parsePost(filePath: string, options: ParseOptions = {}): Promise<ParsedPost> {
  const html = await fs.readFile(filePath, "utf8");
  const $ = cheerio.load(html);
  const fileName = path.basename(filePath);

  const title = normalizeText($("h1.p-name").first().text()).trim();
  if (!title) throw new Error("missing <h1 class='p-name'> title");

  const bodyElement = $('section[data-field="body"]').first().get(0);
  if (!bodyElement) throw new Error("missing body section");

  const body = convertBody($, bodyElement, title);
  const contentBlocks = collectContentBlocks($, bodyElement);

  // Medium's p-summary is usually an auto-generated excerpt of the opening
  // paragraph, but when the post opens with a heading, the "summary" is just
  // that heading title truncated with an ellipsis — not something the author
  // wrote. isAutoExcerptOfHeading detects that case so it can be discarded
  // rather than surfacing as e.g. description: "前言".
  const subtitleRaw = normalizeText($('section[data-field="subtitle"]').first().text()).trim();
  const authoredSummary = isAutoExcerptOfHeading(subtitleRaw, contentBlocks[0], title) ? "" : subtitleRaw;
  const description = truncate(authoredSummary || deriveDescription(contentBlocks), CONFIG.DESCRIPTION_MAX_LENGTH);
  const subtitle = authoredSummary && authoredSummary !== description ? authoredSummary : undefined;

  // Drafts have no canonical link, only a short "View original" URL.
  const mediumUrl = $("a.p-canonical").first().attr("href") ?? $('a[href*="medium.com/p/"]').first().attr("href");

  const featured = $("img[data-is-featured='true']").first().attr("src");

  return {
    body,
    date: await resolveDate($, filePath, options.pinnedDate),
    description: description || title,
    draft: fileName.startsWith("draft_"),
    mediumUrl,
    slug: slugify(title),
    sourceFile: fileName,
    subtitle,
    thumbnail: featured ?? $("img.graf-image").first().attr("src"),
    title,
  };
}
