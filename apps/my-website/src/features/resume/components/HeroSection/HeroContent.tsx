"use client";

import { motion } from "framer-motion";

import { ContactLinks } from "@/components/shared";

import type { HeroContentData } from "../../types/resumeContent.types";
import TypewriterText from "./TypewriterText";

interface HeroContentProps {
  contactLinkLocale: "en" | "zh-Hant";
  content: HeroContentData;
}

const HeroContent: React.FC<HeroContentProps> = ({ contactLinkLocale, content }) => {
  return (
    <div className="card-body flex max-w-2xl flex-col gap-6 p-0 text-center lg:text-left">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="card-title mb-2 text-4xl font-bold lg:text-6xl"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span>{content.greeting}</span>
        <TypewriterText delay={0.8} text={content.name} />
      </motion.h1>

      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className="text-secondary mb-2 text-xl font-semibold lg:text-2xl"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {content.title}
      </motion.h2>

      <motion.p
        animate={{ opacity: 1, y: 0 }}
        className="text-base-content/70 mb-2 text-lg font-medium lg:text-xl"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {content.subtitle}
      </motion.p>

      <div className="text-base-content/80 space-y-4 text-base leading-relaxed lg:text-lg">
        {content.paragraphs.map((paragraph, index) => (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            key={paragraph}
            transition={{ delay: 0.7 + index * 0.2, duration: 0.6 }}
            whileHover={{ x: 5 }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      {/* CTA Buttons */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.button
          className="btn btn-primary btn-lg group tooltip tooltip-custom tooltip-top relative overflow-hidden shadow-md transition-all hover:shadow-xl"
          data-tip={content.workCta.tooltip}
          onClick={() => {
            const projectsSection = document.getElementById("featured-projects");
            projectsSection?.scrollIntoView({ behavior: "smooth" });
          }}
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">{content.workCta.label}</span>
          <motion.div
            className="from-primary to-secondary pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20"
            initial={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            whileHover={{ x: "0%" }}
          />
        </motion.button>
        <motion.button
          className="btn btn-outline btn-lg tooltip tooltip-custom tooltip-top shadow-md transition-all hover:shadow-xl"
          data-tip={content.resumeDownload.tooltip}
          onClick={() => {
            const link = document.createElement("a");
            link.href = content.resumeDownload.href;
            link.download = content.resumeDownload.fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          {content.resumeDownload.label}
        </motion.button>
      </motion.div>

      {/* Social Links */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex justify-center gap-4 lg:justify-start"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 1.7, duration: 0.6 }}
      >
        <ContactLinks locale={contactLinkLocale} variant="circle" />
      </motion.div>
    </div>
  );
};

export default HeroContent;
