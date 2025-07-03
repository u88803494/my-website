"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { API_PATHS } from "@/lib/api-paths";
import type { APIErrorResponse, WordAnalysisResponse } from "@/types/dictionary.types";

const testWords = ["字典", "學習", "智慧", "生活", "電腦", "網路", "程式", "開發", "咖啡", "沙發"];
const MAX_WORD_LENGTH = 20;

interface APICallResult {
  response: APIErrorResponse | WordAnalysisResponse;
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
        response: { error: error.message },
        timestamp: new Date().toLocaleString("zh-TW"),
        word,
      };
      setTestResults((prev) => [result, ...prev]);
    },
    onSuccess: (data, word) => {
      const result: APICallResult = {
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
    }
  };

  const handleTestWord = (word: string) => {
    setInputWord(word);
    mutation.mutate(word);
  };

  const handleClearResults = () => {
    setTestResults([]);
  };

  const isError = (response: APIErrorResponse | WordAnalysisResponse): response is APIErrorResponse => {
    return "error" in response;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">🤖 AI 辭典</h1>
          <p className="text-base-content/70 text-lg">輸入中文詞彙，獲得完整的字源學分析</p>
        </div>

        <div className="card bg-base-100 mb-8 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📝 輸入測試</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <input
                  className={`input input-bordered w-full ${isInputTooLong ? "input-error" : ""}`}
                  disabled={mutation.isPending}
                  onChange={(e) => setInputWord(e.target.value)}
                  placeholder="輸入任何中文詞彙... (例如：咖啡、沙發)"
                  type="text"
                  value={inputWord}
                />
                <label className="label">
                  <span className="label-text-alt" />
                  <span className={`label-text-alt ${isInputTooLong ? "text-error" : ""}`}>
                    {inputWord.length}/{MAX_WORD_LENGTH}
                  </span>
                </label>
              </div>
              <div className="card-actions mt-2 justify-end">
                <button
                  className="btn btn-primary"
                  disabled={mutation.isPending || !inputWord.trim() || isInputTooLong}
                  type="submit"
                >
                  {mutation.isPending ? "分析中..." : "分析"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card bg-base-100 mb-8 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">🎯 快速測試</h2>
            <p className="text-base-content/70 mb-4 text-sm">點擊以下詞彙進行快速測試：</p>
            <div className="flex flex-wrap gap-2">
              {testWords.map((word) => (
                <button
                  className="btn btn-outline btn-sm"
                  disabled={mutation.isPending}
                  key={word}
                  onClick={() => handleTestWord(word)}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mutation.isPending && (
          <div className="alert alert-info mb-8">
            <span className="loading loading-spinner loading-md" />
            <span>正在分析詞彙，請稍候...</span>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">📊 測試結果 ({testResults.length})</h2>
            <button className="btn btn-outline btn-sm" onClick={handleClearResults}>
              清除結果
            </button>
          </div>
        )}

        <div className="space-y-6">
          {testResults.map((result, index) => (
            <div className="card bg-base-100 shadow-xl" key={index}>
              <div className="card-body">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="card-title text-lg">
                    查詢詞彙: <span className="text-primary">{result.word}</span>
                  </h3>
                  <div className="badge badge-outline">{result.timestamp}</div>
                </div>

                {/* 新增：音譯詞資訊 */}
                {!isError(result.response) && result.response.isTransliteration && (
                  <div className="bg-info/10 text-info-content mb-4 space-y-2 rounded-lg p-4">
                    <p>
                      <span className="font-semibold">原始外文:</span> {result.response.originalForeignWord}
                    </p>
                    <p>
                      <span className="font-semibold">來源語言:</span> {result.response.originLanguage}
                    </p>
                  </div>
                )}

                {isError(result.response) ? (
                  <div className="alert alert-error">
                    <span>❌ {result.response.error}</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold">📖 詞彙定義:</h4>
                      <div className="space-y-2">
                        {result.response.definitions.map((def, defIndex) => (
                          <div className="bg-base-200 rounded p-3" key={defIndex}>
                            <div className="badge badge-secondary mb-2">{def.partOfSpeech}</div>
                            <p>{def.meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold">🔍 字元分析:</h4>
                      <div className="space-y-3">
                        {result.response.characters.map((char, charIndex) => (
                          <div className="bg-base-200 rounded p-4" key={charIndex}>
                            <div className="mb-2 flex items-center gap-4">
                              <span className="text-primary text-3xl font-bold">{char.char}</span>
                              <div className="flex gap-2">
                                <div className="badge badge-info">注音: {char.zhuyin}</div>
                                <div className="badge badge-success">拼音: {char.pinyin}</div>
                              </div>
                            </div>
                            <p className="text-sm">
                              <span className="font-semibold">字源學:</span> {char.etymology}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="collapse-arrow bg-base-200 collapse">
                      <input type="checkbox" />
                      <div className="collapse-title text-sm font-medium">🔧 查看原始 JSON 回應</div>
                      <div className="collapse-content">
                        <pre className="bg-base-300 overflow-x-auto rounded p-4 text-xs">
                          {JSON.stringify(result.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {testResults.length === 0 && !mutation.isPending && (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">🤖</div>
            <p className="text-base-content/70 text-lg">還沒有測試結果，請輸入詞彙開始測試！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDictionaryPage;
