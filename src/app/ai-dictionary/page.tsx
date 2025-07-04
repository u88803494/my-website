"use client";

// TODO: 重構計劃
// - 將卡片組件拆分為獨立的 WordCard 元件
// - 提取學習完成邏輯到自定義 hook (useWordLearning)
// - 建立 WordSearchForm 元件
// - 優化 TypeScript 類型定義
// - 添加更多動畫效果和微互動

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { API_PATHS } from "@/lib/api-paths";
import type { APIErrorResponse, WordAnalysisResponse } from "@/types/dictionary.types";

const MAX_WORD_LENGTH = 20;

interface APICallResult {
  autoRemoveTimeoutId?: NodeJS.Timeout;
  id: string;
  isCompleting?: boolean;
  isRemoving?: boolean;
  response: APIErrorResponse | WordAnalysisResponse;
  showUndoInPlace?: boolean;
  timestamp: string;
  word: string;
}

const AIDictionaryPage: React.FC = () => {
  const [inputWord, setInputWord] = useState("");
  const [testResults, setTestResults] = useState<APICallResult[]>([]);

  const isInputTooLong = inputWord.length > MAX_WORD_LENGTH;

  const mutation = useMutation<WordAnalysisResponse, Error, string>({
    mutationFn: async (word: string) => {
      const response = await fetch(API_PATHS.DICTIONARY_DEFINE, {
        body: JSON.stringify({ word }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    },
    onError: (error, word) => {
      const result: APICallResult = {
        id: `${Date.now()}-${Math.random()}`,
        response: { error: error.message },
        timestamp: new Date().toLocaleString("zh-TW"),
        word,
      };
      setTestResults((prev) => [result, ...prev]);
    },
    onSuccess: (data, word) => {
      const result: APICallResult = {
        id: `${Date.now()}-${Math.random()}`,
        response: data,
        timestamp: new Date().toLocaleString("zh-TW"),
        word,
      };
      setTestResults((prev) => [result, ...prev]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWord.trim() && !isInputTooLong) {
      mutation.mutate(inputWord.trim());
      setInputWord("");
    }
  };

  const handleClearResults = () => {
    setTestResults([]);
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

  const isError = (response: APIErrorResponse | WordAnalysisResponse): response is APIErrorResponse => {
    return "error" in response;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-2 text-3xl font-light text-slate-800">
              AI 智能中文字典
              <span className="ml-3 rounded-md bg-blue-100 px-2 py-1 text-sm font-medium text-blue-700">Beta</span>
            </h1>
            <p className="text-slate-600">運用人工智慧技術，讓中文詞彙含義與字源更容易理解</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Search Input */}
          <div className="mb-8 rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 flex gap-4">
                  <input
                    className={`flex-1 rounded-lg border px-4 py-3 text-lg transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                      isInputTooLong ? "border-red-300 focus:ring-red-500" : "border-slate-300"
                    }`}
                    disabled={mutation.isPending}
                    onChange={(e) => setInputWord(e.target.value)}
                    placeholder="輸入中文詞彙進行查詢..."
                    type="text"
                    value={inputWord}
                  />
                  <button
                    className="w-24 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={mutation.isPending || !inputWord.trim() || isInputTooLong}
                    type="submit"
                  >
                    {mutation.isPending ? "分析中..." : "查詢"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">支援詞彙、成語及專有名詞查詢</span>
                  <span className={`text-sm ${isInputTooLong ? "text-red-500" : "text-slate-400"}`}>
                    {inputWord.length}/{MAX_WORD_LENGTH}
                  </span>
                </div>
              </form>
            </div>
          </div>

          {/* Loading State */}
          {mutation.isPending && (
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span className="text-blue-800">正在分析詞彙，請稍候...</span>
              </div>
            </div>
          )}

          {/* Results Header */}
          {testResults.length > 0 && (
            <>
              {/* AI 生成內容免責聲明 */}
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg text-amber-600">📚</span>
                  <div className="flex-1 text-sm">
                    <p className="text-amber-800">本字典內容由 AI 生成，建議搭配傳統字典使用以確保準確性。</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium text-slate-800">
                  查詢結果 <span className="text-slate-500">({testResults.length})</span>
                </h2>
                <button
                  className="text-sm text-slate-500 transition-colors hover:text-slate-700"
                  onClick={handleClearResults}
                >
                  清除所有結果
                </button>
              </div>
            </>
          )}

          {/* Results */}
          <div className="space-y-6">
            {testResults.map((result) =>
              result.showUndoInPlace ? (
                // 就地撤銷條
                <div
                  className="rounded-lg border border-green-200 bg-green-50 p-4 transition-all duration-500 ease-in-out"
                  key={result.id}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <span className="text-sm text-white">✓</span>
                      </div>
                      <span className="font-medium text-green-800">已完成學習「{result.word}」</span>
                    </div>
                    <button
                      className="px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:text-green-900"
                      onClick={() => handleUndo(result.id)}
                    >
                      撤銷
                    </button>
                  </div>
                </div>
              ) : (
                // 正常卡片
                <div
                  className={`relative rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-1200 ease-in-out ${
                    result.isCompleting
                      ? "border-blue-200 shadow-lg"
                      : result.isRemoving
                        ? "translate-y-[-20px] scale-95 opacity-0"
                        : "translate-y-0 scale-100 opacity-100"
                  }`}
                  key={result.id}
                >
                  <div className="p-6">
                    {/* Complete Learning Button */}
                    <button
                      className={`absolute top-4 right-4 rounded-md px-3 py-1 text-sm font-medium transition-all duration-300 ${
                        result.isCompleting
                          ? "scale-105 bg-green-100 text-green-800"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                      }`}
                      disabled={result.isCompleting || result.isRemoving}
                      onClick={() => handleCompleteCard(result.id)}
                    >
                      {result.isCompleting ? "已完成 👍" : "學習完成"}
                    </button>

                    {/* Success Animation */}
                    {result.isCompleting && (
                      <>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="animate-bounce text-6xl">🎉</div>
                        </div>
                        <div className="pointer-events-none absolute top-8 right-8">
                          <div className="animate-pulse text-3xl">✨</div>
                        </div>
                        <div className="pointer-events-none absolute top-12 right-12">
                          <div className="animate-ping text-2xl">⭐</div>
                        </div>
                      </>
                    )}

                    {/* Word Header */}
                    <div className="mb-6 pr-20">
                      <h3 className="mb-2 text-2xl font-semibold text-slate-800">{result.word}</h3>
                      <p className="text-sm text-slate-500">{result.timestamp}</p>
                    </div>

                    {isError(result.response) ? (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                            <span className="text-sm text-white">!</span>
                          </div>
                          <span className="text-red-800">{result.response.error}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Transliteration Info */}
                        {result.response.isTransliteration && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <h4 className="mb-2 font-medium text-amber-800">音譯詞資訊</h4>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">原始外文:</span> {result.response.originalForeignWord}
                              </p>
                              <p>
                                <span className="font-medium">來源語言:</span> {result.response.originLanguage}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Definitions */}
                        <div>
                          <h4 className="mb-3 font-semibold text-slate-800">詞彙定義</h4>
                          <div className="space-y-3">
                            {result.response.definitions.map((def, defIndex) => (
                              <div className="rounded-lg border border-slate-200 p-4" key={defIndex}>
                                <div className="mb-2 flex items-center gap-2">
                                  <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                    {def.partOfSpeech}
                                  </span>
                                </div>
                                <p className="leading-relaxed text-slate-700">{def.meaning}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Character Analysis */}
                        <div>
                          <h4 className="mb-3 font-semibold text-slate-800">字元分析</h4>
                          <div className="space-y-4">
                            {result.response.characters.map((char, charIndex) => (
                              <div className="rounded-lg border border-slate-200 p-4" key={charIndex}>
                                <div className="mb-3 flex items-start gap-4">
                                  <span className="mt-1 text-4xl font-bold text-blue-600">{char.char}</span>
                                  <div className="flex-1">
                                    <div className="mb-2 flex gap-3">
                                      <span className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-700">
                                        注音: {char.zhuyin}
                                      </span>
                                      <span className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-700">
                                        拼音: {char.pinyin}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-800">字源學:</span>
                                  <p className="mt-1 leading-relaxed text-slate-700">{char.etymology}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Empty State */}
          {testResults.length === 0 && !mutation.isPending && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <span className="text-2xl text-slate-400">📚</span>
              </div>
              <h3 className="mb-2 text-lg font-medium text-slate-700">開始您的詞彙探索之旅</h3>
              <p className="text-slate-500">在上方搜索框輸入中文詞彙，開始深入了解其含義與字源</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDictionaryPage;
