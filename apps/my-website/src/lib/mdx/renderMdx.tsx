import type { ComponentType } from "react";
import * as runtime from "react/jsx-runtime";

/**
 * Velite's `s.mdx()` field pre-compiles MDX source into a JS function body
 * string at build time (via its own bundled @mdx-js/mdx compiler). That
 * string expects to be invoked as a function with the JSX runtime
 * (`jsx`, `jsxs`, `Fragment`) passed as its single argument, returning
 * `{ default: Component }` — it must NOT be re-parsed as raw MDX source
 * (e.g. via `@mdx-js/mdx`'s `evaluate()`), which fails since it's already
 * compiled JS, not markdown/MDX text.
 *
 * SECURITY: `new Function()` executes `code` as arbitrary JavaScript. This
 * is currently safe because `code` only ever originates from build-time
 * compilation of local files under `content/blog/**\/*.mdx` (see
 * velite.config.ts) — no request-scoped, user-submitted, or externally
 * fetched content reaches this function. If a future phase adds any
 * external content source (headless CMS, user submissions, remote MDX)
 * that feeds into `s.mdx()` or `code` here, this becomes a server-side
 * code injection path and must be reassessed (e.g. a sandboxed MDX
 * runtime, or keeping external content out of this pipeline entirely).
 */
function useMdxComponent(code: string): ComponentType {
  try {
    const fn = new Function(code);
    return fn(runtime).default;
  } catch (error) {
    console.error("Failed to compile MDX:", error);
    // Fallback: return error component instead of crashing
    const ErrorComponent = () => (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
        <p className="font-bold">Error loading article content</p>
        <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
    ErrorComponent.displayName = "MDXErrorFallback";
    return ErrorComponent;
  }
}

interface MdxContentProps {
  code: string;
}

export function MdxContent({ code }: MdxContentProps) {
  const Component = useMdxComponent(code);
  return <Component />;
}
