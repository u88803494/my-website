"use client";

import { m, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <m.div
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
    </m.div>
  );
};

export default AnimatedWrapper;
