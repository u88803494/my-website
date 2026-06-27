"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

const navigationItems = [
  { href: "/blog", labelKey: "blog" },
  { href: "/ai-dictionary", labelKey: "aiDictionary" },
  { href: "/ai-analyzer", labelKey: "aiAnalyzer" },
  { href: "/time-tracker", labelKey: "timeTracker" },
  { href: "/about", labelKey: "about" },
] as const;

const QuickNavigation: React.FC = () => {
  const t = useTranslations("NotFound");
  const tNav = useTranslations("Navigation");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 mb-8"
      initial={{ opacity: 0, y: 30 }}
      transition={{ delay: 1.0, duration: 0.6 }}
    >
      <h3 className="text-base-content mb-4 text-lg font-semibold">{t("quickNavigation")}</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {navigationItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <motion.button className="btn btn-ghost btn-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {tNav(item.labelKey)}
            </motion.button>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickNavigation;
