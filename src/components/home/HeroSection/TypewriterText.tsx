"use client";

import { motion } from "framer-motion";

const TypewriterText = ({ delay = 0.8, text }: { delay?: number; text: string }) => {
  return (
    <motion.span
      animate={{ opacity: 1 }}
      className="text-primary"
      initial={{ opacity: 0 }}
      transition={{
        delay: delay,
        duration: 0.8,
        ease: "easeInOut",
      }}
    >
      {text}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        className="bg-primary ml-1 inline-block h-7 w-0.5 lg:h-11"
        initial={{ opacity: 0 }}
        transition={{
          delay: delay + 0.8,
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.span>
  );
};

export default TypewriterText;
