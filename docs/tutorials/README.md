# 📖 Tutorials

**Learning-oriented documentation** - Guided lessons that teach fundamental concepts through hands-on practice.

## 📖 Philosophy

Tutorials are lessons that take learners on a journey from zero knowledge to basic competence. They are meant for learning, not problem-solving.

**Characteristics:**

- ✅ Learning-oriented (building understanding)
- ✅ Gentle introduction to concepts
- ✅ Safe, reproducible environment
- ✅ Immediate feedback and success
- ✅ Minimal choices (clear path forward)

**Not for:**

- ❌ Solving specific problems (use [Guides](../guides/))
- ❌ Comprehensive reference material (use [Reference](../reference/))
- ❌ Deep conceptual explanations (use [Explanation](../explanation/))

---

## 📚 Available Tutorials

### Getting Started

1. **Project Setup** - From zero to running dev server _(Coming soon)_
2. **Adding New Feature** - End-to-end feature development _(Coming soon)_
3. **Medium Integration** - Working with external APIs _(Coming soon)_

---

## 🎯 Learning Path

```
01. Project Setup
    └─> Set up tools, clone, install, run
        │
        ↓
02. Adding New Feature
    └─> Create feature folder, components, add route
        │
        ↓
03. Medium Integration
    └─> Fetch data, parse, display, handle errors
```

---

## 🆕 Creating New Tutorials

Use the [tutorial template](../.templates/tutorial-template.md):

```bash
cp docs/.templates/tutorial-template.md docs/tutorials/0X-tutorial-name.md
```

**Naming Convention:**

- Prefix with number: `01-`, `02-`, `03-`
- Use kebab-case: `01-your-tutorial.md`
- Describe the journey: `getting-started.md` not `setup.md`

**Required Sections:**

1. What You'll Learn (learning objectives)
2. Prerequisites (assumed knowledge)
3. Time Estimate (how long it takes)
4. Lesson Steps (guided, numbered)
5. What You've Learned (recap)
6. Next Steps (where to go from here)

**Best Practices:**

- Start simple, add complexity gradually
- Explain _why_ each step matters
- Include code examples that work
- Provide checkpoints for verification
- Encourage experimentation at the end

---

## 🤖 For AI Agents

When user is **learning** or **onboarding**:

1. Start with Tutorial 01 if completely new
2. Guide through tutorials sequentially
3. Provide context and explanations (not just commands)
4. Encourage experimentation after core learning
5. Link to Guides for specific tasks afterward

**Example mapping:**

- "I'm new to this project" → Start with Tutorial 01
- "How does the feature system work?" → Tutorial 02
- "I want to add authentication" → Create new tutorial (if teaching concept) or Guide (if solving problem)
