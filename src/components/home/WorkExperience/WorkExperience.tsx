"use client";

import { experiences } from '@/data/experienceData';
import Experience from '@/components/home/WorkExperience/ExperienceCard';

const WorkExperience = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-2 md:px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-base-content mb-4">Work Experience</h2>
          <p className="text-lg text-base-content/80">我的職涯發展歷程</p>
        </div>
        <div className="flex flex-col gap-12">
          {experiences.map((exp) => (
            <Experience key={exp.company + exp.period} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience; 
