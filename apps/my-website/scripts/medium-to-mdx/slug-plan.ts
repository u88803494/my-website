/**
 * Output slug assignment.
 *
 * Extracted from index.ts so it can be unit-tested: index.ts ends with a
 * `require.main === module` guard, which throws under vitest's ESM loader.
 */

import type { ParsedPost, SlugContext, SlugResolution } from "./types";

/**
 * Decide the output slug for a post, or skip it entirely.
 *
 * A post already on disk is skipped so batches can be re-run cheaply; --force
 * overrides that. A collision within the same run is disambiguated with the
 * Medium post id embedded in the source filename, which keeps the slug stable
 * across re-runs (unlike a positional counter).
 */
export function resolveSlug(post: ParsedPost, fileName: string, context: SlugContext): SlugResolution {
  const base = post.slug || fileName.replace(/\.html$/, "");

  if (context.existing.has(`${base}.mdx`) && !context.force) return { kind: "skip" };
  if (!context.usedSlugs.has(base)) return { kind: "use", slug: base };

  const mediumId = /([0-9a-f]{12})\.html$/.exec(fileName)?.[1]?.slice(0, 6);
  return { kind: "use", slug: mediumId ? `${base}-${mediumId}` : `${base}-${context.usedSlugs.size}` };
}
