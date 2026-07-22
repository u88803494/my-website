import "../globals.css";

import type { Metadata } from "next";

import RootDocument from "@/components/shared/RootDocument";
import { traditionalChineseRootMetadata } from "@/components/shared/rootMetadata";
import { globalEnglishSiteChrome } from "@/components/shared/siteChromeContent";

export const metadata: Metadata = traditionalChineseRootMetadata;

interface TraditionalChineseLayoutProps {
  children: React.ReactNode;
}

const TraditionalChineseLayout: React.FC<TraditionalChineseLayoutProps> = ({ children }) => {
  return (
    <RootDocument chrome={globalEnglishSiteChrome} documentLocale="zh-Hant">
      {children}
    </RootDocument>
  );
};

export default TraditionalChineseLayout;
