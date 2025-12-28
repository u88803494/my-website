/**
 * AI Error Parser - Unified error parsing for AI Chat
 * Used by both frontend and backend for consistent error messages
 */

export type AIErrorType =
  | "quota_exceeded"
  | "rate_limited"
  | "model_unavailable"
  | "auth_error"
  | "network_error"
  | "unknown";

export interface ParsedAIError {
  type: AIErrorType;
  message: string;
  isQuotaError: boolean;
  isRetryable: boolean;
  suggestAlternative: boolean;
  model?: string;
}

/**
 * Parse AI-related errors into user-friendly messages
 * @param errorMessage - The error message string to parse
 * @returns Parsed error with user-friendly message and metadata
 */
export function parseAIErrorMessage(errorMessage: string): ParsedAIError {
  const lowerMessage = errorMessage.toLowerCase();

  // Check for quota exceeded
  if (
    lowerMessage.includes("quota") ||
    lowerMessage.includes("resource_exhausted") ||
    lowerMessage.includes("rate-limits")
  ) {
    // Extract model name if present
    const modelMatch = errorMessage.match(/model[:\s]+([a-zA-Z0-9.-]+)/i);
    const model = modelMatch ? modelMatch[1] : undefined;

    return {
      type: "quota_exceeded",
      message: model
        ? `${model} 的免費額度已用完，請選擇其他模型`
        : "此模型的免費額度已用完，請選擇其他模型",
      isQuotaError: true,
      isRetryable: false,
      suggestAlternative: true,
      model,
    };
  }

  // Check for rate limiting (different from quota)
  if (lowerMessage.includes("rate limit") && !lowerMessage.includes("quota")) {
    return {
      type: "rate_limited",
      message: "請求過於頻繁，請稍後再試",
      isQuotaError: false,
      isRetryable: true,
      suggestAlternative: false,
    };
  }

  // Check for model unavailable
  if (
    lowerMessage.includes("decommissioned") ||
    lowerMessage.includes("not found") ||
    (lowerMessage.includes("model") && lowerMessage.includes("unavailable"))
  ) {
    return {
      type: "model_unavailable",
      message: "此模型已停用，請選擇其他模型",
      isQuotaError: false,
      isRetryable: false,
      suggestAlternative: true,
    };
  }

  // Check for authentication errors
  if (
    lowerMessage.includes("api key") ||
    lowerMessage.includes("authentication") ||
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("401")
  ) {
    return {
      type: "auth_error",
      message: "API 認證失敗，請聯繫管理員",
      isQuotaError: false,
      isRetryable: false,
      suggestAlternative: true,
    };
  }

  // Check for network errors
  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("fetch failed") ||
    lowerMessage.includes("failed to fetch") ||
    lowerMessage.includes("connection") ||
    lowerMessage.includes("timeout") ||
    lowerMessage.includes("econnrefused") ||
    lowerMessage.includes("enotfound")
  ) {
    return {
      type: "network_error",
      message: "網路連線失敗，請檢查網路狀態後重試",
      isQuotaError: false,
      isRetryable: true,
      suggestAlternative: false,
    };
  }

  // Default unknown error
  return {
    type: "unknown",
    message: "發生錯誤，請稍後再試",
    isQuotaError: false,
    isRetryable: true,
    suggestAlternative: false,
  };
}

/**
 * Get HTTP status code for error type
 */
export function getErrorStatusCode(errorType: AIErrorType): number {
  switch (errorType) {
    case "quota_exceeded":
    case "rate_limited":
      return 429;
    case "model_unavailable":
    case "auth_error":
      return 503;
    case "network_error":
      return 502; // Bad Gateway
    default:
      return 500;
  }
}
