#!/usr/bin/env node

/**
 * Validate Commit Size
 *
 * Ensures commits are small and focused by enforcing:
 * - Maximum 15 files per commit
 * - Maximum 400 total lines across all files (hard limit)
 * - Warning at 300 total lines (soft limit)
 * - Maximum 200 lines per file (hard limit)
 * - Warning at 150 lines per file (soft limit)
 *
 * Excluded files:
 * - Lock files (pnpm-lock.yaml, package-lock.json, etc.)
 * - Documentation files (*.md)
 * - Scripts (scripts/*)
 * - Build outputs (dist/, build/, .next/, etc.)
 * - Generated files (*.generated.*, *.gen.*)
 * - Config files (*.config.ts, *.config.js)
 * - AI-generated content (.serena/memories/, .kiro/specs/)
 *
 * Exit codes:
 * - 0: Validation passed
 * - 1: Validation failed
 *
 * Usage:
 *   node scripts/validate-commit-size.js
 */

const { execSync } = require("child_process");
const path = require("path");

// Configuration
const MAX_FILES = 15;
const MAX_TOTAL_LINES = 400;
const WARNING_TOTAL_LINES = 300;
const MAX_LINES_PER_FILE = 200;
const WARNING_LINES_PER_FILE = 150;

// File patterns to exclude from validation
const EXCLUDE_PATTERNS = [
  // Lock files (auto-generated, thousands of lines)
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",

  // Documentation files (naturally long, not frequently modified)
  "**/*.md",

  // Scripts (single-purpose, longer acceptable)
  "scripts/**/*.ts",
  "scripts/**/*.js",
  "**/*.sh",

  // Build outputs (should not be committed)
  "dist/**",
  "build/**",
  ".next/**",
  ".turbo/**",
  "out/**",

  // Generated files
  "*.generated.*",
  "*.gen.*",

  // Config files (can be long)
  "*.config.ts",
  "*.config.js",
  "*.config.mjs",
  "*.config.cjs",

  // AI-generated content
  ".serena/memories/**",
  ".kiro/specs/**",

  // Type declarations
  "*.d.ts",

  // Test snapshots
  "**/__snapshots__/**",
];

/**
 * Check if a file matches any exclusion pattern
 */
function isExcluded(filePath) {
  return EXCLUDE_PATTERNS.some((pattern) => {
    // Special handling for **/* patterns (any depth, any file)
    if (pattern.startsWith("**/")) {
      const suffix = pattern.substring(3); // Remove **/

      // Handle **/*.ext pattern (any .ext file at any depth)
      if (suffix.startsWith("*.")) {
        const ext = suffix.substring(1); // Get extension including dot (.md)
        return filePath.endsWith(ext);
      }

      // Handle **/<path> pattern (specific path at any depth)
      return filePath.endsWith(suffix) || filePath.includes("/" + suffix);
    }

    // Handle other patterns (exact match, no ** prefix)
    const regexPattern = pattern
      .replace(/\\/g, "\\\\") // Escape backslashes first (security fix)
      .replace(/\./g, "\\.") // Escape dots
      .replace(/\*/g, "[^/]*"); // * matches any characters except /

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  });
}

/**
 * Get list of staged files
 */
function getStagedFiles() {
  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACMR", {
      encoding: "utf-8",
    });
    return output
      .trim()
      .split("\n")
      .filter((file) => file.length > 0);
  } catch (error) {
    console.error("❌ Failed to get staged files:", error.message);
    process.exit(1);
  }
}

/**
 * Count lines added/deleted in a staged file
 */
function getFileLineChanges(filePath) {
  try {
    const output = execSync(`git diff --cached --numstat -- "${filePath}"`, {
      encoding: "utf-8",
    });

    const [added, deleted] = output.trim().split("\t");
    return {
      added: parseInt(added, 10) || 0,
      deleted: parseInt(deleted, 10) || 0,
      total: (parseInt(added, 10) || 0) + (parseInt(deleted, 10) || 0),
    };
  } catch (error) {
    console.error(`❌ Failed to get line changes for ${filePath}:`, error.message);
    return { added: 0, deleted: 0, total: 0 };
  }
}

