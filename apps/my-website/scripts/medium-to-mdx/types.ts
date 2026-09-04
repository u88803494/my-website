/** A Medium post parsed into everything the MDX output needs. */
export interface ParsedPost {
  body: string;
  date: string;
  description: string;
  draft: boolean;
  mediumUrl: string | undefined;
  slug: string;
  sourceFile: string;
  subtitle: string | undefined;
  thumbnail: string | undefined;
  title: string;
}

export interface CliOptions {
  dryRun: boolean;
  force: boolean;
  input: string | undefined;
  limit: number | undefined;
  only: string | undefined;
  out: string;
}

export interface ConversionStats {
  converted: ParsedPost[];
  failed: { file: string; reason: string }[];
  skipped: number;
}

/** Mutable state threaded through a conversion run. */
export interface ConversionState {
  existing: Set<string>;
  stats: ConversionStats;
  usedSlugs: Set<string>;
}

/** State that spans a single article's body walk. */
export interface BodyContext {
  title: string;
  titleHeadingSkipped: boolean;
}

export type SlugResolution = { kind: "skip" } | { kind: "use"; slug: string };

export interface SlugContext {
  existing: Set<string>;
  force: boolean;
  usedSlugs: Set<string>;
}
