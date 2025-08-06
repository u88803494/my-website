"use client";

import type { HTMLMotionProps } from "framer-motion";
import dynamic from "next/dynamic";
import React from "react";
import { useInView } from "react-intersection-observer";

// 動態載入 m 組件（LazyMotion 兼容），只在需要動畫時載入
const MotionP = dynamic(
  () =>
    import("framer-motion").then((mod) => {
      // 創建一個包裝組件來傳遞所有 props
      const DynamicMotionP = ({ children, ...props }: HTMLMotionProps<"p">) => {
        const Component = mod.m.p;
        return <Component {...props}>{children}</Component>;
      };
      DynamicMotionP.displayName = "DynamicMotionP";
      return DynamicMotionP;
    }),
  {
    loading: () => <p className="opacity-50 transition-opacity duration-200" />,
    ssr: false,
  },
);

interface ViewportMotionProps extends Omit<HTMLMotionProps<"p">, "ref"> {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

const ViewportMotion: React.FC<ViewportMotionProps> = ({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  ...props
}) => {
  const { inView, ref } = useInView({
    threshold,
    triggerOnce,
  });

  // 如果不在視窗內，只渲染普通的 p 標籤
  if (!inView) {
    return (
      <p className={className} ref={ref}>
        {children}
      </p>
    );
  }

  // 進入視窗後才載入並渲柔 m.p，使用更輕量的動畫
  return (
    <MotionP
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      ref={ref}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      {...props}
    >
      {children}
    </MotionP>
  );
};

export default ViewportMotion;
