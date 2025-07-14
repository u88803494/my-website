// --- Imports ---
// Core
import { dirname } from "path";
import { fileURLToPath } from "url";
// ESLint
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
// Plugins
import perfectionist from "eslint-plugin-perfectionist";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";

// --- Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

// --- Import Architecture Rules ---
// 這些規則確保專案遵循清晰的架構模式：
// 1. Features 之間不應該直接互相 import
// 2. 共享組件應該通過 @/components/shared 訪問
// 3. 類型定義應該集中在 @/types 中
// 4. App 路由組件應該只包含頁面邏輯，不包含業務邏輯
const importRestrictionRules = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        // 禁止直接從 app 資料夾 import（除了 page.tsx 和 layout.tsx）
        {
          group: ["@/app/*"],
          message: "請勿直接從 app 資料夾 import，應該使用對應的 feature 組件",
        },
        // 禁止跨 feature 的 hooks import
        {
          group: ["@/features/*/hooks/*"],
          message: "請勿直接從其他 feature 的 hooks 資料夾 import，應該在當前 feature 內創建所需的 hooks",
        },
        // 禁止跨 feature 的 types import
        {
          group: ["@/features/*/types/*"],
          message: "請勿直接從其他 feature 的 types 資料夾 import，應該在 @/types 中定義共享類型",
        },
        // 禁止從其他 feature 的 components 資料夾 import
        {
          group: ["@/features/*/components/*"],
          message: "請勿直接從其他 feature 的 components 資料夾 import，應該將共享組件移到 @/components/shared",
        },
      ],
    },
  ],
};

// --- Rule Groups ---
const reactRules = {
  "react/function-component-definition": [
    "error",
    { namedComponents: "arrow-function", unnamedComponents: "arrow-function" },
  ],
  "react/self-closing-comp": "error",
  "react/jsx-pascal-case": "error",
};

const codeStyleRules = {
  "prefer-const": "error",
  "no-var": "error",
  "prefer-arrow-callback": "error",
};

const typeScriptRules = {
  "@typescript-eslint/no-explicit-any": "error",
};

const importSortRules = {
  "simple-import-sort/imports": "error",
  "unused-imports/no-unused-imports": "error",
  "perfectionist/sort-imports": "off", // Defer to simple-import-sort
};

// --- Main Configuration ---
const eslintConfig = [
  // 1. Base configurations for the entire project
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),

  // 2. Plugin definitions, available globally
  {
    plugins: {
      perfectionist,
      sonarjs,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
  },

  // 3. Configuration for the main React application (src folder)
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Perfectionist rules (code sorting and organization)
      ...perfectionist.configs["recommended-natural"].rules,

      // SonarJS rules (code quality and bug detection)
      "sonarjs/cognitive-complexity": "error",
      "sonarjs/no-duplicate-string": "error",
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/prefer-immediate-return": "error",

      // Apply rule groups
      ...importSortRules,
      ...importRestrictionRules,
      ...reactRules,
      ...codeStyleRules,
      ...typeScriptRules,
    },
  },

  // 4. Configuration for auto-generated data files
  {
    files: ["src/data/articleData.ts"],
    rules: {
      "sonarjs/no-duplicate-string": "off",
    },
  },

  // 5. Configuration for Node.js scripts (scripts folder)
  {
    files: ["scripts/**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      ...importSortRules,
      ...codeStyleRules,
      // Perfectionist rules for scripts
      "perfectionist/sort-imports": "off", // Defer to simple-import-sort
      "perfectionist/sort-objects": "error",
      "perfectionist/sort-interfaces": "error",
    },
  },
];

export default eslintConfig;
