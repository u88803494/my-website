export interface AIAnalysisState {
  analysisResult: string;
  error: null | string;
  isLoading: boolean;
}

export interface AnalysisResultProps {
  isCopying: boolean;
  onChange: (value: string) => void;
  onCopy: () => void;
  value: string;
}

export interface NeedInputProps {
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
}

export interface UsageTipsProps {
  tips: string[];
}
