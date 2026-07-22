import type { Metadata } from "next";

import PersonJsonLd from "@/components/shared/PersonJsonLd";
import ResumeFeature, { englishResumeContent } from "@/features/resume";

const description =
  "Senior AI Frontend Engineer Henry Lee's resume, featuring AI-native products, frontend architecture, professional experience, and technical writing.";
const title = "Henry Lee - Senior AI Frontend Engineer";

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
      <PersonJsonLd jobTitle="Senior AI Frontend Engineer" url="https://henryleelab.com/" />
      <ResumeFeature content={englishResumeContent} />
    </>
  );
};

export default HomePage;
