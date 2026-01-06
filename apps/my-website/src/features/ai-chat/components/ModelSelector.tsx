"use client";

import { ChevronDown } from "lucide-react";

import { AI_MODELS, getModelById, UI_STRINGS } from "../constants";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange, disabled = false }) => {
  const currentModel = getModelById(selectedModel);

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    // Close dropdown by blurring the active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="dropdown dropdown-end" role="combobox" aria-haspopup="listbox" aria-expanded="false">
      <label
        tabIndex={0}
        aria-label={UI_STRINGS.ariaModelSelector}
        className={`btn btn-sm btn-ghost gap-2 ${disabled ? "btn-disabled" : ""}`}
      >
        <span className="text-sm font-medium">{currentModel?.name ?? UI_STRINGS.modelSelectorPlaceholder}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </label>
      <ul
        tabIndex={0}
        role="listbox"
        className="menu dropdown-content rounded-box bg-base-200 z-50 mt-2 w-64 p-2 shadow-lg"
      >
        {AI_MODELS.map((model) => (
          <li key={model.id} role="option" aria-selected={selectedModel === model.id}>
            <button
              onClick={() => handleModelSelect(model.id)}
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
