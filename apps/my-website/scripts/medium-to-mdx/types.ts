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
  /** Only counts posts already on disk. A collision is a failure, not a skip. */
  skipped: number;
}

/** Mutable state threaded through a conversion run. */
export interface ConversionState {
  existing: Set<string>;
  /** slug → the source file that produced it, read back from frontmatter. */
  ownerOfExisting: Map<string, string>;
  /** sourceFile → date, so a draft's date survives a re-run. */
  pinnedDates: Map<string, string>;
  stats: ConversionStats;
}

/** State that spans a single article's body walk. */
export interface BodyContext {
  title: string;
  titleHeadingSkipped: boolean;
}
