"use client";

import { ReactNode, Suspense } from "react";
import { useInView } from "react-intersection-observer";

interface LazySectionProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  threshold?: number;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = "",
  fallback = <div className="bg-base-200/50 min-h-96 animate-pulse" />,
  threshold = 0.1,
}) => {
  const { inView, ref } = useInView({
    rootMargin: "200px 0px",
    threshold,
    triggerOnce: true,
  });

  return (
    <div className={className} ref={ref}>
      {inView ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

export default LazySection;
