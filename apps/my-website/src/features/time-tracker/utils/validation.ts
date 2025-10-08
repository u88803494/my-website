import { type TimeEntryFormData, type ValidationError, type ValidationResult } from "@packages/shared/types";

import { ActivityType } from "@/features/time-tracker/types";

import { calculateDuration, validateTimeFormat } from "./time";

/**
 * 驗證時間記錄表單資料
 */
export const validateTimeEntry = (data: TimeEntryFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // 驗證日期
  if (!data.date) {
    errors.push({
      field: "date",
      message: "請選擇日期",
    });
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push({
      field: "date",
      message: "日期格式不正確 (YYYY-MM-DD)",
    });
  }

  // 驗證開始時間
  if (!data.startTime) {
    errors.push({
      field: "startTime",
      message: "請輸入開始時間",
    });
  } else if (!validateTimeFormat(data.startTime)) {
    errors.push({
      field: "startTime",
      message: "開始時間格式不正確 (HH:MM)",
    });
  }

  // 驗證結束時間
  if (!data.endTime) {
    errors.push({
      field: "endTime",
      message: "請輸入結束時間",
    });
  } else if (!validateTimeFormat(data.endTime)) {
    errors.push({
      field: "endTime",
      message: "結束時間格式不正確 (HH:MM)",
    });
  }

  // 驗證活動類型
  if (!data.activityType) {
    errors.push({
      field: "activityType",
      message: "請選擇活動類型",
    });
  } else if (!Object.values(ActivityType).includes(data.activityType)) {
    errors.push({
      field: "activityType",
      message: "無效的活動類型",
    });
  }

  // 驗證描述長度
  if (data.description && data.description.length > 200) {
    errors.push({
      field: "description",
      message: "描述不能超過 200 個字元",
    });
  }

  // 如果基本格式都正確，再驗證時間邏輯
  if (data.startTime && data.endTime && validateTimeFormat(data.startTime) && validateTimeFormat(data.endTime)) {
    const calculation = calculateDuration(data.startTime, data.endTime);
    if (!calculation.isValid && calculation.error) {
      errors.push({
        field: "endTime",
        message: calculation.error,
      });
    }
  }

  return errors;
};

/**
 * 從錯誤陣列中獲取指定欄位的錯誤訊息
 */
export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  const error = errors.find((err) => err.field === field);
  return error?.message;
};

/**
 * 檢查表單是否有錯誤
 */
export const hasErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};

/**
 * 檢查指定欄位是否有錯誤
 */
export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some((err) => err.field === field);
};

/**
 * 清除指定欄位的錯誤
 */
export const clearFieldError = (errors: ValidationError[], field: string): ValidationError[] => {
  return errors.filter((err) => err.field !== field);
};

/**
 * 新增錯誤到錯誤陣列
 */
export const addError = (errors: ValidationError[], field: string, message: string): ValidationError[] => {
  // 先清除該欄位的現有錯誤，再新增新錯誤
  const clearedErrors = clearFieldError(errors, field);
  return [...clearedErrors, { field, message }];
};

/**
 * 驗證時間記錄表單並返回結果
 */
export const validateTimeEntryForm = (data: TimeEntryFormData): ValidationResult => {
  const errors = validateTimeEntry(data);
  return {
    errors,
    isValid: errors.length === 0,
  };
};
