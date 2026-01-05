import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These are only available on the server.
   */
  server: {
    // AI Provider API Keys
    GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
    GROQ_API_KEY: z.string().optional(),
    MISTRAL_API_KEY: z.string().optional(),

    // Runtime
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  /**
   * Client-side environment variables schema.
   * Exposed to the client (must be prefixed with NEXT_PUBLIC_).
   */
  client: {
    // No client-side env vars currently
  },

  /**
   * Runtime environment variables.
   * Maps env vars to the schema for validation.
   */
  runtimeEnv: {
    // Server
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * Skip validation in certain environments.
   * Useful for Docker builds where env vars aren't available.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined.
   * Prevents empty string from passing validation.
   */
  emptyStringAsUndefined: true,
});
