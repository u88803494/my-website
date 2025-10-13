"use client";

import { skillData } from "../data/skillData";
import TechStack from "./TechStack";
import { motion } from "framer-motion";

const TechStackSection = () => {
  return (
    <section>
      <motion.h3
        animate={{ opacity: 1, y: 0 }}
        className="border-primary/20 mb-6 border-b-2 pb-2 text-2xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        我的技術棧
      </motion.h3>
      <div className="space-y-6">
        {skillData.map((category, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            key={category.title}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
          >
            <motion.h4 className="mb-3 text-lg font-semibold" transition={{ duration: 0.2 }} whileHover={{ x: 5 }}>
              {category.title}
            </motion.h4>
            <motion.div
              animate={{ scale: 1 }}
              initial={{ scale: 0.95 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            >
              <TechStack techStack={category.skills.map((skill) => skill.name)} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TechStackSection;
