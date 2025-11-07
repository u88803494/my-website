# Git Workflow Guide: Implementing Pre-commit and Pre-push Checks

---

title: Git Workflow Guide - Pre-commit and Pre-push Checks
type: guide
status: stable
audience: [developer]
tags: [git, workflow, automation, hooks, commitlint]
created: 2025-11-07
updated: 2025-11-07
difficulty: intermediate
estimated_time: 30 minutes
related:

- reference/commitlint-rules.md
- reference/git-hooks.md
- explanation/git-hooks-research.md
- adr/003-git-hooks-optimization.md
  ai_context: |
  Step-by-step guide for implementing git automation checks including pre-commit hooks,
  pre-push validation, commitlint, and commit size validation.

---

## Overview

**What you'll accomplish:**
Set up automated git hooks for code quality checks, commit message validation, and commit size limits in a Turborepo monorepo project.

**Why this matters:**
Automated git hooks catch errors early, enforce code standards, and improve developer experience by providing fast feedback without slowing down the development workflow.

---

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js and pnpm installed
- [ ] Husky installed in your project
- [ ] Turborepo configured with lint and type-check scripts
- [ ] Basic understanding of git hooks

**Assumed knowledge:**

- Git basics (commit, push, staging)
- Package.json script configuration
- TypeScript and ESLint fundamentals

---

## Steps

### Step 1: Install Required Dependencies

Install commitlint and its configuration:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

**Expected outcome**: Dependencies added to `package.json` and `node_modules`.

**Why this step**: Commitlint validates commit messages against Conventional Commits specification.

---

### Step 2: Create Commit Size Validation Script

Create `scripts/validate-commit-size.js`:

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

function isExcluded(filePath) {
  return EXCLUDE_PATTERNS.some((pattern) => {
    if (pattern.startsWith("**/")) {
      const suffix = pattern.substring(3);
      if (suffix.startsWith("*.")) {
        const ext = suffix.substring(1);
        return filePath.endsWith(ext);
      }
      return filePath.endsWith(suffix) || filePath.includes("/" + suffix);
    }
    const regexPattern = pattern.replace(/\./g, "\\.").replace(/\*/g, "[^/]*");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  });
}

try {
  // Get staged files
  const stagedFiles = execSync("git diff --cached --name-only", {
    encoding: "utf-8",
  })
    .split("\n")
    .filter(Boolean)
    .filter((f) => !isExcluded(f));

  // Check file count
  if (stagedFiles.length > MAX_FILES) {
    console.error("");
    console.error(
      `❌ Commit contains too many files: ${stagedFiles.length}/${MAX_FILES}`,
    );
    console.error("");
    console.error("📝 Please split changes into smaller commits");
    console.error("");
    console.error("Modified files:");
    stagedFiles.forEach((file) => console.error(`  - ${file}`));
    console.error("");
    process.exit(1);
  }

  // Check line changes
  const diffStats = execSync("git diff --cached --numstat", {
    encoding: "utf-8",
  })
    .split("\n")
    .filter(Boolean)
    .filter((line) => {
      const filename = line.split("\t")[2];
      return filename && !isExcluded(filename);
    });

  let totalAdded = 0;
  let totalDeleted = 0;

  diffStats.forEach((line) => {
    const [added, deleted] = line.split("\t").map(Number);
    if (!isNaN(added)) totalAdded += added;
    if (!isNaN(deleted)) totalDeleted += deleted;
  });

  const totalChanges = totalAdded + totalDeleted;

  if (totalChanges > MAX_LINES) {
    console.error("");
    console.error(
      `❌ Commit changes too many lines: ${totalChanges}/${MAX_LINES}`,
    );
    console.error(
      `   Added: ${totalAdded} lines, Deleted: ${totalDeleted} lines`,
    );
    console.error("");
    console.error("📝 Please split changes into smaller commits");
    console.error("");
    process.exit(1);
  }

  // Success
  console.log("");
  console.log("✅ Commit size validation passed:");
  console.log(`   Files: ${stagedFiles.length}/${MAX_FILES}`);
  console.log(
    `   Lines: ${totalChanges}/${MAX_LINES} (Added: ${totalAdded}, Deleted: ${totalDeleted})`,
  );
  console.log("");
} catch (error) {
  console.error("");
  console.error("❌ Error validating commit size:", error.message);
  console.error("");
  process.exit(1);
}
```

**Expected outcome**: Script file created in `scripts/` directory.

---

### Step 3: Create Commitlint Configuration

Create `commitlint.config.ts` in project root:

```typescript
import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],

    "scope-enum": [
      2,
      "always",
      [
        "my-website",
        "shared",
        "tsconfig",
        "eslint-config",
        "resume",
        "blog",
        "ai-dictionary",
        "ai-analyzer",
        "time-tracker",
        "about",
        "not-found",
        "deps",
        "config",
        "ci",
        "scripts",
        "docs",
        "all",
      ],
    ],

    "header-max-length": [2, "always", 100],
    "subject-max-length": [2, "always", 72],
    "subject-case": [2, "always", "lower-case"],
    "subject-full-stop": [2, "never", "."],
    "subject-empty": [2, "never"],
    "body-leading-blank": [2, "always"],
    "scope-case": [2, "always", "kebab-case"],
    "scope-empty": [1, "never"],
  },

  helpUrl:
    "https://github.com/u88803494/my-website/blob/main/docs/guides/git-workflow.md",
};

export default Configuration;
```

**Expected outcome**: Commitlint configuration file created.

---

### Step 4: Configure Git Hooks

#### 4.1 Update `.husky/pre-commit`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Lint staged files
pnpm lint-staged

# Validate commit size
node scripts/validate-commit-size.js
```

