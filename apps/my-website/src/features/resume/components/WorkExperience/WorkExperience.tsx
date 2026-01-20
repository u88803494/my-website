"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { experiences } from "@/data/experienceData";
import { type Experience } from "@/types/experience.types";
import { cn } from "@/utils/cn";

import ExperienceCard from "./ExperienceCard";

interface WorkExperienceProps {
  backgroundClass: string;
  sectionId: string;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({ backgroundClass, sectionId }) => {
  const t = useTranslations("Experience");

  return (
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="prose prose-neutral container mx-auto max-w-4xl px-2 md:px-4">
        <div className="mb-16 text-center">
          <h2 className="text-base-content mb-4 text-4xl font-bold">{t("title")}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 text-lg">{t("subtitle")}</p>
        </div>
        <div className="flex flex-col gap-12">
          {experiences.map((exp: Experience) => (
            <ExperienceCard experience={exp} key={exp.companyKey} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
