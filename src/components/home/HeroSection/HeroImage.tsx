"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HeroImage = () => {
  return (
    <motion.div
      className="avatar"
      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <motion.div
        className="w-48 h-48 lg:w-64 lg:h-64 rounded-full ring-4 ring-primary/20 shadow-2xl overflow-hidden"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        whileHover={{
          scale: 1.05,
          rotateY: 5,
          transition: { duration: 0.3 },
        }}
      >
        <Image
          src="/images/my-photo.jpeg"
          alt="Henry Lee's photo"
          width={256}
          height={256}
          className="w-full h-full object-cover object-top"
          priority
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroImage; 