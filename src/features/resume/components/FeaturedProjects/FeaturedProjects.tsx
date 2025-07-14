import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { projects } from "@/data/projectData";
import { cn } from "@/utils/cn";

import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  backgroundClass: string;
  sectionId: string;
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ backgroundClass, sectionId }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 4);
  const isDev = process.env.NODE_ENV === "development";

  return (
    <section className={cn("py-16", backgroundClass)} id={sectionId}>
      <div className="container mx-auto px-4">
        {/* 標題區域 */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">精選專案 Featured Projects</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="mx-auto max-w-2xl text-lg text-gray-600">探索我的技術旅程，從學習階段到專業開發的完整作品集</p>
        </div>

        {/* 專案網格 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {displayedProjects.map((project, idx) => (
            <ProjectCard key={project.title + idx} project={project} />
          ))}
        </div>

        {/* 看更多/收合按鈕 */}
        {projects.length > 4 && (
          <div className="mt-10 flex justify-center">
            {!showAll ? (
              <button
                className="btn btn-primary btn-lg flex items-center gap-2 px-12 py-4 font-bold"
                onClick={() => setShowAll(true)}
              >
                <ChevronDown aria-hidden="true" className="h-6 w-6" />
                看更多專案
              </button>
            ) : (
              isDev && (
                <button
                  className="btn btn-outline btn-lg flex items-center gap-2 px-12 py-4 font-bold"
                  onClick={() => setShowAll(false)}
                >
                  <ChevronUp aria-hidden="true" className="h-6 w-6" />
                  收合 <span className="text-error text-xs">[僅開發模式]</span>
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
