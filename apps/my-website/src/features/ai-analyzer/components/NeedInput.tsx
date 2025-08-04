"use client";

import { Loader2, Send } from "lucide-react";
import { useState } from "react";

import { cn } from "@/utils/cn";

import type { NeedInputProps } from "../types";

const NeedInput: React.FC<NeedInputProps> = ({ isLoading, onChange, onSubmit, placeholder, value }) => {
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 100;
  const minLength = 10;
  const currentLength = value.length;
  const isValidLength = currentLength >= minLength;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative">
        <textarea
          // iOS Safari 若 font-size < 16px 會自動放大，text-base = 16px
          className={cn(
            "textarea textarea-bordered h-24 w-full resize-none text-base", // ← 這裡加上 text-base
            "focus:ring-primary focus:ring-2 focus:outline-none",
            "transition-all duration-200",
            isFocused && "ring-primary ring-2",
            currentLength >= maxLength && "textarea-error",
          )}
          disabled={isLoading}
          maxLength={maxLength}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          value={value}
        />

        <button
          className={cn("btn btn-primary btn-sm absolute right-2 bottom-2", "h-8 min-h-0 w-8 p-0")}
          disabled={isLoading || !value.trim() || !isValidLength}
          onClick={onSubmit}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-base-content/60">按 Enter 快速分析，或點擊發送按鈕</span>
        <span className={cn("text-xs", currentLength >= maxLength ? "text-error" : "text-base-content/60")}>
          {currentLength}/{maxLength}
        </span>
      </div>

      {currentLength > 0 && currentLength < minLength && (
        <div className="text-error mt-1 text-xs">
          請至少輸入 {minLength} 個字（目前 {currentLength} 個字）
        </div>
      )}
    </div>
  );
};

export default NeedInput;
