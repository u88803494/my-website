#!/usr/bin/env node

/**
 * Validate Commit Size
 *
 * Ensures commits are small and focused by enforcing:
 * - Maximum 15 files per commit
 * - Maximum 500 lines per file (with exclusions)
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
const MAX_LINES_PER_FILE = 500;

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

  // Check total file count
  if (stagedFiles.length > MAX_FILES) {
    console.error(`❌ Too many files in commit: ${stagedFiles.length} (max: ${MAX_FILES})`);
    console.error("   Please split your commit into smaller, focused changes.\n");
    hasErrors = true;
  }

  // Check lines per file
  const violations = [];
  filesToValidate.forEach((file) => {
    const changes = getFileLineChanges(file);
    if (changes.total > MAX_LINES_PER_FILE) {
      violations.push({ file, changes });
    }
  });

  if (violations.length > 0) {
    console.error(`❌ ${violations.length} file(s) exceed line limit (${MAX_LINES_PER_FILE} lines):\n`);
    violations.forEach(({ file, changes }) => {
      console.error(`   📄 ${file}`);
      console.error(`      +${changes.added} -${changes.deleted} (total: ${changes.total} lines)\n`);
    });
    console.error("   Please split large changes into smaller commits.\n");
    hasErrors = true;
  }

  // Exit with appropriate code
  if (hasErrors) {
    console.error("💡 Tips:");
    console.error("   - Break refactoring into multiple commits");
    console.error("   - Separate new features from bug fixes");
    console.error("   - Use git add -p for partial staging\n");
    process.exit(1);
  }

  console.log("✅ Commit size validation passed!\n");
  process.exit(0);
}

// Run validation
validateCommitSize();
