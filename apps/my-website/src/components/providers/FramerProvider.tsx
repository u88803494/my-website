"use client";
import { LazyMotion } from "framer-motion";

// 只載入最基本的動畫功能，減少首屏載入，並使用更細粒度的控制
const loadFeatures = () =>
  import("framer-motion").then((res) => {
    // 只返回必要的動畫功能，排除複雜的 3D 變換
    return {
      ...res.domAnimation,
      // 只保留基本的動畫功能
    };
  });

export const FramerProvider = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={loadFeatures} strict>
    {children}
  </LazyMotion>
);
