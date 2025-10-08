"use client";

import { skillData } from "@packages/shared/data";
import { cn } from "@packages/shared/utils/cn";
import { motion } from "framer-motion";
import React from "react";

import SkillCategory from "./SkillCategory";

interface SkillsProps {
  backgroundClass: string;
  sectionId: string;
}

const Skills: React.FC<SkillsProps> = ({ backgroundClass, sectionId }) => {
  return (
    <section className={cn("py-20", backgroundClass)} id={sectionId}>
      <div className="prose prose-neutral container mx-auto max-w-6xl px-2 md:px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base-content mb-4 text-4xl font-bold">Skills</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 text-lg">我在軟體開發領域的技能分佈，從核心專長到各種涉獵的技術棧</p>
        </motion.div>

        <div className="not-prose grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skillData.map((category, index) => (
            <SkillCategory
              description={category.description || ""}
              index={index}
              key={index}
              skills={category.skills}
              title={category.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
