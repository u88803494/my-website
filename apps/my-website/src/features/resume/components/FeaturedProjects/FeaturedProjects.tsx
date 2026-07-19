import { cn } from "@packages/shared/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import type { FeaturedProjectsContent } from "../../types/resumeContent.types";
import ProjectCard from "./ProjectCard";

const INITIAL_DISPLAY_COUNT = 4;

interface FeaturedProjectsProps {
  backgroundClass: string;
  content: FeaturedProjectsContent;
  sectionId: string;
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ backgroundClass, content, sectionId }) => {
  const [showAll, setShowAll] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  return (
    <section className={cn("py-16", backgroundClass)} id={sectionId}>
      <div className="container mx-auto px-4">
        {/* 標題區域 */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">{content.heading}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="mx-auto max-w-2xl text-lg text-gray-600">{content.description}</p>
        </div>

        {/* 專案網格 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {(showAll ? content.projects : content.projects.slice(0, INITIAL_DISPLAY_COUNT)).map((project, idx) => (
            <ProjectCard key={project.title + idx} project={project} techStackLabel={content.techStackLabel} />
          ))}
        </div>

        {/* 看更多/收合按鈕 */}
        {content.projects.length > INITIAL_DISPLAY_COUNT && (
          <div className="mt-10 flex justify-center">
            {!showAll ? (
              <button
                className="btn btn-primary btn-lg flex items-center gap-2 px-12 py-4 font-bold"
                onClick={() => setShowAll(true)}
              >
                <ChevronDown aria-hidden="true" className="h-6 w-6" />
                {content.showMoreLabel}
              </button>
            ) : (
              isDev && (
                <button
                  className="btn btn-outline btn-lg flex items-center gap-2 px-12 py-4 font-bold"
                  onClick={() => setShowAll(false)}
                >
                  <ChevronUp aria-hidden="true" className="h-6 w-6" />
                  {content.collapseLabel} <span className="text-error text-xs">{content.developmentOnlyLabel}</span>
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
