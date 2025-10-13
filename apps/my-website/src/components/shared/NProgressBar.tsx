"use client";

import "nprogress/nprogress.css";

import { usePathname } from "next/navigation";
// @ts-expect-error: nprogress 沒有型別定義
import NProgress from "nprogress";
import { useEffect } from "react";

// TODO: Consider upgrading to BProgress (@bprogress/core) in the future
// BProgress is a modern upgrade of NProgress with better design and enhanced features
// Reference: https://bprogress.vercel.app/
// Benefits: Modern design, better TypeScript support, smoother animations

// 自訂 nprogress 樣式和配置
NProgress.configure({
  minimum: 0.3,
  showSpinner: false,
  speed: 500,
  trickleSpeed: 200,
});

// 添加自定義樣式讓進度條更粗
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    #nprogress .bar {
      height: 4px !important;
      background: linear-gradient(90deg, #3b82f6, #06b6d4) !important;
      box-shadow: 0 0 10px #3b82f6 !important;
    }
    
    #nprogress .peg {
      box-shadow: 0 0 10px #3b82f6, 0 0 5px #3b82f6 !important;
      height: 4px !important;
    }
  `;
  document.head.appendChild(style);
}

const NProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return null;
};

export default NProgressBar;
