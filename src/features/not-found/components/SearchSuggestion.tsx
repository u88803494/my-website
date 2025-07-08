"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

const SearchSuggestion: React.FC = () => {
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
          <span className="text-base-content text-sm font-medium">找不到想要的內容？</span>
        </div>
        <p className="text-base-content/70 text-sm">
          您可以在首頁查看我的作品集、技術文章，或使用 AI 工具來協助您找到需要的資訊。
        </p>
      </div>
    </motion.div>
  );
};

export default SearchSuggestion;
