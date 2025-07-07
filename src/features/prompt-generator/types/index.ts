export interface GeneratedTemplateProps {
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

export interface PromptGenerationState {
  error: null | string;
  generatedTemplate: string;
  isLoading: boolean;
}

export interface UsageTipsProps {
  tips: string[];
}
