"use client";

import { m } from "framer-motion";
import { Eye, Star, Zap } from "lucide-react";
import React from "react";

import { Skill } from "@/data/skillData";
import { cn } from "@/utils/cn";

interface SkillCategoryProps {
  description: string;
  index: number;
  level: "expert" | "familiar" | "proficient";
  skills: Skill[];
  title: string;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ description, index, level, skills, title }) => {
  const getLevelConfig = () => {
    switch (level) {
      case "familiar":
        return {
          accentColor: "text-info",
          badgeVariant: "badge-info",
          icon: <Eye className="h-5 w-5" />,
        };
      case "proficient":
        return {
          accentColor: "text-accent",
          badgeVariant: "badge-accent",
          icon: <Zap className="h-5 w-5" />,
        };
      case "expert":
      default:
        return {
          accentColor: "text-primary",
          badgeVariant: "badge-primary",
          icon: <Star className="h-5 w-5" />,
        };
    }
  };

  const config = getLevelConfig();

  return (
    <m.div
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
        <div className="mb-4 flex items-center">
          <div className={cn(config.accentColor, "mr-3")}>{config.icon}</div>
          <div>
            <h3 className="card-title text-base-content text-xl font-bold">{title}</h3>
            <p className={cn("text-sm font-semibold", config.accentColor)}>({description})</p>
          </div>
        </div>

        <div className="space-y-2">
          {skills.map((skill, skillIndex) => (
            <m.div
              className={cn(
                "badge badge-outline w-full justify-start p-3",
                "h-auto min-h-[2rem] gap-2",
                config.badgeVariant,
              )}
              initial={{ opacity: 0, x: -20 }}
              key={skillIndex}
              transition={{ delay: index * 0.1 + skillIndex * 0.05, duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <span className="flex-shrink-0">{skill.icon}</span>
              <span className="text-sm">{skill.name}</span>
            </m.div>
          ))}
        </div>
      </div>
    </m.div>
  );
};

export default SkillCategory;
