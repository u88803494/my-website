# Commitlint Rules Reference

---

title: Commitlint Configuration Rules Reference
type: reference
status: stable
audience: [developer, ai]
tags: [commitlint, git, validation, configuration]
created: 2025-11-07
updated: 2025-11-07
version: 1.0.0
related:

- guides/git-workflow.md
- explanation/git-hooks-research.md
- adr/003-git-hooks-optimization.md
  ai_context: |
  Complete reference documentation for all available commitlint rules and configuration options.

---

## Overview

**What this documents**: Complete specification of commitlint rules, formats, and configuration options for validating commit messages according to Conventional Commits.

**Use cases**:

- Configure commitlint for your project
- Understand validation error messages
- Customize commit message requirements
- Create team-specific commit standards

**Location**: `commitlint.config.ts` or `commitlint.config.js`

---

## Quick Reference

**Most common operations:**

| Operation      | Rule                                      | Description               |
| -------------- | ----------------------------------------- | ------------------------- |
| Require type   | `type-empty: [2, 'never']`                | Type must not be empty    |
| Valid types    | `type-enum: [2, 'always', [...]]`         | Restrict allowed types    |
| Scope format   | `scope-case: [2, 'always', 'kebab-case']` | Enforce scope naming      |
| Subject length | `subject-max-length: [2, 'always', 72]`   | Limit subject length      |
| No period      | `subject-full-stop: [2, 'never', '.']`    | Prevent trailing period   |
| Header length  | `header-max-length: [2, 'always', 100]`   | Total header length limit |

---

## Complete Specification

### Rule Structure

```javascript
'rule-name': [level, applicable, value]
```

**Parameters**:

- **level**: `0` (disabled) | `1` (warning) | `2` (error)
- **applicable**: `'always'` | `'never'`
- **value**: Rule-specific configuration value

**Example**:

```javascript
{
  'type-enum': [2, 'always', ['feat', 'fix']], // Error if type not in list
  'scope-empty': [1, 'never'],                  // Warning if scope empty
  'body-max-length': [0]                        // Disabled
}
```

---

## Type Rules

### type-enum

- **Type**: `Array<string>`
- **Default**: None (must configure)
- **Required**: Recommended
- **Description**: Restrict commit type to specific values

**Example**:

```typescript
{
  'type-enum': [
    2,
    'always',
    [
      'feat',      // New feature
      'fix',       // Bug fix
      'docs',      // Documentation
      'style',     // Formatting
      'refactor',  // Code refactoring
      'perf',      // Performance
      'test',      // Testing
      'build',     // Build system
      'ci',        // CI configuration
      'chore',     // Maintenance
      'revert',    // Revert commit
    ],
  ],
}
```

---

### type-case

- **Type**: `string`
- **Default**: None
- **Required**: No
- **Description**: Enforce type casing format

**Valid values**:

- `lower-case` - All lowercase (recommended)
- `upper-case` - All uppercase
- `camel-case` - camelCase
- `kebab-case` - kebab-case
- `pascal-case` - PascalCase
- `sentence-case` - Sentence case
- `snake-case` - snake_case
- `start-case` - Start Case

**Example**:

```typescript
{
  'type-case': [2, 'always', 'lower-case']
}
```

---

### type-empty

- **Type**: `boolean`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Control whether type can be empty

**Example**:

```typescript
{
  'type-empty': [2, 'never']  // Type must not be empty
}
```

---

### type-max-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Maximum length for type

**Example**:

```typescript
{
  'type-max-length': [2, 'always', 20]
}
```

---

### type-min-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Minimum length for type

**Example**:

```typescript
{
  'type-min-length': [2, 'always', 3]
}
```

---

## Scope Rules

### scope-enum

- **Type**: `Array<string>`
- **Default**: None
- **Required**: Recommended for monorepos
- **Description**: Restrict scope to specific values

**Example**:

```typescript
{
  'scope-enum': [
    2,
    'always',
    [
      // Apps
      'my-website',

      // Packages
      'shared',
      'tsconfig',
      'eslint-config',

      // Features
      'resume',
      'blog',
      'ai-dictionary',

      // Infrastructure
      'deps',
      'config',
      'ci',
      'docs',
    ],
  ],
}
```

---

### scope-case

- **Type**: `string`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Enforce scope casing format

**Valid values**: Same as `type-case`

**Example**:

```typescript
{
  'scope-case': [2, 'always', 'kebab-case']
}
```

---

### scope-empty

