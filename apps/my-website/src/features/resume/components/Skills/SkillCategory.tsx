"use client";

import { type Skill } from "@packages/shared/types";
import { cn } from "@packages/shared/utils";
import { motion } from "framer-motion";
import React from "react";

interface SkillCategoryProps {
  description: string;
  index: number;
  skills: Skill[];
  title: string;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ description, index, skills, title }) => {
  return (
    <motion.div
      className={cn(
        "card bg-base-100 h-full shadow-xl hover:shadow-2xl",
        "border-base-200/70 border transition-shadow duration-300",
      )}
      initial={{ opacity: 0, y: 50 }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="card-body p-6">
        <div className="mb-4">
          <h3 className="card-title text-base-content text-xl font-bold">{title}</h3>
          <p className="text-base-content/80 text-sm">{description}</p>
        </div>

        <div className="space-y-2">
          {skills.map((skill, skillIndex) => (
            <motion.div
              className="bg-base-200 badge badge-outline w-full justify-between p-3"
              initial={{ opacity: 0, x: -20 }}
              key={skillIndex}
              transition={{ delay: index * 0.1 + skillIndex * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="text-sm">{skill.name}</span>
              <span className="text-xl">{skill.icon}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillCategory;
