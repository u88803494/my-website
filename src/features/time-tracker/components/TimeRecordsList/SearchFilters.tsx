import { Filter, Search } from "lucide-react";
import React from "react";

import { ACTIVITY_TYPE_OPTIONS } from "@/features/time-tracker/constants";
import type { ActivityType } from "@/features/time-tracker/types";

interface SearchFiltersProps {
  filterType: "" | ActivityType;
  onFilterChange: (value: "" | ActivityType) => void;
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

/**
 * 搜尋和篩選控制項元件
 */
const SearchFilters: React.FC<SearchFiltersProps> = ({ filterType, onFilterChange, onSearchChange, searchTerm }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* 搜尋框 */}
      <div className="form-control flex-1">
        <div className="input-group flex items-center gap-2">
          <span className="bg-base-200 flex items-center justify-center">
            <Search aria-hidden="true" className="h-4 w-4" />
          </span>
          <input
            aria-label="搜尋時間記錄"
            className="input input-bordered flex-1"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋記錄..."
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
            aria-label="篩選活動類型"
            className="select select-bordered"
            onChange={(e) => onFilterChange(e.target.value as "" | ActivityType)}
            value={filterType}
          >
            <option value="">所有類型</option>
            {ACTIVITY_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
