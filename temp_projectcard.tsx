import React from 'react';
import Image from 'next/image';
import { Project } from '@/types/project.types';
import { motion } from 'framer-motion';
import { ExternalLink, Github, FileText, Calendar } from 'lucide-react';
import TechStack from '@/components/shared/TechStack';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      <figure className="bg-base-200 flex items-center justify-center aspect-[4/3] overflow-hidden relative">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </figure>
      <div className="card-body flex flex-col">
        <h2 className="card-title group-hover:text-primary transition-colors duration-300 mb-1">{project.title}</h2>
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
            <motion.a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline hover:btn-primary transition-all duration-200 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label === '預覽網站' && <ExternalLink className="w-3 h-3" />}
              {link.label.includes('GitHub') && <Github className="w-3 h-3" />}
              {(link.label.includes('文章') || link.label.includes('心得')) && <FileText className="w-3 h-3" />}
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
