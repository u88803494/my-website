import React from 'react';
import Image from 'next/image';
import { Project } from '@/types/project.types';
import { SiGithub } from 'react-icons/si';
import { ExternalLink, FileText, Calendar } from 'lucide-react';
import TechStack from '@/components/shared/TechStack';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="card bg-base-100 shadow-xl h-full border border-base-200/50 hover:border-base-200 transition-colors duration-200">
      <figure className="bg-base-100 flex items-center justify-center aspect-[4/3] overflow-hidden relative border-b border-base-200/30">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-contain"
        />
      </figure>
      <div className="card-body flex flex-col">
        <h2 className="card-title mb-1">{project.title}</h2>
        <span className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {project.category}
        </span>
        <p className="mb-3">{project.description.intro}</p>
        <ul className="list-disc list-inside mb-3 space-y-1">
          {project.description.features.map((feature, idx) => (
            <li key={idx} className="text-sm leading-relaxed">{feature}</li>
          ))}
        </ul>
        <TechStack 
          techStack={project.techStack} 
          variant="primary" 
          className="mb-4"
        />
        <div className="mt-auto flex flex-wrap gap-2">
          {project.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline flex items-center gap-2 px-4 py-2"
            >
              {link.label === '預覽網站' && <ExternalLink className="w-4 h-4" />}
              {link.label.includes('GitHub') && <SiGithub className="w-4 h-4" />}
              {(link.label.includes('文章') || link.label.includes('心得')) && <FileText className="w-4 h-4" />}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 