import { describe, expect, it } from "vitest";

import { type AIErrorType,getErrorStatusCode, parseAIErrorMessage } from "../aiErrorParser";

describe("aiErrorParser", () => {
  describe("parseAIErrorMessage", () => {
    describe("quota_exceeded errors", () => {
      it("should detect 'quota' keyword", () => {
        const result = parseAIErrorMessage("You have exceeded your quota");
        expect(result.type).toBe("quota_exceeded");
        expect(result.isQuotaError).toBe(true);
        expect(result.isRetryable).toBe(false);
        expect(result.suggestAlternative).toBe(true);
      });

      it("should detect 'resource_exhausted' keyword", () => {
        const result = parseAIErrorMessage("Error: RESOURCE_EXHAUSTED");
        expect(result.type).toBe("quota_exceeded");
        expect(result.isQuotaError).toBe(true);
      });

      it("should detect 'rate-limits' keyword (quota-related)", () => {
        const result = parseAIErrorMessage("rate-limits exceeded for this model");
        expect(result.type).toBe("quota_exceeded");
        expect(result.isQuotaError).toBe(true);
      });

      it("should extract model name from error message", () => {
        const result = parseAIErrorMessage("quota exceeded for model: gemini-2.5-flash");
        expect(result.type).toBe("quota_exceeded");
        expect(result.model).toBe("gemini-2.5-flash");
        expect(result.message).toContain("gemini-2.5-flash");
      });

      it("should extract model name with different format", () => {
        const result = parseAIErrorMessage("Model gpt-4 has exceeded quota");
        expect(result.model).toBe("gpt-4");
      });

      it("should handle missing model name gracefully", () => {
        const result = parseAIErrorMessage("quota exceeded");
        expect(result.type).toBe("quota_exceeded");
        expect(result.model).toBeUndefined();
        expect(result.message).toBe("此模型的免費額度已用完，請選擇其他模型");
      });
    });

    describe("rate_limited errors", () => {
      it("should detect 'rate limit' keyword", () => {
        const result = parseAIErrorMessage("Rate limit exceeded, please try again later");
        expect(result.type).toBe("rate_limited");
        expect(result.isQuotaError).toBe(false);
        expect(result.isRetryable).toBe(true);
        expect(result.suggestAlternative).toBe(false);
      });

      it("should detect rate limit without confusing with quota", () => {
        const result = parseAIErrorMessage("Rate limit exceeded, too many requests");
        expect(result.type).toBe("rate_limited");
        expect(result.isQuotaError).toBe(false);
      });

      it("should prioritize quota over rate limit when both present", () => {
        const result = parseAIErrorMessage("rate limit due to quota exceeded");
        expect(result.type).toBe("quota_exceeded");
      });
    });

    describe("model_unavailable errors", () => {
      it("should detect 'decommissioned' keyword", () => {
        const result = parseAIErrorMessage("This model has been decommissioned");
        expect(result.type).toBe("model_unavailable");
        expect(result.isRetryable).toBe(false);
        expect(result.suggestAlternative).toBe(true);
      });

      it("should detect 'not found' keyword", () => {
        const result = parseAIErrorMessage("Model not found");
        expect(result.type).toBe("model_unavailable");
      });

      it("should detect 'model unavailable' combination", () => {
        const result = parseAIErrorMessage("The model is currently unavailable");
        expect(result.type).toBe("model_unavailable");
      });
    });

    describe("auth_error errors", () => {
      it("should detect 'api key' keyword", () => {
        const result = parseAIErrorMessage("Invalid API key provided");
        expect(result.type).toBe("auth_error");
        expect(result.isRetryable).toBe(false);
        expect(result.suggestAlternative).toBe(true);
      });

      it("should detect 'authentication' keyword", () => {
        const result = parseAIErrorMessage("Authentication failed");
        expect(result.type).toBe("auth_error");
      });

      it("should detect 'unauthorized' keyword", () => {
        const result = parseAIErrorMessage("Unauthorized access");
        expect(result.type).toBe("auth_error");
      });

      it("should detect '401' status code", () => {
        const result = parseAIErrorMessage("Error 401: Access denied");
        expect(result.type).toBe("auth_error");
      });
    });

    describe("network_error errors", () => {
      it("should detect 'network' keyword", () => {
        const result = parseAIErrorMessage("Network error occurred");
        expect(result.type).toBe("network_error");
        expect(result.isRetryable).toBe(true);
        expect(result.suggestAlternative).toBe(false);
      });

      it("should detect 'fetch failed' keyword", () => {
        const result = parseAIErrorMessage("Fetch failed: Unable to connect");
        expect(result.type).toBe("network_error");
      });

      it("should detect 'failed to fetch' keyword", () => {
        const result = parseAIErrorMessage("Failed to fetch resource");
        expect(result.type).toBe("network_error");
      });

      it("should detect 'connection' keyword", () => {
        const result = parseAIErrorMessage("Connection refused");
        expect(result.type).toBe("network_error");
      });

      it("should detect 'timeout' keyword", () => {
        const result = parseAIErrorMessage("Request timeout after 30s");
        expect(result.type).toBe("network_error");
      });

      it("should detect 'econnrefused' keyword", () => {
        const result = parseAIErrorMessage("ECONNREFUSED: Connection refused");
        expect(result.type).toBe("network_error");
      });

      it("should detect 'enotfound' keyword", () => {
        const result = parseAIErrorMessage("ENOTFOUND: DNS lookup failed");
        expect(result.type).toBe("network_error");
      });
    });

    describe("unknown errors", () => {
      it("should return unknown for unrecognized errors", () => {
        const result = parseAIErrorMessage("Something went wrong");
        expect(result.type).toBe("unknown");
        expect(result.isQuotaError).toBe(false);
        expect(result.isRetryable).toBe(true);
        expect(result.suggestAlternative).toBe(false);
      });

      it("should return unknown for empty string", () => {
        const result = parseAIErrorMessage("");
        expect(result.type).toBe("unknown");
      });

      it("should return unknown for random text", () => {
        const result = parseAIErrorMessage("abc123xyz");
        expect(result.type).toBe("unknown");
      });
    });

    describe("case insensitivity", () => {
      it("should handle uppercase error messages", () => {
        const result = parseAIErrorMessage("QUOTA EXCEEDED");
        expect(result.type).toBe("quota_exceeded");
      });

      it("should handle mixed case error messages", () => {
        const result = parseAIErrorMessage("RaTe LiMiT exceeded");
        expect(result.type).toBe("rate_limited");
      });
    });
  });

  describe("getErrorStatusCode", () => {
    it("should return 429 for quota_exceeded", () => {
      expect(getErrorStatusCode("quota_exceeded")).toBe(429);
    });

    it("should return 429 for rate_limited", () => {
      expect(getErrorStatusCode("rate_limited")).toBe(429);
    });

    it("should return 503 for model_unavailable", () => {
      expect(getErrorStatusCode("model_unavailable")).toBe(503);
    });

    it("should return 503 for auth_error", () => {
      expect(getErrorStatusCode("auth_error")).toBe(503);
    });

    it("should return 502 for network_error", () => {
      expect(getErrorStatusCode("network_error")).toBe(502);
    });

    it("should return 500 for unknown", () => {
      expect(getErrorStatusCode("unknown")).toBe(500);
    });

    it("should return 500 for any unhandled type", () => {
      // Test with a type assertion to ensure default case works
      expect(getErrorStatusCode("invalid_type" as AIErrorType)).toBe(500);
    });
  });
});
