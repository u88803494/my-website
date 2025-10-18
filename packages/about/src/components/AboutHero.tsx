
"use client";

import { cn } from "@packages/shared";
import { motion } from "framer-motion";
import Image from "next/image";

import ContactLinks from "./ContactLinks";

const AboutHero = () => {
  return (
    <header className="mb-12 flex flex-col-reverse items-center gap-8 text-center sm:flex-row sm:items-center sm:text-left">
      <div className="flex-1 space-y-6">
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="text-primary mb-2 text-4xl font-bold tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Henry Lee
        </motion.h1>

        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-base-content/80 mb-4 text-xl font-medium"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          前端工程師 | 技術愛好者 | 分享家
        </motion.h2>

        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="text-base-content/90 mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ x: 5 }}
        >
          你好，我是 Henry。一位對軟體工藝充滿熱情的前端工程師，專注於運用最新的 Web
          技術打造高效能、高可維護性且使用者體驗卓越的應用程式。
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center sm:justify-start"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <ContactLinks />
        </motion.div>
      </div>

      <motion.div
        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
        className="relative h-32 w-32 flex-shrink-0 sm:h-40 sm:w-40"
        initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
        transition={{ delay: 0.1, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          className={cn(
            "relative h-full w-full overflow-hidden rounded-full shadow-lg",
            "ring-primary ring-offset-base-100 ring ring-offset-2",
            "transition-transform duration-300",
          )}
          transition={{ duration: 3, repeat: Infinity }}
          whileHover={{
            rotateY: 5,
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
        >
          <Image
            alt="Henry Lee"
            className="h-full w-full object-cover object-top"
            fill
            priority
            src="/images/my-photo.jpeg"
          />
        </motion.div>
      </motion.div>
    </header>
  );
};

export default AboutHero;
