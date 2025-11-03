# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** for Henry Lee's personal website (henryleelab.com), built with **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS**, and **React Query**. The site features a resume/portfolio, blog integration with Medium, AI-powered dictionary, AI analyzer, and time tracking application.

## Monorepo Structure

- **`apps/my-website`** - Main Next.js 15 application
- **`packages/shared`** - Shared types, constants, data, utilities, and components
- **`packages/tsconfig`** - Shared TypeScript configurations
- **`packages/eslint-config`** - Shared ESLint configurations

## Common Development Commands

### Root Level (Turborepo)

```bash
pnpm dev                 # Start dev server with Turbo TUI
pnpm build              # Build all apps
pnpm lint               # Run ESLint across workspace
pnpm check-types        # Run TypeScript checks
pnpm check              # Run lint + type checks
pnpm format             # Format code with Prettier
```

### App Level (apps/my-website)

```bash
cd apps/my-website

# Development
pnpm dev                # Start Next.js dev (with Turbopack on port 3000)

# Code Quality
pnpm check              # Run types + lint + format (auto-fixes)
pnpm check-types        # TypeScript validation only
pnpm lint               # ESLint only

# Build & Deploy
pnpm build              # Sync articles + build for production
pnpm start              # Start production server

# Medium Article Automation
pnpm sync:latest        # Sync latest 2 articles from Medium
pnpm parse:articles     # Parse article content
pnpm sync:all-articles  # Full sync (latest + parse)
```

## Architecture Patterns

### Feature-Based Architecture

The app follows a **feature-sliced design**. Each feature is self-contained in `/apps/my-website/src/features/`:

```
features/
├── resume/          # Homepage with hero, experience, projects
├── about/           # About page
├── blog/            # Blog listing with Medium integration
├── ai-dictionary/   # AI-powered dictionary
├── ai-analyzer/     # AI analysis tool
├── time-tracker/    # Time tracking application
└── not-found/       # 404 page
```

**Feature Structure Pattern:**

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

**Strict import rules prevent architectural violations:**

- ❌ Cannot import from `@/app/*` (use features instead)
- ❌ Cannot import hooks across features
- ❌ Cannot import types across features
- ❌ Cannot import components across features
- ✅ Use `@packages/shared` for shared code

**Exceptions:**

- Data files (`articleData.ts`, etc.) can be imported anywhere
- Shared components in `/components/shared/` can be imported

### File Naming Conventions

