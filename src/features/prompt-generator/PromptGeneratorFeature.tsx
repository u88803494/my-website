"use client";

import { useState } from "react";

import GeneratedTemplate from "./components/GeneratedTemplate";
import NeedInput from "./components/NeedInput";
import UsageTips from "./components/UsageTips";
import { PLACEHOLDER_TEXT, USAGE_TIPS } from "./constants";
import { usePromptGeneration } from "./hooks/usePromptGeneration";

const PromptGeneratorFeature: React.FC = () => {
  const { copyToClipboard, error, generateTemplate, isLoading, needInput, setNeedInput, setTemplate, template } =
    usePromptGeneration();

  const [isCopying, setIsCopying] = useState(false);

  const handleSubmit = () => {
    generateTemplate();
  };

  const handleCopy = async () => {
    setIsCopying(true);
    await copyToClipboard();
    setIsCopying(false);
  };

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* 標題區域 */}
      <div className="space-y-4 text-center">
        <h1 className="text-base-content text-4xl font-bold">AI Prompt 生成器</h1>
        <p className="text-base-content/70 mx-auto max-w-2xl text-xl">
          想不到怎麼下提示詞嗎？用用這個工具，或許你可以釐清你的需求。
        </p>
      </div>

      {/* 使用提示 */}
      <UsageTips tips={USAGE_TIPS} />

      {/* 需求輸入 */}
      <div className="space-y-4">
        <h2 className="text-base-content text-center text-2xl font-semibold">描述您的需求</h2>
        <NeedInput
          isLoading={isLoading}
          onChange={setNeedInput}
          onSubmit={handleSubmit}
          placeholder={PLACEHOLDER_TEXT}
          value={needInput}
        />
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="alert alert-error mx-auto max-w-2xl">
          <span>{error}</span>
        </div>
      )}

      {/* 生成的模板 */}
      <GeneratedTemplate isCopying={isCopying} onChange={setTemplate} onCopy={handleCopy} value={template} />
    </div>
  );
};

export default PromptGeneratorFeature;
