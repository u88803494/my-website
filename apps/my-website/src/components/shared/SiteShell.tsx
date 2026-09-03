import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import QueryProvider from "@/components/providers/QueryProvider";
import ConditionalFooter from "@/components/shared/ConditionalFooter";
import { Navbar } from "@/components/shared/Navbar";
import NProgressBar from "@/components/shared/NProgressBar";
import type { SiteChromeContent } from "@/components/shared/siteChromeContent";
import type { NavigationMode } from "@/types/route.types";

interface SiteShellProps {
  children: React.ReactNode;
  chrome: SiteChromeContent;
  navigationMode?: NavigationMode;
}

const SiteShell: React.FC<SiteShellProps> = ({ children, chrome, navigationMode = "client" }) => {
  return (
    <>
      <QueryProvider>
        <div lang={chrome.locale}>
          <Navbar contactLabel={chrome.contactLabel} navigationMode={navigationMode} routes={chrome.routes} />
        </div>
        <NProgressBar />
        {/* overflow-x-clip (not hidden): browsers force an unset overflow-y to compute as
            auto when overflow-x is non-visible, which turns main into its own scroll
            container and breaks position:sticky for every descendant inside it */}
        <main className="flex-1 overflow-x-clip pt-16">{children}</main>
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
