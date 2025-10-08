# @packages/about

About page feature package for the personal website.

## Overview

This package contains the About page components and functionality, including:

- About hero section with personal introduction
- Story section
- Philosophy section
- Tech stack display
- Animated background

## Usage

```tsx
import { AboutFeature } from "@packages/about";

export default function AboutPage() {
  return <AboutFeature />;
}
```

## Components

- `AboutFeature` - Main about page component
- `AboutHero` - Hero section with photo and introduction
- `StorySection` - Personal story section
- `PhilosophySection` - Development philosophy
- `TechStackSection` - Technical skills display
- `AnimatedBackground` - Animated background component
- `CallToActionSection` - Call to action section

## Dependencies

- `@packages/shared` - Shared utilities and components
- `framer-motion` - Animations
- `next` - Next.js components (Image)
