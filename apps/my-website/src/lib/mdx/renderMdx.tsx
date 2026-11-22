import type { ComponentPropsWithoutRef, ComponentType } from "react";
import * as runtime from "react/jsx-runtime";

/** The subset of the standard MDX component-override map this app overrides. */
interface MdxComponentOverrides {
  img?: ComponentType<ComponentPropsWithoutRef<"img">>;
}

/** Every compiled MDX component accepts this — @mdx-js/mdx's standard override prop. */
interface MdxComponentProps {
  components?: MdxComponentOverrides;
}

/**
 * Builds the <img> override for one MdxContent render.
 *
 * next/image needs known dimensions (or a configured loader) at build time;
 * these all point at Medium's CDN with no size on record, and are only there
 * until self-hosting is sorted out (see issue #124), so a plain <img> stays.
 * loading="lazy" still matters — some migrated articles embed 30+ images, all
 * of which would otherwise start downloading immediately on page load.
 *
 * The first image in an article is commonly the LCP candidate (a hero
 * screenshot right under the <h1>), so it alone gets loading="eager" +
 * fetchPriority="high" instead — lazy-loading it works against the metric
 * loading="lazy" exists to protect everywhere else. The counter is created
 * fresh per MdxContent call (a Server Component, rendered once per page, not
 * subject to Client Component Strict Mode double-render) so it can't leak
 * state between articles.
 */
function createMdxImage(): ComponentType<ComponentPropsWithoutRef<"img">> {
  let seen = false;

  return function MdxImage(props: ComponentPropsWithoutRef<"img">) {
    const isFirst = !seen;
    seen = true;

    return (
      // eslint-disable-next-line @next/next/no-img-element -- see comment above
      <img
        alt=""
        decoding="async"
        loading={isFirst ? "eager" : "lazy"}
        fetchPriority={isFirst ? "high" : "auto"}
        {...props}
      />
    );
  };
}

/**
 * Velite's `s.mdx()` field pre-compiles MDX source into a JS function body
 * string at build time (via its own bundled @mdx-js/mdx compiler). That
 * string expects to be invoked as a function with the JSX runtime
 * (`jsx`, `jsxs`, `Fragment`) passed as its single argument, returning
 * `{ default: Component }` — it must NOT be re-parsed as raw MDX source
 * (e.g. via `@mdx-js/mdx`'s `evaluate()`), which fails since it's already
 * compiled JS, not markdown/MDX text.
 *
 * SECURITY: `new Function()` executes `code` as arbitrary JavaScript, but that
 * is not really the boundary — MDX itself lets any `content/blog/**\/*.mdx`
 * file mount arbitrary JSX event handlers (`<div onClick={...}>`), so nothing
 * about *how* this is rendered would contain that. The real trust boundary is
 * `content/blog/**` itself, plus every program that writes into it —
 * concretely, `apps/my-website/scripts/medium-to-mdx/`, which parses Medium's
 * export (untrusted markup) into these files. That converter is expected to
 * escape attribute values and validate URLs before they reach a `.mdx` file
 * (see `scripts/medium-to-mdx/url.ts`); this function assumes that already
 * happened. If a future phase adds any other source that feeds into `s.mdx()`
 * or `code` here (headless CMS, user submissions, remote MDX), it must go
 * through the same escaping discipline, or this becomes a server-side code
 * injection path (this runs at build time under `next build`, not just in the
 * browser) and must be reassessed — e.g. a sandboxed MDX runtime.
 *
 * velite.config.ts previously ran a `validateMdxCode` rehype plugin as a second
 * line of defense. It never worked: unified calls rehype plugins as attachers
 * (invoked with plugin options, expected to return a transformer), but it was
 * written to receive the AST tree directly, so it always inspected
 * `JSON.stringify(undefined)` and never actually checked anything. It has been
 * removed rather than fixed — fixing the signature would make it receive the
 * *hast* tree (pre-JSX-compilation markup), not the compiled `code` string its
 * patterns were written against, and it would then throw on any article whose
 * prose or code sample happens to contain the word "import" or "export".
 */
function useMdxComponent(code: string): ComponentType<MdxComponentProps> {
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
  return <Component components={{ img: createMdxImage() }} />;
}
