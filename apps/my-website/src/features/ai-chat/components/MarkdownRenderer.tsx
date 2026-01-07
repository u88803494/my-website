"use client";

import type { ErrorInfo, ReactNode } from "react";
import { Component, memo } from "react";
import { Streamdown } from "streamdown";

import { UI_STRINGS } from "../constants";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

// Error Boundary for catching Streamdown render errors
// Note: Error Boundaries MUST be class components - React doesn't provide a hooks API for this
// See: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class MarkdownErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("MarkdownRenderer error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="bg-error/10 text-error rounded p-2 text-sm">{UI_STRINGS.markdownErrorFallback}</div>
        )
      );
    }
    return this.props.children;
  }
}

// Streamdown dark mode CSS variables (HSL format without hsl() wrapper)
const darkModeStyles: React.CSSProperties = {
  // @ts-expect-error - CSS custom properties
  "--background": "222.2 84% 4.9%",
  "--foreground": "210 40% 98%",
  "--primary": "210 40% 98%",
  "--primary-foreground": "222.2 47.4% 11.2%",
  "--secondary": "217.2 32.6% 17.5%",
  "--secondary-foreground": "210 40% 98%",
  "--muted": "217.2 32.6% 17.5%",
  "--muted-foreground": "215 20.2% 65.1%",
  "--border": "217.2 32.6% 17.5%",
  "--input": "217.2 32.6% 17.5%",
  "--ring": "212.7 26.8% 83.9%",
};

const MarkdownRenderer = memo<MarkdownRendererProps>(({ content, isStreaming = false }) => {
  // Defensive check for empty/invalid content
  const safeContent = content?.trim() || "";

  if (!safeContent) {
    return null;
  }

  return (
    <MarkdownErrorBoundary>
      <div style={darkModeStyles}>
        <Streamdown
          mode={isStreaming ? "streaming" : "static"}
          isAnimating={isStreaming}
          shikiTheme={["github-dark", "github-dark"]}
          className="streamdown-content"
        >
          {safeContent}
        </Streamdown>
      </div>
    </MarkdownErrorBoundary>
  );
});

MarkdownRenderer.displayName = "MarkdownRenderer";

export default MarkdownRenderer;
