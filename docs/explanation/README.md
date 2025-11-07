# 💡 Explanation

**Understanding-oriented documentation** - Concepts, context, and the "why" behind technical decisions.

## 📖 Philosophy

Explanations clarify and illuminate topics. They provide context, discuss alternatives, and deepen understanding without teaching or directing.

**Characteristics:**

- ✅ Understanding-oriented (building context)
- ✅ Discusses alternatives and trade-offs
- ✅ Provides background and history
- ✅ Explains "why" not "how"
- ✅ Connects concepts together

**Not for:**

- ❌ Step-by-step instructions (use [Guides](../guides/))
- ❌ Complete technical specs (use [Reference](../reference/))
- ❌ Teaching from scratch (use [Tutorials](../tutorials/))

---

## 📚 Available Explanations

### Architecture & Design

- **[Feature-Based Architecture](./feature-based-architecture.md)** - Why we organize code by features
- **[Monorepo Strategy](./monorepo-strategy.md)** - Why Turborepo and monorepo approach
- **[React Query Patterns](./react-query-patterns.md)** - SSG + React Query integration strategy

### Technical Decisions

- **[Git Hooks Research](./git-hooks-research.md)** - Industry best practices and research findings

---

## 🎯 When to Write Explanations

Create explanation docs when:

- A technical decision needs justification
- Multiple approaches exist (discuss trade-offs)
- Understanding "why" helps developers make better choices
- Concepts connect across multiple features
- Historical context is important

**Good topics for Explanation:**

- ✅ Architectural patterns and principles
- ✅ Technology choices and alternatives
- ✅ Design trade-offs
- ✅ Industry research and best practices
- ✅ System behavior and characteristics

**Not for Explanation:**

- ❌ "How to set up X" → Guide
- ❌ "API specification for X" → Reference
- ❌ "Learn X from scratch" → Tutorial

---

## 🆕 Creating New Explanations

Use the [explanation template](../.templates/explanation-template.md):

```bash
cp docs/.templates/explanation-template.md docs/explanation/your-explanation.md
```

**Naming Convention:**

- Use kebab-case: `your-explanation.md`
- Conceptual names: `feature-based-architecture.md`
- Avoid "how-to": `monorepo-strategy.md` not `how-to-use-monorepo.md`

**Required Sections:**

1. Overview (what concept/decision)
2. Context (why this matters)
3. Explanation (the "why" and "what")
4. Alternatives (other approaches, trade-offs)
5. Implications (what this means in practice)
6. Related (cross-references)

**Best Practices:**

- Discuss alternatives fairly
- Explain trade-offs honestly
- Provide historical context
- Connect to broader principles
- Link to ADRs for specific decisions

---

## 🤖 For AI Agents

When user asks **"why"** or needs **conceptual understanding**:

1. Check if explanation exists
2. If not, create using template
3. Focus on concepts, not procedures
4. Discuss alternatives and trade-offs
5. Link to ADR for specific decisions
6. Link to Guides for how-to

**Example mapping:**

- "Why feature-based folders?" → Feature-Based Architecture explanation
- "Why use React Query with SSG?" → React Query Patterns explanation
- "How do I use React Query?" → Guide (not explanation)
- "What are the React Query options?" → Reference (not explanation)

**Relationship with ADRs:**

- **Explanation**: Discusses general concepts and alternatives (e.g., "Monorepo strategies")
- **ADR**: Records specific decision for this project (e.g., "ADR 002: We chose Turborepo")

An Explanation should discuss the topic broadly, while ADRs capture what we specifically decided.

---

## 🔗 Relationship with Other Doc Types

```
Explanation → "Why we use X pattern"
     ↓
   ADR → "Decision to use X in our project"
     ↓
Reference → "X API specification"
     ↓
 Guide → "How to use X to solve Y"
     ↓
Tutorial → "Learn X fundamentals"
```

**Example Flow:**

1. [Explanation](./react-query-patterns.md) - Discusses SSG + React Query patterns
2. [ADR 001](../adr/001-react-query-ssg-pattern.md) - Records our specific decision
3. [Reference](../reference/api/) - Documents our API specifications
4. [Guide](../guides/) - Shows how to implement the pattern (future)
5. [Tutorial](../tutorials/02-adding-new-feature.md) - Teaches through example
