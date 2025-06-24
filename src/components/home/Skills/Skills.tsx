"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '@/data/skillsData';
import SkillCategory from './SkillCategory';

const Skills: React.FC = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-2 md:px-4 prose prose-neutral max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Skills
          </h2>
          <p className="text-lg text-base-content/80">
            我在軟體開發領域的技能分佈，從核心專長到各種涉獵的技術棧
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 not-prose">
          {skillsData.map((category, index) => (
            <SkillCategory
              key={index}
              title={category.title}
              description={category.description}
              skills={category.skills} 
              level={category.level}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills; 