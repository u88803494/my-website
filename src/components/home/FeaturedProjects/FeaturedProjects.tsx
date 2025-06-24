import React from 'react';
import { projects } from '@/data/projectData';
import ProjectCard from './ProjectCard';

const FeaturedProjects: React.FC = () => {
  return (
    <section className="py-16" id="featured-projects">
      <div className="container mx-auto px-4">
        {/* 標題區域 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            精選專案 Featured Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            探索我的技術旅程，從學習階段到專業開發的完整作品集
          </p>
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
