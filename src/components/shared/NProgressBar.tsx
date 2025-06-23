"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
// @ts-expect-error: nprogress 沒有型別定義
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 自訂 nprogress 樣式（可根據主題調整顏色）
NProgress.configure({ showSpinner: false });

export default function NProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return null;
} 