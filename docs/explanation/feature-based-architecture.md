---
title: Feature-Based Architecture
type: explanation
status: stable
audience: [developer, architect, ai]
tags: [architecture, design, patterns, features, modularity]
created: 2025-11-07
updated: 2025-11-07
related:
  - reference/architecture.md
  - explanation/monorepo-strategy.md
  - adr/002-agents-md-adoption.md
  - guides/development-setup.md
ai_context: |
  Explains the reasoning behind feature-based architecture, its benefits over
  traditional layered architecture, and how it scales with project growth.
---

# Feature-Based Architecture

## Overview

This project uses **feature-based architecture** where code is organized by features (resume, blog, ai-dictionary) rather than by technical layers (components, hooks, utils).

**Key principle**: Everything related to a feature lives together in one directory.

---

## Why Feature-Based Architecture?

### Traditional Layered Architecture Problems

In a traditional architecture, code is organized by type:

```
src/
├── components/          # ALL components
│   ├── HeroSection.tsx
│   ├── ExperienceCard.tsx
│   ├── BlogList.tsx
│   ├── DictionaryForm.tsx
│   └── TimeTrackerMain.tsx
├── hooks/              # ALL hooks
│   ├── useMediumArticles.ts
│   ├── useTimeTracker.ts
│   └── useDictionary.ts
├── types/              # ALL types
│   ├── article.types.ts
│   ├── timeEntry.types.ts
│   └── dictionary.types.ts
└── utils/              # ALL utilities
    ├── articleParser.ts
    ├── timeCalculator.ts
    └── wordAnalyzer.ts
```

**Problems as project grows:**

1. **Hard to find related code** - Time tracker logic scattered across 4+ directories
2. **Difficult to delete features** - Must hunt through every directory for related files
3. **Unclear dependencies** - Can't tell which components depend on which hooks
4. **Merge conflicts** - Multiple developers editing same directories
5. **Cognitive overload** - Must mentally map relationships across directories
6. **No clear ownership** - Who owns "components"? Everyone and no one

---

## Feature-Based Architecture Solution

Instead, organize by **features**:

```
src/features/
├── resume/                     # Resume/homepage feature
│   ├── ResumeFeature.tsx       # Orchestrator
│   ├── components/             # Resume-specific components
│   │   ├── HeroSection/
│   │   └── ExperienceCard/
│   ├── hooks/                  # Resume-specific hooks
│   ├── types/                  # Resume-specific types
│   └── index.ts                # Barrel export
├── blog/                       # Blog feature
│   ├── BlogFeature.tsx
│   ├── components/
│   │   └── BlogList/
│   ├── hooks/
│   │   └── useMediumArticles.ts
│   ├── types/
│   │   └── article.types.ts
│   └── utils/
│       └── articleParser.ts
├── time-tracker/               # Time tracking feature
│   ├── TimeTrackerFeature.tsx
│   ├── components/
│   ├── hooks/
│   │   └── useTimeTracker.ts
│   ├── types/
│   │   └── timeEntry.types.ts
│   └── utils/
│       └── timeCalculator.ts
└── ai-dictionary/              # AI dictionary feature
    ├── AIDictionaryFeature.tsx
    ├── components/
    │   └── DictionaryForm/
    ├── hooks/
    │   └── useDictionary.ts
    ├── types/
    │   └── dictionary.types.ts
    └── utils/
        └── wordAnalyzer.ts
```

**Benefits:**

1. ✅ **Co-location** - All related code in one place
2. ✅ **Easy deletion** - Remove entire feature directory
3. ✅ **Clear dependencies** - Obvious what a feature needs
4. ✅ **Reduced conflicts** - Teams work in separate directories
5. ✅ **Cognitive clarity** - Understand feature without jumping around
6. ✅ **Clear ownership** - Each feature has defined owners

---

## Architecture Rules

### ❌ Prohibited: Cross-Feature Imports

Features **cannot** import from each other:

```typescript
// ❌ WRONG: ai-dictionary importing from blog
import { useMediumArticles } from "@/features/blog/hooks";
```

**Why?** Creates tight coupling and dependency chains.

**Enforcement**: ESLint rule (`no-restricted-imports`) blocks this at build time.

### ✅ Allowed: Shared Package Imports

Use `@packages/shared` for code used by multiple features:

```typescript
// ✅ CORRECT: Import from shared package
import { cn } from "@packages/shared/utils";
import type { Article } from "@packages/shared/types";
```

**What goes in shared:**

- **Components**: Used by 2+ features (Button, Card, Modal)
- **Types**: Shared data structures (Article, User)
- **Constants**: App-wide constants (API paths, config)
- **Utilities**: Generic helpers (cn, formatDate)

### ✅ Allowed: Data Imports

Data files (like `articleData.ts`) can be imported anywhere:

