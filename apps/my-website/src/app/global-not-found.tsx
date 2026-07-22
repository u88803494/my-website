import "./globals.css";

import RootDocument from "@/components/shared/RootDocument";
import { globalEnglishSiteChrome } from "@/components/shared/siteChromeContent";
import { NotFoundFeature } from "@/features/not-found";

const GlobalNotFoundPage = () => {
  return (
    // Next.js renders global-not-found outside the normal App Router tree.
    // In Next.js 16.1.1, next/link can update the URL without replacing this
    // standalone document: https://github.com/vercel/next.js/issues/88341
    // Keep document navigation enabled until that framework issue is verified fixed.
    <RootDocument chrome={globalEnglishSiteChrome} documentLocale="zh-Hant" navigationMode="document">
      <NotFoundFeature />
    </RootDocument>
  );
};

export default GlobalNotFoundPage;
