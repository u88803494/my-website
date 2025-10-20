"use client";

import ArticleStatsSkeleton from "./ArticleStatsSkeleton";
import SkeletonCard from "./SkeletonCard";

const LoadingState = () => {
  return (
    <div className="py-8">
      {/* Stats skeleton */}
      <ArticleStatsSkeleton />

      {/* Skeleton cards grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <SkeletonCard index={index} key={index} />
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
