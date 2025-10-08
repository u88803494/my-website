import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper;