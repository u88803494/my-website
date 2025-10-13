"use client";

import { TechStack } from "@/components/shared";
import { type Project } from "@packages/shared/types";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import React from "react";
import { SiGithub } from "react-icons/si";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <motion.div
      className="card bg-base-100 border-base-200/50 hover:border-base-200 group h-full border shadow-xl transition-colors duration-200"
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      whileHover={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        scale: 1.02,
        y: -8,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <figure className="bg-base-100 border-base-200/30 relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b">
        <Image
          alt={project.title}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          fill
          src={project.imageUrl}
        />
      </figure>
      <div className="card-body flex flex-col">
        <h2 className="card-title mb-1">{project.title}</h2>
        <span className="mb-3 flex items-center gap-1 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          {project.category}
        </span>
        <p className="mb-3">{project.description.intro}</p>
        <ul className="mb-3 list-inside list-disc space-y-1">
          {project.description.features.map((feature: string, idx: number) => (
            <li className="text-sm leading-relaxed" key={idx}>
              {feature}
            </li>
          ))}
        </ul>
        <TechStack className="mt-4" techStack={project.techStack} />
        <div className="mt-auto flex flex-wrap gap-2">
          {project.links.map((link: { label: string; url: string }, idx: number) => (
            <motion.a
              className="btn btn-outline flex items-center gap-2 px-4 py-2"
              href={link.url}
              key={idx}
              rel="noopener noreferrer"
              target="_blank"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label === "預覽網站" && <ExternalLink className="h-4 w-4" />}
              {link.label.includes("GitHub") && <SiGithub className="h-4 w-4" />}
              {(link.label.includes("文章") || link.label.includes("心得")) && <FileText className="h-4 w-4" />}
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
