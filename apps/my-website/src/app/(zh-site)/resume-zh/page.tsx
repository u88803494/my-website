import type { Metadata } from "next";

import PersonJsonLd from "@/components/shared/PersonJsonLd";
import ResumeFeature, { traditionalChineseResumeContent } from "@/features/resume";

const description = "Henry Lee 的繁體中文履歷，展示前端、AI 與全端 Web 開發經驗、專案作品、專業技能與技術文章。";
const title = "Henry Lee - 資深軟體工程師繁中履歷";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://henryleelab.com/resume-zh",
  },
  description,
  openGraph: {
    description,
    images: [
      {
        alt: "Henry Lee 頭像",
        height: 512,
        url: "https://henryleelab.com/images/my-photo.jpeg",
        width: 512,
      },
    ],
    title,
    type: "profile",
    url: "https://henryleelab.com/resume-zh",
  },
  title,
  twitter: {
    card: "summary",
    description,
    images: ["https://henryleelab.com/images/my-photo.jpeg"],
    title,
  },
};

const TraditionalChineseResumePage: React.FC = () => {
  return (
    <>
      <PersonJsonLd jobTitle="資深軟體工程師" url="https://henryleelab.com/resume-zh" />
      <ResumeFeature content={traditionalChineseResumeContent} />
    </>
  );
};

export default TraditionalChineseResumePage;
