"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Eye } from 'lucide-react';

import { Skill } from '@/data/skillData';

interface SkillCategoryProps {
  title: string;
  description: string;
  skills: Skill[];
  level: 'expert' | 'proficient' | 'familiar';
  index: number;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({
  title,
  description,
  skills,
  level,
  index
}) => {
  const getLevelConfig = () => {
    switch (level) {
      case 'expert':
        return {
          icon: <Star className="w-5 h-5" />,
          badgeVariant: 'badge-primary',
          accentColor: 'text-primary'
        };
      case 'proficient':
        return {
          icon: <Zap className="w-5 h-5" />,
          badgeVariant: 'badge-accent',
          accentColor: 'text-accent'
        };
      case 'familiar':
        return {
          icon: <Eye className="w-5 h-5" />,
          badgeVariant: 'badge-info',
          accentColor: 'text-info'
        };
      default:
        return {
          icon: <Star className="w-5 h-5" />,
          badgeVariant: 'badge-primary',
          accentColor: 'text-primary'
        };
    }
  };

  const config = getLevelConfig();

  return (
    <motion.div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full border border-base-200/70"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <div className="card-body p-6">
        <div className="flex items-center mb-4">
          <div className={`${config.accentColor} mr-3`}>
            {config.icon}
          </div>
          <div>
            <h3 className="card-title text-xl font-bold text-base-content">{title}</h3>
            <p className={`text-sm ${config.accentColor} font-semibold`}>({description})</p>
          </div>
        </div>

        <div className="space-y-2">
          {skills.map((skill, skillIndex) => (
            <motion.div
              key={skillIndex}
              className={`badge ${config.badgeVariant} badge-outline w-full justify-start p-3 h-auto min-h-[2rem] gap-2`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index * 0.1) + (skillIndex * 0.05) }}
            >
              <span className="flex-shrink-0">{skill.icon}</span>
              <span className="text-sm">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCategory; 