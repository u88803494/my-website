import { useState } from "react";

import type { APIErrorResponse, WordAnalysisResponse } from "@/types/dictionary.types";

import type { APICallResult } from "../types";

export const useWordLearning = () => {
  const [testResults, setTestResults] = useState<APICallResult[]>([]);

  const addResult = (word: string, response: APIErrorResponse | WordAnalysisResponse, cardId?: string) => {
    if (cardId) {
      // 更新現有結果
      setTestResults((prev) =>
        prev.map((result) =>
          result.id === cardId
            ? {
                ...result,
                response,
                timestamp: new Date().toLocaleString("zh-TW"),
              }
            : result,
        ),
      );
    } else {
      // 新增結果
      const result: APICallResult = {
        id: `${Date.now()}-${Math.random()}`,
        response,
        timestamp: new Date().toLocaleString("zh-TW"),
        word,
      };
      setTestResults((prev) => [result, ...prev]);
    }
  };

  const updateResult = (cardId: string, response: APIErrorResponse | WordAnalysisResponse) => {
    setTestResults((prev) =>
      prev.map((result) =>
        result.id === cardId
          ? {
              ...result,
              response,
              timestamp: new Date().toLocaleString("zh-TW"),
            }
          : result,
      ),
    );
  };

  const handleCompleteCard = (cardId: string) => {
    // 設置完成動畫狀態
    setTestResults((prev) => prev.map((result) => (result.id === cardId ? { ...result, isCompleting: true } : result)));

    // 0.8 秒後開始移除動畫
    setTimeout(() => {
      setTestResults((prev) =>
        prev.map((result) => (result.id === cardId ? { ...result, isCompleting: false, isRemoving: true } : result)),
      );

      // 1.2 秒後顯示就地撤銷條
      setTimeout(() => {
        // 設置自動移除的 timeout
        const autoRemoveTimeoutId = setTimeout(() => {
          setTestResults((prev) => prev.filter((result) => result.id !== cardId));
        }, 4000);

        setTestResults((prev) =>
          prev.map((result) =>
            result.id === cardId
              ? { ...result, autoRemoveTimeoutId, isRemoving: false, showUndoInPlace: true }
              : result,
          ),
        );
      }, 1200);
    }, 800);
  };

  const handleUndo = (cardId: string) => {
    // 清除自動移除的 timeout
    const card = testResults.find((result) => result.id === cardId);
    if (card?.autoRemoveTimeoutId) {
      clearTimeout(card.autoRemoveTimeoutId);
    }

    setTestResults((prev) =>
      prev.map((result) =>
        result.id === cardId
          ? {
              ...result,
              autoRemoveTimeoutId: undefined,
              isCompleting: false,
              isRemoving: false,
              showUndoInPlace: false,
            }
          : result,
      ),
    );
  };

  const handleClearResults = () => {
    setTestResults([]);
  };

  return {
    addResult,
    handleClearResults,
    handleCompleteCard,
    handleUndo,
    testResults,
    updateResult,
  };
};
