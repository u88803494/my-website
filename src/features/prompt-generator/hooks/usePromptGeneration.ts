"use client";

import { useState } from "react";

import { ANALYZE_NEED_PROMPT } from "@/lib/prompts/prompt-generator.prompt";

export const usePromptGeneration = () => {
  const [state, setState] = useState({
    error: null as null | string,
    generatedTemplate: "",
    isLoading: false,
  });

  const [needInput, setNeedInput] = useState("");
  const [template, setTemplate] = useState("");

  const generateTemplate = async () => {
    if (!needInput.trim()) {
      setState((prev) => ({ ...prev, error: "請輸入您的需求" }));
      return;
    }

    if (needInput.trim().length < 10) {
      setState((prev) => ({ ...prev, error: "需求描述至少需要 10 個字" }));
      return;
    }

    setState((prev) => ({ ...prev, error: null, isLoading: true }));

    try {
      const response = await fetch("/api/prompt-generator", {
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
        throw new Error("生成失敗，請稍後再試");
      }

      const data = await response.json();
      const generatedTemplate = data.template || "";

      setTemplate(generatedTemplate);
      setNeedInput(""); // 清除輸入內容
      setState((prev) => ({
        ...prev,
        generatedTemplate,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "發生未知錯誤",
        isLoading: false,
      }));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(template);
      return true;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Copy failed:", err);
      }
      return false;
    }
  };

  return {
    needInput,
    setNeedInput,
    setTemplate,
    template,
    ...state,
    copyToClipboard,
    generateTemplate,
  };
};
