"use client";

import { Experience } from '@/types/experience.types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <motion.div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="card-body p-6">
        <div className="flex items-center mb-4">
          <Image
            src={experience.logoUrl}
            alt={`${experience.company} logo`}
            width={48}
            height={48}
            className="rounded-full object-cover mr-4 shadow"
          />
          <div>
            <h3 className="card-title text-xl font-bold text-base-content">{experience.company}</h3>
            <p className="text-primary font-semibold">{experience.role}</p>
            <p className="text-sm text-base-content/80">{experience.period}</p>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-base-content mb-3">主要成就</h4>
          <ul className="space-y-3">
            {experience.achievements.map((achievement, achievementIndex) => (
              <li key={achievementIndex} className="flex items-start gap-2 text-base-content/80 text-sm leading-relaxed">
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                <p>
                  <strong className="font-bold text-base-content">{achievement.title}：</strong>
                  {achievement.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-8">
          {experience.techStackGroups.map((group: { label: string; items: string[] }, groupIdx: number) => (
            <div key={group.label} className="min-w-[120px]">
              <h5 className="text-md font-semibold text-base-content mb-2">{group.label}</h5>
              <div className="flex flex-wrap gap-2">
                {group.items.map((tech: string, techIndex: number) => (
                  <div
                    key={techIndex}
                    className={`badge ${groupIdx === 0 ? 'badge-primary' : groupIdx === 1 ? 'badge-accent' : 'badge-info'} badge-outline`}
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