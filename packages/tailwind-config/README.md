# @packages/tailwind-config

Centralized Tailwind CSS configuration for the monorepo.

## Purpose

This package provides a **single source of truth** for Tailwind CSS and DaisyUI configuration across all apps and packages in the monorepo. It leverages **Tailwind CSS 4's CSS-first configuration** approach using `@source` and `@plugin` directives.

## Why Centralized Configuration?

- ✅ **Single Configuration**: No need to duplicate Tailwind config in each package
- ✅ **Automatic Scanning**: Uses `@source` to automatically scan all apps and packages for Tailwind classes
- ✅ **Unified Theming**: DaisyUI themes are managed in one place
- ✅ **Easy Maintenance**: Update themes and plugins once, apply everywhere
- ✅ **Scalability**: Adding new packages automatically includes them in the Tailwind build

## How It Works

### The CSS-First Approach (Tailwind 4)

Instead of traditional `tailwind.config.js/ts` files, Tailwind 4 allows configuration directly in CSS using special directives:

```css
@import "tailwindcss";

/* Scan all packages */
@source "../../packages/*/src/**/*.{js,ts,jsx,tsx}";

/* Scan all apps */
@source "../../apps/*/src/**/*.{js,ts,jsx,tsx}";

/* DaisyUI Plugin */
@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark,
    corporate;
}
```

### What Gets Scanned?

The `@source` directive tells Tailwind to scan:

- All files in `packages/*/src/**/*.{js,ts,jsx,tsx}`
- All files in `apps/*/src/**/*.{js,ts,jsx,tsx}`

This means **any package or app** you add to the monorepo will automatically be included!

## Usage

### In Your App

Import the shared style in your main CSS file:

```css
/* apps/my-website/src/app/globals.css */
@import "@packages/tailwind-config/style.css";
```

### In Your Packages

For feature packages that use Tailwind classes, create a minimal `styles.css`:

```css
/* packages/blog/src/styles.css */
/* This ensures Tailwind classes work in this package */
/* Actual styling is handled by the main app's globals.css */
@import "@packages/tailwind-config/style.css";
```

## Configuration

### DaisyUI Themes

Currently configured themes:

- **light** (default)
- **dark** (auto-selected based on user preference)
- **corporate**

To change themes, edit `style.css`:

```css
@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark,
    your-custom-theme;
}
```

### Adding Custom Theme Extensions

If you need custom theme extensions, you can add them directly in the CSS:

```css
@import "tailwindcss";

@theme {
  --color-brand-primary: #your-color;
}

@source "../../packages/*/src/**/*.{js,ts,jsx,tsx}";
/* ... rest of config */
```

## Package Structure

```
packages/tailwind-config/
├── package.json    # Package configuration
├── style.css       # Main Tailwind configuration (CSS-first)
├── README.md       # This file
└── node_modules/   # Dependencies (daisyui, tailwindcss)
```

## Dependencies

- **tailwindcss**: `^4` - Tailwind CSS framework
- **daisyui**: `^5.0.43` - DaisyUI component library

## Benefits Over Traditional Config

### Traditional Approach (Tailwind 3)

```javascript
// Each package needs its own tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  daisyui: { themes: ["light", "dark"] },
};
```

### Our Approach (Tailwind 4)

```css
/* One style.css, all packages scanned automatically */
@source "../../packages/*/src/**/*.{js,ts,jsx,tsx}";
```

## When Adding New Packages

No configuration needed! The `@source` glob pattern automatically includes:

- `packages/your-new-package/src/**/*.{js,ts,jsx,tsx}`

Just start using Tailwind classes in your new package.

## Troubleshooting

### Classes Not Being Applied?

1. Check if your file matches the `@source` pattern
2. Ensure your app imports `@packages/tailwind-config/style.css`
3. Clear Next.js cache: `rm -rf .next`

### DaisyUI Components Not Working?

Make sure the main app imports the shared style:

```css
@import "@packages/tailwind-config/style.css";
```

## Learn More

- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/)
- [Tailwind CSS-First Configuration](https://tailwindcss.com/docs/configuration)
