"use client";

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { GraduationCap, Calendar } from 'lucide-react';

const educationData = [
  {
    title: "程式導師實驗計畫第三期",
    period: "Apr 2019 ~ Dec 2019",
    description: "學員",
    icon: <GraduationCap className="w-4 h-4" />,
    highlight: true
  },
  {
    title: "明新科技大學",
    period: "2009 ~ 2011", 
    description: "學士學位，化學與材料工程學系",
    icon: <GraduationCap className="w-4 h-4" />,
    highlight: false
  },
  {
    title: "義守大學",
    period: "2007 ~ 2009",
    description: "副學士學位，化學工程",
    icon: <GraduationCap className="w-4 h-4" />,
    highlight: false
  }
];

interface EducationProps {
  backgroundClass: string;
  sectionId: string;
}

const Education: React.FC<EducationProps> = ({
  backgroundClass,
  sectionId
}) => {
  return (
    <section 
      className={clsx('pt-10 pb-16', backgroundClass)}
      id={sectionId}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-base-content mb-4">
            學歷與進修
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-base-content/80">
            我的學習歷程與背景
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-4">
          {educationData.map((edu, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 ${
                edu.highlight 
                  ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
                  : 'bg-base-100 border-base-content/10 hover:bg-base-200/50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`${edu.highlight ? 'text-primary' : 'text-base-content/60'}`}>
                  {edu.icon}
                </div>
                <div>
                  <h3 className={`font-medium ${edu.highlight ? 'text-primary' : 'text-base-content'}`}>
                    {edu.title}
                  </h3>
                  <p className="text-sm text-base-content/70">{edu.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-base-content/60">
                <Calendar className="w-3 h-3" />
                <span className="text-sm">{edu.period}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education; 