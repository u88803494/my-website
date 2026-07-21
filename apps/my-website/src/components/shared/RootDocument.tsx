import { Geist, Geist_Mono } from "next/font/google";

import type { SiteChromeContent } from "@/components/shared/siteChromeContent";
import SiteShell from "@/components/shared/SiteShell";
import type { NavigationMode } from "@/types/route.types";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

interface RootDocumentProps {
  children: React.ReactNode;
  chrome: SiteChromeContent;
  documentLocale: "en" | "zh-Hant";
  navigationMode?: NavigationMode;
}

const RootDocument: React.FC<RootDocumentProps> = ({ children, chrome, documentLocale, navigationMode = "client" }) => {
  return (
    <html data-theme="corporate" lang={documentLocale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
        suppressHydrationWarning={true}
      >
        <SiteShell chrome={chrome} navigationMode={navigationMode}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
};

export default RootDocument;
