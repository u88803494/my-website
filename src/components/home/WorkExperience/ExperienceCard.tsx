"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

import { Experience } from "@/types/experience.types";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="card-body p-6">
        <div className="mb-4 flex items-center">
          <Image
            alt={`${experience.company} logo`}
            className="mr-4 rounded-full object-cover shadow"
            height={48}
            src={experience.logoUrl}
            width={48}
          />
          <div>
            <h3 className="card-title text-base-content text-xl font-bold">{experience.company}</h3>
            <p className="text-primary font-semibold">{experience.role}</p>
            <p className="text-base-content/80 text-sm">{experience.period}</p>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-base-content mb-3 text-lg font-semibold">主要成就</h4>
          <ul className="space-y-3">
            {experience.achievements.map((achievement, achievementIndex) => (
              <li
                className="text-base-content/80 flex items-start gap-2 text-sm leading-relaxed"
                key={achievementIndex}
              >
                <CheckCircle2 className="text-secondary mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  <strong className="text-base-content font-bold">{achievement.title}：</strong>
                  {achievement.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-8">
          {experience.techStackGroups.map((group: { items: string[]; label: string }, groupIdx: number) => (
            <div className="min-w-[120px]" key={group.label}>
              <h5 className="text-md text-base-content mb-2 font-semibold">{group.label}</h5>
              <div className="flex flex-wrap gap-2">
                {group.items.map((tech: string, techIndex: number) => (
                  <div
                    className={`badge ${groupIdx === 0 ? "badge-primary" : groupIdx === 1 ? "badge-accent" : "badge-info"} badge-outline`}
                    key={techIndex}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
