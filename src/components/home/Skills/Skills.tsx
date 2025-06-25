"use client";

import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { skillData } from "@/data/skillData";
import SkillCategory from "./SkillCategory";

interface SkillsProps {
  backgroundClass: string;
  sectionId: string;
}

const Skills: React.FC<SkillsProps> = ({ backgroundClass, sectionId }) => {
  return (
    <section className={clsx("py-20", backgroundClass)} id={sectionId}>
      <div className="container mx-auto px-2 md:px-4 prose prose-neutral max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-base-content mb-4">Skills</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-base-content/80">我在軟體開發領域的技能分佈，從核心專長到各種涉獵的技術棧</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 not-prose">
          {skillData.map((category, index) => (
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