```typescript
// ✅ CORRECT: Import data files
import { articleData } from "@packages/shared/data/articleData";
```

---

## Feature Structure Pattern

Every feature follows this consistent structure:

```
{feature-name}/
├── {FeatureName}Feature.tsx    # Main orchestrator component
├── components/                 # Feature-specific components
│   ├── ComponentA/
│   │   ├── ComponentA.tsx
│   │   ├── SubComponent.tsx
│   │   └── index.ts
│   └── ComponentB/
├── hooks/                      # Feature-specific hooks
│   ├── useFeatureData.ts
│   └── useFeatureLogic.ts
├── types/                      # Feature-specific types
│   └── feature.types.ts
├── utils/                      # Feature-specific utilities
│   └── featureHelpers.ts
├── constants/                  # Feature-specific constants
│   └── featureConstants.ts
└── index.ts                    # Barrel export (exports Feature component)
```

### The "Feature" Component

Each feature has a main orchestrator component:

```typescript
// TimeTrackerFeature.tsx
export const TimeTrackerFeature: React.FC = () => {
  // 1. Data fetching and state management
  const { entries, isLoading } = useTimeTracker();

  // 2. Early returns for edge cases
  if (isLoading) return <LoadingState />;

  // 3. Main render with sub-components
  return (
    <div>
      <HeaderSection />
      <MainTabContent entries={entries} />
      <FooterSection />
    </div>
  );
};
```

**Responsibilities:**

- Coordinate sub-components
- Manage feature-level state
- Handle data fetching
- Control error/loading/empty states

---

## Scalability Benefits

### Easy Feature Addition

**Adding a new feature:**

```bash
# Create feature directory
mkdir -p src/features/new-feature/components

# Copy from template
cp src/features/resume/ResumeFeature.tsx \
   src/features/new-feature/NewFeature.tsx
```

No need to modify existing code. Feature is isolated.

### Easy Feature Removal

**Removing a feature:**

```bash
# Delete feature directory
rm -rf src/features/old-feature

# Remove route (if any)
rm src/app/old-feature/page.tsx
```

No hunt-and-delete across multiple directories.

### Team Collaboration

**Multiple teams working simultaneously:**

- **Team A**: Works in `features/resume/`
- **Team B**: Works in `features/blog/`
- **Team C**: Works in `features/time-tracker/`

**Result**: Zero merge conflicts in most cases.

### Code Understanding

**New developer onboarding:**

```bash
# "Where's the time tracker logic?"
cd src/features/time-tracker
# Everything is here!
```

No need to learn the entire codebase structure.

---

## Alternatives Considered

### 1. Domain-Driven Design (DDD)

**Structure:**

```
src/domains/
├── user/
├── article/
└── time/
```

**Pros:**

- Aligns with business domains
- Clear domain boundaries

**Cons:**

- Overkill for small projects
- Complex domain mapping
- More abstraction layers

**Why not chosen**: Too heavyweight for a personal portfolio site.

### 2. Layered Architecture

**Structure:**

```
src/
├── presentation/
├── application/
├── domain/
└── infrastructure/
```

**Pros:**

- Clear separation of concerns
- Follows clean architecture

**Cons:**

- Hard to navigate
- Scattered feature logic
- Overkill for frontend

**Why not chosen**: Too many layers for a Next.js app.

### 3. Atomic Design

**Structure:**

```
src/components/
├── atoms/
├── molecules/
├── organisms/
└── templates/
```

**Pros:**

- Good for design systems
- Clear component hierarchy

**Cons:**

- Focuses only on UI
- Doesn't organize hooks/utils
- Hard to categorize components

**Why not chosen**: Doesn't solve the feature isolation problem.

---

## Trade-offs

### What We Gain

- ✅ **Co-location** - Related code stays together
- ✅ **Scalability** - Easy to add/remove features
- ✅ **Team velocity** - Reduced conflicts and cognitive load
- ✅ **Maintainability** - Clear ownership and boundaries

### What We Accept

- ⚠️ **Duplication** - Some code might be duplicated across features (acceptable)
- ⚠️ **Refactoring cost** - Extracting shared code requires moving to `@packages/shared`
- ⚠️ **File navigation** - More directories to navigate (mitigated by editor search)

### Duplication vs Coupling

**Philosophy**: Prefer duplication over wrong coupling.

**Example**: Two features need date formatting.

**❌ Wrong**: Create `@packages/shared/utils/formatDate.ts` immediately
**✅ Right**: Let each feature implement it first, extract to shared only when 3+ features need it

**Why?** Premature abstraction is worse than duplication. Wait until the pattern is clear.

---

## Implementation Details

### ESLint Enforcement

The architecture is enforced by ESLint:

```javascript
// .eslintrc.js
rules: {
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['@/features/*/hooks', '@/features/*/types', '@/features/*/components'],
          message: 'Cannot import from other features. Use @packages/shared instead.'
        }
      ]
    }
  ]
}
```

