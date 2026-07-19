"use client";

import { cn } from "@packages/shared/utils";
import { motion } from "framer-motion";
import { Calendar, GraduationCap } from "lucide-react";
import React from "react";

import type { EducationContent } from "../../types/resumeContent.types";

interface EducationProps {
  backgroundClass: string;
  content: EducationContent;
  sectionId: string;
}

const Education: React.FC<EducationProps> = ({ backgroundClass, content, sectionId }) => {
  return (
    <section className={cn("pt-10 pb-16", backgroundClass)} id={sectionId}>
      <div className="container mx-auto max-w-4xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-base-content mb-4 text-4xl font-bold">{content.heading}</h2>
          <div className="bg-primary mx-auto mb-6 h-1 w-20" />
          <p className="text-base-content/80 text-lg">{content.description}</p>
        </motion.div>

        <div className="mx-auto max-w-2xl space-y-4">
          {content.items.map((education, index) => (
            <motion.div
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors duration-200 ${
                education.highlight
                  ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  : "bg-base-100 border-base-content/10 hover:bg-base-200/50"
              }`}
              initial={{ opacity: 0, x: -20 }}
              key={index}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`${education.highlight ? "text-primary" : "text-base-content/60"}`}>
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className={`font-medium ${education.highlight ? "text-primary" : "text-base-content"}`}>
                    {education.title}
                  </h3>
                  <p className="text-base-content/70 text-sm">{education.description}</p>
                </div>
              </div>
              <div className="text-base-content/60 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span className="text-sm">{education.period}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
