import * as path from "path";

export const CONFIG = {
  CHECKLIST_FILE: "CONVERSION_CHECKLIST.md",
  DEFAULT_TAGS: ["medium"],
  DESCRIPTION_MAX_LENGTH: 120,
  LOCAL_PREVIEW_BASE: "http://localhost:3000/blog",
  OUTPUT_DIR: "content/blog",
  SOURCE_GLOB_ROOT: "medium-source",
} as const;

/** Monorepo root — the checklist and the Medium export live here. */
export const REPO_ROOT = path.resolve(__dirname, "../../../..");

/** apps/my-website — the MDX output lives here. */
export const APP_ROOT = path.resolve(__dirname, "../..");
