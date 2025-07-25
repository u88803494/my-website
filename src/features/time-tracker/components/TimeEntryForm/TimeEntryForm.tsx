"use client";

import React from "react";

import type { TimeRecord } from "@/types/time-tracker.types";

import { getFieldError } from "../../utils/validation";
import ActivityTypeSelect from "./ActivityTypeSelect";
import DateTimeInputs from "./DateTimeInputs";
import DurationPreview from "./DurationPreview";
import { useTimeEntryForm } from "./hooks/useTimeEntryForm";
import SubmitButton from "./SubmitButton";

interface TimeEntryFormProps {
  isLoading?: boolean;
  onSubmit: (record: Omit<TimeRecord, "createdAt" | "id">) => void;
}

/**
 * 時間輸入表單元件
 * 處理時間記錄的輸入和驗證
 */
const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ isLoading = false, onSubmit }) => {
  const {
    dateObj,
    endTimeObj,
    errors,
    formData,
    handleDateChange,
    handleEndTimeChange,
    handleInputChange,
    handleStartTimeChange,
    handleSubmit,
    isSubmitting,
    previewData,
    startTimeObj,
  } = useTimeEntryForm({ isLoading, onSubmit });

  const generalError = getFieldError(errors, "general");

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* 一般錯誤訊息 */}
      {generalError && (
        <div className="alert alert-error">
          <span>{generalError}</span>
        </div>
      )}

      <DateTimeInputs
        dateObj={dateObj}
        endTimeObj={endTimeObj}
        errors={errors}
        formData={formData}
        isDisabled={isSubmitting || isLoading}
        onDateChange={handleDateChange}
        onEndTimeChange={handleEndTimeChange}
        onStartTimeChange={handleStartTimeChange}
        startTimeObj={startTimeObj}
      />

      <DurationPreview
        duration={previewData.duration}
        endTime={formData.endTime}
        error={previewData.error}
        isValid={previewData.isValid}
        startTime={formData.startTime}
      />

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

      <SubmitButton isLoading={isSubmitting || isLoading} />
    </form>
  );
};

export default TimeEntryForm;
