import { AIDictionaryFeature } from "@packages/ai-dictionary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description: "運用人工智慧技術，讓中文詞彙含義與字源更容易理解",
  title: "AI 智能中文字典 - Henry Lee",
};

const AIDictionaryPage: React.FC = () => {
  return <AIDictionaryFeature />;
};

export default AIDictionaryPage;