- **Type**: `boolean`
- **Default**: None
- **Required**: Optional
- **Description**: Control whether scope can be empty

**Example**:

```typescript
{
  'scope-empty': [1, 'never']  // Warning if scope is empty
}
```

---

### scope-max-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Maximum length for scope

**Example**:

```typescript
{
  'scope-max-length': [2, 'always', 30]
}
```

---

### scope-min-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Minimum length for scope

**Example**:

```typescript
{
  'scope-min-length': [2, 'always', 3]
}
```

---

## Subject Rules

### subject-case

- **Type**: `string | Array<string>`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Enforce subject casing format

**Valid values**: Same as `type-case`

**Example**:

```typescript
{
  'subject-case': [2, 'always', 'lower-case']
}

// Or allow multiple formats
{
  'subject-case': [
    2,
    'always',
    ['lower-case', 'sentence-case']
  ]
}
```

---

### subject-empty

- **Type**: `boolean`
- **Default**: None
- **Required**: Yes
- **Description**: Control whether subject can be empty

**Example**:

```typescript
{
  'subject-empty': [2, 'never']  // Subject must not be empty
}
```

---

### subject-full-stop

- **Type**: `string`
- **Default**: `'.'`
- **Required**: Yes (recommended)
- **Description**: Control trailing punctuation in subject

**Example**:

```typescript
{
  'subject-full-stop': [2, 'never', '.']  // No trailing period
}
```

---

### subject-max-length

- **Type**: `number`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Maximum length for subject

**Example**:

```typescript
{
  'subject-max-length': [2, 'always', 72]  // Git standard
}
```

---

### subject-min-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Minimum length for subject

**Example**:

```typescript
{
  'subject-min-length': [2, 'always', 10]
}
```

---

## Header Rules

### header-case

- **Type**: `string`
- **Default**: None
- **Required**: No
- **Description**: Enforce header casing format

**Valid values**: Same as `type-case`

**Example**:

```typescript
{
  'header-case': [2, 'always', 'lower-case']
}
```

---

### header-full-stop

- **Type**: `string`
- **Default**: `'.'`
- **Required**: No
- **Description**: Control trailing punctuation in header

**Example**:

```typescript
{
  'header-full-stop': [2, 'never', '.']
}
```

---

### header-max-length

- **Type**: `number`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Maximum length for entire header line

**Example**:

```typescript
{
  'header-max-length': [2, 'always', 100]
}
```

---

### header-min-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Minimum length for header

**Example**:

```typescript
{
  'header-min-length': [2, 'always', 10]
}
```

---

### header-trim

- **Type**: `boolean`
- **Default**: None
- **Required**: No
- **Description**: Trim whitespace from header

**Example**:

```typescript
{
  'header-trim': [2, 'always']
}
```

---

## Body Rules

### body-leading-blank

- **Type**: `boolean`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Require blank line before body

**Example**:

```typescript
{
  'body-leading-blank': [2, 'always']
}
```

---

### body-empty

- **Type**: `boolean`
- **Default**: None
- **Required**: No
- **Description**: Control whether body can be empty

**Example**:

```typescript
{
  'body-empty': [1, 'never']  // Warning if body is empty
}
```

---

### body-max-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Maximum total length for body

**Example**:

```typescript
{
  'body-max-length': [2, 'always', 500]
}
```

---

### body-max-line-length

- **Type**: `number`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Maximum length per body line

**Example**:

```typescript
{
  'body-max-line-length': [2, 'always', 100]
}
```

---

### body-min-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Minimum total length for body

**Example**:

```typescript
{
  'body-min-length': [2, 'always', 20]
}
```

---

## Footer Rules

### footer-leading-blank

- **Type**: `boolean`
- **Default**: None
- **Required**: Yes (recommended)
- **Description**: Require blank line before footer

**Example**:

```typescript
{
  'footer-leading-blank': [2, 'always']
}
```

---

### footer-empty

- **Type**: `boolean`
- **Default**: None
- **Required**: No
- **Description**: Control whether footer can be empty

**Example**:

```typescript
{
  'footer-empty': [1, 'never']
}
```

---

### footer-max-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Maximum total length for footer

**Example**:

```typescript
{
  'footer-max-length': [2, 'always', 100]
}
```

---

### footer-max-line-length

- **Type**: `number`
- **Default**: None
- **Required**: No
- **Description**: Maximum length per footer line

**Example**:

```typescript
{
  'footer-max-line-length': [2, 'always', 100]
}
```

---

## Special Rules

### references-empty

