# ADR-XXX: [Short Title of Decision]

---

title: [Full title]
type: adr
status: proposed|accepted|rejected|superseded|deprecated
date: YYYY-MM-DD
deciders: [List of people involved]
consulted: [List of people consulted]
informed: [List of people informed]
supersedes: [ADR-XXX if applicable]
superseded_by: [ADR-XXX if applicable]
tags: [tag1, tag2, tag3]
related:

- path/to/explanation.md
- path/to/reference.md
  ai_context: |
  Brief context about what decision was made and why.

---

## Status

**[Proposed | Accepted | Rejected | Superseded | Deprecated]**

- Proposed: YYYY-MM-DD
- Accepted: YYYY-MM-DD (if applicable)
- Superseded by: [ADR-XXX](./XXX-title.md) (if applicable)

## Context

**What is the issue or problem we're facing?**

Describe the forces at play:

- Technical constraints
- Business requirements
- User needs
- Team capabilities
- Timeline constraints

Include relevant background information that helps understand why this decision was necessary.

## Decision

**What decision have we made?**

State the decision clearly and concisely. This should be a complete sentence that can stand alone.

Example: "We will use React Query with Next.js SSG by implementing server-side prefetch with HydrationBoundary."

## Consequences

### Positive Consequences

What benefits does this decision bring?

- ✅ Benefit 1
- ✅ Benefit 2
- ✅ Benefit 3

### Negative Consequences

What drawbacks or trade-offs does this decision introduce?

- ❌ Drawback 1
- ❌ Drawback 2
- ❌ Drawback 3

### Neutral Consequences

What other effects does this decision have?

- ℹ️ Effect 1
- ℹ️ Effect 2

## Alternatives Considered

### Alternative 1: [Name]

**Description**: Brief explanation of this alternative.

**Pros**:

- Pro 1
- Pro 2

**Cons**:

- Con 1
- Con 2

**Why not chosen**: Explain why this alternative was not selected.

---

### Alternative 2: [Name]

**Description**: Brief explanation of this alternative.

**Pros**:

- Pro 1
- Pro 2

**Cons**:

- Con 1
- Con 2

**Why not chosen**: Explain why this alternative was not selected.

---

### Alternative 3: [Name]

(Add more alternatives as needed)

## Implementation

**How will this decision be implemented?**

- Implementation step 1
- Implementation step 2
- Implementation step 3

**Timeline**: Expected completion date or milestones.

**Dependencies**: What needs to be in place before implementation?

## Validation

**How will we know if this decision was correct?**

- Success criterion 1
- Success criterion 2
- Success criterion 3

**Review date**: YYYY-MM-DD (when to revisit this decision)

## Related Documents

### Explanation

- [Concept/Pattern Explanation](../explanation/concept.md) - Background on the concept

### Reference

- [Technical Reference](../reference/tech-spec.md) - Detailed specifications

### Guides

- [Implementation Guide](../guides/how-to-implement.md) - How to apply this decision

### Related ADRs

- [ADR-XXX: Related Decision](./XXX-related.md)

---

## Notes

Any additional notes, research links, or context that doesn't fit elsewhere.

### Research & References

- [Link to research 1](https://example.com)
- [Link to research 2](https://example.com)

### Discussion History

- YYYY-MM-DD: Initial proposal
- YYYY-MM-DD: Team discussion
- YYYY-MM-DD: Decision made

---

## Template Instructions (Remove this section)

**How to use this template:**

1. **Title**: Use format "ADR-XXX: Short Title" where XXX is next sequential number
2. **Frontmatter**: Fill in all YAML fields
3. **Status**: Start with "Proposed", update as decision progresses
4. **Context**: Explain the problem and forces driving the decision
5. **Decision**: State the decision clearly in one sentence
6. **Consequences**: Be honest about pros and cons
7. **Alternatives**: Document at least 2-3 alternatives considered
8. **Implementation**: Practical steps to implement
9. **Validation**: How to measure success
10. **Related**: Link to all related documentation

**Best practices:**

- Write for future readers who don't have current context
- Be objective and honest about trade-offs
- Document the "why" not just the "what"
- Include research and references
- Update status as decision evolves
- If superseded, create new ADR and link both ways
