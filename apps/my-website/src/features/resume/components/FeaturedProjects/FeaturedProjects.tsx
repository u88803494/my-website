"use client";

import { type Project } from "@packages/shared/types";
import { cn } from "@packages/shared/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { projects as PROJECTS } from "@/data/projectData";

import ProjectCard from "./ProjectCard";

const INITIAL_DISPLAY_COUNT = 4;

interface FeaturedProjectsProps {
  backgroundClass: string;
  sectionId: string;
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ backgroundClass, sectionId }) => {
  const [showAll, setShowAll] = useState(false);
  const isDev = process.env.NODE_ENV === "development";
  const t = useTranslations("Projects");

  return (
    <section className={cn("py-16", backgroundClass)} id={sectionId}>
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">{t("title")}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {(showAll ? PROJECTS : PROJECTS.slice(0, INITIAL_DISPLAY_COUNT)).map((project: Project, idx: number) => (
            <ProjectCard key={project.titleKey + idx} project={project} />
          ))}
        </div>

        {PROJECTS.length > INITIAL_DISPLAY_COUNT && (
          <div className="mt-10 flex justify-center">
            {!showAll ? (
              <button
                className="btn btn-primary btn-lg flex items-center gap-2 px-12 py-4 font-bold"
                onClick={() => setShowAll(true)}
              >
                <ChevronDown aria-hidden="true" className="h-6 w-6" />
                {t("showMore")}
              </button>
            ) : (
              isDev && (
                <button
                  className="btn btn-outline btn-lg flex items-center gap-2 px-12 py-4 font-bold"
                  onClick={() => setShowAll(false)}
                >
                  <ChevronUp aria-hidden="true" className="h-6 w-6" />
                  {t("collapse")} <span className="text-error text-xs">[{t("devOnly")}]</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
