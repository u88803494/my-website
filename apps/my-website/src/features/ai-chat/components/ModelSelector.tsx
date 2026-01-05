"use client";

import { ChevronDown } from "lucide-react";

import { AI_MODELS, getModelById } from "../constants/models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange, disabled = false }) => {
  const currentModel = getModelById(selectedModel);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className={`btn btn-sm btn-ghost gap-2 ${disabled ? "btn-disabled" : ""}`}>
        <span className="text-sm font-medium">{currentModel?.name ?? "選擇模型"}</span>
        <ChevronDown className="h-4 w-4" />
      </label>
      <ul tabIndex={0} className="menu dropdown-content rounded-box bg-base-200 z-50 mt-2 w-64 p-2 shadow-lg">
        {AI_MODELS.map((model) => (
          <li key={model.id}>
            <button
              onClick={() => onModelChange(model.id)}
              className={`flex flex-col items-start ${selectedModel === model.id ? "active" : ""}`}
            >
              <span className="font-medium">{model.name}</span>
              <span className="text-xs opacity-70">{model.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelSelector;
