"use client";

import { MAX_WORD_LENGTH } from "@packages/shared/constants";
import { cn } from "@packages/shared/utils";
import { Search } from "lucide-react";
import { useState } from "react";

interface WordSearchFormProps {
  isLoading: boolean;
  onSubmit: (word: string) => void;
}

const loadingDotClass = cn("block", "h-2 w-2", "animate-bounce", "rounded-full");

const WordSearchForm: React.FC<WordSearchFormProps> = ({ isLoading, onSubmit }) => {
  const [inputWord, setInputWord] = useState("");

  const isInputTooLong = inputWord.length > MAX_WORD_LENGTH;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWord.trim() && !isInputTooLong) {
      onSubmit(inputWord.trim());
      setInputWord("");
    }
  };

  return (
    <div className={cn("mb-8", "rounded-lg border border-slate-200", "bg-white shadow-sm")}>
      <div className={cn("px-4 py-4", "sm:px-6 sm:py-6")}>
        <form onSubmit={handleSubmit}>
          <div className={cn("flex flex-col gap-3", "sm:flex-row sm:gap-4")}>
            <input
              aria-label="查詢詞彙"
              className={cn(
                "flex-1",
                "rounded-lg border px-3 py-2 text-lg",
                "transition-all outline-none",
                "focus:border-transparent focus:ring-2 focus:ring-blue-500",
                isInputTooLong ? "border-red-500 focus:ring-red-500" : "border-slate-300",
              )}
              disabled={isLoading}
              maxLength={40}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="輸入中文詞彙進行查詢..."
              type="text"
              value={inputWord}
            />
            <button
              aria-label="搜尋"
              className={cn(
                "hidden sm:flex",
                "items-center justify-center",
                "rounded-lg bg-blue-600 px-3 py-2",
                "transition-colors",
                "hover:bg-blue-700",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "sm:w-14",
              )}
              disabled={isLoading || !inputWord.trim() || isInputTooLong}
              type="submit"
            >
              {isLoading ? (
                <div aria-hidden="true" className={cn("flex items-center space-x-1")}>
                  <span className={cn(loadingDotClass, "bg-blue-500", "[animation-delay:-0.3s]")} />
                  <span className={cn(loadingDotClass, "bg-blue-400", "[animation-delay:-0.15s]")} />
                  <span className={cn(loadingDotClass, "bg-blue-300")} />
                </div>
              ) : (
                <Search aria-hidden="true" className={cn("h-5 w-5", "text-white")} />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WordSearchForm;
