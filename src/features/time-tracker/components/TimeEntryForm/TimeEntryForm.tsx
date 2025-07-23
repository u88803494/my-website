"use client";

import "react-datepicker/dist/react-datepicker.css";

import { Clock, Plus } from "lucide-react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

import type { ActivityType, TimeEntryFormData, TimeRecord } from "@/types/time-tracker.types";

import type { ValidationError } from "../../types";
import { getCurrentDate } from "../../utils/dateHelpers";
import { formatMinutesToHours } from "../../utils/formatting";
import { calculateDuration } from "../../utils/timeCalculation";
import { getFieldError, validateTimeEntry } from "../../utils/validation";
import ActivityTypeSelect from "./ActivityTypeSelect";

interface TimeEntryFormProps {
  isLoading?: boolean;
  onSubmit: (record: Omit<TimeRecord, "createdAt" | "id">) => void;
}

/**
 * 時間輸入表單元件
 * 處理時間記錄的輸入和驗證
 */
const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ isLoading = false, onSubmit }) => {
  const [formData, setFormData] = useState<TimeEntryFormData>({
    activityType: "" as ActivityType,
    date: getCurrentDate(),
    description: "",
    endTime: "",
    startTime: "",
  });
  // 新增本地 state 以支援 Date 物件
  const [startTimeObj, setStartTimeObj] = useState<Date | null>(null);
  const [endTimeObj, setEndTimeObj] = useState<Date | null>(null);
  const [dateObj, setDateObj] = useState<Date | null>(new Date());

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 計算預覽持續時間和錯誤狀態
  const previewData = React.useMemo(() => {
    if (formData.startTime && formData.endTime) {
      const result = calculateDuration(formData.startTime, formData.endTime);
      return {
        duration: result.isValid ? result.duration : 0,
        error: result.error,
        isValid: result.isValid,
      };
    }
    return {
      duration: 0,
      error: undefined,
      isValid: true,
    };
  }, [formData.startTime, formData.endTime]);

  const handleInputChange = (field: keyof TimeEntryFormData, value: ActivityType | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 清除該欄位的錯誤
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  // 即時驗證函數
  const validateTimeFields = (startTime: string, endTime: string) => {
    const newErrors: ValidationError[] = [];

    // 如果兩個時間都存在，檢查時間邏輯
    if (startTime && endTime) {
      const durationResult = calculateDuration(startTime, endTime);
      if (!durationResult.isValid && durationResult.error) {
        newErrors.push({
          field: "endTime",
          message: durationResult.error,
        });
      }
    }

    // 只更新時間相關的錯誤，保留其他欄位的錯誤
    setErrors((prev) => {
      const filteredErrors = prev.filter((error) => error.field !== "startTime" && error.field !== "endTime");
      return [...filteredErrors, ...newErrors];
    });
  };

  // 當時間選擇器變動時，更新 formData 與本地 state
  const handleStartTimeChange = (date: Date | null) => {
    const timeString = date
      ? `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
      : "";

    setStartTimeObj(date);
    setFormData((prev) => ({
      ...prev,
      startTime: timeString,
    }));

    // 如果結束時間已存在，立即驗證
    if (formData.endTime) {
      validateTimeFields(timeString, formData.endTime);
    } else {
      // 清除開始時間相關錯誤
      setErrors((prev) => prev.filter((error) => error.field !== "startTime"));
    }
  };

  const handleEndTimeChange = (date: Date | null) => {
    const timeString = date
      ? `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
      : "";

    setEndTimeObj(date);
    setFormData((prev) => ({
      ...prev,
      endTime: timeString,
    }));

    // 如果開始時間已存在，立即驗證
    if (formData.startTime) {
      validateTimeFields(formData.startTime, timeString);
    } else {
      // 清除結束時間相關錯誤
      setErrors((prev) => prev.filter((error) => error.field !== "endTime"));
    }
  };

  const handleDateChange = (date: Date | null) => {
    const dateString = date
      ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      : getCurrentDate();

    setDateObj(date);
    setFormData((prev) => ({
      ...prev,
      date: dateString,
    }));

    // 清除日期相關錯誤
    setErrors((prev) => prev.filter((error) => error.field !== "date"));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting || isLoading) return;

    setIsSubmitting(true);

    try {
      // 驗證表單
      const validationErrors = validateTimeEntry(formData);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // 計算持續時間
      const durationResult = calculateDuration(formData.startTime, formData.endTime);

      if (!durationResult.isValid) {
        setErrors([
          {
            field: "endTime",
            message: durationResult.error || "時間計算錯誤",
          },
        ]);
        return;
      }

      // 建立記錄物件
      const record: Omit<TimeRecord, "createdAt" | "id"> = {
        activityType: formData.activityType,
        date: formData.date, // 使用表單日期
        description: formData.description?.trim() || undefined,
        duration: durationResult.duration,
        endTime: formData.endTime,
        startTime: formData.startTime,
      };

      // 提交記錄
      onSubmit(record);

      // 重置表單
      setFormData({
        activityType: "" as ActivityType,
        date: getCurrentDate(), // 重設為今天
        description: "",
        endTime: "",
        startTime: "",
      });
      setStartTimeObj(null);
      setEndTimeObj(null);
      setDateObj(new Date());
      setErrors([]);
    } catch (error) {
      console.error("提交表單時發生錯誤:", error);
      setErrors([
        {
          field: "general",
          message: "提交失敗，請稍後再試",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generalError = getFieldError(errors, "general");

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* 一般錯誤訊息 */}
      {generalError && (
        <div className="alert alert-error">
          <span>{generalError}</span>
        </div>
      )}

      {/* 日期 + 時間選擇器區塊：一整排靠左對齊 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        {/* 日期選擇器 */}
        <div className="flex items-center gap-2">
          <label className="text-base-content text-sm font-medium whitespace-nowrap">
            日期<span className="text-error ml-1">*</span>
          </label>
          <DatePicker
            aria-label="日期"
            className={`input input-bordered input-sm w-32 ${getFieldError(errors, "date") ? "input-error" : ""}`}
            dateFormat="yyyy-MM-dd"
            disabled={isSubmitting || isLoading}
            onChange={handleDateChange}
            selected={dateObj}
          />
        </div>

        {/* 開始時間 */}
        <div className="flex items-center gap-2">
          <label className="text-base-content text-sm font-medium whitespace-nowrap">
            開始時間<span className="text-error ml-1">*</span>
          </label>
          <DatePicker
            aria-label="開始時間"
            className={`input input-bordered input-sm w-24 ${getFieldError(errors, "startTime") ? "input-error" : ""}`}
            dateFormat="HH:mm"
            disabled={isSubmitting || isLoading}
            onChange={handleStartTimeChange}
            placeholderText="00:00"
            selected={startTimeObj}
            showTimeSelect
            showTimeSelectOnly
            timeCaption="時間"
            timeFormat="HH:mm"
            timeIntervals={5}
          />
        </div>

        {/* 結束時間 */}
        <div className="flex items-center gap-2">
          <label className="text-base-content text-sm font-medium whitespace-nowrap">
            結束時間<span className="text-error ml-1">*</span>
          </label>
          <DatePicker
            aria-label="結束時間"
            className={`input input-bordered input-sm w-24 ${getFieldError(errors, "endTime") ? "input-error" : ""}`}
            dateFormat="HH:mm"
            disabled={isSubmitting || isLoading}
            onChange={handleEndTimeChange}
            placeholderText="00:00"
            selected={endTimeObj}
            showTimeSelect
            showTimeSelectOnly
            timeCaption="時間"
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
      <div className="text-base-content/60 text-xs">※ 所有時間皆以 24 小時制（00:00~23:59）輸入與顯示</div>

      {/* 持續時間預覽或錯誤提示 */}
      {formData.startTime &&
        formData.endTime &&
        (previewData.isValid && previewData.duration > 0 ? (
          <div className="alert alert-info">
            <Clock aria-hidden="true" className="h-4 w-4" />
            <span>
              預計持續時間：{formatMinutesToHours(previewData.duration)}
              <span className="ml-2 text-sm opacity-75">({(previewData.duration / 60).toFixed(2)} hr)</span>
            </span>
          </div>
        ) : (
          !previewData.isValid &&
          previewData.error && (
            <div className="alert alert-error">
              <span>{previewData.error}</span>
            </div>
          )
        ))}

      {/* 活動類型選擇 */}
      <ActivityTypeSelect
        disabled={isSubmitting || isLoading}
        error={getFieldError(errors, "activityType")}
        onChange={(value) => handleInputChange("activityType", value)}
        value={formData.activityType}
      />

      {/* 描述輸入 */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">描述</span>
          <span className="label-text-alt">選填</span>
        </label>
        <textarea
          aria-describedby={getFieldError(errors, "description") ? "description-error" : undefined}
          aria-label="活動描述"
          className={`textarea textarea-bordered w-full ${
            getFieldError(errors, "description") ? "textarea-error" : ""
          }`}
          disabled={isSubmitting || isLoading}
          maxLength={200}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="輸入活動描述..."
          rows={3}
          value={formData.description}
        />
        <label className="label">
          <span className="label-text-alt">{formData.description?.length || 0}/200</span>
          {getFieldError(errors, "description") && (
            <span className="label-text-alt text-error" id="description-error" role="alert">
              {getFieldError(errors, "description")}
            </span>
          )}
        </label>
      </div>

      {/* 提交按鈕 */}
      <div className="form-control">
        <button
          className={`btn btn-primary ${isSubmitting || isLoading ? "loading" : ""}`}
          disabled={isSubmitting || isLoading}
          type="submit"
        >
          {!isSubmitting && !isLoading && <Plus aria-hidden="true" className="mr-2 h-4 w-4" />}
          {isSubmitting || isLoading ? "新增中..." : "新增記錄"}
        </button>
      </div>
    </form>
  );
};

export default TimeEntryForm;
