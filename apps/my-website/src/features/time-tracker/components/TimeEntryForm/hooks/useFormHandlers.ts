import type { ActivityType, TimeEntryFormData } from "@/features/time-tracker/types";

import type { ValidationError } from "../../../types";
import { calculateDuration, getCurrentTaiwanDate } from "../../../utils/time";

export const useFormHandlers = (
  formData: TimeEntryFormData,
  setFormData: React.Dispatch<React.SetStateAction<TimeEntryFormData>>,
  setStartTimeObj: React.Dispatch<React.SetStateAction<Date | null>>,
  setEndTimeObj: React.Dispatch<React.SetStateAction<Date | null>>,
  setDateObj: React.Dispatch<React.SetStateAction<Date | null>>,
  setErrors: React.Dispatch<React.SetStateAction<ValidationError[]>>,
) => {
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
      : getCurrentTaiwanDate();

    setDateObj(date);
    setFormData((prev) => ({
      ...prev,
      date: dateString,
    }));

    // 清除日期相關錯誤
    setErrors((prev) => prev.filter((error) => error.field !== "date"));
  };

  return {
    handleDateChange,
    handleEndTimeChange,
    handleInputChange,
    handleStartTimeChange,
    validateTimeFields,
  };
};
