# Claude Code Configuration

@AGENTS.md

## 📚 Documentation System

This project uses the **Diataxis framework** for AI-first documentation organization:

**Navigate by task type:**

- **How do I...?** → [Guides](./docs/guides/) (e.g., [Git Workflow](./docs/guides/git-workflow.md))
- **I want to learn...** → [Tutorials](./docs/tutorials/) (e.g., [Project Setup](./docs/tutorials/01-project-setup.md))
- **What is...?** → [Reference](./docs/reference/) (e.g., [Architecture](./docs/reference/architecture.md), [API Docs](./docs/reference/api/))
- **Why...?** → [Explanation](./docs/explanation/) (e.g., [Feature-Based Architecture](./docs/explanation/feature-based-architecture.md))
- **What did we decide?** → [ADR](./docs/adr/) (e.g., [ADR 001: React Query SSG](./docs/adr/001-react-query-ssg-pattern.md))

**Key Resources:**

- [Documentation Hub](./docs/README.md) - Start here for complete overview
- [Development Setup](./docs/guides/development-setup.md) - Local environment setup
- [Architecture Reference](./docs/reference/architecture.md) - System architecture
- [API Documentation](./docs/reference/api/) - All API endpoints

## Claude Code 專屬功能

This file supplements AGENTS.md with Claude Code-specific features and workflows.

### React Query + Next.js SSG Pattern

**重要：React Query 最低版本要求 5.84.1+**（修復 SSG 相容性 bug）

**決策流程圖：**

```
需要 React Query？
  ├─ 是 → 是 GET request？
  │      ├─ 是 → 需要 SEO？
  │      │      ├─ 是 → ✅ 使用 Pattern 1 (Server Prefetch + HydrationBoundary)
  │      │      └─ 否 → ❌ 使用 Pattern 2 (Client-only)
  │      └─ 否 (POST/PUT/DELETE) → ❌ 使用 Pattern 2 (Client-only)
  └─ 否 → 一般 Server Component
```

**Pattern 1: Server-side Prefetch (有 SEO 需求)**

```typescript
// apps/my-website/src/app/blog/page.tsx
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export default async function BlogPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: mediumArticlesKeys.list(limit),
    queryFn: ({ pageParam }) => fetchMediumArticles({ limit, pageParam }),
    ...mediumArticlesQueryConfig,
    pages: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogFeature />
    </HydrationBoundary>
  );
}
```

**Pattern 2: Client-only Mutation (無 SEO 需求)**

```typescript
// apps/my-website/src/app/ai-dictionary/page.tsx
export default function AIDictionaryPage() {
  return <AIDictionaryFeature />;  // Client Component 內部處理
}
```

**重要注意事項：**

- 不要使用 `force-dynamic` - React Query 5.84.1+ 已修復 SSG bug
- `'use client'` 只在真正需要 client-side 功能的組件使用
- 詳見：`docs/adr/001-react-query-ssg-pattern.md`

### API Routes

Located in `/apps/my-website/src/app/api/`:

- **`/api/define` (POST)** - AI word analysis using Google Gemini
  - Request: `{ word: string, type: string }`
  - Response: `WordAnalysisResponse`

- **`/api/ai-analyzer` (POST)** - General AI analysis
  - Request: `{ need: string, prompt: string }`
  - Response: AI-generated analysis

- **`/api/medium-articles` (GET)** - Fetch Medium articles
  - Returns cached article data

### Medium Article Automation

The site automatically syncs and displays Medium articles.

**Article Data Flow:**

1. **Source**: `article-urls.json` (list of Medium URLs)
2. **Scripts**:
   - `sync-latest-articles.ts` - Fetches latest 2 articles
   - `batch-parse-articles.ts` - Parses full article content
3. **Output**: `@packages/shared/data/articleData.ts` (auto-generated, don't edit manually)
4. **Display**: Used by `blog` and `resume` features

**When to Run Sync:**

- **Before builds**: Automatically runs via `pnpm build`
- **After adding new articles**: Run `pnpm sync:all-articles` manually
- **Development**: Articles are cached, no need to sync frequently

### Subagents Usage

Use Task tool to launch specialized subagents for complex operations:

- **Explore agent** (subagent_type: Explore) - Quick codebase exploration, finding files by patterns
- **Deep research agent** (subagent_type: deep-research-agent) - Comprehensive research with adaptive strategies
- **Refactoring expert** (subagent_type: refactoring-expert) - Code quality improvements and technical debt reduction
- **System architect** (subagent_type: system-architect) - Scalable system architecture design
- **Security engineer** (subagent_type: security-engineer) - Security vulnerability identification

### MCP Servers

This project uses several MCP (Model Context Protocol) servers:

- **Serena MCP** - Semantic code understanding with project memory
  - Symbol operations (rename, extract, move functions/classes)
  - Project-wide code navigation
  - Session persistence with memories

- **Context7 MCP** - Official library documentation lookup
  - Framework patterns and best practices
  - Version-specific API documentation

- **Sequential Thinking MCP** - Multi-step reasoning for complex analysis
  - Systematic problem decomposition
  - Hypothesis testing and validation

- **Tavily MCP** - Web search and real-time information
  - Current technical information
  - Recent framework updates

- **Magic MCP** - UI component generation from 21st.dev patterns
  - Modern, accessible React components
  - Design system integration

### Task Management with TodoWrite

For complex multi-step operations:

1. **Create task list** with TodoWrite at the beginning
2. **Mark in_progress** before starting each task (exactly ONE at a time)
3. **Complete immediately** after finishing (don't batch completions)
4. **Break down** complex tasks into smaller steps

### Instruction Hierarchy

Claude Code has a strict instruction hierarchy:

1. **CLAUDE.md** (this file) - Treated as authoritative system rules
2. **User prompts** - Interpreted as flexible requests within established rules
3. **Context** - Additional information that supplements rules

This hierarchy ensures consistent behavior throughout your Claude Code session.

### Workflow Best Practices

1. **Before making changes**:
   - Understand the feature-based architecture
   - Check architectural boundaries (ESLint rules)
   - Review existing patterns in similar features

2. **During implementation**:
   - Use TodoWrite for task tracking
   - Follow React Query patterns (Pattern 1 vs Pattern 2)
   - Ensure proper error/loading/empty state handling
   - Maintain consistent file naming conventions

3. **After making changes**:
   - Run `pnpm check` (MANDATORY)
   - Test the feature locally
   - Write meaningful commit messages (Conventional Commits)
   - Create PR with clear description

### Special Considerations

**Time Tracker Feature:**

- Uses **localStorage** for data persistence
- Complex state with multiple views (main, weekly stats, settings)
- Custom hooks: `useTimeTracker`, `useWeeklyStats`, `useUserSettings`
- Utility modules for calculations, formatting, validation

**AI Features:**

- **AI Dictionary**: Gemini API for word analysis (etymology, definitions, examples)
- **AI Analyzer**: General-purpose prompt analysis
- Both use React Query mutations with error handling

**Medium Integration:**

- GraphQL API for article fetching
- Cheerio for HTML parsing
- Auto-syncs before production builds

### Deployment

The site is deployed on **Vercel**.

**Build Process:**

1. `pnpm build` runs `sync:all-articles` first
2. Next.js build generates `.next/` directory
3. Turborepo caches build outputs

**Environment Setup:**
Ensure `GEMINI_API_KEY` is set in Vercel environment variables.

## GitHub Account Verification

**Before using any gh commands**, verify the account matches the project path:

- **Personal Projects** (`/personal/`): Use account `u88803494`
  - Check: `gh auth status`
  - Switch: `gh auth switch --user u88803494`
