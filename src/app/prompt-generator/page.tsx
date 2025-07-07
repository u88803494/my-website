import { Metadata } from "next";

import PromptGeneratorFeature from "@/features/prompt-generator";

export const metadata: Metadata = {
  description: "想不到怎麼下提示詞嗎？用用這個工具，或許你可以釐清你的需求。",
  title: "AI Prompt 生成器 | Henry Lee",
};

const PromptGeneratorPage = () => {
  return <PromptGeneratorFeature />;
};

export default PromptGeneratorPage;
