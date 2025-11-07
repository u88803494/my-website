# [Concept/Pattern/Decision Name]

---

title: [Full title]
type: explanation
status: draft|review|stable|deprecated
audience: [developer, ai, architect]
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
related:

- adr/related-decision.md
- reference/related-tech.md
- guides/related-guide.md
  ai_context: |
  Brief context about what concept or pattern this explains.

---

## Overview

**What this explains**: One-sentence description of the concept or pattern.

**Why this matters**: Brief explanation of the relevance and importance.

**Key insight**: The core principle or understanding you want readers to take away.

---

## Context

### The Problem Space

What problem or challenge does this concept address?

- Problem 1
- Problem 2
- Problem 3

### Why This Matters

Explain the significance:

- Impact on development workflow
- Impact on code quality
- Impact on maintainability
- Impact on performance

### Historical Context (optional)

How did we get here? What led to this approach?

---

## The Core Concept

### What Is [Concept]?

Fundamental explanation of the concept in simple terms.

**Key characteristics**:

- Characteristic 1
- Characteristic 2
- Characteristic 3

### How It Works

Detailed explanation of the mechanism or pattern:

1. **Step/Aspect 1**: Explanation
2. **Step/Aspect 2**: Explanation
3. **Step/Aspect 3**: Explanation

**Diagram** (if helpful):

```
Visual representation of concept
┌─────────┐
│Component│
└────┬────┘
     │
     ↓
┌─────────┐
│ Result  │
└─────────┘
```

### Core Principles

The fundamental rules or principles:

- **Principle 1**: Explanation and why it matters
- **Principle 2**: Explanation and why it matters
- **Principle 3**: Explanation and why it matters

---

## When to Use This Approach

### Ideal Use Cases

This approach works well when:

- ✅ Scenario 1 - Explanation
- ✅ Scenario 2 - Explanation
- ✅ Scenario 3 - Explanation

### When NOT to Use

This approach may not be suitable when:

- ❌ Scenario 1 - Explanation
- ❌ Scenario 2 - Explanation
- ❌ Scenario 3 - Explanation

---

## Alternatives & Trade-offs

### Alternative 1: [Name]

**What it is**: Brief description.

**How it differs**: Key differences from the main approach.

**Trade-offs**:
| Aspect | This Approach | Alternative 1 |
|--------|--------------|---------------|
| Complexity | Low | High |
| Performance | Fast | Slower |
| Flexibility | Moderate | High |

**When to prefer**: Use Alternative 1 when [scenario].

---

### Alternative 2: [Name]

**What it is**: Brief description.

**How it differs**: Key differences.

**Trade-offs**:
| Aspect | This Approach | Alternative 2 |
|--------|--------------|---------------|
| Learning curve | Gentle | Steep |
| Maintenance | Easy | Complex |
| Scalability | Good | Excellent |

**When to prefer**: Use Alternative 2 when [scenario].

---

## Real-World Implications

### Impact on Development

**Positive impacts**:

- ✅ Impact 1
- ✅ Impact 2
- ✅ Impact 3

**Challenges**:

- ⚠️ Challenge 1
- ⚠️ Challenge 2
- ⚠️ Challenge 3

### Impact on Team

How this affects team dynamics and workflow:

- Team consideration 1
- Team consideration 2

### Impact on Architecture

How this shapes system design:

- Architectural implication 1
- Architectural implication 2

---

## Common Misconceptions

### Misconception 1: [Common Misunderstanding]

**The misconception**: What people incorrectly believe.

**The reality**: What's actually true.

**Why this matters**: Impact of the misconception.

---

### Misconception 2: [Common Misunderstanding]

**The misconception**: What people incorrectly believe.

**The reality**: What's actually true.

---

## Industry Perspective

### How Others Approach This

**Company/Project A**:

- Their approach
- Key differences
- Results

**Company/Project B**:

- Their approach
- Key differences
- Results

### Best Practices from Industry

- Best practice 1 (Source: [Company/Research])
- Best practice 2 (Source: [Company/Research])
- Best practice 3 (Source: [Company/Research])

---

## Example Scenarios

### Scenario 1: [Real-World Case]

**Context**: Describe the situation.

**How the concept applies**: Explain application.

**Outcome**: What happens as a result.

**Key lesson**: What to learn from this scenario.

---

### Scenario 2: [Real-World Case]

**Context**: Describe the situation.

**How the concept applies**: Explain application.

**Outcome**: What happens as a result.

---

## Further Reading

### Internal Documentation

- [ADR: Specific Decision](../adr/XXX-decision.md) - Our implementation
- [Reference: Technical Specs](../reference/tech.md) - Detailed specifications
- [Guide: How to Implement](../guides/how-to.md) - Practical application

### External Resources

- [Research Paper/Article](https://example.com) - Original research
- [Industry Blog Post](https://example.com) - Practical perspective
- [Documentation](https://example.com) - Official docs

### Related Concepts

- [Related Concept 1](./related-concept-1.md)
- [Related Concept 2](./related-concept-2.md)

---

## Summary

**Key takeaways**:

1. **Takeaway 1**: Core principle or understanding
2. **Takeaway 2**: Important trade-off or consideration
3. **Takeaway 3**: When to apply this approach

**In practice**: Brief statement of how to think about this in daily work.

---

## Template Instructions (Remove this section)

**How to use this explanation template:**

1. **Title**: Use format "[Concept/Pattern/Decision Name]" (not "How to...")
2. **Frontmatter**: Fill in all YAML fields
3. **Overview**: State what concept you're explaining
4. **Context**: Explain why this concept exists
5. **Core Concept**: Detailed explanation of how it works
6. **When to Use**: Guidance on applicability
7. **Alternatives**: Discuss other approaches fairly
8. **Implications**: Real-world effects
9. **Misconceptions**: Address common confusions
10. **Examples**: Concrete scenarios

**Best practices:**

- Focus on understanding, not instruction
- Discuss alternatives objectively
- Explain "why" not "how"
- Connect to broader principles
- Include real-world context
- Link to ADRs for specific decisions
- Link to Guides for implementation
- Update when understanding evolves

**Explanation vs other doc types:**

- **Explanation**: "React Query enables efficient data synchronization between server and client by..."
- **Reference**: "React Query API: `useQuery(queryKey, queryFn, options)`"
- **Guide**: "How to use React Query to fetch user data"
- **Tutorial**: "Learn React Query by building a todo app"
- **ADR**: "We decided to use React Query because..."

Explanations deepen understanding of concepts. They're conceptual, not procedural.
