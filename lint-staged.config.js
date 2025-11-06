module.exports = {
  // JS/TS 檔案：格式化 → ESLint 修復
  // 注意：TypeScript 型別檢查已移至 pre-push hook 以提升 pre-commit 速度
  'apps/my-website/**/*.{js,jsx,ts,tsx}': [
    "bash -c 'cd apps/my-website && pnpm prettier --write ${0#apps/my-website/}'",
    "bash -c 'cd apps/my-website && pnpm eslint --fix --max-warnings=0 ${0#apps/my-website/}'",
  ],

  // 其他檔案：只格式化
  '**/*.{json,css,scss,md,mdx,yaml,yml}': [
    'prettier --write'
  ]
};
