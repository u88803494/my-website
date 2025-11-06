import type { UserConfig } from "@commitlint/types";

/**
 * Commitlint configuration for monorepo
 *
 * Enforces Conventional Commits format with monorepo-specific scopes.
 *
 * Format: <type>(<scope>): <subject>
 * Example: feat(my-website): add new feature
 *
 * ## Scope Guidelines for AI Assistants
 *
 * When modifying features in apps/my-website/src/features/,
 * use the my-website scope with feature name in subject:
 *
 *   feat(my-website): [resume] add new project
 *   fix(my-website): [time-tracker] correct calculation
 *   feat(my-website): [about] update bio
 *
 * Available features: resume, time-tracker, about, not-found
 *
 * @see https://commitlint.js.org/
 * @see https://www.conventionalcommits.org/
 */
const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Enforce specific commit types
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style changes (formatting, etc.)
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Test additions or modifications
        "build", // Build system changes (deps, scripts)
        "ci", // CI/CD changes
        "chore", // Other changes (maintenance, configs)
        "revert", // Revert previous commit
      ],
    ],

    // Define valid scopes for monorepo
    "scope-enum": [
      2,
      "always",
      [
        // Apps
        "my-website",

        // Packages
        "shared",
        "tsconfig",
        "eslint-config",
        "tailwind-config",
        "blog",
        "ai-analyzer",
        "ai-dictionary",

        // Cross-cutting concerns
        "docs",
        "ci",
        "deps",
        "release",
      ],
    ],

    // Subject length: max 72 characters
    "subject-max-length": [2, "always", 72],

    // Subject must not be empty
    "subject-empty": [2, "never"],

    // Subject can use sentence case (allows proper nouns like CodeQL, TypeScript)
    "subject-case": [2, "always", "sentence-case"],

    // Subject must not end with period
    "subject-full-stop": [2, "never", "."],

    // Body line length: max 100 characters
    "body-max-line-length": [2, "always", 100],

    // Footer line length: max 100 characters (for references like "Closes #123")
    "footer-max-line-length": [2, "always", 100],
  },
};

export default config;
