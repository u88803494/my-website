module.exports = {
  // JS/TS 檔案：格式化 → ESLint 修復 → 型別檢查
  'apps/my-website/**/*.{js,jsx,ts,tsx}': [
    "bash -c 'cd apps/my-website && pnpm prettier --write ${0#apps/my-website/}'",
    "bash -c 'cd apps/my-website && pnpm eslint --fix --max-warnings=0 ${0#apps/my-website/}'",
    "bash -c 'cd apps/my-website && pnpm tsc --noEmit --skipLibCheck'"
  ],

  // 其他檔案：只格式化
  '**/*.{json,css,scss,md,mdx,yaml,yml}': [
    'prettier --write'
  ]
};
