"use client";

import { cn } from "@packages/shared/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

import type { AnalysisResultProps } from "../types";

const AnalysisResult: React.FC<AnalysisResultProps> = ({ isCopying, onChange, onCopy, value }) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  if (!value) return null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base-content text-lg font-semibold">AI 分析結果</h3>
        <button
          className={cn("btn btn-outline btn-sm gap-2", showCopySuccess && "btn-success")}
          disabled={isCopying}
          onClick={handleCopy}
        >
          {showCopySuccess ? (
            <>
              <Check className="h-4 w-4" />
              已複製
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              複製
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <textarea
          className={cn(
            "textarea textarea-bordered h-64 w-full resize-none",
            "font-mono text-sm leading-relaxed",
            "focus:ring-primary focus:ring-2 focus:outline-none",
          )}
          onChange={(e) => onChange(e.target.value)}
          placeholder="AI 將在這裡顯示分析結果..."
          value={value}
        />

        <div className="text-base-content/40 absolute top-2 right-2 text-xs">{value.length} 字元</div>
      </div>

      <div className="text-base-content/60 text-center text-sm">
        您可以自由編輯上面的分析結果，然後複製到 ChatGPT、Claude 等 AI 工具中使用
      </div>
    </div>
  );
};

export default AnalysisResult;
