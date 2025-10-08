// @ts-check
import { nextJsConfig } from "@packages/eslint-config/next";

// --- Import Architecture Rules ---
// 這些規則確保專案遵循清晰的架構模式
const importRestrictionRules = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        { group: ["@/app/*"], message: "請勿直接從 app 資料夾 import，應該使用對應的 feature 組件" },
        { group: ["@/features/*/hooks/*"], message: "請勿直接從其他 feature 的 hooks 資料夾 import" },
        { group: ["@/features/*/types/*"], message: "請勿直接從其他 feature 的 types import" },
        { group: ["@/features/*/components/*"], message: "請勿直接從其他 feature 的 components 資料夾 import" },
      ],
    },
  ],
};

// --- Main Configuration ---
/** @type {import("eslint").Linter.Config[]} */
export default [
  // 展開 Next.js 推薦配置（包含 base、React、TypeScript 規則）
  ...nextJsConfig,

  // 針對主要應用程式的設定
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...importRestrictionRules,
    },
  },

  // 針對特定檔案類型，放寬重複字串的檢查
  {
    files: [
      "src/data/**/*.{ts,tsx}",
      "src/features/**/components/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
      "src/app/**/components/**/*.{ts,tsx}",
    ],
    rules: {
      "sonarjs/no-duplicate-string": "off",
    },
  },

  // 針對自動產生的資料檔案，放寬排序規則
  {
    files: ["src/data/articleData.ts"],
    rules: {
      "perfectionist/sort-objects": "off",
    },
  },

  // 針對 Node.js 指令碼的設定
  {
    files: ["scripts/**/*.{js,ts}"],
    rules: {
      "no-console": "off",
    },
  },
];
