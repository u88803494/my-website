import type { NextConfig } from "next";
import { build } from "velite";

/**
 * Build Velite content at config-load time (before NextConfig construction)
 * Ensures both `next dev` and `next build` have compiled content available
 */
await build({ watch: process.env.NODE_ENV === "development", clean: process.env.NODE_ENV !== "development" });

/**
 * Next.js configuration
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },

  /**
   * Transpile workspace packages for proper React Context sharing
   * Required for monorepo packages to work correctly with React Query
   */
  transpilePackages: ["@packages/medium-blog", "@packages/shared", "@packages/ai-dictionary", "@packages/ai-analyzer"],

  /**
   * Prevent bundling server-only packages in client code
   * Required for pino and pino-pretty to work correctly
   */
  serverExternalPackages: ["pino", "pino-pretty"],
};

export default nextConfig;
