import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import QueryProvider from "@/components/providers/QueryProvider";
import ConditionalFooter from "@/components/shared/ConditionalFooter";
import { Navbar } from "@/components/shared/Navbar";
import NProgressBar from "@/components/shared/NProgressBar";
import type { SiteChromeContent } from "@/components/shared/siteChromeContent";

interface SiteShellProps {
  children: React.ReactNode;
  chrome: SiteChromeContent;
}

const SiteShell: React.FC<SiteShellProps> = ({ children, chrome }) => {
  return (
    <>
      <QueryProvider>
        <div lang={chrome.locale}>
          <Navbar contactLabel={chrome.contactLabel} routes={chrome.routes} />
        </div>
        <NProgressBar />
        <main className="flex-1 overflow-x-hidden pt-16">{children}</main>
        <div lang={chrome.locale}>
          <ConditionalFooter content={chrome.footer} locale={chrome.locale} />
        </div>
      </QueryProvider>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default SiteShell;
