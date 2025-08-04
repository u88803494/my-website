"use client";

import { useState } from "react";

import { ANALYZE_NEED_PROMPT } from "@/lib/prompts/ai-analyzer.prompt";

export const useAIAnalysis = () => {
  const [state, setState] = useState<{
    analysisResult: string;
    error: null | string;
    isLoading: boolean;
  }>({
    analysisResult: "",
    error: null,
    isLoading: false,
  });

  const [needInput, setNeedInput] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");

  const analyzeNeed = async () => {
    if (!needInput.trim()) {
      setState((prev) => ({ ...prev, error: "請輸入您的想法或需求" }));
      return;
    }

    if (needInput.trim().length < 10) {
      setState((prev) => ({ ...prev, error: "描述至少需要 10 個字" }));
      return;
    }

    setState((prev) => ({ ...prev, error: null, isLoading: true }));

    try {
      const response = await fetch("/api/ai-analyzer", {
        body: JSON.stringify({
          need: needInput,
          prompt: ANALYZE_NEED_PROMPT,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("分析失敗，請稍後再試");
      }

      const data = await response.json();
      const analysisResult = data.analysisResult || "";

      setAnalysisResult(analysisResult);
      setNeedInput(""); // 清除輸入內容
      setState((prev) => ({
        ...prev,
        analysisResult,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "分析過程中發生錯誤",
        isLoading: false,
      }));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(analysisResult);
      return true;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Copy failed:", err);
      }
      return false;
    }
  };

  return {
    analysisResult,
    analyzeNeed,
    copyToClipboard,
    error: state.error,
    isLoading: state.isLoading,
    needInput,
    setAnalysisResult,
    setNeedInput,
  };
};
