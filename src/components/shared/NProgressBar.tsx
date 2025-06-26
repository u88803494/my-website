"use client";

import "nprogress/nprogress.css";

import { usePathname } from "next/navigation";
// @ts-expect-error: nprogress 沒有型別定義
import NProgress from "nprogress";
import { useEffect } from "react";

// 自訂 nprogress 樣式（可根據主題調整顏色）
NProgress.configure({ showSpinner: false });

const NProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return null;
};

export default NProgressBar;
