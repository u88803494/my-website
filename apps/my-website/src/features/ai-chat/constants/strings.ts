// UI Strings for AI Chat feature
// Centralized for maintainability and potential i18n support

export const UI_STRINGS = {
  // Feature Header
  featureTitle: "AI Chat",

  // Actions
  clearChat: "清除對話",
  retry: "重試",
  scrollToBottom: "跳到底部",

  // Empty State
  emptyStateTitle: "開始對話",
  emptyStateDescription: "輸入訊息開始與 AI 助手對話",
  emptyStateSubDescription: "支援多種 AI 模型切換",

  // Input
  inputPlaceholder: "輸入訊息... (Shift+Enter 換行)",

  // Messages
  userLabel: "你",
  assistantLabel: "AI 助手",
  emptyContentFallback: "...",

  // Model Selector
  modelSelectorPlaceholder: "選擇模型",

  // Errors
  quotaErrorSuggestion: "建議使用 Groq 或 Mistral 系列模型",
  markdownErrorFallback: "無法渲染內容",

  // Accessibility (ARIA labels)
  ariaMessageInput: "訊息輸入框",
  ariaSendMessage: "發送訊息",
  ariaChatHistory: "對話歷史",
  ariaModelSelector: "選擇 AI 模型",
  ariaLoadingMessage: "AI 正在回應中",
} as const;

export type UIStringKey = keyof typeof UI_STRINGS;