**Result**: Build fails if you try to import across features.

### TypeScript Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["src/features/*"],
      "@packages/*": ["../../packages/*"]
    }
  }
}
```

**Result**: Clean imports with clear boundaries.

---

## Evolution Path

### Phase 1: Small Project (Current)

- Features as directories
- Minimal shared code
- Direct feature imports in pages

### Phase 2: Medium Project (Future)

- Extract common patterns to `@packages/shared`
- Create feature flags for A/B testing
- Add inter-feature communication via event bus

### Phase 3: Large Project (If Needed)

- Split features into separate packages
- Implement micro-frontends
- Add feature-level dependency injection

**Current state**: Phase 1. Will evolve as needed.

---

## Related Patterns

### Next.js App Router Integration

```
src/
├── app/                    # Next.js routes
│   ├── page.tsx            # → resume feature
│   ├── blog/page.tsx       # → blog feature
│   └── time-tracker/page.tsx  # → time-tracker feature
└── features/               # Feature implementations
    ├── resume/
    ├── blog/
    └── time-tracker/
```

**Pages** are thin wrappers that import **features**.

### Shared Component Library

```
packages/shared/
└── src/
    └── components/
        ├── ui/             # Generic UI (Button, Modal)
        └── layout/         # Layout components (Header, Footer)
```

**Shared components** have no feature-specific logic.

---

## Best Practices

### ✅ Do

1. **Co-locate everything** - Keep feature code together
2. **Use feature orchestrators** - Main Feature component coordinates sub-components
3. **Extract to shared only when needed** - Wait for 3+ usages
4. **Follow consistent structure** - All features look the same
5. **Respect boundaries** - No cross-feature imports

### ❌ Don't

1. **Don't import across features** - Use `@packages/shared` instead
2. **Don't create shared code prematurely** - Wait for clear patterns
3. **Don't mix feature and shared logic** - Keep them separate
4. **Don't nest features deeply** - Keep feature directories flat
5. **Don't skip the Feature component** - Always create the orchestrator

---

## Real-World Examples

### Example 1: Time Tracker Feature

**Structure:**

```
features/time-tracker/
├── TimeTrackerFeature.tsx          # Orchestrator
├── components/
│   ├── HeaderSection/              # Header with tabs
│   ├── MainTabContent/             # Main content area
│   │   ├── MainTab.tsx
│   │   ├── WeeklyTab.tsx
│   │   └── SettingsTab.tsx
│   ├── TimerDisplay/               # Current timer
│   └── TimeEntryCard/              # Entry list item
├── hooks/
│   ├── useTimeTracker.ts           # Main state management
│   ├── useWeeklyStats.ts           # Weekly statistics
│   └── useUserSettings.ts          # User preferences
├── utils/
│   ├── timeCalculator.ts           # Duration calculations
│   ├── timeFormatter.ts            # Display formatting
│   └── timeValidator.ts            # Input validation
└── types/
    └── timeEntry.types.ts          # TimeEntry, UserSettings
```

**Why it works:**

- All time tracker logic in one place
- Can delete entire feature without hunting files
- Team can work on time tracker without conflicts
- New developer finds everything in `features/time-tracker/`

### Example 2: Blog Feature

**Structure:**

```
features/blog/
├── BlogFeature.tsx                 # Orchestrator
├── components/
│   ├── ArticleCard/                # Individual article
│   └── EmptyState/                 # No articles state
├── hooks/
│   └── useMediumArticles.ts        # Infinite scroll data fetching
└── types/
    └── article.types.ts            # Article type (extends shared Article)
```

**Why it works:**

- Simple feature, simple structure
- Uses React Query for data fetching
- Reuses shared `Article` type but extends it
- No utils needed (uses shared utilities)

---

## Conclusion

Feature-based architecture is the right choice for this project because:

1. **Scalability**: Easy to add/remove features as requirements change
2. **Maintainability**: Clear boundaries and ownership
3. **Developer Experience**: Reduced cognitive load and merge conflicts
4. **Flexibility**: Can evolve to more complex patterns if needed

**Philosophy**: Start simple, evolve as needed, prioritize developer experience.

---

## Related Documentation

- [Architecture Reference](../reference/architecture.md) - Complete system architecture
- [Monorepo Strategy](./monorepo-strategy.md) - Why Turborepo
- [Development Setup](../guides/development-setup.md) - How to set up locally
- [ADR 002: AGENTS.md Adoption](../adr/002-agents-md-adoption.md) - AI-first development

---

## Further Reading

- [Feature-Sliced Design](https://feature-sliced.design/) - Similar methodology
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) - Enterprise alternative
- [The Mikado Method](https://mikadomethod.info/) - Refactoring strategy
- [Modular Monoliths](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer) - Architecture evolution
