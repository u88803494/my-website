"use client";

import { Filter, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import { ACTIVITY_TYPE_OPTIONS, ACTIVITY_TYPE_TO_KEY } from "@/features/time-tracker/constants";
import { type ActivityType as ActivityTypeType } from "@/features/time-tracker/types";

interface SearchFiltersProps {
  filterType: "" | ActivityTypeType;
  onFilterChange: (value: "" | ActivityTypeType) => void;
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

/**
 * 搜尋和篩選控制項元件
 */
const SearchFilters: React.FC<SearchFiltersProps> = ({ filterType, onFilterChange, onSearchChange, searchTerm }) => {
  const t = useTranslations("TimeTracker");

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* 搜尋框 */}
      <div className="form-control flex-1">
        <div className="input-group flex items-center gap-2">
          <span className="bg-base-200 flex items-center justify-center">
            <Search aria-hidden="true" className="h-4 w-4" />
          </span>
          <input
            aria-label={t("records.searchRecords")}
            className="input input-bordered flex-1"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("records.searchPlaceholder")}
            type="text"
            value={searchTerm}
          />
        </div>
      </div>

      {/* 活動類型篩選 */}
      <div className="form-control">
        <div className="input-group flex items-center gap-2">
          <span className="bg-base-200 flex items-center justify-center">
            <Filter aria-hidden="true" className="h-4 w-4" />
          </span>
          <select
            aria-label={t("records.filterByType")}
            className="select select-bordered"
            onChange={(e) => onFilterChange(e.target.value as "" | ActivityTypeType)}
            value={filterType}
          >
            <option value="">{t("records.allTypes")}</option>
            {ACTIVITY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(ACTIVITY_TYPE_TO_KEY[option.value])}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
