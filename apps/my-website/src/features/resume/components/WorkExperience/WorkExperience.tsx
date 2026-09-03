"use client";

import React from "react";

import { cn } from "@/utils/cn";

import type { WorkExperienceContent } from "../../types/resumeContent.types";
import ExperienceCard from "./ExperienceCard";

interface WorkExperienceProps {
  backgroundClass: string;
  content: WorkExperienceContent;
  sectionId: string;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ backgroundClass, content, sectionId }) => {
  return (
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="prose prose-neutral container mx-auto max-w-4xl px-2 md:px-4">
        <div className="mb-16 text-center">
          <h2 className="text-base-content mb-4 text-4xl font-bold">{content.heading}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 text-lg">{content.description}</p>
        </div>
        <div className="not-prose flex flex-col gap-12">
          {content.experiences.map((experience) => (
            <ExperienceCard
              achievementHeading={content.achievementHeading}
              achievementSeparator={content.achievementSeparator}
              experience={experience}
              key={experience.company + experience.period}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
