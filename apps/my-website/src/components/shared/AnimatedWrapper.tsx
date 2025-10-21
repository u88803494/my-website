"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";

interface AnimatedWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedWrapper = ({ children, className, delay = 0 }: AnimatedWrapperProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      animate={controls}
      className={className}
      initial="hidden"
      ref={ref}
      transition={{ delay, duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;
