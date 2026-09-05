import * as cheerio from "cheerio";
import { promises as fs } from "fs";
import * as path from "path";

import { CONFIG } from "./config";
import { convertBody } from "./markdown-blocks";
import { normalizeText, slugify, truncate } from "./text";
import type { ParsedPost } from "./types";

/**
 * Derive a description from the first prose paragraph.
 * Used for the handful of posts Medium exported without a p-summary.
 */
function deriveDescription(body: string): string {
  const firstParagraph = body
    .split("\n\n")
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("```") && !block.startsWith("!["));

  if (!firstParagraph) return "";

  return firstParagraph
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*`>]/g, "")
    .replace(/\\([{}\\])/g, "$1")
    .trim();
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

  // Medium's p-summary is an auto-generated excerpt of the opening paragraph.
  // It serves as the subtitle verbatim, and as a truncated meta description.
  const subtitleRaw = normalizeText($('section[data-field="subtitle"]').first().text()).trim();
  const description = truncate(subtitleRaw || deriveDescription(body), CONFIG.DESCRIPTION_MAX_LENGTH);
  const subtitle = subtitleRaw && subtitleRaw !== description ? subtitleRaw : undefined;

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
