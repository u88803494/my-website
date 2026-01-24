"use client";

import { List } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface EmptyStateProps {
  hasFilters: boolean;
}

/**
 * 空狀態元件
 */
const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
  const t = useTranslations("TimeTracker");

  return (
    <div className="py-8 text-center">
      <div className="text-base-content/40 mb-2">
        <List aria-hidden="true" className="mx-auto mb-3 h-12 w-12" />
      </div>
      <h4 className="text-base-content/60 mb-1 text-lg font-medium">
        {hasFilters ? t("records.noMatchingRecords") : t("records.noRecords")}
      </h4>
      <p className="text-base-content/40 text-sm">
        {hasFilters ? t("records.noMatchingRecordsDescription") : t("records.noRecordsDescription")}
      </p>
    </div>
  );
};

export default EmptyState;
