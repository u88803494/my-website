# ADR 002: Adopt AGENTS.md Standard for AI Configuration

## Status

Accepted

## Date

2025-11-04

## Context

### Problem

Multiple AI coding tools require separate configuration files, creating duplication and maintenance burden:

- **Claude Code**: Required `CLAUDE.md` (13KB)
- **Cursor IDE**: Required `.cursorrules` (8.7KB)
- **Windsurf IDE**: No configuration file
- **Gemini CLI**: Configurable via `settings.json`
- **Qwen**: Deprecated, using `PROJECT_SUMMARY.md`

**Issues with this approach:**

- ❌ Content duplication (~70% overlap between CLAUDE.md and .cursorrules)
- ❌ Synchronization burden (updating 3+ files for each change)
- ❌ Inconsistency risk across different AI tools
- ❌ No industry standard for configuration

### Industry Standard: AGENTS.md

Research revealed [AGENTS.md](https://agents.md/) as an emerging open standard:

- **Adoption**: 20,000+ GitHub repositories
- **Support**: Cursor, Windsurf, Gemini CLI, RooCode, Zed, GitHub Copilot
- **Community**: Strong community support (e.g., GitHub Issue #6235 with 1000+ 👍)
- **Apache Superset** and other major projects already using it

**Current Claude Code Status:**

- Does NOT natively support AGENTS.md yet (as of Nov 2025)
- Feature request pending: https://github.com/anthropics/claude-code/issues/6235
- **Workaround available**: Reference AGENTS.md via `@AGENTS.md` syntax in CLAUDE.md

## Decision

Adopt **AGENTS.md as the single source of truth** for common AI configuration, with tool-specific wrappers:

```
AGENTS.md                    # Main configuration (industry standard, ~200 lines)
├── CLAUDE.md                # Claude Code entry (@AGENTS.md + specific features)
├── .cursorrules → AGENTS.md # Symbolic link (Cursor IDE)
└── .windsurfrules → AGENTS.md # Symbolic link (Windsurf IDE)
```

### Configuration Strategy

**AGENTS.md contains:**

- Project overview and communication guidelines
- Monorepo structure and development commands
- Architecture patterns and boundaries
- Code standards (TypeScript, naming, import order)
- Styling guidelines (Tailwind, DaisyUI)
- State management patterns
- Git conventions

**CLAUDE.md contains:**

- `@AGENTS.md` reference (imports all common config)
- Claude Code-specific features:
  - React Query + Next.js SSG patterns
  - API routes documentation
  - Medium article automation
  - Subagents usage guide
  - MCP servers configuration
  - TodoWrite task management
  - Instruction hierarchy
  - Workflow best practices

**Tool-specific setup:**

- **Cursor**: Reads `.cursorrules` (symlink → AGENTS.md)
- **Windsurf**: Reads `.windsurfrules` (symlink → AGENTS.md)
- **Gemini CLI**: Configured via `settings.json` → `"contextFileName": "AGENTS.md"`
- **Claude Code**: Reads `CLAUDE.md` → references `@AGENTS.md`

## Consequences

### Positive

✅ **Single Source of Truth**

- Common configuration maintained in one place (AGENTS.md)
- Updates propagate automatically via symlinks and references

✅ **Industry Standard**

- Follows widely adopted AGENTS.md specification
- Future-proof as more tools adopt the standard
- VS Code Copilot also planning support

✅ **Tool-Specific Customization**

- Claude Code retains CLAUDE.md for specific features
- Other tools can add tool-specific configs if needed

✅ **Reduced Maintenance**

- Update once in AGENTS.md vs 3+ separate files
- Automatic sync for Cursor/Windsurf via symlinks

✅ **Backward Compatible**

- Existing tools continue working immediately
- No breaking changes to current workflows

### Negative

⚠️ **Claude Code Workaround**

- Requires `@AGENTS.md` reference until native support
- Adds one level of indirection
- Depends on Issue #6235 for full native support

⚠️ **Symbolic Link Limitations**

- Windows requires Developer Mode or admin rights
- Known bugs in Claude Code with symlinks (Issues #764, #1388, #3575)
- Cursor/Windsurf symlink support needs testing

⚠️ **File Structure Change**

- New file structure may confuse developers initially
- Requires documentation update

⚠️ **Content Split Decisions**

- Determining what goes in AGENTS.md vs CLAUDE.md requires judgment
- May need iteration and refinement

### Mitigations

- **Documentation**: Comprehensive ADR and updated project docs explain rationale
- **Testing**: Verify all AI tools read configuration correctly
- **Fallback**: If symlinks fail on Windows, can use copy scripts as backup
- **Iteration**: Content split can be adjusted based on usage feedback

## Implementation

### Files Created

- `AGENTS.md` - Main configuration (207 lines)
- `CLAUDE.md` - Claude Code wrapper with @AGENTS.md reference (202 lines)

### Files Modified

- `.gemini/settings.json` - Added `"contextFileName": "AGENTS.md"`

### Symbolic Links Created

- `.cursorrules → AGENTS.md`
- `.windsurfrules → AGENTS.md`

### Files Removed

- `.qwen/` directory (deprecated)

### Total Size Impact

- **Before**: CLAUDE.md (13KB) + .cursorrules (8.7KB) = 21.7KB
- **After**: AGENTS.md (7.9KB) + CLAUDE.md (6.5KB) + symlinks (0 bytes) = 14.4KB
- **Reduction**: ~33% smaller with no duplication

## References

- [AGENTS.md Specification](https://agents.md/)
- [AGENT.md GitHub Repository](https://github.com/agentmd/agent.md)
- [Claude Code Issue #6235: Support AGENTS.md](https://github.com/anthropics/claude-code/issues/6235)
- [Factory's AGENTS.md Implementation Guide](https://docs.factory.ai/cli/configuration/agents-md)
- [Apache Superset Implementation](https://github.com/apache/superset)

## Future Considerations

### When Claude Code Adds Native AGENTS.md Support

Once Issue #6235 is resolved:

1. **Simplify CLAUDE.md**: Remove `@AGENTS.md` reference, keep only Claude-specific content
2. **Priority Order**: Claude Code will likely check CLAUDE.md first, then AGENTS.md
3. **No Breaking Changes**: Current structure remains forward-compatible
4. **Optional**: Consider moving Claude-specific content to separate file

### Monorepo Modularity (Optional)

AGENTS.md supports hierarchical configuration:

```
apps/my-website/AGENTS.md    # App-specific rules (optional)
packages/shared/AGENTS.md    # Package-specific rules (optional)
```

Priority: Closest file wins → Parent directory → Root directory

This can be added later if specific packages need unique configurations.

## Testing

- [x] Claude Code reads CLAUDE.md and @AGENTS.md reference
- [x] Cursor reads .cursorrules symlink
- [x] Windsurf reads .windsurfrules symlink
- [x] Gemini CLI reads AGENTS.md via settings.json
- [x] `pnpm check` passes
- [x] No build errors
- [x] Git operations work correctly

## Approval

Approved by: Henry Lee
Date: 2025-11-04
