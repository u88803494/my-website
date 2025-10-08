# GEMINI.md

## Project Overview

This is a monorepo for a personal website, built with Next.js, Turborepo, and pnpm workspaces. The main application is `apps/my-website`, which is a modern personal website that showcases professional skills, work experience, and project portfolios. It also integrates with the Medium API to automatically fetch and display the latest articles, and includes an AI-powered dictionary feature.

The monorepo is structured to allow for code sharing and centralized management of dependencies. Shared components and utilities are located in the `packages` directory and are consumed by the main application in the `apps` directory.

**Key Technologies:**

- **Framework:** Next.js 15 (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** React
- **API Integration:** Google Gemini API, Medium GraphQL API
- **Build System:** Turborepo
- **Package Manager:** pnpm

## Building and Running

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Development

To start the development server, run the following command from the root of the monorepo:

```bash
pnpm dev
```

This will start the main application, which can be accessed at [http://localhost:3000](http://localhost:3000).

### Building

To build the application for production, run the following command from the root of the monorepo:

```bash
pnpm build
```

### Other Commands

- `pnpm start`: Starts the production server.
- `pnpm lint`: Lints the codebase.
- `pnpm check-types`: Type-checks the codebase.
- `pnpm check`: Runs all checks (linting and type-checking).
- `pnpm format`: Formats the codebase.

## Development Conventions

- **Monorepo Structure:** The project is organized as a monorepo with `apps` and `packages` directories.
- **Feature-based Architecture:** The main application follows a feature-based architecture, with features encapsulated in their own directories.
- **Shared Packages:** Shared components, utilities, and configurations are located in the `packages` directory.
- **TypeScript:** The project is written in TypeScript and uses strict mode.
- **Linting and Formatting:** ESLint and Prettier are used for linting and formatting the codebase.
- **Commits:** The project uses `lint-staged` and `husky` to run checks before committing.
