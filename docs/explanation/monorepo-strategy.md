---
title: Monorepo Strategy with Turborepo
type: explanation
status: stable
audience: [developer, architect]
tags: [monorepo, turborepo, architecture, tooling]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/architecture.md
  - explanation/feature-based-architecture.md
  - guides/development-setup.md
ai_context: |
  Explains why this project uses a monorepo architecture with Turborepo,
  its benefits, trade-offs, and how it scales with project growth.
---

# Monorepo Strategy with Turborepo

## Overview

This project uses a **monorepo** (single repository containing multiple packages) managed by **Turborepo** and **pnpm workspaces**.

**Key principle**: One repository, multiple packages, shared tooling.

---

## Why Monorepo?

### Traditional Multi-Repo Problems

In a multi-repo setup, code is split across repositories:

```
my-website-app/           # Main application
my-website-shared/        # Shared utilities
my-website-tsconfig/      # TypeScript configs
```

**Problems:**

1. **Version synchronization** - Ensure all repos use compatible versions
2. **Cross-repo changes** - Need multiple PRs for single feature
3. **Tooling duplication** - ESLint/Prettier configs repeated everywhere
4. **Dependency management** - Complex inter-repo dependency tracking
5. **CI/CD complexity** - Multiple pipelines to maintain
6. **Developer experience** - Clone/install/setup multiple repos

---

## Monorepo Solution

All code in one repository:

```
my-website/
├── apps/
│   └── my-website/           # Main Next.js app
├── packages/
│   ├── shared/               # Shared utilities/types
│   ├── tsconfig/             # Shared TypeScript configs
│   ├── eslint-config/        # Shared ESLint configs
│   └── tailwind-config/      # Shared Tailwind configs
└── pnpm-workspace.yaml       # Workspace configuration
```

**Benefits:**

1. ✅ **Atomic changes** - One PR for cross-package changes
2. ✅ **Shared tooling** - One ESLint/Prettier config for all
3. ✅ **Single dependency tree** - pnpm manages everything
4. ✅ **Fast CI/CD** - Turborepo caches and parallelizes
5. ✅ **Developer experience** - Clone once, run everywhere

---

## Architecture

### Workspace Structure

```
root/
├── apps/                     # Applications (deployable)
│   └── my-website/           # Main Next.js 15 application
│       ├── src/
│       ├── package.json      # App-specific dependencies
│       └── tsconfig.json     # Extends @packages/tsconfig
├── packages/                 # Shared packages (libraries)
│   ├── shared/               # Utilities, types, constants
│   │   ├── src/
│   │   └── package.json
│   ├── tsconfig/             # Shared TS configs
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   └── package.json
│   ├── eslint-config/        # Shared ESLint configs
│   └── tailwind-config/      # Shared Tailwind configs
├── pnpm-workspace.yaml       # Defines workspace packages
├── turbo.json                # Turborepo pipeline configuration
└── package.json              # Root package.json (workspace commands)
```

### Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*" # All apps
  - "packages/*" # All packages
```

**Result**: pnpm treats each directory as a workspace.

---

## Turborepo Benefits

### 1. Smart Caching

**Without Turborepo:**

```bash
pnpm run build    # Builds everything, every time (slow!)
```

**With Turborepo:**

```bash
pnpm run build    # First run: builds all
pnpm run build    # Second run: cache hit, instant! ⚡
```

**How it works:**

- Turborepo hashes inputs (source files, dependencies, env vars)
- If hash matches previous run, uses cached output
- If hash changes, rebuilds only affected packages

### 2. Parallel Execution

**Without Turborepo:**

```bash
# Sequential execution
cd packages/shared && pnpm build
cd apps/my-website && pnpm build
# Total: 5 minutes
```

**With Turborepo:**

```bash
# Parallel execution
turbo run build
# Runs shared + my-website in parallel
# Total: 2 minutes ⚡
```

### 3. Incremental Builds

**Changed a single package?** Turborepo rebuilds only that package and its dependents.

```bash
# Changed packages/shared
turbo run build
# Rebuilds:
#  - packages/shared (changed)
#  - apps/my-website (depends on shared)
# Skips: Other packages (not affected)
```

---

## Dependency Management

### Internal Dependencies

Packages can depend on each other:

```json
// apps/my-website/package.json
{
  "dependencies": {
    "@packages/shared": "workspace:*"
  }
}
```

**`workspace:*`** = "Use the version in this workspace".

**Benefits:**

- No need to publish to npm
- Changes immediately available
- Type-safe across packages

### External Dependencies

```json
// apps/my-website/package.json
{
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0"
  }
}
```

**pnpm** deduplicates dependencies across workspaces.

**Result**: If two packages use `react@19.0.0`, only one copy is installed.

---

## Turborepo Pipeline

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "check-types": {
      "dependsOn": ["^build"]
    },
    "lint": {
      "cache": true
    }
  }
}
```

**Pipeline rules:**

- **`build`**: Depends on dependencies' `build` (`^build`)
- **`check-types`**: Depends on dependencies' `build`
- **`lint`**: Cacheable (no dependencies)

**Result**: Turborepo knows execution order and can parallelize safely.

---

## Development Workflow

### Installing Dependencies

```bash
# Install all workspaces
pnpm install

# Add dependency to specific workspace
pnpm --filter my-website add next
pnpm --filter @packages/shared add date-fns

# Add dev dependency to root
pnpm add -D -w turbo
```

