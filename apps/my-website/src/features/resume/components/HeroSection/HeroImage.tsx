"use client";

import { m } from "framer-motion";
import Image from "next/image";

import { cn } from "@/utils/cn";

const HeroImage = () => {
  return (
    <m.div
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      className="avatar"
      initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
      transition={{ delay: 0.05, duration: 0.5 }}
    >
      <m.div
        animate={{ y: [0, -10, 0] }}
        className={cn(
          "h-48 w-48 overflow-hidden rounded-full lg:h-64 lg:w-64",
          "ring-primary ring-offset-base-100 ring ring-offset-4",
          "bg-base-100 shadow-2xl transition-transform duration-300 hover:scale-105",
        )}
        transition={{ duration: 3, repeat: Infinity }}
        whileHover={{
          rotateY: 5,
          scale: 1.08,
          transition: { duration: 0.3 },
        }}
      >
        <Image
          alt="Henry Lee's photo"
          className="h-full w-full object-cover object-top"
          height={256}
          priority
          src="/images/my-photo.jpeg"
          width={256}
        />
      </m.div>
    </m.div>
  );
};

export default HeroImage;
