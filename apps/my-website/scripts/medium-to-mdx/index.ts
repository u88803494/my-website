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
import { buildSlugPlan } from "./slug-plan";
import type { SlugPlan } from "./slug-plan";
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

interface ExistingPost {
  slug: string;
  date: string;
}

/**
 * Read back what previous conversions produced, keyed by source file.
 *
 * The slug keeps a published URL attached to the post that owns it, and the
 * date keeps drafts stable — they have no date in the export, so without this
 * they would drift to the file's mtime on every re-run.
 */
async function readExistingPosts(
  outDir: string,
  files: string[],
  knownSources: ReadonlyMap<string, string>,
): Promise<Map<string, ExistingPost>> {
  const posts = new Map<string, ExistingPost>();

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const text = await fs.readFile(path.join(outDir, file), "utf8");
    // Files written before sourceFile existed are adopted by matching their
    // mediumUrl, so the first run after this change claims them rather than
    // writing a renamed duplicate alongside.
    const source =
      /^sourceFile: "(.*)"$/m.exec(text)?.[1] ?? knownSources.get(/^mediumUrl: "(.*)"$/m.exec(text)?.[1] ?? "");
    if (!source) continue;

    posts.set(source, {
      date: /^date: (.*)$/m.exec(text)?.[1]?.trim() ?? "",
      slug: file.replace(/\.mdx$/, ""),
    });
  }

  return posts;
}

/** Convert one file into the output dir, recording the outcome in state. */
async function convertOne(
  fileName: string,
  inputDir: string,
  options: CliOptions,
  state: ConversionState,
  plan: SlugPlan,
): Promise<void> {
  const slug = plan.bySourceFile.get(fileName);
  if (!slug) {
    state.stats.failed.push({ file: fileName, reason: "no slug assigned" });
    return;
  }

  try {
    // Never let one post take over another's file. The plan prevents this by
    // construction; this catches a stale plan or a hand-edited filename.
    const owner = state.ownerOfExisting.get(slug);
    if (owner && owner !== fileName) {
      state.stats.failed.push({ file: fileName, reason: `slug "${slug}" belongs to ${owner}` });
      console.error(`❌ ${fileName}: would overwrite ${owner}`);
      return;
    }

    if (state.existing.has(`${slug}.mdx`) && !options.force) {
      state.stats.skipped++;
      return;
    }

    const post = await parsePost(path.join(inputDir, fileName), { pinnedDate: state.pinnedDates.get(fileName) });
    post.slug = slug;

    if (!options.dryRun) {
      await fs.writeFile(path.join(options.out, `${slug}.mdx`), renderMdx(post), "utf8");
    }

    state.stats.converted.push(post);
    console.log(`✅ ${post.title}\n   → ${slug}.mdx${post.draft ? " (draft)" : ""}`);
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

  const existingFiles = await fs.readdir(options.out);
  // Parse every candidate up front: the slug plan needs all base slugs, and the
  // mediumUrl doubles as the key for adopting output written before sourceFile.
  const parsed = await Promise.all(
    allFiles.map(async (sourceFile) => ({ post: await parsePost(path.join(inputDir, sourceFile)), sourceFile })),
  );
  const sourcesByMediumUrl = new Map(
    parsed.flatMap(({ post, sourceFile }) => (post.mediumUrl ? [[post.mediumUrl, sourceFile] as const] : [])),
  );
  const existingPosts = await readExistingPosts(options.out, existingFiles, sourcesByMediumUrl);
  const ownerOfExisting = new Map([...existingPosts].map(([source, { slug }]) => [slug, source]));

  // Slugs claimed by hand-written MDX (no sourceFile) are off limits.
  const reserved = new Set(
    existingFiles
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
      .filter((slug) => !ownerOfExisting.has(slug)),
  );

  // Built from every candidate, not just this run's subset, so --limit and
  // --only cannot change which slug a post gets.
  const plan = buildSlugPlan({
    candidates: parsed.map(({ post, sourceFile }) => ({ baseSlug: post.slug, sourceFile })),
    pinned: new Map([...existingPosts].map(([source, { slug }]) => [source, slug])),
    reserved,
  });

  for (const conflict of plan.conflicts) {
    console.error(`❌ ${conflict.sourceFile}: slug "${conflict.slug}" is held by ${conflict.heldBy}`);
  }

  const state: ConversionState = {
    existing: new Set(existingFiles),
    ownerOfExisting,
    pinnedDates: new Map([...existingPosts].map(([source, { date }]) => [source, date])),
    stats: { converted: [], failed: [...plan.conflicts.map((c) => ({ file: c.sourceFile, reason: `slug held by ${c.heldBy}` }))], skipped: 0 },
  };

  for (const fileName of candidates) {
    if (options.limit !== undefined && state.stats.converted.length >= options.limit) break;
    await convertOne(fileName, inputDir, options, state, plan);
  }

  reportStats(state.stats, candidates.length);

  if (options.dryRun) {
    console.log("\n🔍 Dry run — no files written.");
    return;
  }

  if (state.stats.converted.length > 0) {
    await writeChecklist(state.stats.converted, options.out);
  }

  // Signal failure without truncating buffered stdout, which process.exit would.
  if (state.stats.failed.length > 0) process.exitCode = 1;
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
