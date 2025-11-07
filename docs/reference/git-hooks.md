# Git Hooks Configuration Reference

---

title: Git Hooks Configuration and Implementation Reference
type: reference
status: stable
audience: [developer, ai]
tags: [git, hooks, husky, lint-staged, automation]
created: 2025-11-07
updated: 2025-11-07
version: 1.0.0
related:

- guides/git-workflow.md
- reference/commitlint-rules.md
- explanation/git-hooks-research.md
- adr/003-git-hooks-optimization.md
  ai_context: |
  Complete reference for git hooks configuration including pre-commit, commit-msg,
  and pre-push hooks with Husky integration and commit size validation.

---

## Overview

**What this documents**: Complete specification of git hooks configuration, including pre-commit, commit-msg, and pre-push hooks using Husky, lint-staged, and custom validation scripts.

**Use cases**:

- Configure automated code quality checks
- Set up commit message validation
- Implement commit size limits
- Troubleshoot git hook issues

**Location**: `.husky/` directory in project root

---

## Quick Reference

**Most common operations:**

| Operation        | File                              | Command                                |
| ---------------- | --------------------------------- | -------------------------------------- |
| Fast format/lint | `.husky/pre-commit`               | `pnpm lint-staged`                     |
| Validate message | `.husky/commit-msg`               | `npx commitlint --edit $1`             |
| Full type check  | `.husky/pre-push`                 | `pnpm run check-types`                 |
| Validate size    | `scripts/validate-commit-size.js` | `node scripts/validate-commit-size.js` |
| Skip hooks       | CLI                               | `git commit --no-verify`               |

---

## Complete Specification

### Pre-commit Hook

**Location**: `.husky/pre-commit`

**Purpose**: Fast validation on staged files before commit

**Execution time**: ~1-5 seconds

**Configuration**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Lint staged files
pnpm lint-staged

# Validate commit size
node scripts/validate-commit-size.js
```

**Execution Flow**:

```
1. git commit triggered
2. Run lint-staged (Prettier + ESLint on staged files)
3. Run commit size validation
4. If all pass → proceed to commit-msg hook
5. If any fail → abort commit
```

**Exit codes**:

- `0` - Success, continue to commit-msg hook
- `1` - Failure, abort commit

---

### Commit-msg Hook

**Location**: `.husky/commit-msg`

**Purpose**: Validate commit message format

**Execution time**: ~0.1 seconds

**Configuration**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

**Parameters**:

- `$1` - Path to commit message file (`.git/COMMIT_EDITMSG`)

**Execution Flow**:

```
1. Pre-commit hook passed
2. Read commit message from $1
3. Validate against commitlint rules
4. If pass → create commit
5. If fail → abort commit
```

**Exit codes**:

- `0` - Valid commit message
- `1` - Invalid commit message

---

### Pre-push Hook

**Location**: `.husky/pre-push`

**Purpose**: Comprehensive validation before push

**Execution time**: ~10-20 seconds (first run), ~2-5 seconds (cached)

**Configuration**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running comprehensive checks before push..."
echo ""

# TypeScript type checking
echo "📘 Type checking..."
pnpm run check-types || { echo "\n❌ Type check failed. Please fix errors before pushing."; exit 1; }

# ESLint full check
echo ""
echo "🔧 Linting..."
pnpm run lint || { echo "\n❌ Linting failed. Please fix errors before pushing."; exit 1; }

echo ""
echo "✅ All pre-push checks passed!"
```

**Commands executed**:

1. `pnpm run check-types` - TypeScript full project check
2. `pnpm run lint` - ESLint full project check with `--max-warnings=0`

**Execution Flow**:

```
1. git push triggered
2. Run TypeScript type check on entire project
3. If fail → abort push with error message
4. Run ESLint on entire project
5. If fail → abort push with error message
6. If all pass → proceed with push
```

**Exit codes**:

- `0` - All checks passed
- `1` - Type check failed or linting failed

---

## lint-staged Configuration

**Location**: `lint-staged.config.js`

**Purpose**: Run formatters and linters only on staged files

**Configuration**:

```javascript
module.exports = {
  "apps/my-website/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
  ],
  "packages/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
  ],
  "**/*.{json,css,scss,md,mdx,yaml,yml}": ["prettier --write"],
};
```

**File Patterns**:

| Pattern                                | Files Matched                 | Commands          |
| -------------------------------------- | ----------------------------- | ----------------- |
| `apps/my-website/**/*.{js,jsx,ts,tsx}` | App JavaScript/TypeScript     | Prettier + ESLint |
| `packages/**/*.{js,jsx,ts,tsx}`        | Package JavaScript/TypeScript | Prettier + ESLint |
| `**/*.{json,css,scss,md,mdx,yaml,yml}` | All config/style/docs         | Prettier only     |

