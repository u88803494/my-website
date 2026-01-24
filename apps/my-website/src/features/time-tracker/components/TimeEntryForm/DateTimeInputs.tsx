"use client";

import "react-datepicker/dist/react-datepicker.css";

import { useTranslations } from "next-intl";
import React from "react";
import DatePicker from "react-datepicker";

import type { TimeEntryFormData, ValidationError } from "../../types";
import { getFieldError } from "../../utils/validation";

interface DateTimeInputsProps {
  dateObj: Date | null;
  endTimeObj: Date | null;
  errors: ValidationError[];
  formData: TimeEntryFormData;
  isDisabled: boolean;
  onDateChange: (date: Date | null) => void;
  onEndTimeChange: (date: Date | null) => void;
  onStartTimeChange: (date: Date | null) => void;
  startTimeObj: Date | null;
}

/**
 * 日期和時間輸入組件
 * 包含日期選擇器和開始/結束時間選擇器
 */
const DateTimeInputs: React.FC<DateTimeInputsProps> = ({
  dateObj,
  endTimeObj,
  errors,
  isDisabled,
  onDateChange,
  onEndTimeChange,
  onStartTimeChange,
  startTimeObj,
}) => {
  const t = useTranslations("TimeTracker");

  return (
    <>
      {/* 日期 + 時間選擇器區塊：一整排靠左對齊 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        {/* 日期選擇器 */}
        <div className="flex items-center gap-2">
          <label className="text-base-content text-sm font-medium whitespace-nowrap">
            {t("form.date")}<span className="text-error ml-1">*</span>
          </label>
          <DatePicker
            aria-label={t("form.date")}
            className={`input input-bordered input-sm w-32 ${getFieldError(errors, "date") ? "input-error" : ""}`}
            dateFormat="yyyy-MM-dd"
            disabled={isDisabled}
            onChange={onDateChange}
            selected={dateObj}
          />
        </div>

        {/* 開始時間 */}
        <div className="flex items-center gap-2">
          <label className="text-base-content text-sm font-medium whitespace-nowrap">
            {t("form.startTime")}<span className="text-error ml-1">*</span>
          </label>
          <DatePicker
            aria-label={t("form.startTime")}
            className={`input input-bordered input-sm w-24 ${getFieldError(errors, "startTime") ? "input-error" : ""}`}
            dateFormat="HH:mm"
            disabled={isDisabled}
            onChange={onStartTimeChange}
            placeholderText="00:00"
            selected={startTimeObj}
            showTimeSelect
            showTimeSelectOnly
            timeCaption={t("form.time")}
            timeFormat="HH:mm"
            timeIntervals={5}
          />
        </div>

        {/* 結束時間 */}
        <div className="flex items-center gap-2">
          <label className="text-base-content text-sm font-medium whitespace-nowrap">
            {t("form.endTime")}<span className="text-error ml-1">*</span>
          </label>
          <DatePicker
            aria-label={t("form.endTime")}
            className={`input input-bordered input-sm w-24 ${getFieldError(errors, "endTime") ? "input-error" : ""}`}
            dateFormat="HH:mm"
            disabled={isDisabled}
            onChange={onEndTimeChange}
            placeholderText="00:00"
            selected={endTimeObj}
            showTimeSelect
            showTimeSelectOnly
            timeCaption={t("form.time")}
            timeFormat="HH:mm"
            timeIntervals={5}
          />
        </div>
      </div>

      {/* 錯誤訊息顯示 */}
      {(getFieldError(errors, "date") || getFieldError(errors, "startTime") || getFieldError(errors, "endTime")) && (
        <div className="text-error space-y-1 text-xs">
          {getFieldError(errors, "date") && <div>{getFieldError(errors, "date")}</div>}
          {getFieldError(errors, "startTime") && <div>{getFieldError(errors, "startTime")}</div>}
          {getFieldError(errors, "endTime") && <div>{getFieldError(errors, "endTime")}</div>}
        </div>
      )}

      {/* 時間輸入區域下方加註 24 小時制提示 */}
      <div className="text-base-content/60 text-xs">{t("form.timeFormat24Hour")}</div>
    </>
  );
};

export default DateTimeInputs;
