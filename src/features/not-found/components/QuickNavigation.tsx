"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const QuickNavigation: React.FC = () => {
  const navigationItems = [
    { href: "/blog", label: "部落格" },
    { href: "/ai-dictionary", label: "AI 字典" },
    { href: "/ai-analyzer", label: "AI 需求分析器" },
    { href: "/about", label: "關於我" },
  ];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
      initial={{ opacity: 0, y: 30 }}
      transition={{ delay: 1.0, duration: 0.6 }}
    >
      <h3 className="text-base-content mb-4 text-lg font-semibold">快速導航</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {navigationItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <motion.button className="btn btn-ghost btn-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {item.label}
            </motion.button>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickNavigation;
