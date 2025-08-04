import type { Metadata } from "next";

import { ResumeFeature } from "@/features/resume";

export const metadata: Metadata = {
  description: "Henry Lee 的個人履歷網站，展示前端開發技能、專案經驗與技術文章",
  title: "Henry Lee - Full Stack Developer",
};

const HomePage: React.FC = () => {
  return <ResumeFeature />;
};

export default HomePage;
