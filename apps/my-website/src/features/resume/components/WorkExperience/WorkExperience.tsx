"use client";

import React from "react";

import { experiences } from "@/data/experienceData";
import { cn } from "@/utils/cn";

import ExperienceCard from "./ExperienceCard";

interface WorkExperienceProps {
  backgroundClass: string;
  sectionId: string;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ backgroundClass, sectionId }) => {
  return (
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="prose prose-neutral container mx-auto max-w-4xl px-2 md:px-4">
        <div className="mb-16 text-center">
          <h2 className="text-base-content mb-4 text-4xl font-bold">Work Experience</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 text-lg">我的職涯發展歷程</p>
        </div>
        <div className="flex flex-col gap-12">
          {experiences.map((exp) => (
            <ExperienceCard experience={exp} key={exp.company + exp.period} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
