"use client";

import React from 'react';
import clsx from 'clsx';
import { experiences } from '@/data/experienceData';
import ExperienceCard from '@/components/home/WorkExperience/ExperienceCard';

interface WorkExperienceProps {
  backgroundClass: string;
  sectionId: string;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({
  backgroundClass,
  sectionId
}) => {
  return (
    <section 
      className={clsx('py-20', backgroundClass)}
      id={sectionId}
    >
      <div className="container mx-auto px-2 md:px-4 prose prose-neutral max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-base-content mb-4">Work Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-base-content/80">我的職涯發展歷程</p>
        </div>
        <div className="flex flex-col gap-12">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.company + exp.period} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience; 
