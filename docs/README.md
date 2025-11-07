# 📚 Documentation

This project uses the [Diataxis framework](https://diataxis.fr/) for documentation organization, optimized for both AI and human readers.

## 🎯 Documentation Philosophy

- **AI-First**: Structured for LLM comprehension and generation
- **Human-Friendly**: Clear navigation for developers and stakeholders
- **Scalable**: Grows with the project complexity
- **Searchable**: Easy to find what you need

---

## 📖 Documentation Types

The Diataxis framework organizes documentation into four distinct types based on user needs:

```
                Learning-Oriented
                       │
          Tutorials    │    How-to Guides
           (教學)      │      (操作指南)
    Study ─────────────┼──────────────── Goals
                       │
        Explanation    │     Reference
         (概念說明)     │     (技術參考)
                       │
                Understanding-Oriented
```

### 🛠️ [Guides](./guides/) - How-to Guides

**Problem-oriented**: Step-by-step instructions to solve specific problems.

- [Git Workflow](./guides/git-workflow.md) - Using git hooks and automation
- [Development Setup](./guides/development-setup.md) - Setting up local environment
- [Deployment](./guides/deployment.md) - Deploying to production
- [Contributing](./guides/contributing.md) - How to contribute to this project

**When to use**: "How do I...?" questions

---

### 📖 [Tutorials](./tutorials/) - Learning Path

**Learning-oriented**: Guided lessons to learn fundamental concepts.

- [01 - Project Setup](./tutorials/01-project-setup.md) - From zero to hello world
- [02 - Adding New Feature](./tutorials/02-adding-new-feature.md) - Feature development workflow
- [03 - Medium Integration](./tutorials/03-medium-integration.md) - Working with Medium API

**When to use**: Onboarding new developers or learning new concepts

---

### 📋 [Reference](./reference/) - Technical Specifications

**Information-oriented**: Complete technical details, APIs, and configurations.

- [Architecture](./reference/architecture.md) - System architecture overview
- [Commitlint Rules](./reference/commitlint-rules.md) - Commit message rules
- [Git Hooks](./reference/git-hooks.md) - Git hooks configuration
- [Environment Variables](./reference/environment-variables.md) - All env vars
- [CLI Commands](./reference/cli-commands.md) - Available commands
- [API Reference](./reference/api/) - REST API specifications

**When to use**: Looking up exact specifications or API details

---

### 💡 [Explanation](./explanation/) - Concepts & Context

**Understanding-oriented**: Why things are designed this way, background knowledge.

- [Feature-Based Architecture](./explanation/feature-based-architecture.md) - Why feature folders
- [React Query Patterns](./explanation/react-query-patterns.md) - SSG + React Query strategy
- [Git Hooks Research](./explanation/git-hooks-research.md) - Industry best practices
- [Monorepo Strategy](./explanation/monorepo-strategy.md) - Why Turborepo

**When to use**: Understanding "why" behind technical decisions

---

### 📝 [ADR](./adr/) - Architecture Decision Records

**Decision-oriented**: Historical record of significant technical decisions.

- [ADR Template](./adr/template.md) - Template for new ADRs
- [001 - React Query SSG Pattern](./adr/001-react-query-ssg-pattern.md)
- [002 - Agents.md Adoption](./adr/002-agents-md-adoption.md)
- [003 - Git Hooks Optimization](./adr/003-git-hooks-optimization.md)

**When to use**: Making or understanding major architectural decisions

---

## 🤖 For AI Agents

### Document Metadata

All documents include YAML frontmatter:

```yaml
---
title: Document Title
type: guide|tutorial|reference|explanation|adr
status: draft|review|stable|deprecated
audience: [developer, ai, end-user]
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
related:
  - path/to/related/doc.md
ai_context: |
  Brief context for AI to understand the purpose and scope.
---
```

### Document Templates

Use templates in [`docs/.templates/`](./.templates/) when generating new documentation:

- [Guide Template](./.templates/guide-template.md)
- [Tutorial Template](./.templates/tutorial-template.md)
- [Reference Template](./.templates/reference-template.md)
- [Explanation Template](./.templates/explanation-template.md)

### Cross-References

Documents link to related content using relative paths. AI agents should:

1. Check `related` field in frontmatter
2. Follow cross-reference links
3. Understand document relationships

---

## 🔍 Quick Navigation

### I want to...

- **Learn the project from scratch** → Start with [Tutorials](./tutorials/)
- **Solve a specific problem** → Check [Guides](./guides/)
- **Look up technical details** → See [Reference](./reference/)
- **Understand why decisions were made** → Read [Explanation](./explanation/) or [ADR](./adr/)
- **Make an architectural decision** → Create new [ADR](./adr/) using the template

### By Topic

- **Git & CI/CD**: [Git Workflow Guide](./guides/git-workflow.md), [Git Hooks Reference](./reference/git-hooks.md), [Git Hooks Research](./explanation/git-hooks-research.md), [ADR 003](./adr/003-git-hooks-optimization.md)
- **Architecture**: [Architecture Reference](./reference/architecture.md), [Feature-Based Explanation](./explanation/feature-based-architecture.md)
- **API**: [API Reference](./reference/api/)
- **React Query**: [React Query Patterns](./explanation/react-query-patterns.md), [ADR 001](./adr/001-react-query-ssg-pattern.md)

---

## 📝 Contributing to Documentation

1. Choose the right document type using Diataxis principles
2. Use the appropriate template from [`docs/.templates/`](./.templates/)
3. Include YAML frontmatter with all required fields
4. Add cross-references to related documents
5. Follow the project's writing style (see [CONTRIBUTING.md](../CONTRIBUTING.md))
6. Update this README if adding new top-level documents

---

## 📚 Further Reading

- [Diataxis Framework](https://diataxis.fr/) - Official documentation
- [AGENTS.md](../AGENTS.md) - AI agent configuration for this project
- [CLAUDE.md](../CLAUDE.md) - Claude Code specific instructions
