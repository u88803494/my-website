---
title: "Tutorial 01: Project Setup - From Zero to Hello World"
type: tutorial
status: stable
audience: [developer]
tags: [tutorial, setup, getting-started, monorepo, nextjs]
created: 2025-11-07
updated: 2025-11-07
difficulty: beginner
estimated_time: 45 minutes
prerequisites:
  - Basic knowledge of JavaScript/TypeScript
  - Familiarity with command line
  - Git installed on your machine
related:
  - guides/development-setup.md
  - reference/architecture.md
  - tutorials/02-adding-new-feature.md
ai_context: |
  Learning-oriented tutorial that guides developers from zero to a working
  development environment with their first code change committed.
---

# Tutorial 01: Project Setup

Welcome! In this tutorial, you'll set up the my-website monorepo from scratch and make your first contribution. By the end, you'll have a working development environment and understand the basic workflow.

## 🎯 What You'll Learn

- Clone and install the my-website monorepo
- Understand the project structure
- Start the development server
- Make your first code change
- Commit using the project's conventions
- Navigate the documentation system

## ⏱️ Time Estimate

**45 minutes** (including installations)

## 📚 Prerequisites

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **Basic terminal/command line** knowledge
- **Git** installed ([Download](https://git-scm.com/))
- **Text editor** (VS Code recommended)

---

## Step 1: Install pnpm (5 minutes)

This project uses **pnpm** as the package manager. Let's install it:

```bash
npm install -g pnpm
```

**Verify installation:**

```bash
pnpm --version
# Should show: 8.x.x or higher
```

**Why pnpm?**

- **Faster** than npm/yarn
- **Disk efficient** (uses hard links)
- **Strict** dependency management (prevents phantom dependencies)

✅ **Checkpoint**: `pnpm --version` shows a version number.

---

## Step 2: Clone the Repository (2 minutes)

```bash
# Navigate to your projects folder
cd ~/projects  # Or wherever you keep your code

# Clone the repository
git clone https://github.com/u88803494/my-website.git

# Enter the project directory
cd my-website
```

**Explore the structure:**

```bash
ls -la
```

You should see:

```
apps/             # Applications (my-website)
packages/         # Shared packages
docs/             # Documentation (you're reading this!)
scripts/          # Build and utility scripts
.husky/           # Git hooks
pnpm-workspace.yaml
package.json
```

✅ **Checkpoint**: You're inside the `my-website` directory.

---

## Step 3: Install Dependencies (3 minutes)

```bash
pnpm install
```

**What's happening:**

- Installing all dependencies for all workspaces
- Setting up git hooks (husky) for commit validation
- Linking internal packages (`@packages/*`)

**Expected output:**

```
Lockfile is up to date, resolution step is skipped
Packages: +XXX
...
Done in X.Xs
```

✅ **Checkpoint**: No error messages, dependencies installed successfully.

---

## Step 4: Set Up Environment Variables (3 minutes)

The project needs some environment variables to run.

**Create `.env.local` file:**

```bash
touch .env.local
```

**Add the following:**

```bash
# Development environment
NODE_ENV=development

# Optional: Gemini API (needed for AI features)
# Get your key from: https://ai.google.dev/
GEMINI_API_KEY=your_key_here
```

**Note**: AI features (AI Dictionary, AI Analyzer) won't work without the API key, but the site will still run.

✅ **Checkpoint**: `.env.local` file created in project root.

---

## Step 5: Start Development Server (5 minutes)

Let's see the site in action!

```bash
pnpm dev
```

**Expected output:**

```
• Packages in scope: my-website
• Running dev in 1 package
...
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

**Open your browser:**

- Navigate to [http://localhost:3000](http://localhost:3000)
- You should see the homepage with:
  - Navigation bar
  - Hero section
  - Experience timeline
  - Featured projects

**Explore the site:**

- Click "Blog" → See Medium articles
- Click "Time Tracker" → Try the time tracking app
- Try "AI Dictionary" (needs API key)

✅ **Checkpoint**: Website loads at localhost:3000 with no errors.

---

## Step 6: Understand the Project Structure (5 minutes)

Let's explore the codebase:

```bash
# View the main app structure
tree apps/my-website/src -L 2
```

### Feature-Based Architecture

Each feature is self-contained in `apps/my-website/src/features/`:

```
features/
├── resume/           # Homepage/resume feature
├── blog/             # Blog listing feature
├── ai-dictionary/    # AI word analysis feature
├── ai-analyzer/      # AI prompt analyzer
├── time-tracker/     # Time tracking app
├── about/            # About page
└── not-found/        # 404 page
```

### Feature Structure

Each feature follows this pattern:

```
{feature-name}/
├── {FeatureName}Feature.tsx    # Main orchestrator
├── components/                 # Feature-specific components
├── hooks/                      # Feature-specific hooks
├── types/                      # Feature-specific types
├── utils/                      # Feature-specific utilities
└── index.ts                    # Barrel export
```

### Shared Code

Shared code lives in `packages/shared/`:

```
packages/shared/
├── src/
│   ├── components/   # Shared components
│   ├── types/        # Shared types
│   ├── constants/    # Shared constants
│   └── utils/        # Shared utilities
└── data/             # Shared data (e.g., articleData.ts)
```

✅ **Checkpoint**: You understand where features live and how they're organized.

---

## Step 7: Make Your First Code Change (10 minutes)

Let's make a simple change to see the dev workflow.

### 7.1 Create a New Branch

```bash
git checkout -b feat/my-first-change
```

**Branch naming**: `feat/`, `fix/`, `docs/`, `refactor/`

### 7.2 Edit the Hero Section

Open `apps/my-website/src/features/resume/components/HeroSection/HeroSection.tsx`

**Find this line** (around line 20):

```typescript
<h1 className="text-4xl font-bold md:text-6xl">
  Hi, I&apos;m <span className="text-primary">Henry Lee</span>
</h1>
```

**Change it to:**

```typescript
<h1 className="text-4xl font-bold md:text-6xl">
  Hi, I&apos;m <span className="text-primary">Henry Lee</span>
  <span className="ml-2">👋</span>
</h1>
```

### 7.3 See Your Change

**Your browser should hot-reload automatically!**

- Go to [http://localhost:3000](http://localhost:3000)
- You should see a 👋 emoji next to "Henry Lee"

**If it doesn't reload:**

- Check the terminal for errors
- Refresh the browser manually

✅ **Checkpoint**: You see the emoji in the browser.

---

## Step 8: Run Quality Checks (5 minutes)

Before committing, let's ensure code quality:

```bash
pnpm check
```

**This runs:**

1. **Type checking** - Ensures TypeScript types are correct
2. **Linting** - Checks code style (ESLint)
3. **Formatting** - Formats code (Prettier)

**Expected output:**

```
✓ Type checking passed
✓ Linting passed
✓ Formatting passed
```

**If there are errors:**

- Most will be auto-fixed
- Run `pnpm check` again to verify

✅ **Checkpoint**: All checks pass with no errors.

---

## Step 9: Commit Your Change (5 minutes)

### 9.1 Stage Your Changes

```bash
git add apps/my-website/src/features/resume/components/HeroSection/HeroSection.tsx
```

### 9.2 Commit with Conventional Commits

```bash
git commit -m "feat(my-website): Add wave emoji to hero section"
```

**Commit format**: `<type>(<scope>): <subject>`

- **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **scope**: `my-website`, `shared`, `docs`, etc.
- **subject**: Short description in sentence-case

**What happens:**

1. **pre-commit hook** runs:
   - Linting staged files
   - Formatting staged files
2. **commit-msg hook** runs:
   - Validates commit message format
   - Checks commit size limits
3. Commit is created ✅

✅ **Checkpoint**: Commit created successfully.

---

## Step 10: Understanding Git Hooks (3 minutes)

You just experienced git hooks! Let's understand what happened:

### Pre-commit Hook

Runs **before** commit is created:

- ✅ Lint and format staged files
- ✅ Run type checks (optional)

### Commit-msg Hook

Runs **after** commit message is entered:

- ✅ Validate commit message format (Conventional Commits)
- ✅ Check commit size limits (warns if >10 files)

### Pre-push Hook

Runs **before** pushing to remote:

- ✅ Run full type checks
- ✅ Run ESLint on all files

**Read more**: [Git Workflow Guide](../guides/git-workflow.md)

---

## Step 11: Explore Documentation (2 minutes)

This project uses the **Diataxis framework** for documentation:

```
docs/
├── guides/           # How-to guides (like "How to deploy")
├── tutorials/        # Learning paths (like this one!)
├── reference/        # Technical specs (API docs, configs)
├── explanation/      # Concepts (why things work this way)
└── adr/              # Architecture Decision Records
```

**Key documents:**

- [Architecture Reference](../reference/architecture.md) - System architecture
- [Git Workflow Guide](../guides/git-workflow.md) - Git procedures
- [React Query Patterns](../explanation/react-query-patterns.md) - Data fetching patterns

**For AI assistants:**

- [AGENTS.md](../../AGENTS.md) - Project overview
- [CLAUDE.md](../../CLAUDE.md) - Claude Code specific instructions

---

## 🎉 What You've Learned

Congratulations! You've completed the first tutorial. You now know how to:

- ✅ Install and configure the development environment
- ✅ Start the development server
- ✅ Navigate the feature-based architecture
- ✅ Make code changes with hot-reload
- ✅ Run quality checks before committing
- ✅ Commit using Conventional Commits format
- ✅ Understand git hooks and automation
- ✅ Navigate the documentation system

---

## 🚀 Next Steps

### Continue Learning

- **[Tutorial 02: Adding a New Feature](./02-adding-new-feature.md)** - Create a complete feature from scratch
- **[Tutorial 03: Medium Integration](./03-medium-integration.md)** - Work with external APIs

### Deepen Understanding

- **[Feature-Based Architecture](../explanation/feature-based-architecture.md)** - Why we organize code by features
- **[React Query Patterns](../explanation/react-query-patterns.md)** - SSG + React Query integration
- **[Monorepo Strategy](../explanation/monorepo-strategy.md)** - Why Turborepo

### Start Building

- **[Git Workflow Guide](../guides/git-workflow.md)** - Complete git procedures
- **[API Reference](../reference/api/)** - API endpoints documentation
- **[Architecture Reference](../reference/architecture.md)** - Complete system architecture

---

## 💡 Tips for Success

### Development Best Practices

1. **Always run `pnpm check`** before committing
2. **Follow commit message conventions** (enforced by hooks)
3. **Keep features isolated** (respect architecture boundaries)
4. **Use TypeScript strictly** (no `any` types)
5. **Test locally** before pushing

### Common Pitfalls

❌ **Don't**: Import across feature boundaries
✅ **Do**: Use `@packages/shared` for shared code

❌ **Don't**: Skip quality checks with `--no-verify`
✅ **Do**: Fix issues found by linters/type checks

❌ **Don't**: Commit large binary files (images >1MB)
✅ **Do**: Use external storage (Vercel assets)

### Getting Help

- **Documentation**: Start at [docs/README.md](../README.md)
- **Issues**: Check [GitHub Issues](https://github.com/u88803494/my-website/issues)
- **Architecture Decisions**: Browse [ADR directory](../adr/)

---

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Git Hooks Not Running

```bash
# Reinstall hooks
pnpm install
```

### Type Errors After Pull

```bash
# Clean and reinstall
rm -rf node_modules
pnpm install
```

---

## Related Documentation

- [Development Setup Guide](../guides/development-setup.md) - Complete setup reference
- [Architecture Reference](../reference/architecture.md) - System architecture
- [Git Workflow Guide](../guides/git-workflow.md) - Git procedures
- [Commitlint Rules](../reference/commitlint-rules.md) - Commit message rules
- [Tutorial 02: Adding New Feature](./02-adding-new-feature.md) - Next tutorial

---

**Ready for more?** Continue to [Tutorial 02: Adding a New Feature](./02-adding-new-feature.md) to learn how to create a complete feature from scratch!
