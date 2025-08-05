import type { Metadata } from "next";

import { AboutFeature } from "@/features/about";

export const metadata: Metadata = {
  description: "了解 Henry Lee 的職業經歷、技能、以及對軟體開發的熱忱",
  title: "關於我 - Henry Lee",
};

const AboutPage: React.FC = () => {
  return <AboutFeature />;
};

export default AboutPage;
