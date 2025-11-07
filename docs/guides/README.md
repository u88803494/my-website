# 🛠️ How-to Guides

**Problem-oriented documentation** - Practical step-by-step instructions to achieve specific goals.

## 📖 Philosophy

Guides are recipes that help you solve specific problems. They assume you understand the basics and focus on practical steps to accomplish tasks.

**Characteristics:**

- ✅ Goal-oriented (achieving specific outcomes)
- ✅ Step-by-step instructions
- ✅ Minimal explanation (link to [Explanation](../explanation/) for "why")
- ✅ Practical examples
- ✅ Troubleshooting sections

**Not for:**

- ❌ Teaching concepts from scratch (use [Tutorials](../tutorials/))
- ❌ Complete technical specifications (use [Reference](../reference/))
- ❌ Explaining "why" (use [Explanation](../explanation/))

---

## 📚 Available Guides

### Development

- **[Git Workflow](./git-workflow.md)** - Using git hooks, commitlint, and automation
- **Development Setup** - Setting up local development environment _(Coming soon)_
- **Contributing** - How to contribute to this project _(Coming soon)_

### Deployment

- **Deployment** - Deploying to Vercel and managing environments _(Coming soon)_

---

## 🆕 Creating New Guides

Use the [guide template](../.templates/guide-template.md):

```bash
cp docs/.templates/guide-template.md docs/guides/your-guide-name.md
```

**Naming Convention:**

- Use kebab-case: `your-guide-name.md`
- Be specific: `deploying-to-vercel.md` not `deployment.md`
- Action-oriented: `adding-api-endpoint.md` not `api-endpoints.md`

**Required Sections:**

1. Overview (what you'll achieve)
2. Prerequisites (what you need first)
3. Steps (numbered, actionable)
4. Verification (how to check success)
5. Troubleshooting (common issues)
6. Related (links to related docs)

---

## 🤖 For AI Agents

When user asks **"How do I..."** questions:

1. Check if existing guide covers it
2. If not, create new guide using template
3. Focus on actionable steps, not theory
4. Link to Reference for technical details
5. Link to Explanation for background context

**Example mapping:**

- "How do I set up the dev environment?" → Development Setup guide
- "How do I add a new API endpoint?" → Create new guide
- "How do git hooks work?" → Link to Explanation (not a guide)