#### 4.2 Create `.husky/commit-msg`

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

#### 4.3 Create `.husky/pre-push`

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

**Expected outcome**: Three git hook files created and configured.

---

### Step 5: Update lint-staged Configuration

Modify `lint-staged.config.js` to remove TypeScript checking:

```javascript
module.exports = {
  "apps/my-website/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
    // ❌ Removed: tsc --noEmit
  ],
  "packages/**/*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
  ],
  "**/*.{json,css,scss,md,mdx,yaml,yml}": ["prettier --write"],
};
```

**Expected outcome**: lint-staged only runs fast checks (Prettier + ESLint).

---

### Step 6: Set File Permissions

Make all hook files executable:

```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
chmod +x scripts/validate-commit-size.js
```

**Expected outcome**: All scripts have execute permissions.

---

## Verification

**How to verify success:**

1. **Pre-commit speed test**: Modify a file and commit. Should complete in < 5 seconds.
2. **Commitlint validation**: Try invalid commit message. Should be rejected.
3. **Commit size limit**: Try committing 20 files. Should be rejected.
4. **Pre-push validation**: Push with type errors. Should be blocked.

**Verification commands:**

```bash
# Test 1: Pre-commit speed
echo "// test" >> test.ts
git add test.ts
time git commit -m "test: verify speed"
# Expected: < 5 seconds

# Test 2: Invalid commit message
git commit -m "Add feature"
# Expected: ❌ Error

# Test 3: Valid commit message
git commit -m "feat(test): add test file"
# Expected: ✅ Success

# Test 4: Pre-push (with clean code)
git push
# Expected: ✅ Success after checks
```

---

## Troubleshooting

### Issue 1: Pre-commit Hook Not Running

**Symptoms**: Commits succeed without running hooks.

**Cause**: Git hooks not properly initialized or permissions issue.

**Solution**:

```bash
# Reinstall husky
pnpm exec husky install

# Set permissions
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

---

### Issue 2: Commitlint Fails on Valid Message

**Symptoms**: Error "scope must be one of [...]" for valid scope.

**Cause**: Scope not in configured list.

**Solution**:
Add the scope to `commitlint.config.ts`:

```typescript
"scope-enum": [
  2,
  "always",
  [
    // ... existing scopes
    "your-new-scope",
  ],
],
```

---

### Issue 3: Pre-push Too Slow

**Symptoms**: Pre-push takes more than 20 seconds.

**Cause**: No Turborepo cache.

**Solution**:
First push will be slower. Subsequent pushes use cache (~3-5 seconds). For emergency bypass:

```bash
git push --no-verify
```

⚠️ **Warning**: Only use `--no-verify` in emergencies. Monitoring usage should be < 5%.

---

### Issue 4: Lock Files Counted in Commit Size

**Symptoms**: `pnpm-lock.yaml` changes trigger size limit.

**Cause**: File not in exclude patterns.

**Solution**:
Lock files are already excluded. If issue persists, verify `EXCLUDE_PATTERNS` in `scripts/validate-commit-size.js`.

---

## Tips & Best Practices

- 💡 **Tip 1**: Use descriptive scopes matching your project structure (features, packages)
- 💡 **Tip 2**: Run `pnpm run check` locally before committing to catch issues early
- 💡 **Tip 3**: If you need to bypass hooks temporarily, use `--no-verify` sparingly
- 💡 **Tip 4**: Adjust `MAX_FILES` and `MAX_LINES` in validation script based on your team's needs
- ⚠️ **Warning**: Never disable hooks permanently - they're your safety net

---

## Related Documentation

### Concepts

- [Git Hooks Research and Best Practices](../explanation/git-hooks-research.md) - Industry research and rationale

### Reference

- [Commitlint Rules Reference](../reference/commitlint-rules.md) - Complete rule specifications
- [Git Hooks Configuration Reference](../reference/git-hooks.md) - Hook implementation details

### ADR

- [ADR-003: Git Hooks Optimization](../adr/003-git-hooks-optimization.md) - Technical decisions

---

## FAQ

### Q1: Why not do TypeScript check in pre-commit?

**A**: TypeScript must check the entire project (8-15 seconds), which is too slow for pre-commit. 87% of developers expect pre-commit to complete in < 3 seconds. We moved type checking to pre-push instead.

---

### Q2: Can I skip these checks in emergencies?

**A**: Yes, use `--no-verify` flag:

```bash
# Skip pre-commit and commit-msg
git commit --no-verify -m "emergency fix"

# Skip pre-push
git push --no-verify
```

However, this should be rare (< 5% of commits).

---

### Q3: How do I exclude specific files from size validation?

**A**: Add patterns to `EXCLUDE_PATTERNS` in `scripts/validate-commit-size.js`:

```javascript
const EXCLUDE_PATTERNS = [
  // ... existing patterns
  "src/legacy/**", // Exclude directory
  "migration-*.ts", // Exclude pattern
];
```

---

### Q4: What if my commit legitimately needs 20 files?

**A**: Consider whether it can be split logically. If not, adjust `MAX_FILES` in the validation script or use `--no-verify` with justification.

---

## Next Steps

After completing this guide, you might want to:

1. [Understand the research behind these decisions](../explanation/git-hooks-research.md)
2. [Review complete commitlint configuration options](../reference/commitlint-rules.md)
3. [Read the architectural decision record](../adr/003-git-hooks-optimization.md)
4. Set up CI/CD to run the same checks
5. Consider adding conventional changelog generation
