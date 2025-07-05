import { useState } from "react";

import { MAX_WORD_LENGTH } from "../types";

interface WordSearchFormProps {
  isLoading: boolean;
  onSubmit: (word: string) => void;
}

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
    <div className="mb-8 rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-3 flex gap-4">
            <input
              className={`flex-1 rounded-lg border px-4 py-3 text-lg transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                isInputTooLong ? "border-red-300 focus:ring-red-500" : "border-slate-300"
              }`}
              disabled={isLoading}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="輸入中文詞彙進行查詢..."
              type="text"
              value={inputWord}
            />
            <button
              className="w-24 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || !inputWord.trim() || isInputTooLong}
              type="submit"
            >
              {isLoading ? "分析中..." : "查詢"}
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
  );
};

export default WordSearchForm;
