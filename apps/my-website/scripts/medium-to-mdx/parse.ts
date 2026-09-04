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

/** Resolve the publication date, falling back to file mtime for drafts. */
async function resolveDate($: cheerio.CheerioAPI, filePath: string): Promise<string> {
  // Published posts carry <time class="dt-published">; drafts do not.
  const publishedAttr = $("time.dt-published").first().attr("datetime");
  if (publishedAttr) return new Date(publishedAttr).toISOString();

  const stat = await fs.stat(filePath);
  return stat.mtime.toISOString();
}

/** Parse one Medium export file (microformats2 h-entry) into a ParsedPost. */
export async function parsePost(filePath: string): Promise<ParsedPost> {
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
    date: await resolveDate($, filePath),
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
