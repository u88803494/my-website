"use client";

import { m } from "framer-motion";
import Link from "next/link";

import { routes } from "@/constants/routes";

const QuickNavigation: React.FC = () => {
  // 過濾掉首頁，因為 404 頁面通常不需要首頁連結
  const navigationItems = routes.filter((route) => route.href !== "/");

  return (
    <m.div
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 mb-8"
      initial={{ opacity: 0, y: 30 }}
      transition={{ delay: 1.0, duration: 0.6 }}
    >
      <h3 className="text-base-content mb-4 text-lg font-semibold">快速導航</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {navigationItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <m.button className="btn btn-ghost btn-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {item.label}
            </m.button>
          </Link>
        ))}
      </div>
    </m.div>
  );
};

export default QuickNavigation;