- **Type**: `boolean`
- **Default**: None
- **Required**: No
- **Description**: Control issue reference requirement

**Example**:

```typescript
{
  'references-empty': [2, 'never']  // Must reference an issue
}
```

---

### signed-off-by

- **Type**: `string`
- **Default**: `'Signed-off-by:'`
- **Required**: No
- **Description**: Require signed-off-by trailer

**Example**:

```typescript
{
  'signed-off-by': [2, 'always', 'Signed-off-by:']
}
```

---

### trailer-exists

- **Type**: `string`
- **Default**: None
- **Required**: No
- **Description**: Require specific trailer to exist

**Example**:

```typescript
{
  'trailer-exists': [2, 'always', 'Co-authored-by:']
}
```

---

## Complete Configuration Example

```typescript
import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Type rules
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
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // Scope rules
    "scope-enum": [
      2,
      "always",
      [
        "my-website",
        "shared",
        "resume",
        "blog",
        "deps",
        "config",
        "ci",
        "docs",
      ],
    ],
    "scope-case": [2, "always", "kebab-case"],
    "scope-empty": [1, "never"], // Warning

    // Subject rules
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-max-length": [2, "always", 72],

    // Header rules
    "header-max-length": [2, "always", 100],

    // Body rules
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 100],

    // Footer rules (optional)
    "footer-leading-blank": [2, "always"],
  },

  helpUrl:
    "https://github.com/u88803494/my-website/blob/main/docs/guides/git-workflow.md",
};

export default Configuration;
```

---

## Case Format Reference

| Format          | Example                   | Use Case                      |
| --------------- | ------------------------- | ----------------------------- |
| `lower-case`    | `feat`, `my-scope`        | Standard for types and scopes |
| `upper-case`    | `FEAT`, `MY-SCOPE`        | Organizational style          |
| `camel-case`    | `myScope`, `newFeature`   | JavaScript style              |
| `kebab-case`    | `my-scope`, `new-feature` | Recommended for scopes        |
| `pascal-case`   | `MyScope`, `NewFeature`   | Class names                   |
| `sentence-case` | `My scope`, `New feature` | Natural language              |
| `snake-case`    | `my_scope`, `new_feature` | Python style                  |
| `start-case`    | `My Scope`, `New Feature` | Title case                    |

---

## Validation Examples

### Valid Commits

```bash
# Basic
feat(blog): add infinite scroll

# With body
feat(blog): add infinite scroll

Implement infinite scroll pagination for blog posts
to improve user experience and reduce initial load time.

# With footer
fix(api): correct error handling

Fixes #123

# Multiple scopes (if configured)
feat(blog,resume): add shared component
```

---

### Invalid Commits

```bash
# Missing type
(blog): add feature
# Error: type may not be empty

# Invalid type
added(blog): new feature
# Error: type must be one of [feat, fix, ...]

# Invalid scope
feat(unknown): add feature
# Error: scope must be one of [blog, resume, ...]

# Subject too long
feat(blog): add this really long feature description that exceeds the maximum allowed length
# Error: subject must not be longer than 72 characters

# Trailing period
feat(blog): add feature.
# Error: subject may not end with '.'

# No blank line before body
feat(blog): add feature
This is the body without blank line.
# Error: body must have leading blank line
```

---

## Performance Considerations

- 📊 **Validation speed**: < 100ms per commit (negligible)
- 📊 **Memory usage**: < 10MB
- ⚡ **Optimization tip**: Use simple string patterns in `scope-enum` rather than complex regex

---

## Compatibility

**Supported versions**:

- commitlint: >= 17.0.0
- Node.js: >= 16.0.0
- Git: >= 2.0.0

**Known issues**:

- Commitlint v18+ requires TypeScript 4.5+ for `.ts` config files
- Some rules may conflict (e.g., `header-max-length` vs `subject-max-length + scope`)

---

## See Also

### Guides

- [Git Workflow Guide](../guides/git-workflow.md) - Implementation steps

### Explanation

- [Git Hooks Research and Best Practices](../explanation/git-hooks-research.md) - Background and rationale

### Related Reference

- [Git Hooks Configuration Reference](./git-hooks.md) - Hook implementation details

### External Documentation

- [Commitlint Official Documentation](https://commitlint.js.org/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)

---

## Changelog

### Version 1.0.0 (2025-11-05)

- Initial commitlint configuration
- Added monorepo-specific scopes
- Configured recommended rules
- Set subject and header length limits
- Added comprehensive documentation
