"use client";

import { motion } from "framer-motion";
import ContactLinks from "@/components/shared/ContactLinks";
import TypewriterText from "./TypewriterText";

const HeroContent = () => {
  return (
    <div className="text-center lg:text-left max-w-2xl flex flex-col gap-6">
      <motion.h1
        className="text-4xl lg:text-6xl font-bold mb-2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span>{"Hi, I'm "}</span>
        <TypewriterText text="Henry Lee" delay={0.8} />
      </motion.h1>
      
      <motion.h2
        className="text-xl lg:text-2xl font-semibold text-secondary mb-2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        前端工程師
      </motion.h2>
      
      <div className="text-base lg:text-lg text-base-content/80 leading-relaxed space-y-4">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ x: 5 }}
        >
          具備四年 Web 開發經驗，專精於使用 <b>Next.js</b> 與 <b>TypeScript</b> 打造高效能、高可維護性的應用。
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          whileHover={{ x: 5 }}
        >
          擅長主導前端架構與效能優化，曾透過創新開發方式，成功將專案成本降低 <b>50%</b>，並將關鍵頁面讀取時間由 <b>5 秒以上</b> 縮短至 <b>1 秒內</b>。
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          whileHover={{ x: 5 }}
        >
          團隊協作方面，負責指導兩名團隊成員導入新技術、建立標準化開發流程以提升程式碼品質，也致力於提升團隊整體生產力。
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          whileHover={{ x: 5 }}
        >
          經歷一段個人成長與沉澱後，對職涯方向有了更清晰的規劃，已準備好重返職場，期待貢獻我的技術與經驗，為團隊創造實質價值。
        </motion.p>
      </div>
      
      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.button
          className="btn btn-primary btn-lg relative overflow-hidden group"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">View My Work</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
        <motion.button
          className="btn btn-outline btn-lg"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          Download Resume
        </motion.button>
      </motion.div>
      
      {/* Social Links */}
      <motion.div
        className="flex justify-center lg:justify-start gap-4 mt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.7 }}
      >
        <ContactLinks variant="circle" />
      </motion.div>
    </div>
  );
};

export default HeroContent; 