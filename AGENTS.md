# AI Coding Assistant Configuration

This project uses the [AGENTS.md](https://agents.md/) standard for AI coding assistant configuration.

## Project Overview

This is a **Turborepo monorepo** for Henry Lee's personal website (henryleelab.com), built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**, and **React Query**. The site features a resume/portfolio, blog integration with Medium, AI-powered dictionary, AI analyzer, and time tracking application.

## Communication Guidelines

- **Language**: Always respond in Traditional Chinese (繁體中文) unless explicitly requested otherwise
- **Technical Terms**: Technical terms can remain in English, but explanations should be in Chinese
- **Code Comments**:
  - Personal projects (path contains `/personal/`): Use English comments
  - Work projects (path contains `/work/`): Use Traditional Chinese comments

## Monorepo Structure

- **`apps/my-website`** - Main Next.js 15 application
- **`packages/shared`** - Shared types, constants, data, utilities, and components
- **`packages/tsconfig`** - Shared TypeScript configurations
- **`packages/eslint-config`** - Shared ESLint configurations

## Development Commands

### Root Level (Turborepo)

```bash
pnpm dev                 # Start dev server with Turbo TUI
pnpm build              # Build all apps
pnpm lint               # Run ESLint across workspace
pnpm check-types        # Run TypeScript checks
pnpm check              # Run lint + type checks (auto-fixes)
pnpm format             # Format code with Prettier
```

### App Level (apps/my-website)

```bash
cd apps/my-website
pnpm dev                # Start Next.js dev (Turbopack on port 3000)
pnpm check              # Run types + lint + format (auto-fixes)
pnpm build              # Sync articles + build for production
```

**🚨 MANDATORY RULE**: After making ANY code changes, ALWAYS run `pnpm run check` to ensure code quality.

## Architecture

### Feature-Based Design

Each feature is self-contained in `/apps/my-website/src/features/`:

- `resume/` - Homepage with hero, experience, projects
- `blog/` - Blog listing with Medium integration
- `ai-dictionary/` - AI-powered dictionary
- `ai-analyzer/` - AI analysis tool
- `time-tracker/` - Time tracking application
- `about/` - About page
- `not-found/` - 404 page

### Feature Structure Pattern

```
{feature-name}/
├── {FeatureName}Feature.tsx  # Main orchestrator component
├── index.ts                  # Barrel export
├── components/               # Feature-specific components
├── hooks/                    # Feature-specific hooks
├── types/                    # Feature-specific types
├── utils/                    # Feature-specific utilities
└── constants/                # Feature-specific constants
```

### Architectural Boundaries (ESLint-Enforced)

- ❌ Cannot import from `@/app/*` (use features instead)
- ❌ Cannot import hooks/types/components across features
- ✅ Use `@packages/shared` for shared code
- ✅ Data files (`articleData.ts`) can be imported anywhere
- ✅ Shared components in `/components/shared/` can be imported

## File Naming Conventions

- **Feature Components**: `*Feature.tsx` (e.g., `ResumeFeature.tsx`)
- **Pages**: `page.tsx` (Next.js App Router only)
- **UI Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useMediumArticles.ts`)
- **Utilities**: camelCase (e.g., `cn.ts`, `apiPaths.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `article.types.ts`)
- **Feature Directories**: kebab-case (e.g., `time-tracker/`, `ai-analyzer/`)
- **Component Directories**: PascalCase (e.g., `HeaderSection/`, `MainTabContent/`)

## Code Standards

### TypeScript

- **Strict mode enabled** - no `any` types allowed
- **Explicit typing** - define interfaces for all data structures
- **Type imports** - use `import type { ... }` for types
- **Prefer `interface` over `type`** for object shapes

### Import Order

1. React imports (`react`, `react-dom`)
2. Next.js imports (`next/link`, `next/navigation`)
3. Third-party packages (alphabetical order)
4. Workspace packages (`@packages/`)
5. Local absolute imports using `@/` alias

### Path Aliases

- `@/*` → `apps/my-website/src/*` (local imports within the app)
- `@packages/*` → `packages/*` (workspace packages)

### Component Definition

```typescript
// Use const with arrow function
const MyComponent: React.FC<Props> = (props) => {
  // 1. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState();
  const { data, isLoading } = useQuery(...);

  // 2. Early returns for edge cases
  if (isLoading) return <LoadingState />;
  if (!data) return <EmptyState />;

  // 3. Event handlers (prefix with "handle")
  const handleClick = () => { ... };

  // 4. Main render
  return <div>...</div>;
};
```

### Boolean Naming

- `isLoading`, `isOpen`, `isValid` (state)
- `hasPermission`, `hasData` (possession)
- `canEdit`, `canDelete` (capability)

## Styling Guidelines

- **Styling Engine**: Use **Tailwind CSS exclusively**. No plain CSS or inline `style` attributes
- **Class Composition**: When a component requires more than ten className attributes, use the `cn()` utility function
- **UI Components**: Leverage **DaisyUI** component classes (e.g., `card`, `btn`, `badge`)
- **Color Usage**: Prioritize daisyUI's semantic color names (`bg-primary`, `text-base-content`)
- **Responsive Design**: Follow mobile-first approach using Tailwind's breakpoints (`sm`, `md`, `lg`, `xl`)

## Icon Usage

- **General UI Icons**: ALWAYS use `lucide-react` package for UI icons (menus, arrows, navigation)
- **Brand/Company Logos**: ALWAYS use `react-icons/si` package for company or brand logos
- **No Other Sources**: Do not use other icon sources or inline SVGs unless explicitly requested

## State Management

- **Server State**: React Query (TanStack Query) for all API calls
- **Local State**: React hooks (`useState`, `useEffect`)
- **Persistent State**: Custom `useLocalStorage` hook (time-tracker)
- **Form State**: Custom hooks with validation logic

### React Query Patterns

**Pattern 1: Server-side Prefetch (有 SEO 需求)**

- GET requests 需要 SEO 優化
- Infinite queries 需要初始資料
- 使用 `HydrationBoundary` + server-side prefetch

**Pattern 2: Client-only Mutation (無 SEO 需求)**

- POST/PUT/DELETE mutations
- 完全動態的頁面
- 不需要 `HydrationBoundary`

## Component Organization

**Complex components use folder structure:**

```
ComponentName/
├── ComponentName.tsx      # Main component
├── SubComponent.tsx       # Related sub-components
├── LoadingState.tsx       # Loading state
├── ErrorState.tsx         # Error state
├── EmptyState.tsx         # Empty state
└── index.ts               # Barrel export
```

**State component pattern**: Always handle loading, error, and empty states explicitly.

## Git Conventions

- **Commit Messages**: Follow **Conventional Commits** specification in English
  - `feat: add user authentication`
  - `fix: correct layout bug on mobile`
  - `docs: update API documentation`
  - `refactor: simplify time calculation logic`
  - `chore: upgrade dependencies`
- **Branch Naming**: Use descriptive names with prefixes (`feat/`, `fix/`, `refactor/`)
- **Pull Requests**: Create PR before merging to main branch

## Environment Variables

Required for development (`.env.local`):

```bash
GEMINI_API_KEY=your_key_here  # Required for AI features
NODE_ENV=development
```

## Technology Stack

**Core**: Next.js 15, React 19, TypeScript, pnpm, Turborepo
**Styling**: Tailwind CSS 4, DaisyUI, Framer Motion
**Data & State**: React Query, date-fns
**AI Integration**: Google Gemini API (Gemini 2.5 Flash Lite)
**Development Tools**: ESLint 9, Prettier, TypeScript ESLint, husky + lint-staged
