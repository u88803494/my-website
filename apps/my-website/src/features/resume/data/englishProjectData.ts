import type { Project } from "@packages/shared/types";

import { projects as traditionalChineseProjects } from "@/data/projectData";

const projectTranslations: Array<Pick<Project, "category" | "description" | "title">> = [
  {
    category: "AI Tool · Independent Project",
    description: {
      features: [
        "Switch between multiple AI models through a consistent chat experience",
        "Stream responses to reduce perceived LLM latency",
        "Render complete Markdown with syntax-highlighted code",
        "Manage and export conversation history",
        "Use the Vercel AI SDK as a unified model interface",
      ],
      intro:
        "An intelligent multi-model chat interface with streaming responses, demonstrating the delivery of AI-native product experiences.",
    },
    title: "AI Chat · Multi-Model Conversation Interface",
  },
  {
    category: "Personal Website · Resume Platform",
    description: {
      features: [
        "Built with Next.js 16, TypeScript, Tailwind CSS, and the App Router",
        "Integrates independently developed AI Dictionary and AI Analyzer tools",
        "Automatically synchronizes and presents Medium articles",
        "Responsive design with purposeful motion",
        "Presents skills, projects, and professional experience",
        "Includes SEO and social sharing metadata",
      ],
      intro:
        "A modern personal platform combining a resume, project portfolio, AI tools, and automated Medium content to demonstrate end-to-end product development.",
    },
    title: "Henry Lee Personal Website",
  },
  {
    category: "AI Tool · Independent Project",
    description: {
      features: [
        "Presents definitions, etymology, and examples in structured learning cards",
        "Provides a learning mode with completion and undo actions",
        "Uses responsive feedback and animation for search and learning states",
        "Includes strict validation and error handling",
        "Uses Google Gemini to analyze Traditional Chinese words and phrases",
      ],
      intro:
        "An AI-powered Traditional Chinese dictionary that combines definitions, etymology, examples, and interactive learning cards.",
    },
    title: "AI Traditional Chinese Dictionary",
  },
  {
    category: "AI Tool · Independent Project",
    description: {
      features: [
        "Turns an initial need into a structured analysis template",
        "Generates guiding questions for goals, users, features, and constraints",
        "Lets users copy results into tools such as ChatGPT and Claude",
        "Provides clear loading and error feedback",
        "Uses Google Gemini to produce diverse analyses",
      ],
      intro:
        "An AI tool that converts ambiguous ideas into structured questions, helping users clarify requirements and write better prompts.",
    },
    title: "AI Requirements Analyzer",
  },
  {
    category: "Dictionary · Independent Project",
    description: {
      features: [
        "Uses the Moedict API for real-time definitions and URL-synchronized routes",
        "Features an independently designed responsive interface",
        "Uses Next.js and TypeScript for type safety and developer experience",
        "Manages asynchronous API data with Redux Toolkit and Thunk",
      ],
      intro:
        "An online Traditional Chinese dictionary built from design through deployment to improve word lookup and learning.",
    },
    title: "New Dictionary",
  },
  {
    category: "Static Commerce Site · AI Collaboration Project",
    description: {
      features: [
        "Completed design-to-deployment in three working days with AI-assisted development",
        "Built with Next.js, TypeScript, and Tailwind CSS and deployed on Vercel",
        "Includes static category switching and product hover interactions",
        "Provides a fully responsive experience",
      ],
      intro:
        "An experiment in AI-assisted delivery that produced a professional responsive product showcase from scratch under a tight schedule.",
    },
    title: "Tzu Chi Product Showcase",
  },
  {
    category: "React Blog · Learning Project",
    description: {
      features: [
        "Integrates Google Firebase Authentication",
        "Provides permission-based article CRUD workflows",
        "Uses React Router and Redux Thunk for SPA state management",
        "Was later refactored to React Hooks for maintainability",
      ],
      intro:
        "An early full-stack learning project covering authentication, article administration, CRUD workflows, and frontend error handling.",
    },
    title: "React Blog System",
  },
  {
    category: "Corporate Website · Lead Developer",
    description: {
      features: [
        "Implemented the Service, Clio, and Faceta pages and all site-wide forms",
        "Built a maintainable BEM-based SCSS architecture with 4K display support",
        "Created global modal forms and smooth section navigation with React Context",
        "Integrated Jest and Puppeteer end-to-end tests with GitLab CI/CD",
      ],
      intro:
        "Led frontend development of the corporate website, translating designs into precise, performant, custom React interfaces.",
    },
    title: "Corporate Website",
  },
];

const englishLinkLabels = {
  article: "Implementation Article",
  live: "Live Site",
  source: "Source Code",
} as const;

export const englishProjects = traditionalChineseProjects.map((project, index) => ({
  ...project,
  ...projectTranslations[index],
  links: project.links.map((link) => ({ ...link, label: englishLinkLabels[link.type] })),
  techStack: project.techStack.map((technology) =>
    technology === "AI 輔助開發" ? "AI-Assisted Development" : technology,
  ),
}));
