/**
 * Output slug assignment.
 *
 * Slug assignment is a pure function of the *whole* candidate list, never of
 * whichever subset a given run happens to process. The previous approach
 * decided per-file against a mutable "already used" set, so --limit and --only
 * changed the answer: a post whose base slug collided with an earlier one could
 * be mistaken for "already converted" and skipped forever, and --force --only
 * could hand a post its neighbour's slug and overwrite a live article.
 */

import { createHash } from "crypto";

export interface SlugCandidate {
  sourceFile: string;
  baseSlug: string;
}

export interface SlugPlanInput {
  /** Every non-excluded source file, regardless of what this run will convert. */
  candidates: SlugCandidate[];
  /** sourceFile → slug for posts already on disk, so published URLs never move. */
  pinned?: ReadonlyMap<string, string>;
  /** Slugs held by hand-written MDX that the converter must not claim. */
  reserved?: ReadonlySet<string>;
}

export interface SlugConflict {
  sourceFile: string;
  slug: string;
  heldBy: string;
  /**
   * "held" (default): another sourceFile already owns this slug.
   * "oversized": the slug itself is the problem, not who holds it — see
   * MAX_SLUG_BYTES below.
   */
  reason?: "held" | "oversized";
}

export interface SlugPlan {
  bySourceFile: ReadonlyMap<string, string>;
  ownerOfSlug: ReadonlyMap<string, string>;
  conflicts: SlugConflict[];
}

const RESERVED_OWNER = "<hand-written>";

/**
 * generateStaticParams() writes one file per slug, and filesystems typically
 * cap a single path component at 255 bytes. A CJK slug can be up to 3 bytes
 * per character once percent-encoded for the URL, so the limit has to be
 * measured in encoded bytes, not characters — with headroom below 255 for the
 * ".mdx" extension and any disambiguating suffix disambiguate() appends.
 * Mirrors velite.config.ts's schema .refine(); kept here too so an oversized
 * slug fails at conversion time with a clear message instead of surfacing
 * only when someone next happens to run a Velite build.
 */
const MAX_SLUG_BYTES = 245;

function slugByteLength(slug: string): number {
  return new TextEncoder().encode(encodeURIComponent(slug)).length;
}

/** The Medium post id embedded in the export filename, if present. */
function mediumId(sourceFile: string): string | undefined {
  return /-([0-9a-f]{6,})\.html$/.exec(sourceFile)?.[1]?.slice(0, 6);
}

/**
 * A stable suffix for filenames with no Medium id. Derived from the filename so
 * it survives re-runs — a positional counter would shift with the batch.
 */
function stableSuffix(sourceFile: string): string {
  return createHash("sha1").update(sourceFile).digest("hex").slice(0, 6);
}

/** Build the disambiguated slug for a given attempt number. */
export function disambiguate(baseSlug: string, sourceFile: string, attempt: number): string {
  if (attempt === 0) return baseSlug;

  const suffix = mediumId(sourceFile) ?? stableSuffix(sourceFile);
  return attempt === 1 ? `${baseSlug}-${suffix}` : `${baseSlug}-${suffix}-${attempt}`;
}

/**
 * Assign one slug to every candidate.
 *
 * Candidates are walked in sorted order, so the first source file to claim a
 * base slug keeps it and the rest take a suffix — deterministic regardless of
 * which subset a run converts.
 */
/**
 * Honour pinned assignments first, so an existing URL always keeps its slug
 * even if a different source file now sorts ahead of it.
 */
function applyPinned(
  ordered: SlugCandidate[],
  pinned: ReadonlyMap<string, string> | undefined,
  bySourceFile: Map<string, string>,
  ownerOfSlug: Map<string, string>,
  conflicts: SlugConflict[],
): void {
  for (const { sourceFile } of ordered) {
    const slug = pinned?.get(sourceFile);
    if (!slug) continue;

    const holder = ownerOfSlug.get(slug);
    if (holder && holder !== sourceFile) {
      conflicts.push({ heldBy: holder, slug, sourceFile });
      continue;
    }

    bySourceFile.set(sourceFile, slug);
    ownerOfSlug.set(slug, sourceFile);
  }
}

export function buildSlugPlan({ candidates, pinned, reserved }: SlugPlanInput): SlugPlan {
  const bySourceFile = new Map<string, string>();
  const ownerOfSlug = new Map<string, string>();
  const conflicts: SlugConflict[] = [];

  for (const slug of reserved ?? []) {
    ownerOfSlug.set(slug, RESERVED_OWNER);
  }

  const ordered = [...candidates].sort((a, b) => a.sourceFile.localeCompare(b.sourceFile));

  applyPinned(ordered, pinned, bySourceFile, ownerOfSlug, conflicts);

  for (const { baseSlug, sourceFile } of ordered) {
    if (bySourceFile.has(sourceFile)) continue;

    const base = baseSlug || sourceFile.replace(/\.html$/, "");

    let attempt = 0;
    let slug = disambiguate(base, sourceFile, attempt);
    while (ownerOfSlug.has(slug)) {
      const holder = ownerOfSlug.get(slug);
      if (holder === RESERVED_OWNER && attempt === 0) {
        conflicts.push({ heldBy: RESERVED_OWNER, slug, sourceFile });
      }
      attempt += 1;
      slug = disambiguate(base, sourceFile, attempt);
    }

    if (slugByteLength(slug) > MAX_SLUG_BYTES) {
      conflicts.push({ heldBy: "<none — slug itself is too long>", reason: "oversized", slug, sourceFile });
      continue;
    }

    bySourceFile.set(sourceFile, slug);
    ownerOfSlug.set(slug, sourceFile);
  }

  return { bySourceFile, conflicts, ownerOfSlug };
}
