"use client";

import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          animate={{
            opacity: [0, 1, 0],
            y: [0, -100, 0],
          }}
          className="bg-primary/20 absolute h-2 w-2 rounded-full"
          initial={{ opacity: 0 }}
          key={i}
          style={{
            left: `${(i * 5) % 100}%`,
            top: `${(i * 7) % 100}%`,
          }}
          transition={{
            delay: 2 + i * 0.1, // 延遲 2 秒後開始，每個粒子間隔 0.1 秒
            duration: 3 + (i % 3),
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
