# [技術/組件/API 名稱] 參考文件

---

title: [完整標題]
type: reference
status: draft|review|stable|deprecated
audience: [developer, ai]
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
version: x.y.z (如適用)
related:

- guides/how-to-use.md
- explanation/concept.md
- api/related-api.md
  ai_context: |
  此參考文件的簡短說明。

---

## 概述

**文件內容**：此技術、組件或 API 的簡要描述。

**使用場景**：

- 使用場景 1
- 使用場景 2
- 使用場景 3

**位置**：`path/to/file` 或 URL（如適用）

---

## 快速參考

**最常用操作：**

| Operation   | Command/Code | Description |
| ----------- | ------------ | ----------- |
| Operation 1 | `command`    | 簡要說明    |
| Operation 2 | `command`    | 簡要說明    |
| Operation 3 | `command`    | 簡要說明    |

---

## 完整規格

### 選項 1：[名稱]

- **Type**：`string | number | boolean`
- **Default**：`defaultValue`
- **Required**：Yes | No
- **描述**：此選項的詳細說明

**範例**：

```typescript
// Example usage
const example = {
  option1: "value",
};
```

---

### 選項 2：[名稱]

- **Type**：`string | number | boolean`
- **Default**：`defaultValue`
- **Required**：Yes | No
- **描述**：詳細說明

**有效值**：

- `value1` - 說明
- `value2` - 說明
- `value3` - 說明

**範例**：

```typescript
// Example usage
const example = {
  option2: "value1",
};
```

---

### 選項 3：[名稱]

（繼續列出所有選項/參數）

---

## API Endpoints（如適用）

### GET /api/endpoint

**描述**：此端點的功能說明。

**請求**：

**Headers**：

```
Content-Type: application/json
Authorization: Bearer <token> (如需要)
```

**Query Parameters**：
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1 | string | Yes | 說明 |
| param2 | number | No | 說明 |

**請求範例**：

```bash
curl -X GET "https://api.example.com/endpoint?param1=value" \
  -H "Content-Type: application/json"
```

**回應**：

**成功 (200)**：

```typescript
interface Response {
  data: string;
  status: "success";
}
```

**回應範例**：

```json
{
  "data": "example",
  "status": "success"
}
```

**錯誤回應**：

| Status Code | Description  | Response Body            |
| ----------- | ------------ | ------------------------ |
| 400         | Bad Request  | `{ "error": "message" }` |
| 401         | Unauthorized | `{ "error": "message" }` |
| 500         | Server Error | `{ "error": "message" }` |

---

### POST /api/endpoint

（記錄其他端點）

---

## 設定檔（如適用）

### Configuration File

**位置**：`path/to/config.file`

**格式**：JSON | YAML | TypeScript

**結構**：

```typescript
interface Config {
  option1: string;
  option2: number;
  option3?: boolean;
}
```

**完整範例**：

```json
{
  "option1": "value",
  "option2": 42,
  "option3": true
}
```

**設定選項**：

| Option  | Type    | Default | Description    |
| ------- | ------- | ------- | -------------- |
| option1 | string  | -       | 必填選項       |
| option2 | number  | 42      | 選填，有預設值 |
| option3 | boolean | false   | 選填設定       |

---

## Types & Interfaces

### Type Name

```typescript
interface TypeName {
  property1: string;
  property2: number;
  property3?: boolean;
}
```

**屬性**：

- **property1**：`string` - 屬性說明
- **property2**：`number` - 屬性說明
- **property3**：`boolean`（選填）- 屬性說明

---

### Type Name 2

（記錄所有類型）

---

## 範例

### 範例 1：[常見使用場景]

**情境**：你想達成的目標。

```typescript
// Complete working example
const example = "implementation";
```

**輸出**：

```
Expected output
```

---

### 範例 2：[進階使用場景]

**情境**：你想達成的目標。

```typescript
// Complete working example
const advanced = "implementation";
```

---

## 驗證規則（如適用）

| Rule   | Description | Example Valid | Example Invalid |
| ------ | ----------- | ------------- | --------------- |
| Rule 1 | 說明        | `valid`       | `invalid`       |
| Rule 2 | 說明        | `valid`       | `invalid`       |

---

## 效能考量

- 📊 **效能注意事項 1**：說明
- 📊 **效能注意事項 2**：說明
- ⚡ **最佳化建議**：說明

---

## 相容性

**支援版本**：

- Technology A: >= x.y.z
- Technology B: >= x.y.z

**已知問題**：

- 版本 X 的問題 1
- 設定 Y 的問題 2

---

## 參見

### 指南

- [如何使用 [技術]](../guides/how-to-use.md) - 實際使用方式

### 解釋

- [為何 [技術] 這樣運作](../explanation/concept.md) - 概念說明

### 相關參考

- [相關技術參考](./related-tech.md)
- [相關 API 參考](./api/related-api.md)

### 外部文件

- [官方文件](https://example.com/docs)
- [API 文件](https://example.com/api)

---

## Changelog（如適用）

### Version x.y.z (YYYY-MM-DD)

- 新增功能 1
- 變更選項 2 的行為
- 修復選項 3 的問題
- 棄用選項 4

---

## 模板使用說明（使用時請移除此區塊）

**如何使用此參考文件模板：**

1. **標題**：使用格式「[技術/組件/API 名稱] 參考文件」
2. **Frontmatter**：填寫所有 YAML 欄位
3. **概述**：簡要描述與使用場景
4. **快速參考**：最常用操作的表格
5. **完整規格**：詳盡列出所有選項/參數
6. **範例**：最精簡可運作的範例
7. **參見**：連結到指南、解釋、相關參考

**最佳實踐：**

- 要詳盡完整（列出所有選項）
- 使用一致的格式（優先使用表格）
- 包含類型簽名
- 提供最精簡可運作的範例
- 保持描述的客觀性（不要寫成操作說明）
- 使用表格呈現結構化資料
- 包含有效/無效範例
- 記錄所有錯誤情況
- 連結到外部文件
- 內容變更時更新版本號和 changelog

**參考文件 vs 指南：**

- **參考文件**：「`enabled` 選項接受布林值（true/false）」
- **指南**：「若要啟用此功能，請在設定檔中設定 `enabled: true`」

參考文件陳述事實。指南展示如何使用。
