import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "**/*.test.ts", "**/*.test.tsx", "**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@packages/shared": path.resolve(__dirname, "packages/shared/src"),
      "@": path.resolve(__dirname, "apps/my-website/src"),
    },
  },
});
