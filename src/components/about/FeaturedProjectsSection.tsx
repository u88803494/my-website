import React from "react";

import ProjectCard from "@/components/home/FeaturedProjects/ProjectCard";
import { projects } from "@/data/projectData";

const featuredProjects = projects.filter((p) => p.title.includes("新典") || p.title.includes("慈濟"));

const FeaturedProjectsSection = () => {
  return (
    <section className="mb-12">
      <h3 className="border-primary/20 mb-6 border-b-2 pb-2 text-2xl font-bold">精選專案</h3>
      <div className="grid gap-8 md:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjectsSection;
