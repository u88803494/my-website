import { evaluate } from "@mdx-js/mdx";
import { Fragment, type ReactNode } from "react";

/**
 * Server-side MDX evaluation and rendering
 * Takes compiled MDX code string and renders as React component
 */
export async function renderMdx(code: string): Promise<ReactNode> {
  try {
    const { default: MDXContent } = await evaluate(code, {
      jsx: true,
      jsxImportSource: "react",
      Fragment,
    });

    return <MDXContent />;
  } catch (error) {
    console.error("MDX rendering error:", error);
    return <div>Error rendering content</div>;
  }
}
