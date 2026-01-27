"use client";

import { useTranslations } from "next-intl";
import React from "react";

export interface ErrorStateProps {
  className?: string;
  error: string;
  onRetry?: () => void;
  showRetryButton?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ className = "", error, onRetry, showRetryButton = true }) => {
  const t = useTranslations("Common");

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`error-state ${className}`}>
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">{t("error")}</h3>
        <p className="error-message">{error}</p>
        {showRetryButton && (
          <button className="retry-button" onClick={handleRetry} type="button">
            {t("retry")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
