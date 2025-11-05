import type { NextConfig } from "next";

/**
 * Next.js configuration
 *
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig: NextConfig = {
  /**
   * Prevent bundling server-only packages in client code
   * Required for pino and pino-pretty to work correctly
   */
  serverExternalPackages: ["pino", "pino-pretty"],
};

export default nextConfig;
