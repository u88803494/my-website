# 📝 Architecture Decision Records (ADRs)

**以決策為導向的文件** - 記錄本專案中重要的架構與技術決策。

## 📖 什麼是 ADRs？

Architecture Decision Records 記錄影響專案結構、模式或技術的重要決策。它們捕捉：

- **做了什麼**決策
- **為什麼**做這個決策
- 考慮了**哪些替代方案**
- 產生了**什麼後果**

ADRs 是不可變的歷史記錄。一旦撰寫完成，就不應該更改（除了格式調整）。如果決策被推翻，應該建立新的 ADR 來取代舊的。

---

## 📚 ADR 索引

### 活躍決策

- **[001 - React Query SSG Pattern](./001-react-query-ssg-pattern.md)** ✅
  - 決策：透過 HydrationBoundary 使用 React Query 搭配 Next.js SSG
  - 狀態：已接受
  - 日期：2024-12-15

- **[002 - Agents.md Adoption](./002-agents-md-adoption.md)** ✅
  - 決策：採用 Agents.md 標準進行 AI agent 設定
  - 狀態：已接受
  - 日期：2024-12-28

- **[003 - Git Hooks Optimization](./003-git-hooks-optimization.md)** ✅
  - 決策：採用兩層式 commit 大小限制與 pre-commit/pre-push 策略
  - 狀態：已接受
  - 日期：2025-01-07

### 已取代決策

_(尚無)_

### 已廢棄決策

_(尚無)_

---

## 🆕 建立新 ADRs

### 何時建立 ADR

在做以下決策時建立 ADR：

- ✅ **架構**：系統結構、元件邊界
- ✅ **技術選擇**：框架、函式庫、工具
- ✅ **模式**：設計模式、程式碼慣例
- ✅ **基礎設施**：部署、CI/CD、託管
- ✅ **標準**：文件、測試、程式碼風格

**不應建立 ADRs 的情況：**

- ❌ 實作細節（程式碼層級的決策）
- ❌ 暫時性或容易回復的選擇
- ❌ 沒有替代方案的顯而易見決策
- ❌ 缺乏技術價值的個人偏好

### 流程

1. **複製模板**：

   ```bash
   cp docs/adr/template.md docs/adr/00X-your-decision.md
   ```

2. **依序編號**：使用下一個可用編號（004、005 等）

3. **填寫所有章節**：遵循模板結構

4. **連結相關文件**：連接到 Explanations、Guides、References

5. **提交**：為 ADR 建立獨立的 commit

6. **更新此 README**：將你的 ADR 加入上方索引

---

## 📋 ADR 模板

請參考 [template.md](./template.md) 取得標準 ADR 格式。

**必要章節：**

1. 標題與 metadata
2. 狀態
3. 背景脈絡
4. 決策
5. 後果
6. 考慮的替代方案

---

## 🔗 與其他文件類型的關係

```
研究與分析
      ↓
Explanation Doc（廣泛討論概念）
      ↓
ADR（記錄本專案的特定決策）
      ↓
Reference Doc（技術規格）
      ↓
Guide（如何實作）
```

**範例：**

- [Explanation: Git Hooks Research](../explanation/git-hooks-research.md) - 產業研究
- [ADR 003: Git Hooks Optimization](./003-git-hooks-optimization.md) - 我們的決策
- [Reference: Git Hooks](../reference/git-hooks.md) - 技術規格
- [Guide: Git Workflow](../guides/git-workflow.md) - 如何使用

---

## 🤖 給 AI Agents

### 何時建立 ADRs

如果使用者正在做**重要的技術決策**：

1. 建議建立 ADR
2. 使用模板
3. 徹底研究替代方案
4. 誠實記錄權衡取捨
5. 連結到相關的 Explanation 文件

### ADR vs Explanation

- **ADR**：「我們決定在 Y 情況使用 X，因為 Z」
- **Explanation**：「這裡說明 X 如何運作以及何時使用」

ADR 是專案特定且以決策為焦點的。Explanation 是通用且以理解為焦點的。

### 狀態轉換

```
                 ┌─────────────┐
                 │   Proposed  │
                 └──────┬──────┘
                        │
           ┌────────────┼────────────┐
           │                         │
           ↓                         ↓
    ┌──────────┐             ┌──────────┐
    │ Accepted │             │ Rejected │
    └────┬─────┘             └──────────┘
         │
         │ (later decision)
         ↓
    ┌────────────┐
    │ Superseded │
    └────────────┘
         │
         ↓
    ┌────────────┐
    │ Deprecated │
    └────────────┘
```

- **Proposed**：審查中，尚未決定
- **Accepted**：已決定並實作
- **Rejected**：已考慮但未選用
- **Superseded**：被新的 ADR 取代
- **Deprecated**：不再適用

---

## 📖 延伸閱讀

- [Architecture Decision Records (GitHub)](https://adr.github.io/)
- [ADR Best Practices](https://github.com/joelparkerhenderson/architecture-decision-record)
- [When to Write an ADR](https://github.com/joelparkerhenderson/architecture-decision-record#when-to-write-an-adr)
