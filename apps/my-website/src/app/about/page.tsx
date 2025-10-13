import type { Metadata } from "next";

import { AboutFeature } from "@/features/about";

export const metadata: Metadata = {
  description:
    "深入了解 Henry Lee，一位熱衷於打造高效能、可維護 Web 應用的前端工程師。探索我的技術棧、專業經歷與個人理念。",
  title: "關於我 | Henry Lee",
};

const AboutPage: React.FC = () => {
  return <AboutFeature />;
};

export default AboutPage;
