/**
 * Medium HTML → MDX converter
 *
 * Converts Medium's official export (microformats2 h-entry HTML) into MDX files
 * consumable by Velite.
 *
 * Usage:
 *   pnpm convert:medium-to-mdx --limit 10           # convert next 10 unconverted posts
 *   pnpm convert:medium-to-mdx --only "Git" --force # re-convert files matching "Git"
 *   pnpm convert:medium-to-mdx --dry-run            # parse only, write nothing
 *
 * Existing MDX files are skipped unless --force is passed, so the conversion can
 * be done incrementally batch by batch.
 */

import { promises as fs } from "fs";
import * as path from "path";

import { parseArgs } from "./cli";
import { CONFIG, REPO_ROOT } from "./config";
import { EXCLUDED_FILES } from "./exclude";
import { renderMdx, writeChecklist } from "./output";
import { parsePost } from "./parse";
import { resolveSlug } from "./slug-plan";
import type { CliOptions, ConversionState, ConversionStats } from "./types";

/**
 * Locate the Medium export posts directory when --input is not given.
 * The export folder name contains a content hash, so it is discovered at runtime.
 */
async function resolveInputDir(explicit: string | undefined): Promise<string> {
  if (explicit) return path.resolve(explicit);

  const sourceRoot = path.join(REPO_ROOT, CONFIG.SOURCE_GLOB_ROOT);
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true });
  const exportDir = entries.find((entry) => entry.isDirectory() && entry.name.startsWith("medium-export-"));

  if (!exportDir) throw new Error(`No medium-export-* directory found under ${sourceRoot}`);

  return path.join(sourceRoot, exportDir.name, "posts");
}

/** Convert one file into the output dir, recording the outcome in state. */
async function convertOne(
  fileName: string,
  inputDir: string,
  options: CliOptions,
  state: ConversionState,
): Promise<void> {
  try {
    const post = await parsePost(path.join(inputDir, fileName));
    const resolution = resolveSlug(post, fileName, {
      existing: state.existing,
      force: options.force,
      usedSlugs: state.usedSlugs,
    });

    if (resolution.kind === "skip") {
      state.stats.skipped++;
      return;
    }

    post.slug = resolution.slug;
    state.usedSlugs.add(resolution.slug);

    if (!options.dryRun) {
      await fs.writeFile(path.join(options.out, `${resolution.slug}.mdx`), renderMdx(post), "utf8");
    }

    state.stats.converted.push(post);
    console.log(`✅ ${post.title}\n   → ${resolution.slug}.mdx${post.draft ? " (draft)" : ""}`);
  } catch (error) {
    // A single malformed export must not abort the batch
    const reason = error instanceof Error ? error.message : String(error);
    state.stats.failed.push({ file: fileName, reason });
    console.error(`❌ ${fileName}: ${reason}`);
  }
}

function reportStats(stats: ConversionStats, candidateCount: number): void {
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Converted: ${stats.converted.length}`);
  console.log(`⏭️  Skipped (already exists): ${stats.skipped}`);
  console.log(`❌ Failed: ${stats.failed.length}`);
  console.log(`📊 Remaining: ${candidateCount - stats.converted.length - stats.skipped - stats.failed.length}`);

  if (stats.failed.length === 0) return;

  console.log("\nFailures:");
  stats.failed.forEach(({ file, reason }) => console.log(`  - ${file}: ${reason}`));
}

async function convert(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const inputDir = await resolveInputDir(options.input);

  console.log(`📂 Source: ${inputDir}`);
  console.log(`📁 Output: ${options.out}`);

  const allFiles = (await fs.readdir(inputDir))
    .filter((name) => name.endsWith(".html") && !EXCLUDED_FILES.has(name))
    .sort();
  const candidates = options.only ? allFiles.filter((name) => name.includes(options.only ?? "")) : allFiles;

  console.log(`📄 ${allFiles.length} posts (${EXCLUDED_FILES.size} excluded as replies/tests)`);

  await fs.mkdir(options.out, { recursive: true });

  const state: ConversionState = {
    existing: new Set(await fs.readdir(options.out)),
    stats: { converted: [], failed: [], skipped: 0 },
    usedSlugs: new Set<string>(),
  };

  for (const fileName of candidates) {
    if (options.limit !== undefined && state.stats.converted.length >= options.limit) break;
    await convertOne(fileName, inputDir, options, state);
  }

  reportStats(state.stats, candidates.length);

  if (options.dryRun) {
    console.log("\n🔍 Dry run — no files written.");
    return;
  }

  if (state.stats.converted.length > 0) {
    await writeChecklist(state.stats.converted, options.out);
  }
}

async function main(): Promise<void> {
  console.log("🔥 Medium HTML → MDX Converter");
  console.log("=".repeat(50));

  try {
    await convert();
  } catch (error) {
    console.error("💥 Conversion aborted:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

if (require.main === module) {
  void main();
}
