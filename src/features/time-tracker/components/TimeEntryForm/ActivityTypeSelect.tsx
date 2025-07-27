import React from "react";

import type { ActivityType } from "@/features/time-tracker/types";
import { ACTIVITY_TYPE_OPTIONS } from "@/features/time-tracker/types";

interface ActivityTypeSelectProps {
  disabled?: boolean;
  error?: string;
  onChange: (value: ActivityType) => void;
  value: "" | ActivityType;
}

/**
 * 活動類型選擇元件
 * 使用 daisyUI 的 select 樣式
 */
const ActivityTypeSelect: React.FC<ActivityTypeSelectProps> = ({ disabled = false, error, onChange, value }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as ActivityType;
    onChange(selectedValue);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">活動類型</span>
        <span className="label-text-alt text-error">*</span>
      </label>

      <select
        aria-describedby={error ? "activity-type-error" : undefined}
        aria-label="選擇活動類型"
        className={`select select-bordered w-full ${error ? "select-error" : ""} ${disabled ? "select-disabled" : ""}`}
        disabled={disabled}
        onChange={handleChange}
        value={value}
      >
        <option disabled value="">
          請選擇活動類型
        </option>
        {ACTIVITY_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error" id="activity-type-error" role="alert">
            {error}
          </span>
        </label>
      )}
    </div>
  );
};

export default ActivityTypeSelect;
