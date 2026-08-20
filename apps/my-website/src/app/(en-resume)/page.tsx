import type { Metadata } from "next";

import PersonJsonLd from "@/components/shared/PersonJsonLd";
import ResumeFeature, { englishResumeContent } from "@/features/resume";

const description =
  "Senior Software Engineer Henry Lee's resume, featuring frontend architecture, AI-native products, full-stack engineering, and professional experience.";
const title = "Henry Lee - Senior Software Engineer";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://henryleelab.com/",
  },
  description,
  openGraph: {
    description,
    images: [
      {
        alt: "Portrait of Henry Lee",
        height: 512,
        url: "https://henryleelab.com/images/my-photo.jpeg",
        width: 512,
      },
    ],
    title,
    type: "profile",
    url: "https://henryleelab.com/",
  },
  title,
  twitter: {
    card: "summary",
    description,
    images: ["https://henryleelab.com/images/my-photo.jpeg"],
    title,
  },
};

const HomePage: React.FC = () => {
  return (
    <>
      <PersonJsonLd jobTitle="Senior Software Engineer" url="https://henryleelab.com/" />
      <ResumeFeature content={englishResumeContent} />
    </>
  );
};

export default HomePage;
