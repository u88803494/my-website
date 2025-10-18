"use client";

import { motion } from "framer-motion";

import { ContactLinks } from "@/components/shared";

import TypewriterText from "./TypewriterText";

const HeroContent = () => {
  return (
    <div className="card-body flex max-w-2xl flex-col gap-6 p-0 text-center lg:text-left">
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="card-title mb-2 text-4xl font-bold lg:text-6xl"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span>{"Hi, I'm "}</span>
        <TypewriterText delay={0.8} text="Henry Lee" />
      </motion.h1>

      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className="text-secondary mb-2 text-xl font-semibold lg:text-2xl"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        前端工程師
      </motion.h2>

      <div className="text-base-content/80 space-y-4 text-base leading-relaxed lg:text-lg">
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ x: 5 }}
        >
          具備四年 Web 開發經驗，專精於使用 <b>Next.js</b> 與 <b>TypeScript</b> 打造高效能、高可維護性的應用。
        </motion.p>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          whileHover={{ x: 5 }}
        >
          擅長主導前端架構與效能優化，曾透過創新開發方式，成功將專案成本降低 <b>50%</b>，並將關鍵頁面讀取時間由{" "}
          <b>5 秒以上</b> 縮短至 <b>1 秒內</b>。
        </motion.p>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          whileHover={{ x: 5 }}
        >
          團隊協作方面，負責指導兩名團隊成員導入新技術、建立標準化開發流程以提升程式碼品質，也致力於提升團隊整體生產力。
        </motion.p>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          whileHover={{ x: 5 }}
        >
          經歷一段個人成長與沉澱後，對職涯方向有了更清晰的規劃，已準備好重返職場，期待貢獻我的技術與經驗，為團隊創造實質價值。
        </motion.p>
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
          data-tip="瀏覽我的精選專案作品"
          onClick={() => {
            const projectsSection = document.getElementById("featured-projects");
            projectsSection?.scrollIntoView({ behavior: "smooth" });
          }}
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">View My Work</span>
          <motion.div
            className="from-primary to-secondary pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20"
            initial={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            whileHover={{ x: "0%" }}
          />
        </motion.button>
        <motion.button
          className="btn btn-outline btn-lg tooltip tooltip-custom tooltip-top shadow-md transition-all hover:shadow-xl"
          data-tip="下載我的履歷 PDF 檔案"
          onClick={() => {
            const link = document.createElement("a");
            link.href = "/documents/henry-lee-resume-20250618.pdf";
            link.download = "Henry-Lee-Resume-2025.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)", scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
        >
          Download Resume
        </motion.button>
      </motion.div>

      {/* Social Links */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 flex justify-center gap-4 lg:justify-start"
        initial={{ opacity: 0, y: 30 }}
        transition={{ delay: 1.7, duration: 0.6 }}
      >
        <ContactLinks variant="circle" />
      </motion.div>
    </div>
  );
};

export default HeroContent;
