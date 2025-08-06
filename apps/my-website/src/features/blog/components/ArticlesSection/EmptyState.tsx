"use client";

import { m } from "framer-motion";
import { FileText } from "lucide-react";

const EmptyState = () => {
  return (
    <m.div
      animate={{ opacity: 1, scale: 1 }}
      className="py-20 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card bg-base-100 border-base-200 mx-auto max-w-md border shadow-xl">
        <div className="card-body text-center">
          <m.div
            animate={{ scale: 1 }}
            className="mb-6"
            initial={{ scale: 0 }}
            transition={{ delay: 0.2, stiffness: 200, type: "spring" }}
          >
            <FileText aria-hidden="true" className="text-base-content/30 mx-auto h-16 w-16" />
          </m.div>
          <h3 className="card-title mb-2 justify-center text-xl">目前沒有文章</h3>
          <p className="text-base-content/70 leading-relaxed">
            暫時沒有找到任何文章內容
            <br />
            請稍後再試，或者檢查網路連線
          </p>
        </div>
      </div>
    </m.div>
  );
};

export default EmptyState;
