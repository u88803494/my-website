import { projects } from "@/data/projectData";
import { cn } from "@/utils/cn";

import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  backgroundClass: string;
  sectionId: string;
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ backgroundClass, sectionId }) => {
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
          {projects.map((project, idx) => (
            <ProjectCard key={project.title + idx} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
