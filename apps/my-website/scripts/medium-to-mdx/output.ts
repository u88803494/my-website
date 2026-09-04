import { promises as fs } from "fs";
import * as path from "path";

import { CONFIG, REPO_ROOT } from "./config";
import { yamlString } from "./text";
import type { ParsedPost } from "./types";

/** Render a parsed post as an MDX file with Velite-compatible frontmatter. */
export function renderMdx(post: ParsedPost): string {
  const lines = [
    "---",
    `title: ${yamlString(post.title)}`,
    `slug: ${yamlString(post.slug)}`,
    `description: ${yamlString(post.description)}`,
  ];

  if (post.subtitle) lines.push(`subtitle: ${yamlString(post.subtitle)}`);

  lines.push(`date: ${post.date}`);
  lines.push(`tags: [${CONFIG.DEFAULT_TAGS.map((tag) => yamlString(tag)).join(", ")}]`);
  lines.push(`draft: ${post.draft}`);

  if (post.thumbnail) lines.push(`thumbnail: ${yamlString(post.thumbnail)}`);
  if (post.mediumUrl) lines.push(`mediumUrl: ${yamlString(post.mediumUrl)}`);

  lines.push("---", "", post.body, "");

  return lines.join("\n");
}

/**
 * Read the existing checklist rows, keyed by slug.
 * Conversion runs in batches, so a rewrite must not discard rows written by
 * earlier batches nor the boxes already ticked during review.
 */
async function readChecklistRows(checklistPath: string): Promise<Map<string, string>> {
  const rows = new Map<string, string>();

  let existing: string;
  try {
    existing = await fs.readFile(checklistPath, "utf8");
  } catch {
    return rows;
  }

  for (const line of existing.split("\n")) {
    const slug = /^- \[[ xX]\] .*\/blog\/([^)]+)\)\s*$/.exec(line)?.[1];
    if (slug) rows.set(decodeURIComponent(slug), line);
  }

  return rows;
}

/** Write the review checklist, preserving ticks from previous batches. */
export async function writeChecklist(posts: ParsedPost[], outDir: string): Promise<void> {
  const checklistPath = path.join(REPO_ROOT, CONFIG.CHECKLIST_FILE);
  const rows = await readChecklistRows(checklistPath);

  // A freshly converted post replaces its old row: the content changed, so any
  // previous tick no longer applies.
  for (const post of posts) {
    const medium = post.mediumUrl ? `[原文](${post.mediumUrl})` : "—";
    const preview = `[預覽](${CONFIG.LOCAL_PREVIEW_BASE}/${encodeURIComponent(post.slug)})`;
    const flag = post.draft ? " 🟡草稿" : "";
    rows.set(post.slug, `- [ ] ${post.title}${flag} · ${medium} · ${preview}`);
  }

  const allRows = [...rows.values()];
  const doneCount = allRows.filter((line) => /^- \[[xX]\]/.test(line)).length;
  const relativeOut = path.relative(REPO_ROOT, outDir);

  const content = [
    "# Medium → MDX 轉換驗收清單",
    "",
    `> 更新於 ${new Date().toISOString()}｜已轉換 ${allRows.length} 篇｜已驗收 ${doneCount} 篇｜輸出至 \`${relativeOut}\``,
    "",
    "逐篇對照 Medium 原文與本地預覽，確認標題、圖片、程式碼區塊、列表渲染正確後打勾。",
    "重新轉換某篇時，該篇的勾選會被清掉（內容已變動，需重新驗收）。",
    "",
    ...allRows,
    "",
  ].join("\n");

  await fs.writeFile(checklistPath, content, "utf8");
  console.log(`📋 Checklist: ${allRows.length} 篇（已驗收 ${doneCount}）→ ${path.relative(REPO_ROOT, checklistPath)}`);
}
