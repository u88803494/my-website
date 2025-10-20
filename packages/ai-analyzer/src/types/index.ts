import type { Dispatch, SetStateAction } from "react";

// AI Analyzer types
export interface NeedInputProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export interface AnalysisResultProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onCopy: () => Promise<void>;
  isCopying: boolean;
}

export interface UsageTipsProps {
  tips: string[];
}
