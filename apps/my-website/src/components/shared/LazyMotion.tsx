"use client";

import dynamic from "next/dynamic";
import React from "react";

// 動態載入 m 組件，避免首屏阻塞
const LazyM = {
  Button: dynamic(() => import("framer-motion").then((mod) => mod.m.button), {
    loading: () => <button className="opacity-0" />,
    ssr: false,
  }),
  Div: dynamic(() => import("framer-motion").then((mod) => mod.m.div), {
    loading: () => <div className="opacity-0" />,
    ssr: false,
  }),
  H1: dynamic(() => import("framer-motion").then((mod) => mod.m.h1), {
    loading: () => <h1 className="opacity-0" />,
    ssr: false,
  }),
  H2: dynamic(() => import("framer-motion").then((mod) => mod.m.h2), {
    loading: () => <h2 className="opacity-0" />,
    ssr: false,
  }),
  Span: dynamic(() => import("framer-motion").then((mod) => mod.m.span), {
    loading: () => <span className="opacity-0" />,
    ssr: false,
  }),
};

export default LazyM;