**Command Sequence**:

1. `prettier --write` - Format code
2. `eslint --fix --max-warnings=0` - Lint and auto-fix

**Important Notes**:

- Commands run sequentially on each file
- Files are auto-staged after modification
- Process aborts on first error
- TypeScript checking NOT included (moved to pre-push)

---

## Commit Size Validation Script

**Location**: `scripts/validate-commit-size.js`

**Purpose**: Prevent excessively large commits

**Configuration**:

```javascript
#!/usr/bin/env node

const { execSync } = require("child_process");

// Configuration
const MAX_FILES = 15;
const MAX_LINES = 500;

// Exclude patterns
const EXCLUDE_PATTERNS = [
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lockb",
  "**/*.md",
  "scripts/**/*.ts",
  "scripts/**/*.js",
  "dist/**",
  "build/**",
  ".next/**",
  "*.generated.*",
  "*.config.ts",
  "*.config.js",
  ".serena/memories/**",
  "*.d.ts",
  "**/__snapshots__/**",
];
```

**Parameters**:

| Parameter          | Type       | Default    | Description                  |
| ------------------ | ---------- | ---------- | ---------------------------- |
| `MAX_FILES`        | `number`   | 15         | Maximum staged files allowed |
| `MAX_LINES`        | `number`   | 500        | Maximum total line changes   |
| `EXCLUDE_PATTERNS` | `string[]` | See config | Files to ignore              |

**Validation Logic**:

```javascript
function isExcluded(filePath) {
  return EXCLUDE_PATTERNS.some((pattern) => {
    // Handle **/ prefix (any depth)
    if (pattern.startsWith("**/")) {
      const suffix = pattern.substring(3);

      // Handle **/*.ext pattern
      if (suffix.startsWith("*.")) {
        const ext = suffix.substring(1);
        return filePath.endsWith(ext);
      }

      // Handle **/<path> pattern
      return filePath.endsWith(suffix) || filePath.includes("/" + suffix);
    }

    // Handle other patterns
    const regexPattern = pattern
      .replace(/\./g, "\\.") // Escape dots
      .replace(/\*/g, "[^/]*"); // * matches any chars except /

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  });
}
```

**Git Commands Used**:

```bash
# Get staged files
git diff --cached --name-only

# Get diff statistics
git diff --cached --numstat
```

**Output Format**:

**Success**:

```
✅ Commit size validation passed:
   Files: 8/15
   Lines: 250/500 (Added: 200, Deleted: 50)
```

**Failure (too many files)**:

```
❌ Commit contains too many files: 20/15

📝 Please split changes into smaller commits

Modified files:
  - src/feature1.tsx
  - src/feature2.tsx
  ...
```

**Failure (too many lines)**:

```
❌ Commit changes too many lines: 650/500
   Added: 450 lines, Deleted: 200 lines

📝 Please split changes into smaller commits
```

**Exit codes**:

- `0` - Validation passed
- `1` - Validation failed or error occurred

---

## Exclude Patterns Reference

### Lock Files

```javascript
'pnpm-lock.yaml',
'package-lock.json',
'yarn.lock',
'bun.lockb',
```

**Reason**: Auto-generated, often 9000+ lines

---

### Documentation

```javascript
'**/*.md',
```

**Reason**: Documentation files can be long without complexity issues

---

### Scripts

```javascript
'scripts/**/*.ts',
'scripts/**/*.js',
```

**Reason**: Single-purpose scripts may legitimately be longer

---

### Build Outputs

```javascript
'dist/**',
'build/**',
'.next/**',
'.turbo/**',
'out/**',
```

**Reason**: Should not be committed, but pattern prevents accidents

---

### Generated Files

```javascript
'*.generated.*',
'*.gen.*',
```

**Reason**: Auto-generated code

---

### Configuration Files

```javascript
'*.config.ts',
'*.config.js',
'*.config.mjs',
'*.config.cjs',
```

**Reason**: Config files can be comprehensive

---

### AI/Tool Outputs

```javascript
'.serena/memories/**',
'.kiro/specs/**',
```

**Reason**: Tool-generated content

---

### Type Declarations

```javascript
'*.d.ts',
```

**Reason**: Type definition files can be extensive

---

### Test Snapshots

```javascript
'**/__snapshots__/**',
```

**Reason**: Test snapshots can be large

---

## Hook Bypass

### Bypass Pre-commit and Commit-msg

```bash
git commit --no-verify -m "commit message"
# or
git commit -n -m "commit message"
```

**Skips**:

- lint-staged (Prettier + ESLint)
- Commit size validation
- Commitlint message validation

---

### Bypass Pre-push

```bash
git push --no-verify
# or
git push -n
```