### Running Commands

```bash
# Run across all workspaces (Turborepo)
pnpm dev          # Starts all dev servers
pnpm build        # Builds all packages
pnpm check-types  # Type checks all packages

# Run in specific workspace
pnpm --filter my-website dev
pnpm --filter @packages/shared build

# Run in all packages matching pattern
pnpm --filter "@packages/*" build
```

### Adding New Package

```bash
# Create package directory
mkdir -p packages/new-package/src

# Create package.json
cat > packages/new-package/package.json << EOF
{
  "name": "@packages/new-package",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
EOF

# pnpm automatically detects it
pnpm install
```

---

## Shared Configurations

### TypeScript Configs

```
packages/tsconfig/
├── base.json          # Shared base config
├── nextjs.json        # Next.js-specific config
└── package.json
```

**Usage in apps:**

```json
// apps/my-website/tsconfig.json
{
  "extends": "@packages/tsconfig/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Benefits:**

- Single source of truth for TS settings
- Update once, applies everywhere
- Type consistency across packages

### ESLint Configs

```
packages/eslint-config/
├── next.js            # Next.js-specific rules
├── base.js            # Shared base rules
└── package.json
```

**Usage:**

```js
// apps/my-website/.eslintrc.js
module.exports = {
  extends: ["@packages/eslint-config/next"],
};
```

---

## Alternatives Considered

### 1. Nx

**Pros:**

- More features (affected commands, graph visualization)
- Better for large enterprises
- Plugin ecosystem

**Cons:**

- More complex configuration
- Steeper learning curve
- Heavier tooling

**Why not chosen**: Turborepo simpler for small/medium projects.

### 2. Lerna

**Pros:**

- Mature, widely adopted
- Good for publishing to npm

**Cons:**

- Slower than Turborepo (no caching)
- Less active development
- No smart task scheduling

**Why not chosen**: Turborepo faster and more modern.

### 3. Yarn Workspaces (alone)

**Pros:**

- Simple, built into Yarn
- Good dependency management

**Cons:**

- No task orchestration (no Turborepo features)
- No caching
- Manual parallelization

**Why not chosen**: Need Turborepo's speed and caching.

### 4. Multi-Repo (Polyrepo)

**Pros:**

- Independent versioning
- Clear boundaries
- Isolated CI/CD

**Cons:**

- Version synchronization hell
- Cross-repo changes painful
- Tooling duplication

**Why not chosen**: Monorepo DX is superior for this project size.

---

## Trade-offs

### What We Gain

- ✅ **Atomic changes** - Single PR for cross-package features
- ✅ **Shared tooling** - One config to rule them all
- ✅ **Fast builds** - Turborepo caching saves hours
- ✅ **Type safety** - TypeScript across workspace boundaries

### What We Accept

- ⚠️ **Larger repo** - More files in one place
- ⚠️ **Build complexity** - More moving parts
- ⚠️ **Merge conflicts** - More developers in same repo (mitigated by feature-based arch)

---

## Scaling Strategy

### Current State (Small Project)

```
apps/
└── my-website/       # Single app

packages/
├── shared/           # Utilities
├── tsconfig/         # Configs
├── eslint-config/    # Configs
└── tailwind-config/  # Configs
```

**3-5 packages, 1 app, manageable size.**

### Future Growth (Medium Project)

```
apps/
├── my-website/       # Main site
└── admin-panel/      # Admin interface

packages/
├── ui/               # Shared UI components
├── api-client/       # API client library
├── shared/           # Utilities
└── configs/          # Shared configs
```

**5-10 packages, 2-3 apps, Turborepo shines.**

### Enterprise Scale (Large Project)

```
apps/
├── web/              # Main website
├── mobile/           # Mobile app (React Native)
├── admin/            # Admin panel
└── api/              # Backend API

packages/
├── ui/               # Component library
├── models/           # Data models
├── api-client/       # API client
├── utils/            # Utilities
└── configs/          # Shared configs
```

**10+ packages, 5+ apps, may need Nx.**

---

## Best Practices

### ✅ Do

1. **Use workspace protocol** - `workspace:*` for internal deps
2. **Share configs** - One ESLint/TS config per project
3. **Cache aggressively** - Let Turborepo cache everything
4. **Document dependencies** - Update turbo.json when adding deps

### ❌ Don't

1. **Don't nest workspaces** - Keep flat structure
2. **Don't skip turbo.json** - Configure pipelines properly
3. **Don't ignore cache** - Use cache for speed
4. **Don't duplicate configs** - Extract to packages/

---

## CI/CD Integration

### Vercel Deployment

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "outputs": [".next/**"],
      "cache": true
    }
  }
}
```

**Vercel automatically**:

- Detects Turborepo
- Uses remote caching
- Builds only changed apps

### GitHub Actions

```yaml
# .github/workflows/ci.yml
- name: Install dependencies
  run: pnpm install

- name: Build
  run: pnpm build # Uses Turborepo caching

- name: Test
  run: pnpm test
```

**Turborepo caches** speed up CI dramatically.

---

## Related Documentation

- [Architecture Reference](../reference/architecture.md) - Complete system architecture
- [Feature-Based Architecture](./feature-based-architecture.md) - Code organization
- [Development Setup](../guides/development-setup.md) - Local setup

---

## Further Reading

- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo.tools](https://monorepo.tools/)
- [Why Monorepos](https://monorepo.tools/#why-a-monorepo)
