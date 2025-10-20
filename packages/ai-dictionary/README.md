# @packages/ai-dictionary

AI 字典工具 package，提供 AI 驅動的詞彙分析功能。

## 功能

- AI 詞彙分析(中英文)
- 詞源、定義、例句生成
- React Query 整合

## 使用方式

```typescript
import { AIDictionaryFeature } from "@packages/ai-dictionary";

export default function DictionaryPage() {
  return <AIDictionaryFeature />;
}
```

## API

- `AIDictionaryFeature` - 主要組件
- `analyzeWord(word: string, apiKey: string)` - 分析詞彙的服務函數
