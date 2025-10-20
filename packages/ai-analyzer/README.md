# @packages/ai-analyzer

AI 分析工具 package,提供通用 AI 文本分析功能。

## 功能

- AI 文本分析
- 自定義 prompts
- React Query 整合

## 使用方式

```typescript
import { AIAnalyzerFeature } from "@packages/ai-analyzer";

export default function AnalyzerPage() {
  return <AIAnalyzerFeature />;
}
```

## API

- `AIAnalyzerFeature` - 主要組件
- `analyzeWithAI(need: string, prompt: string, apiKey: string)` - 分析函數
