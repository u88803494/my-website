"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

const SearchSuggestion: React.FC = () => {
  const t = useTranslations("NotFound");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="card bg-base-200/50"
      initial={{ opacity: 0, y: 30 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <div className="card-body p-4">
        <div className="mb-2 flex items-center gap-2">
          <Search className="text-primary h-4 w-4" />
          <span className="text-base-content text-sm font-medium">{t("cantFindContent")}</span>
        </div>
        <p className="text-base-content/70 text-sm">{t("searchSuggestionDescription")}</p>
      </div>
    </motion.div>
  );
};

export default SearchSuggestion;
