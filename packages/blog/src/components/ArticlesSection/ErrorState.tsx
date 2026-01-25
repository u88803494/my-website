"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  const t = useTranslations("Blog");

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      aria-live="assertive"
      className="alert alert-error mx-auto mb-8 max-w-md shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      role="alert"
      transition={{ duration: 0.3 }}
    >
      <AlertCircle aria-hidden="true" className="h-6 w-6 flex-shrink-0" />
      <div className="flex-1">
        <div className="font-semibold">{t("errorState.title")}</div>
        <div className="mt-1 text-sm opacity-90">{error.message}</div>
      </div>
      {onRetry && (
        <motion.button
          aria-label={t("errorState.retryAria")}
          className="btn btn-sm btn-error btn-outline ml-4 gap-2"
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          {t("errorState.retryButton")}
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorState;
