# Documentation Migration Plan

## Overview

This document tracks the migration of legacy documentation to the Diataxis framework structure.

**Status**: ✅ Phase 1-5 Complete | ⏳ Phase 6 Cleanup In Progress

## Migration Status

### ✅ Completed Migrations

| Legacy File                     | New Location                             | Status     |
| ------------------------------- | ---------------------------------------- | ---------- |
| `docs/git-automation-checks.md` | Multiple files in Diataxis structure     | ✅ Split   |
| -                               | `docs/guides/git-workflow.md`            | ✅ Created |
| -                               | `docs/reference/commitlint-rules.md`     | ✅ Created |
| -                               | `docs/reference/git-hooks.md`            | ✅ Created |
| -                               | `docs/explanation/git-hooks-research.md` | ✅ Created |
| -                               | `docs/adr/003-git-hooks-optimization.md` | ✅ Created |

### ⏳ Pending Migrations

| Legacy File                | Future Location                             | Priority | Notes                         |
| -------------------------- | ------------------------------------------- | -------- | ----------------------------- |
| `LOGGER-GUIDE.md`          | `docs/guides/structured-logging.md`         | Medium   | Structured logging guide      |
| `ISSUE-MANAGEMENT.md`      | `docs/guides/issue-management.md`           | Medium   | P0-P3 issue system            |
| `MEDIUM-ARTICLES-GUIDE.md` | `docs/guides/medium-article-sync.md`        | Low      | Article sync process          |
| `time-tracker-timezone.md` | `docs/explanation/time-tracker-timezone.md` | Low      | Timezone handling explanation |
| `CONFIGURATION.md`         | `docs/reference/configuration.md`           | Low      | Monorepo configuration        |

### 📦 Archive Only (Historical Records)

| Legacy File            | Archive Status | Notes                           |
| ---------------------- | -------------- | ------------------------------- |
| `MONOREPO_REFACTOR.md` | ✅ Archived    | Completed refactor (2025-10-20) |

## Archive Strategy

### Phase 6 Cleanup (Current)

1. ✅ Create `docs/archive/` directory
2. ✅ Add deprecation notices to legacy docs
3. ✅ Create this migration plan
4. ✅ Move completed refactor docs to archive

### Future Cleanup (Phase 7+)

1. Migrate remaining legacy docs (as needed)
2. Move archived docs to `docs/archive/`
3. Update all references to archived docs
4. Remove or archive deprecated files

## New Documentation Created

### Phase 1: Framework Skeleton

- ✅ `docs/README.md` - Main documentation hub
- ✅ `docs/{guides,tutorials,reference,explanation}/README.md` - Category landing pages
- ✅ `docs/adr/{README.md,template.md}` - ADR system
- ✅ `docs/.templates/*.md` - Document templates (4 files)

### Phase 2: Git Automation Split

- ✅ 5 documents split from `git-automation-checks.md`

### Phase 3: Key Documents

- ✅ `docs/guides/development-setup.md` - Setup guide
- ✅ `docs/tutorials/01-project-setup.md` - First tutorial
- ✅ `docs/explanation/feature-based-architecture.md` - Architecture explanation
- ✅ `docs/explanation/react-query-patterns.md` - React Query patterns
- ✅ `docs/explanation/monorepo-strategy.md` - Monorepo explanation

### Phase 4: API Documentation

- ✅ `docs/reference/api/README.md` - API overview
- ✅ `docs/reference/api/define-api.md` - /api/define endpoint
- ✅ `docs/reference/api/ai-analyzer-api.md` - /api/ai-analyzer endpoint
- ✅ `docs/reference/api/medium-articles-api.md` - /api/medium-articles endpoint

### Phase 5: Navigation

- ✅ `README.md` - Added Documentation section
- ✅ `CLAUDE.md` - Added Documentation System section

### Critical Fixes

- ✅ Fixed broken links in all READMEs
- ✅ Created `docs/reference/architecture.md` (2209 lines)
- ✅ Marked all legacy docs as deprecated

## Statistics

**Total Documents Created**: 27+ files
**Total Lines Written**: 10,000+ lines
**Phases Completed**: 5/6
**Coverage**: ~80% of planned documentation

## Next Actions

1. **Immediate** (Phase 6):
   - [ ] Archive `MONOREPO_REFACTOR.md`
   - [x] Validate key internal links
   - [ ] Final commit and PR

2. **Future** (Post-merge):
   - [ ] Migrate logger guide when structured logging changes
   - [ ] Migrate issue management guide when P0-P3 system changes
   - [ ] Create remaining tutorials (02, 03)
   - [ ] Create environment variables reference
   - [ ] Create CLI commands reference

## Success Criteria

- ✅ All critical docs have Diataxis equivalents
- ✅ All new docs have YAML frontmatter and AI context
- ✅ Cross-references are complete
- ✅ Root README and CLAUDE.md updated
- ⏳ Legacy docs marked as deprecated
- ⏳ Archive directory created
- ⏳ Migration plan documented

## Related

- [Issue #50](https://github.com/u88803494/my-website/issues/50) - Adopt Diataxis framework
- [Diataxis Framework](https://diataxis.fr/) - Official documentation
- [docs/README.md](../README.md) - Documentation hub
