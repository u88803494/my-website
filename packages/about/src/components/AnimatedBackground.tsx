"use client";

import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 主要粒子動畫 */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          animate={{
            opacity: [0, 0.8, 0],
            rotate: [0, 180, 360],
            scale: [0.5, 1, 0.5],
          }}
          className="bg-secondary/30 absolute h-3 w-3 rounded-full"
          initial={{ opacity: 0 }}
          key={`main-${i}`}
          style={{
            left: `${(i * 7) % 95}%`,
            top: `${(i * 11) % 90}%`,
          }}
          transition={{
            delay: i * 0.2,
            duration: 4 + (i % 2),
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}

      {/* 較小的裝飾性粒子 */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          animate={{
            opacity: [0, 0.6, 0],
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          className="bg-primary/20 absolute h-1 w-1 rounded-full"
          initial={{ opacity: 0 }}
          key={`small-${i}`}
          style={{
            left: `${(i * 8 + 20) % 90}%`,
            top: `${(i * 13 + 10) % 85}%`,
          }}
          transition={{
            delay: 1 + i * 0.15,
            duration: 5 + (i % 3),
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}

      {/* 漸變光暈效果 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          animate={{
            opacity: [0, 0.1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          className="from-primary/10 to-secondary/10 absolute rounded-full bg-gradient-to-r blur-xl"
          initial={{ opacity: 0 }}
          key={`glow-${i}`}
          style={{
            height: `${150 + i * 50}px`,
            left: `${(i * 30 + 20) % 70}%`,
            top: `${(i * 40 + 15) % 60}%`,
            width: `${150 + i * 50}px`,
          }}
          transition={{
            delay: 2 + i * 1.5,
            duration: 8 + i * 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
