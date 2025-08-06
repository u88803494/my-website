"use client";
import { LazyMotion } from "framer-motion";

// 只載入最基本的動畫功能，減少首屏載入
const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export const FramerProvider = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={loadFeatures} strict>
    {children}
  </LazyMotion>
);
