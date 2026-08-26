#!/usr/bin/env tsx
/**
 * Check Documentation Links - Validates relative links and frontmatter `related` paths
 * Exit codes: 0 (pass), 1 (fail)
 */
import { readdirSync, readFileSync, statSync } from "fs";
import { dirname, join, relative, resolve } from "path";
import { fileURLToPath } from "url";

/** Resolved from this file's location so the check works from any working directory. */
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const CONFIG = {
  ROOT: REPO_ROOT,
  DOCS_DIR: "docs",
} as const;

/** Directories never scanned */
const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  ".git",
  ".turbo",
  ".playwright-mcp",
  "dist",
  "build",
  "out",
  "coverage",
] as const;

/**
 * Files whose links are intentionally unresolvable.
 * Templates contain placeholders like `./XXX-title.md` by design — including them
 * would make this check permanently red, which is the same as having no check.
 */
const EXCLUDE_FILES = ["docs/.templates/", "template.md"] as const;

interface BrokenLink {
  file: string;
  line: number;
  target: string;
  kind: "link" | "related";
}

function isExcludedFile(filePath: string): boolean {
  return EXCLUDE_FILES.some((pattern) => filePath.includes(pattern));
}

function collectMarkdownFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.some((d) => d === entry.name)) continue;
      collectMarkdownFiles(join(dir, entry.name), found);
    } else if (entry.name.endsWith(".md")) {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

function exists(path: string): boolean {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}

/** Strip fenced code blocks so example links inside them are not checked. */
function stripCodeFences(content: string): string {
  return content.replace(/```[\s\S]*?```/g, (block) =>
    "\n".repeat(block.split("\n").length - 1),
  );
}

function checkMarkdownLinks(file: string, content: string): BrokenLink[] {
  const broken: BrokenLink[] = [];
  const lines = stripCodeFences(content).split("\n");

  lines.forEach((line, index) => {
    const pattern = /\[[^\]]*\]\((?!https?:\/\/|mailto:|#)([^)#\s]+)/g;
    let match: null | RegExpExecArray;

    while ((match = pattern.exec(line)) !== null) {
      const target = match[1];
      if (!target) continue;
      if (!exists(resolve(dirname(file), target))) {
        broken.push({ file, kind: "link", line: index + 1, target });
      }
    }
  });

  return broken;
}

/**
 * Frontmatter `related` entries use two conventions in this repo: relative to the
 * file, and relative to `docs/`. Accept either so this check flags only entries
 * that resolve under neither.
 */
function checkRelatedPaths(file: string, content: string): BrokenLink[] {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter?.[1]) return [];

  const relatedBlock = frontmatter[1].match(/^related:\n((?:\s+-\s+.*\n?)+)/m);
  if (!relatedBlock?.[1]) return [];

  const startLine = content
    .slice(0, content.indexOf(relatedBlock[0]))
    .split("\n").length;
  const broken: BrokenLink[] = [];

  relatedBlock[1]
    .split("\n")
    .map((entry) => entry.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean)
    .forEach((target, index) => {
      const fromFile = resolve(dirname(file), target);
      const fromDocs = resolve(CONFIG.ROOT, CONFIG.DOCS_DIR, target);
      if (!exists(fromFile) && !exists(fromDocs)) {
        broken.push({
          file,
          kind: "related",
          line: startLine + index + 1,
          target,
        });
      }
    });

  return broken;
}

function main(): void {
  console.log("🔗 Validating documentation links...\n");

  const files = collectMarkdownFiles(CONFIG.ROOT).filter(
    (f) => !isExcludedFile(relative(CONFIG.ROOT, f)),
  );

  const broken: BrokenLink[] = [];
  let linkCount = 0;

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    linkCount += (
      stripCodeFences(content).match(
        /\[[^\]]*\]\((?!https?:\/\/|mailto:|#)[^)#\s]+/g,
      ) ?? []
    ).length;
    broken.push(
      ...checkMarkdownLinks(file, content),
      ...checkRelatedPaths(file, content),
    );
  }

  console.log(
    `📊 Scanned ${files.length} files, ${linkCount} relative links\n`,
  );

  if (broken.length === 0) {
    console.log("✅ All documentation links are valid!");
    return;
  }

  console.error(`❌ Found ${broken.length} broken link(s):\n`);

  let currentFile = "";
  for (const item of broken) {
    const displayPath = relative(CONFIG.ROOT, item.file);
    if (displayPath !== currentFile) {
      console.error(`  ${displayPath}`);
      currentFile = displayPath;
    }
    const label = item.kind === "related" ? "frontmatter related" : "link";
    console.error(`    L${item.line} (${label}): ${item.target}`);
  }

  console.error(
    "\n💡 Fix the paths, or convert links to plain text with a _(規劃中)_ marker.",
  );
  process.exit(1);
}

main();