- **Feature Components:** `*Feature.tsx` (e.g., `ResumeFeature.tsx`)
- **Pages:** `page.tsx` (Next.js App Router)
- **UI Components:** `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- **Hooks:** `use*.ts` (e.g., `useTimeTracker.ts`)
- **Utilities:** `camelCase.ts` (e.g., `cn.ts`)
- **Types:** `*.types.ts` (e.g., `article.types.ts`)
- **Feature Directories:** `kebab-case` (e.g., `time-tracker/`)
- **Component Directories:** `PascalCase` (e.g., `HeroSection/`)

### State Management

- **Server State:** React Query (TanStack Query) for all API calls
- **Local State:** React hooks (`useState`, `useEffect`)
- **Persistent State:** Custom `useLocalStorage` hook (time-tracker)
- **Form State:** Custom hooks with validation logic

### Data Fetching Pattern

All API calls use React Query with typed responses:

```typescript
// Pattern for mutations (POST requests)
const mutation = useMutation<ResponseType, Error, InputType>({
  mutationFn: async (input) => {
    const response = await fetch(API_PATH, {
      method: "POST",
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed");
    return response.json();
  },
});

// Pattern for queries (GET requests)
const { data, isLoading, error } = useQuery({
  queryKey: ["key"],
  queryFn: async () => {
    const response = await fetch(API_PATH);
    return response.json();
  },
});
```

### React Query + Next.js SSG Pattern

**重要：React Query 最低版本要求 5.84.1+**（修復 SSG 相容性 bug）

專案使用兩種 React Query pattern，根據需求選擇：

#### Pattern 1: Server-side Prefetch（有 SEO 需求）

**使用時機：**

- GET requests 需要 SEO 優化
- Infinite queries 需要初始資料
- 提升 FCP/LCP 性能

**範例：Blog 頁面**

```typescript
// apps/my-website/src/app/blog/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

/**
 * ✅ 使用 HydrationBoundary
 * 理由：Server-side prefetch infinite query，提升初始載入速度和 SEO
 */
export default async function BlogPage() {
  const queryClient = getQueryClient();

  // Server-side prefetch
  await queryClient.prefetchInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    ...mediumArticlesQueryConfig,
    pages: 1, // Only prefetch the first page
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
```

#### Pattern 2: Client-only Mutation（無 SEO 需求）

**使用時機：**

- POST/PUT/DELETE mutations
- 完全動態的頁面
- 不需要 SEO 的功能頁面（如工具頁）

**範例：AI Dictionary 頁面**

```typescript
// apps/my-website/src/app/ai-dictionary/page.tsx
/**
 * ❌ 不使用 HydrationBoundary
 * 理由：只使用 mutation（POST），無需 server-side prefetch
 */
export default function AIDictionaryPage() {
  return <AIDictionaryFeature />;  // Client Component 內部處理
}
```

#### 決策流程圖

```
需要 React Query？
  ├─ 是 → 是 GET request？
  │      ├─ 是 → 需要 SEO？
  │      │      ├─ 是 → ✅ 使用 Pattern 1 (Server Prefetch + HydrationBoundary)
  │      │      └─ 否 → ❌ 使用 Pattern 2 (Client-only)
  │      └─ 否 (POST/PUT/DELETE) → ❌ 使用 Pattern 2 (Client-only)
  └─ 否 → 一般 Server Component
```

#### 重要注意事項

1. **不要使用 `force-dynamic`**
   - React Query 5.84.1+ 已修復 SSG bug
   - 所有頁面都應該能正確生成為 Static (○)

2. **`'use client'` 使用原則**
   - 只在真正需要 client-side 功能的組件使用
   - 純容器組件不需要（子組件已有 `'use client'`）

3. **查看完整架構決策**
   - 詳見：`docs/adr/001-react-query-ssg-pattern.md`

### Component Organization

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

**State component pattern:** Always handle loading, error, and empty states explicitly.

## API Routes

Located in `/apps/my-website/src/app/api/`:

- **`/api/define` (POST)** - AI word analysis using Google Gemini
  - Request: `{ word: string, type: string }`
  - Response: `WordAnalysisResponse`

- **`/api/ai-analyzer` (POST)** - General AI analysis
  - Request: `{ need: string, prompt: string }`
  - Response: AI-generated analysis

- **`/api/medium-articles` (GET)** - Fetch Medium articles
  - Returns cached article data

## Environment Variables

Required for development (`.env.local`):

```bash
GEMINI_API_KEY=your_key_here  # Required for AI features
NODE_ENV=development
```

**Turborepo exposes these to build/dev tasks via `turbo.json`**

## Technology Stack

### Core

- **Next.js 15** (App Router, React 19, Turbopack)
- **TypeScript** (strict mode)
- **pnpm** (workspace package manager)
- **Turborepo** (monorepo build system)

### Styling

- **Tailwind CSS 4** (utility-first)
- **DaisyUI** (component library)
- **Framer Motion** (animations)
- **`cn()` utility** (clsx + tailwind-merge)

### Data & State

- **React Query** (@tanstack/react-query) - server state
- **date-fns** - date manipulation

### AI Integration

- **Google Gemini API** (@google/generative-ai)
- Model: Gemini 2.5 Flash Lite (from `@packages/shared/constants/aiModels`)

### Development Tools

- **ESLint 9** (flat config with strict rules)
- **Prettier** (code formatting)
- **TypeScript ESLint** (type-aware linting)
- **husky + lint-staged** (pre-commit hooks)

### Icons

- **lucide-react** - UI icons (menus, arrows, navigation)
- **react-icons/si** - Brand/company logos

## Important Code Patterns

### TypeScript Standards

- **Strict mode enabled** - no `any` types allowed
- **Explicit typing** - define interfaces for all data structures
- **Type imports** - use `import type { ... }` for types
- **Prefer `interface` over `type`** for object shapes

### Import Patterns

```typescript
// Correct import order:
import React from "react"; // React
import { useRouter } from "next/navigation"; // Next.js
import { useQuery } from "@tanstack/react-query"; // Third-party
import { cn } from "@/utils/cn"; // Local (@/ alias)
import type { Article } from "@packages/shared/types/article.types"; // Types
```

### Path Aliases

- `@/*` → `apps/my-website/src/*`
- `@packages/*` → `packages/*`

### Styling Rules

- **Always use Tailwind CSS** - no plain CSS or inline styles
- **Use `cn()` utility** for conditional classes
- **DaisyUI classes** for common components (`btn`, `card`, `badge`)
- **Semantic colors** - prefer `bg-primary`, `text-base-content`
- **Mobile-first responsive** - use `sm:`, `md:`, `lg:`, `xl:` breakpoints

### Component Patterns

```typescript
// Recommended component structure
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
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

Use semantic prefixes:

- `isLoading`, `isOpen`, `isValid` (state)
- `hasPermission`, `hasData` (possession)
- `canEdit`, `canDelete` (capability)

## Medium Article Automation

The site automatically syncs and displays Medium articles.

### Article Data Flow

1. **Source:** `article-urls.json` (list of Medium URLs)
2. **Scripts:**
   - `sync-latest-articles.ts` - Fetches latest 2 articles
   - `batch-parse-articles.ts` - Parses full article content
3. **Output:** `@packages/shared/data/articleData.ts` (auto-generated, don't edit manually)
4. **Display:** Used by `blog` and `resume` features

### When to Run Sync

- **Before builds:** Automatically runs via `pnpm build`
- **After adding new articles:** Run `pnpm sync:all-articles` manually
- **Development:** Articles are cached, no need to sync frequently

## Testing & Quality Assurance

### Code Quality Workflow

1. Make changes
2. Run `pnpm check` (auto-fixes types, lint, format)
3. Commit changes
4. Pre-commit hooks run automatically via husky + lint-staged

### Single Test Commands

```bash
pnpm check-types    # TypeScript only
pnpm lint           # ESLint only
pnpm format:check   # Prettier validation
```

## Deployment

The site is deployed on **Vercel**.

### Build Process

1. `pnpm build` runs `sync:all-articles` first
2. Next.js build generates `.next/` directory
3. Turborepo caches build outputs

### Environment Setup

Ensure `GEMINI_API_KEY` is set in Vercel environment variables.

## Special Considerations

### Time Tracker Feature

- Uses **localStorage** for data persistence
- Complex state with multiple views (main, weekly stats, settings)
- Custom hooks: `useTimeTracker`, `useWeeklyStats`, `useUserSettings`
- Utility modules for calculations, formatting, validation

### AI Features

- **AI Dictionary:** Gemini API for word analysis (etymology, definitions, examples)
- **AI Analyzer:** General-purpose prompt analysis
- Both use React Query mutations with error handling

### Medium Integration

- GraphQL API for article fetching
- Cheerio for HTML parsing
- Auto-syncs before production builds

## Communication Preference

All communication should be in **Traditional Chinese (繁體中文)** unless explicitly requested otherwise, but technical terms may remain in English.
