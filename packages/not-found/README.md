# @packages/not-found

404 Not Found page feature package for the personal website.

## Overview

This package contains the 404 Not Found page components and functionality, including:

- Hero section with 404 message
- Quick navigation links
- Search suggestions
- Contact section

## Usage

```tsx
import { NotFoundFeature } from "@packages/not-found";

export default function NotFoundPage() {
  return <NotFoundFeature />;
}
```

## Components

- `NotFoundFeature` - Main 404 page component
- `NotFoundHero` - Hero section with 404 message
- `QuickNavigation` - Quick navigation links
- `SearchSuggestion` - Search suggestions
- `ContactSection` - Contact information section

## Dependencies

- `@packages/shared` - Shared utilities and components
- `framer-motion` - Animations
- `next` - Next.js components (Link)
- `lucide-react` - Icons
