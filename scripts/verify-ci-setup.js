#!/usr/bin/env node
/**
 * CI/CD 設定驗證腳本
 * 檢查所有必要的檔案和設定是否正確
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔍 正在驗證 CI/CD 設定...\n");

const checks = [
  {
    name: "GitHub Actions 工作流程檔案",
    path: ".github/workflows/ci.yml",
    required: true,
  },
  {
    name: "Vercel 設定檔案",
    path: "vercel.json",
    required: true,
  },
  {
    name: "Turbo 設定檔案",
    path: "turbo.json",
    required: true,
  },
  {
    name: "CI/CD 說明文件",
    path: "docs/CI-CD-SETUP.md",
    required: false,
  },
];

let allPassed = true;

// 檢查檔案存在性
console.log("📁 檢查設定檔案...\n");
checks.forEach((check) => {
  const exists = fs.existsSync(check.path);
  const status = exists ? "✅" : check.required ? "❌" : "⚠️";
  const message = exists ? "存在" : "不存在";

  console.log(`${status} ${check.name}: ${message}`);

  if (check.required && !exists) {
    allPassed = false;
  }
});

// 檢查 package.json 中的 Turbo 指令
console.log("\n⚡ 檢查 Turbo 指令...\n");
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const scripts = packageJson.scripts || {};

  const turboCommands = ["turbo:check", "turbo:build"];

  turboCommands.forEach((cmd) => {
    if (scripts[cmd]) {
      console.log(`✅ ${cmd}: ${scripts[cmd]}`);
    } else {
      console.log(`❌ ${cmd}: 不存在`);
      allPassed = false;
    }
  });
} catch (error) {
  console.log("❌ 無法讀取 package.json");
  allPassed = false;
}

// 測試 Turbo 指令
console.log("\n🧪 測試 Turbo 指令...\n");
try {
  execSync("pnpm turbo:check --dry-run", { stdio: "pipe" });
  console.log("✅ turbo:check 指令測試通過");
} catch (error) {
  console.log("❌ turbo:check 指令測試失敗");
  allPassed = false;
}

try {
  execSync("pnpm turbo:build --dry-run", { stdio: "pipe" });
  console.log("✅ turbo:build 指令測試通過");
} catch (error) {
  console.log("❌ turbo:build 指令測試失敗");
  allPassed = false;
}

// 檢查 Turbo 是否已安裝
console.log("\n📦 檢查依賴套件...\n");
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const devDeps = packageJson.devDependencies || {};

  if (devDeps.turbo) {
    console.log(`✅ Turbo 已安裝: ${devDeps.turbo}`);
  } else {
    console.log("❌ Turbo 未安裝");
    allPassed = false;
  }
} catch (error) {
  console.log("❌ 無法檢查依賴套件");
  allPassed = false;
}

// 總結
console.log("\n" + "=".repeat(50));
if (allPassed) {
  console.log("🎉 所有檢查通過！CI/CD 設定完成。");
  console.log("\n後續步驟：");
  console.log("1. 提交並推送代碼到 GitHub");
  console.log("2. 設定 GitHub Secrets（如需要）");
  console.log("3. 設定 Vercel 專案（如需要）");
  console.log("4. 執行 pnpm dlx turbo login（如需要 Remote Cache）");
} else {
  console.log("❌ 部分檢查失敗，請檢查上述錯誤。");
  process.exit(1);
}
