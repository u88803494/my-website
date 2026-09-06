/**
 * Command-line argument parsing.
 *
 * Extracted from index.ts so it can be unit-tested: index.ts ends with a
 * `require.main === module` guard, which throws under vitest's ESM loader.
 */

import * as path from "path";

import { APP_ROOT, CONFIG } from "./config";
import type { CliOptions } from "./types";

export function parseArgs(argv: string[]): CliOptions {
  const getValue = (flag: string): string | undefined => {
    const index = argv.indexOf(flag);
    return index === -1 ? undefined : argv[index + 1];
  };

  const limitRaw = getValue("--limit");

  return {
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
    input: getValue("--input"),
    limit: limitRaw ? Number.parseInt(limitRaw, 10) : undefined,
    only: getValue("--only"),
    out: getValue("--out") ?? path.join(APP_ROOT, CONFIG.OUTPUT_DIR),
  };
}
