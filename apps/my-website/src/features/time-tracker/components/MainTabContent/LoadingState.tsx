"use client";

import { useTranslations } from "next-intl";
import React from "react";

export interface LoadingStateProps {
  className?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ className = "", message }) => {
  const t = useTranslations("Common");
  const displayMessage = message ?? t("loading");

  return (
    <div className={`loading-state ${className}`}>
      <div className="loading-spinner">
        <div className="spinner" />
        <p className="loading-message">{displayMessage}</p>
      </div>
    </div>
  );
};

export default LoadingState;
