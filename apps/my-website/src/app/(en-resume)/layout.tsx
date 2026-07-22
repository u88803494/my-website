import "../globals.css";

import type { Metadata } from "next";

import RootDocument from "@/components/shared/RootDocument";
import { englishRootMetadata } from "@/components/shared/rootMetadata";
import { globalEnglishSiteChrome } from "@/components/shared/siteChromeContent";

export const metadata: Metadata = englishRootMetadata;

interface EnglishResumeLayoutProps {
  children: React.ReactNode;
}

const EnglishResumeLayout: React.FC<EnglishResumeLayoutProps> = ({ children }) => {
  return (
    <RootDocument chrome={globalEnglishSiteChrome} documentLocale="en">
      {children}
    </RootDocument>
  );
};

export default EnglishResumeLayout;
