import { type ActivityType, type TimeRecord } from "@packages/shared/types";
import React, { useState } from "react";

import type { TimeEntryFormData } from "../../../types";
import type { ValidationError } from "../../../types";
import { calculateDuration, getCurrentTaiwanDate } from "../../../utils/time";
import { validateTimeEntry } from "../../../utils/validation";
import { useFormHandlers } from "./useFormHandlers";

interface UseTimeEntryFormOptions {
  isLoading?: boolean;
  onSubmit: (record: Omit<TimeRecord, "createdAt" | "id">) => void;
}

export const useTimeEntryForm = ({ isLoading = false, onSubmit }: UseTimeEntryFormOptions) => {
  const [formData, setFormData] = useState<TimeEntryFormData>({
    activityType: "" as ActivityType,
    date: getCurrentTaiwanDate(),
    description: "",
    endTime: "",
    startTime: "",
  });

  const [startTimeObj, setStartTimeObj] = useState<Date | null>(null);
  const [endTimeObj, setEndTimeObj] = useState<Date | null>(null);
  const [dateObj, setDateObj] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleDateChange, handleEndTimeChange, handleInputChange, handleStartTimeChange } = useFormHandlers(
    formData,
    setFormData,
    setStartTimeObj,
    setEndTimeObj,
    setDateObj,
    setErrors,
  );

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSubmitting || isLoading) return;

    setIsSubmitting(true);

    try {
      const validationErrors = validateTimeEntry(formData);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

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

      const record: Omit<TimeRecord, "createdAt" | "id"> = {
        activityType: formData.activityType,
        date: formData.date,
        description: formData.description?.trim() || undefined,
        duration: durationResult.duration,
        endTime: formData.endTime,
        startTime: formData.startTime,
      };

      onSubmit(record);

      // 重置表單
      setFormData({
        activityType: "" as ActivityType,
        date: getCurrentTaiwanDate(),
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

  return {
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
  };
};
