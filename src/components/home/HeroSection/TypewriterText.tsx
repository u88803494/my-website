"use client";

import { motion } from "framer-motion";

const TypewriterText = ({ text, delay = 0.8 }: { text: string; delay?: number }) => {
  return (
    <motion.span
      className="text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      {text}
      <motion.span
        className="inline-block w-0.5 h-7 lg:h-11 bg-primary ml-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: delay + 0.8,
          ease: "easeInOut",
        }}
      />
    </motion.span>
  );
};

export default TypewriterText;
