---
title: Development Setup Guide
type: guide
status: stable
audience: [developer]
tags: [setup, development, environment, tools]
created: 2025-11-07
updated: 2025-11-07
difficulty: beginner
estimated_time: 30 minutes
related:
  - reference/architecture.md
  - reference/cli-commands.md
  - tutorials/01-project-setup.md
ai_context: |
  Step-by-step guide for setting up local development environment for the my-website
  monorepo, including prerequisites, installation, and verification.
---

# Development Setup Guide

This guide will help you set up a local development environment for the my-website monorepo.

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** 18.x or later ([Download](https://nodejs.org/))
- **pnpm** 8.x or later
  ```bash
  npm install -g pnpm
  ```
- **Git** ([Download](https://git-scm.com/))

### Recommended

- **VS Code** ([Download](https://code.visualstudio.com/)) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
- **GitHub CLI** (for PR/issue management)
  ```bash
  brew install gh  # macOS
  ```

### Optional

- **Cursor IDE** - AI-powered editor ([Download](https://cursor.sh/))
- **Claude Code CLI** - For AI-assisted development

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/u88803494/my-website.git

# Navigate to project directory
cd my-website
```

---

## Step 2: Install Dependencies

```bash
# Install all dependencies using pnpm
pnpm install
```

**What happens:**

- Installs all dependencies for all workspaces
- Sets up git hooks (husky)
- Links internal packages

**Expected output:**

```
Lockfile is up to date, resolution step is skipped
...
Done in X.Xs
```

---

## Step 3: Environment Variables

Create `.env.local` in the root directory:

```bash
# Copy example file (if available)
cp .env.example .env.local

# Or create manually
touch .env.local
```

Add required environment variables:

```bash
# Required for AI features
GEMINI_API_KEY=your_api_key_here

# Development environment
NODE_ENV=development
```

**Get API keys:**

- **Gemini API**: [Get API Key](https://ai.google.dev/)

---

## Step 4: Start Development Server

```bash
# Start dev server with Turbo TUI
pnpm dev

# Or start without TUI
pnpm --filter my-website dev
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
- You should see the homepage

---

## Step 5: Verify Installation

Run the full check suite:

```bash
pnpm check
```

This runs:

1. **Type checking** (`tsc --noEmit`)
2. **Linting** (`eslint --fix`)
3. **Format** (`prettier --write`)

**Expected output:**

```
✅ Type checking passed
✅ Linting passed
✅ Formatting passed
```

---

## Project Structure

Understanding the monorepo structure:

```
my-website/
├── apps/
│   └── my-website/           # Main Next.js application
│       ├── src/
│       │   ├── app/          # Next.js App Router pages
│       │   ├── features/     # Feature-based modules
│       │   └── components/   # Shared components
│       └── package.json
├── packages/
│   ├── shared/               # Shared utilities, types, constants
│   ├── tsconfig/             # Shared TypeScript configs
│   ├── eslint-config/        # Shared ESLint configs
│   └── tailwind-config/      # Shared Tailwind configs
├── docs/                     # Documentation (Diataxis framework)
├── scripts/                  # Build and utility scripts
├── pnpm-workspace.yaml       # Workspace configuration
└── package.json              # Root package.json
```

**Key directories:**

- **`apps/my-website/src/features/`**: Feature-based architecture (resume, blog, ai-dictionary, etc.)
- **`packages/shared/`**: Shared code across all apps
- **`docs/`**: All documentation organized by Diataxis framework

---

## Common Commands

| Command                    | Description                          |
| -------------------------- | ------------------------------------ |
| `pnpm dev`                 | Start development server (Turbo TUI) |
| `pnpm build`               | Build all apps for production        |
| `pnpm check`               | Run type check + lint + format       |
| `pnpm check-types`         | Run TypeScript checks only           |
| `pnpm lint`                | Run ESLint only                      |
| `pnpm format`              | Format code with Prettier            |
| `pnpm sync:all-articles`   | Sync Medium articles                 |
| `pnpm --filter my-website` | Run command in specific workspace    |

For complete command reference, see [CLI Commands](../reference/cli-commands.md).

---

## Development Workflow

### Making Changes

1. **Create a new branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes**
   - Follow [feature-based architecture](../explanation/feature-based-architecture.md)
   - Use TypeScript strict mode
   - Add tests if applicable

3. **Run checks**

   ```bash
   pnpm check
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(my-website): Add new feature"
   ```

   Commits follow [Conventional Commits](../reference/commitlint-rules.md).

5. **Push and create PR**
   ```bash
   git push origin feat/your-feature-name
   ```

See [Git Workflow Guide](./git-workflow.md) for detailed git procedures.

---

## Troubleshooting

### Port 3000 Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

### Module Not Found

**Error:**

```
Module not found: Can't resolve '@packages/shared'
```

**Solution:**

```bash
# Reinstall dependencies
pnpm install

# Clear Next.js cache
rm -rf apps/my-website/.next
pnpm dev
```

### Type Errors

**Error:**

```
TS2307: Cannot find module '@packages/shared/types'
```

**Solution:**

```bash
# Rebuild TypeScript projects
pnpm run check-types

# If still failing, check tsconfig paths
cat apps/my-website/tsconfig.json
```

### Git Hooks Not Running

**Error:**

```
Commit created without running pre-commit hooks
```

**Solution:**

```bash
# Reinstall husky
pnpm install
npx husky install

# Verify hooks are installed
ls -la .husky/
```

---

## Editor Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Recommended VS Code Extensions

Install from Extensions marketplace:

```
dbaeumer.vscode-eslint
esbenp.prettier-vscode
bradlc.vscode-tailwindcss
formulahendry.auto-rename-tag
```

---

## Next Steps

Once your environment is set up:

1. **Learn the architecture**: Read [Architecture Reference](../reference/architecture.md)
2. **Follow a tutorial**: Start with [Tutorial 01: Project Setup](../tutorials/01-project-setup.md)
3. **Understand patterns**: Read [React Query Patterns](../explanation/react-query-patterns.md)
4. **Make your first change**: Follow [Git Workflow Guide](./git-workflow.md)

---

## Related Documentation

- [Architecture Reference](../reference/architecture.md) - Complete system architecture
- [CLI Commands Reference](../reference/cli-commands.md) - All available commands
- [Git Workflow Guide](./git-workflow.md) - Git procedures and automation
- [Tutorial 01: Project Setup](../tutorials/01-project-setup.md) - Hands-on learning path

---

## Getting Help

- **Documentation**: Browse [docs/](../)
- **Issues**: [GitHub Issues](https://github.com/u88803494/my-website/issues)
- **Architecture Decisions**: [ADR directory](../adr/)
