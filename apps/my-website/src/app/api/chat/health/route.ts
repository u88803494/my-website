import { AI_MODELS, type AIModelProvider } from "@packages/shared";
import { NextResponse } from "next/server";

import { env } from "@/env";

interface ProviderStatus {
  configured: boolean;
  modelCount: number;
}

interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  providers: Record<AIModelProvider, ProviderStatus>;
  totalModels: number;
  availableModels: number;
}

/**
 * Health check endpoint for AI Chat API
 * Returns provider status and availability
 */
export async function GET() {
  const providers: Record<AIModelProvider, ProviderStatus> = {
    google: {
      configured: Boolean(env.GEMINI_API_KEY),
      modelCount: AI_MODELS.filter((m) => m.provider === "google").length,
    },
    groq: {
      configured: Boolean(env.GROQ_API_KEY),
      modelCount: AI_MODELS.filter((m) => m.provider === "groq").length,
    },
    mistral: {
      configured: Boolean(env.MISTRAL_API_KEY),
      modelCount: AI_MODELS.filter((m) => m.provider === "mistral").length,
    },
  };

  const configuredProviders = Object.values(providers).filter((p) => p.configured);
  const availableModels = configuredProviders.reduce((sum, p) => sum + p.modelCount, 0);
  const totalModels = AI_MODELS.length;

  // Determine overall health status
  let status: HealthResponse["status"];
  if (configuredProviders.length === 0) {
    status = "unhealthy";
  } else if (configuredProviders.length < Object.keys(providers).length) {
    status = "degraded";
  } else {
    status = "healthy";
  }

  const response: HealthResponse = {
    status,
    timestamp: new Date().toISOString(),
    providers,
    totalModels,
    availableModels,
  };

  return NextResponse.json(response, {
    status: status === "unhealthy" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