/**
 * Main validation function
 */
function validateCommitSize() {
  console.log("🔍 Validating commit size...\n");

  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log("✅ No staged files to validate");
    process.exit(0);
  }

  // Filter out excluded files
  const filesToValidate = stagedFiles.filter((file) => {
    const excluded = isExcluded(file);
    if (excluded) {
      console.log(`⏭️  Skipping (excluded): ${file}`);
    }
    return !excluded;
  });

  console.log(`\n📊 Files to validate: ${filesToValidate.length}/${stagedFiles.length}\n`);

  let hasErrors = false;
  let hasWarnings = false;

  // Check total file count
  if (stagedFiles.length > MAX_FILES) {
    console.error(`❌ Too many files in commit: ${stagedFiles.length} (max: ${MAX_FILES})`);
    console.error("   Please split your commit into smaller, focused changes.\n");
    hasErrors = true;
  }

  // Calculate total lines and classify violations
  let totalLines = 0;
  const perFileViolations = [];
  const perFileWarnings = [];

  filesToValidate.forEach((file) => {
    const changes = getFileLineChanges(file);
    totalLines += changes.total;

    if (changes.total > MAX_LINES_PER_FILE) {
      perFileViolations.push({ file, changes });
    } else if (changes.total > WARNING_LINES_PER_FILE) {
      perFileWarnings.push({ file, changes });
    }
  });

  // Check total lines (hard limit)
  if (totalLines > MAX_TOTAL_LINES) {
    console.error(`❌ Total lines exceed limit: ${totalLines} lines (max: ${MAX_TOTAL_LINES})`);
    console.error("   Please split your commit into smaller changes.\n");
    hasErrors = true;
  } else if (totalLines > WARNING_TOTAL_LINES) {
    console.warn(`⚠️  Total lines approaching limit: ${totalLines} lines (warning: ${WARNING_TOTAL_LINES}, max: ${MAX_TOTAL_LINES})`);
    console.warn("   Consider splitting into smaller commits.\n");
    hasWarnings = true;
  }

  // Report per-file violations (hard limit)
  if (perFileViolations.length > 0) {
    console.error(`❌ ${perFileViolations.length} file(s) exceed line limit (${MAX_LINES_PER_FILE} lines):\n`);
    perFileViolations.forEach(({ file, changes }) => {
      console.error(`   📄 ${file}`);
      console.error(`      +${changes.added} -${changes.deleted} (total: ${changes.total} lines)\n`);
    });
    console.error("   Please split large changes into smaller commits.\n");
    hasErrors = true;
  }

  // Report per-file warnings (soft limit)
  if (perFileWarnings.length > 0 && !hasErrors) {
    console.warn(`⚠️  ${perFileWarnings.length} file(s) approaching line limit (${WARNING_LINES_PER_FILE}-${MAX_LINES_PER_FILE} lines):\n`);
    perFileWarnings.forEach(({ file, changes }) => {
      console.warn(`   📄 ${file}`);
      console.warn(`      +${changes.added} -${changes.deleted} (total: ${changes.total} lines)\n`);
    });
    console.warn("   Consider splitting into smaller files or commits.\n");
    hasWarnings = true;
  }

  // Exit with appropriate code
  if (hasErrors) {
    console.error("💡 Tips:");
    console.error("   - Break refactoring into multiple commits");
    console.error("   - Separate new features from bug fixes");
    console.error("   - Use git add -p for partial staging\n");
    process.exit(1);
  }

  if (hasWarnings) {
    console.log("✅ Commit size validation passed (with warnings)\n");
  } else {
    console.log("✅ Commit size validation passed!\n");
  }

  process.exit(0);
}

// Run validation
validateCommitSize();