**Skips**:

- TypeScript type checking
- ESLint full project check

---

### Usage Guidelines

**When to use `--no-verify`**:

- ✅ Emergency production fixes
- ✅ Temporary commits on feature branch (plan to rebase)
- ✅ Known false positives from tools

**When NOT to use**:

- ❌ Regular development workflow
- ❌ Commits going directly to main/master
- ❌ To avoid fixing legitimate issues

**Monitoring**:

- Track bypass usage (should be < 5% of commits)
- Review bypassed commits in PR reviews
- Address patterns requiring frequent bypasses

---

## Troubleshooting Reference

### Hook Not Executing

**Symptoms**: Commits succeed without running hooks

**Possible causes**:

1. Hooks not executable
2. Husky not installed
3. `.git/hooks` not pointing to `.husky`

**Solutions**:

```bash
# Reinstall Husky
pnpm exec husky install

# Set executable permissions
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push

# Verify hook files exist
ls -la .husky/
```

---

### Pre-commit Too Slow

**Symptoms**: Pre-commit takes > 5 seconds

**Possible causes**:

1. Too many staged files
2. Large file sizes
3. Slow ESLint rules

**Solutions**:

```bash
# Check staged files
git diff --cached --name-only | wc -l

# Stage fewer files at once
git add file1.ts file2.ts
git commit -m "..."

# Consider splitting into multiple commits
```

---

### Pre-push Always Fails

**Symptoms**: Type check or lint fails even after fixes

**Possible causes**:

1. Errors in unstaged files
2. Turborepo cache corruption
3. Dependencies out of sync

**Solutions**:

```bash
# Clear Turborepo cache
rm -rf .turbo

# Reinstall dependencies
pnpm install

# Run checks manually
pnpm run check-types
pnpm run lint

# Check for unstaged changes
git status
```

---

### Commit Size Validation False Positive

**Symptoms**: Legitimate commits rejected

**Possible causes**:

1. File should be excluded
2. Limits too strict for project
3. Pattern matching issue

**Solutions**:

```javascript
// Add to EXCLUDE_PATTERNS in scripts/validate-commit-size.js
const EXCLUDE_PATTERNS = [
  // ... existing patterns
  "src/specific-file.ts", // Exclude specific file
  "migrations/**", // Exclude directory
];

// Or adjust limits
const MAX_FILES = 20; // Increase from 15
const MAX_LINES = 800; // Increase from 500
```

---

## Performance Metrics

### Pre-commit Hook

| Operation           | Time      | Cache   |
| ------------------- | --------- | ------- |
| Prettier (1 file)   | ~0.1s     | No      |
| ESLint (1 file)     | ~0.3s     | Yes     |
| Commit size check   | ~0.1s     | No      |
| **Total (typical)** | **~1-3s** | Partial |

---

### Commit-msg Hook

| Operation             | Time  | Cache |
| --------------------- | ----- | ----- |
| Commitlint validation | ~0.1s | No    |

---

### Pre-push Hook

| Operation                 | Time        | Cache |
| ------------------------- | ----------- | ----- |
| TypeScript check (first)  | ~10-15s     | No    |
| TypeScript check (cached) | ~2-3s       | Yes   |
| ESLint (first)            | ~5-8s       | No    |
| ESLint (cached)           | ~1-2s       | Yes   |
| **Total (first)**         | **~15-23s** | No    |
| **Total (cached)**        | **~3-5s**   | Yes   |

---

## Compatibility

**Supported versions**:

- Git: >= 2.0.0
- Node.js: >= 16.0.0
- Husky: >= 8.0.0
- lint-staged: >= 13.0.0

**Known issues**:

- Git worktrees may require separate Husky setup
- Windows requires Git Bash or WSL for shell scripts
- Some CI environments need explicit Husky installation

---

## See Also

### Guides

- [Git Workflow Implementation Guide](../guides/git-workflow.md) - Step-by-step setup

### Reference

- [Commitlint Rules Reference](./commitlint-rules.md) - Complete commitlint configuration

### Explanation

- [Git Hooks Research and Best Practices](../explanation/git-hooks-research.md) - Why these decisions

### ADR

- [ADR-003: Git Hooks Optimization](../adr/003-git-hooks-optimization.md) - Technical decisions

### External Documentation

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/lint-staged/lint-staged)
- [Git Hooks Documentation](https://git-scm.com/docs/githooks)

---

## Changelog

### Version 1.0.0 (2025-11-05)

- Initial git hooks configuration
- Implemented pre-commit with lint-staged
- Added commit-msg with commitlint
- Created pre-push with full validation
- Implemented commit size validation script
- Added comprehensive exclude patterns
- Fixed pre-push exit code checking
- Fixed markdown exclusion pattern matching
