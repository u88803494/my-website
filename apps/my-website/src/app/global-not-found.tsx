import "./globals.css";

import RootDocument from "@/components/shared/RootDocument";
import { globalEnglishSiteChrome } from "@/components/shared/siteChromeContent";
import { NotFoundFeature } from "@/features/not-found";

const GlobalNotFoundPage = () => {
  return (
    <RootDocument chrome={globalEnglishSiteChrome} documentLocale="zh-Hant">
      <NotFoundFeature />
    </RootDocument>
  );
};

export default GlobalNotFoundPage;
