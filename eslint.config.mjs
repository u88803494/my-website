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
import tailwindcss from "eslint-plugin-tailwindcss";
import unusedImports from "eslint-plugin-unused-imports";

// --- Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

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
      tailwindcss,
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

      // Tailwind CSS rules
      "tailwindcss/no-custom-classname": "off",

      // Apply rule groups
      ...importSortRules,
      ...reactRules,
      ...codeStyleRules,
    },
  },

  // 4. Configuration for Node.js scripts (scripts folder)
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: { ...globals.node },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
