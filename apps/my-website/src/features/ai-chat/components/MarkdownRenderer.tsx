"use client";

import { Streamdown } from "streamdown";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
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

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming = false }) => {
  return (
    <div style={darkModeStyles}>
      <Streamdown
        mode={isStreaming ? "streaming" : "static"}
        isAnimating={isStreaming}
        shikiTheme={["github-dark", "github-dark"]}
        className="streamdown-content"
      >
        {content}
      </Streamdown>
    </div>
  );
};

export default MarkdownRenderer;
