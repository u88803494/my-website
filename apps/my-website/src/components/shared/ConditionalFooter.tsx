"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";

// Routes that don't need a footer (immersive experiences)
const ROUTES_WITHOUT_FOOTER = ["/ai-chat"];

const ConditionalFooter: React.FC = () => {
  const pathname = usePathname();
  const shouldHideFooter = ROUTES_WITHOUT_FOOTER.some((route) => pathname.startsWith(route));

  if (shouldHideFooter) return null;
  return <Footer />;
};

export default ConditionalFooter;
