"use client";

import { m } from "framer-motion";

interface SkeletonCardProps {
  index?: number;
}

const SkeletonCard = ({ index = 0 }: SkeletonCardProps) => {
  return (
    <m.div
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-100 border-base-200/50 h-full w-full border shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <div className="card-body flex h-full flex-col p-6">
        {/* Header skeleton */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="skeleton h-5 w-5 rounded-full" />
            <div className="skeleton h-4 w-24" />
          </div>
          <div className="skeleton h-3 w-16" />
        </div>

        {/* Title skeleton */}
        <div className="mb-3 space-y-2">
          <div className="skeleton h-5 w-full" />
          <div className="skeleton h-5 w-4/5" />
          <div className="skeleton h-5 w-3/5" />
        </div>

        {/* Description skeleton */}
        <div className="mb-4 flex-grow space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-4/5" />
          <div className="skeleton h-4 w-3/5" />
        </div>

        {/* Collection tag skeleton */}
        <div className="mb-4">
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>

        {/* Author and read time skeleton */}
        <div className="mb-4 flex items-center justify-between">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-3 w-16" />
        </div>

        {/* Button skeleton */}
        <div className="mt-auto">
          <div className="skeleton h-8 w-full" />
        </div>
      </div>
    </m.div>
  );
};

export default SkeletonCard;
