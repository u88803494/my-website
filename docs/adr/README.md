# 📝 Architecture Decision Records (ADRs)

**Decision-oriented documentation** - Recording significant architectural and technical decisions made in this project.

## 📖 What are ADRs?

Architecture Decision Records document important decisions that affect the structure, patterns, or technologies used in this project. They capture:

- **What** decision was made
- **Why** it was made
- **What alternatives** were considered
- **What consequences** resulted

ADRs are immutable historical records. Once written, they should not be changed (except for formatting). If a decision is reversed, create a new ADR that supersedes the old one.

---

## 📚 ADR Index

### Active Decisions

- **[001 - React Query SSG Pattern](./001-react-query-ssg-pattern.md)** ✅
  - Decision: Use React Query with Next.js SSG via HydrationBoundary
  - Status: Accepted
  - Date: 2024-12-15

- **[002 - Agents.md Adoption](./002-agents-md-adoption.md)** ✅
  - Decision: Adopt Agents.md standard for AI agent configuration
  - Status: Accepted
  - Date: 2024-12-28

- **[003 - Git Hooks Optimization](./003-git-hooks-optimization.md)** ✅
  - Decision: Two-tier commit size limits with pre-commit/pre-push strategy
  - Status: Accepted
  - Date: 2025-01-07

### Superseded Decisions

_(None yet)_

### Deprecated Decisions

_(None yet)_

---

## 🆕 Creating New ADRs

### When to Create an ADR

Create an ADR when making decisions about:

- ✅ **Architecture**: System structure, component boundaries
- ✅ **Technology choices**: Frameworks, libraries, tools
- ✅ **Patterns**: Design patterns, coding conventions
- ✅ **Infrastructure**: Deployment, CI/CD, hosting
- ✅ **Standards**: Documentation, testing, code style

**Don't create ADRs for:**

- ❌ Implementation details (code-level decisions)
- ❌ Temporary or easily reversible choices
- ❌ Obvious decisions with no alternatives
- ❌ Personal preferences without technical merit

### Process

1. **Copy the template**:

   ```bash
   cp docs/adr/template.md docs/adr/00X-your-decision.md
   ```

2. **Number sequentially**: Use next available number (004, 005, etc.)

3. **Fill out all sections**: Follow the template structure

4. **Link related docs**: Connect to Explanations, Guides, References

5. **Commit**: Create a separate commit for the ADR

6. **Update this README**: Add your ADR to the index above

---

## 📋 ADR Template

See [template.md](./template.md) for the standard ADR format.

**Required sections:**

1. Title and metadata
2. Status
3. Context
4. Decision
5. Consequences
6. Alternatives Considered

---

## 🔗 Relationship with Other Doc Types

```
Research & Analysis
      ↓
Explanation Doc (discusses concepts broadly)
      ↓
ADR (records specific decision for this project)
      ↓
Reference Doc (technical specifications)
      ↓
Guide (how to implement)
```

**Example:**

- [Explanation: Git Hooks Research](../explanation/git-hooks-research.md) - Industry research
- [ADR 003: Git Hooks Optimization](./003-git-hooks-optimization.md) - Our decision
- [Reference: Git Hooks](../reference/git-hooks.md) - Technical specs
- [Guide: Git Workflow](../guides/git-workflow.md) - How to use

---

## 🤖 For AI Agents

### When to Create ADRs

If user is making a **significant technical decision**:

1. Suggest creating an ADR
2. Use the template
3. Research alternatives thoroughly
4. Document trade-offs honestly
5. Link to related Explanation docs

### ADR vs Explanation

- **ADR**: "We decided to use X for Y because Z"
- **Explanation**: "Here's how X works and when to use it"

An ADR is project-specific and decision-focused. An Explanation is general and understanding-focused.

### Status Transitions

```
                 ┌─────────────┐
                 │   Proposed  │
                 └──────┬──────┘
                        │
           ┌────────────┼────────────┐
           │                         │
           ↓                         ↓
    ┌──────────┐             ┌──────────┐
    │ Accepted │             │ Rejected │
    └────┬─────┘             └──────────┘
         │
         │ (later decision)
         ↓
    ┌────────────┐
    │ Superseded │
    └────────────┘
         │
         ↓
    ┌────────────┐
    │ Deprecated │
    └────────────┘
```

- **Proposed**: Under review, not yet decided
- **Accepted**: Decision made and implemented
- **Rejected**: Considered but not chosen
- **Superseded**: Replaced by newer ADR
- **Deprecated**: No longer applicable

---

## 📖 Further Reading

- [Architecture Decision Records (GitHub)](https://adr.github.io/)
- [ADR Best Practices](https://github.com/joelparkerhenderson/architecture-decision-record)
- [When to Write an ADR](https://github.com/joelparkerhenderson/architecture-decision-record#when-to-write-an-adr)
