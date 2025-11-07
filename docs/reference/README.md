# 📋 Reference

**Information-oriented documentation** - Complete technical specifications, APIs, configurations, and factual information.

## 📖 Philosophy

Reference documentation provides dry, precise technical information. It describes how things work without teaching or guiding.

**Characteristics:**

- ✅ Information-oriented (stating facts)
- ✅ Comprehensive and accurate
- ✅ Well-organized and structured
- ✅ Consistent format
- ✅ Easy to scan and search

**Not for:**

- ❌ Explaining concepts (use [Explanation](../explanation/))
- ❌ Teaching step-by-step (use [Tutorials](../tutorials/))
- ❌ Solving problems (use [Guides](../guides/))

---

## 📚 Available Reference Documentation

### System & Architecture

- **Architecture** - System architecture and component relationships _(Coming soon)_
- **Environment Variables** - All environment variables _(Coming soon)_
- **CLI Commands** - Available pnpm scripts and commands _(Coming soon)_

### Git & CI/CD

- **[Commitlint Rules](./commitlint-rules.md)** - Commit message rules and scopes
- **[Git Hooks](./git-hooks.md)** - Pre-commit, commit-msg, pre-push configurations

### API

- **API Reference** - Complete API specifications _(Coming soon)_

---

## 🔍 Organization Principles

### By Technical Domain

Reference docs are organized by technical area, not by user task:

- **System**: Architecture, environment, CLI
- **Git/CI**: Commit rules, hooks, automation
- **API**: REST endpoints, GraphQL queries
- **Components**: React components, hooks, utilities (if needed)

### Consistent Structure

Each reference doc follows a standard format:

1. **Overview**: Brief description
2. **Specification**: Complete technical details
3. **Parameters/Options**: All available configurations
4. **Examples**: Minimal working examples
5. **Related**: Links to guides and explanations

---

## 🆕 Creating New Reference Docs

Use the [reference template](../.templates/reference-template.md):

```bash
cp docs/.templates/reference-template.md docs/reference/your-reference.md
```

**Naming Convention:**

- Use kebab-case: `your-reference.md`
- Be specific: `commitlint-rules.md` not `rules.md`
- Factual names: `git-hooks.md` not `git-hooks-guide.md`

**Required Sections:**

1. Overview (what this documents)
2. Specification (complete details)
3. All Options/Parameters (exhaustive list)
4. Examples (minimal, working code)
5. Related Docs (cross-references)

**Best Practices:**

- Be exhaustively complete
- Use tables for structured data
- Include type signatures
- Provide minimal examples (not tutorials)
- Keep explanations brief (link to Explanation docs)

---

## 🤖 For AI Agents

When user asks for **technical specs** or **"what is"** questions:

1. Check if reference doc exists
2. If not, create using template
3. Focus on facts, not procedures
4. Include all options/parameters
5. Link to Guides for how-to, Explanation for why

**Example mapping:**

- "What commit types are allowed?" → Commitlint Rules reference
- "What env vars are available?" → Environment Variables reference
- "How do I use git hooks?" → Git Workflow guide (not reference)
- "Why do we use this pattern?" → Explanation (not reference)

**API Documentation Format:**

```markdown
# POST /api/endpoint

## Request

### Headers

- `Content-Type: application/json`

### Body

\`\`\`typescript
interface Request {
param: string;
}
\`\`\`

## Response

### Success (200)

\`\`\`typescript
interface Response {
data: string;
}
\`\`\`

### Error (400, 500)

\`\`\`typescript
interface ErrorResponse {
error: string;
}
\`\`\`

## Implementation

- Location: `apps/my-website/src/app/api/endpoint/route.ts`
- Uses: Gemini API, rate limiting
```
