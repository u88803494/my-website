"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";
import type { FooterContent } from "./siteChromeContent";

// Routes that don't need a footer (immersive experiences)
const ROUTES_WITHOUT_FOOTER = ["/ai-chat"];

interface ConditionalFooterProps {
  content: FooterContent;
  locale: "en" | "zh-Hant";
}

const ConditionalFooter: React.FC<ConditionalFooterProps> = ({ content, locale }) => {
  const pathname = usePathname();
  const shouldHideFooter = ROUTES_WITHOUT_FOOTER.some((route) => pathname.startsWith(route));

  if (shouldHideFooter) return null;
  return <Footer content={content} locale={locale} />;
};

export default ConditionalFooter;
