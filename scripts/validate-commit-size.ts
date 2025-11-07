#!/usr/bin/env tsx
/**
 * Validate Commit Size - Two-tier limits (400/200 total, 300/150 warning)
 * Exit codes: 0 (pass), 1 (fail)
 */
import { execSync } from "child_process";

const CONFIG = {
  MAX_FILES: 15,
  MAX_TOTAL_LINES: 400,
  WARNING_TOTAL_LINES: 300,
  MAX_LINES_PER_FILE: 200,
  WARNING_LINES_PER_FILE: 150,
} as const;

const EXCLUDE_PATTERNS = [
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",
  "**/*.md",
  "scripts/**/*.ts",
  "scripts/**/*.js",
  "**/*.sh",
  "dist/**",
  "build/**",
  ".next/**",
  ".turbo/**",
  "out/**",
  "*.generated.*",
  "*.gen.*",
  "*.config.*",
  ".serena/memories/**",
  ".kiro/specs/**",
  "*.d.ts",
  "**/__snapshots__/**",
] as const;

interface FileChanges {
  added: number;
  deleted: number;
  total: number;
}

interface FileViolation {
  file: string;
  changes: FileChanges;
}

function isExcluded(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => {
    if (pattern.startsWith("**/")) {
      const suffix = pattern.substring(3);
      if (suffix.startsWith("*.")) {
        return filePath.endsWith(suffix.substring(1));
      }
      return filePath.endsWith(suffix) || filePath.includes(`/${suffix}`);
    }

    const regexPattern = pattern
      .replace(/\\/g, "\\\\")
      .replace(/\./g, "\\.")
      .replace(/\*/g, "[^/]*");

    return new RegExp(`^${regexPattern}$`).test(filePath);
  });
}

function getStagedFiles(): string[] {
  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACMR", {
      encoding: "utf-8",
    });
    return output.trim().split("\n").filter(Boolean);
  } catch {
    console.error("❌ Failed to get staged files");
    process.exit(1);
  }
}

function getFileLineChanges(filePath: string): FileChanges {
  try {
    const [added, deleted] = execSync(`git diff --cached --numstat -- "${filePath}"`, {
      encoding: "utf-8",
    })
      .trim()
      .split("\t");

    const addedLines = parseInt(added, 10) || 0;
    const deletedLines = parseInt(deleted, 10) || 0;
    return { added: addedLines, deleted: deletedLines, total: addedLines + deletedLines };
  } catch {
    return { added: 0, deleted: 0, total: 0 };
  }
}

function reportIssues(
  items: FileViolation[],
  isError: boolean,
  limit: number,
  warningLimit?: number
): void {
  const logger = isError ? console.error : console.warn;
  const icon = isError ? "❌" : "⚠️ ";
  const limitText = isError
    ? `exceed line limit (${limit} lines)`
    : `approaching line limit (${warningLimit}-${limit} lines)`;
  const advice = isError
    ? "Please split large changes into smaller commits."
    : "Consider splitting into smaller files or commits.";

  logger(`${icon} ${items.length} file(s) ${limitText}:\n`);
  items.forEach(({ file, changes }) => {
    logger(`   📄 ${file}`);
    logger(`      +${changes.added} -${changes.deleted} (total: ${changes.total} lines)\n`);
  });
  logger(`   ${advice}\n`);
}

function validateCommitSize(): void {
  console.log("🔍 Validating commit size...\n");
  const stagedFiles = getStagedFiles();
  if (stagedFiles.length === 0) {
    console.log("✅ No staged files to validate");
    process.exit(0);
  }

  const filesToValidate = stagedFiles.filter((file) => {
    const excluded = isExcluded(file);
    if (excluded) console.log(`⏭️  Skipping (excluded): ${file}`);
    return !excluded;
  });
  console.log(`\n📊 Files to validate: ${filesToValidate.length}/${stagedFiles.length}\n`);

  let hasErrors = false;
  let hasWarnings = false;

  if (stagedFiles.length > CONFIG.MAX_FILES) {
    console.error(
      `❌ Too many files in commit: ${stagedFiles.length} (max: ${CONFIG.MAX_FILES})`
    );
    console.error("   Please split your commit into smaller, focused changes.\n");
    hasErrors = true;
  }

  let totalLines = 0;
  const perFileViolations: FileViolation[] = [];
  const perFileWarnings: FileViolation[] = [];

  filesToValidate.forEach((file) => {
    const changes = getFileLineChanges(file);
    totalLines += changes.total;
    if (changes.total > CONFIG.MAX_LINES_PER_FILE) {
      perFileViolations.push({ file, changes });
    } else if (changes.total > CONFIG.WARNING_LINES_PER_FILE) {
      perFileWarnings.push({ file, changes });
    }
  });

  if (totalLines > CONFIG.MAX_TOTAL_LINES) {
    console.error(`❌ Total lines exceed limit: ${totalLines} lines (max: ${CONFIG.MAX_TOTAL_LINES})`);
    console.error("   Please split your commit into smaller changes.\n");
    hasErrors = true;
  } else if (totalLines > CONFIG.WARNING_TOTAL_LINES) {
    console.warn(
      `⚠️  Total lines approaching limit: ${totalLines} lines (warning: ${CONFIG.WARNING_TOTAL_LINES}, max: ${CONFIG.MAX_TOTAL_LINES})`
    );
    console.warn("   Consider splitting into smaller commits.\n");
    hasWarnings = true;
  }

  if (perFileViolations.length > 0) {
    reportIssues(perFileViolations, true, CONFIG.MAX_LINES_PER_FILE);
    hasErrors = true;
  }
  if (perFileWarnings.length > 0 && !hasErrors) {
    reportIssues(perFileWarnings, false, CONFIG.MAX_LINES_PER_FILE, CONFIG.WARNING_LINES_PER_FILE);
    hasWarnings = true;
  }

  if (hasErrors) {
    console.error("💡 Tips: Break into smaller commits, use git add -p\n");
    process.exit(1);
  }
  console.log(hasWarnings ? "✅ Commit size validation passed (with warnings)\n" : "✅ Commit size validation passed!\n");
}

validateCommitSize();
