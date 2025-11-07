# [Technology/Component/API Name] Reference

---

title: [Full title]
type: reference
status: draft|review|stable|deprecated
audience: [developer, ai]
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
version: x.y.z (if applicable)
related:

- guides/how-to-use.md
- explanation/concept.md
- api/related-api.md
  ai_context: |
  Brief context about what this reference documents.

---

## Overview

**What this documents**: Brief description of the technology, component, or API.

**Use cases**:

- Use case 1
- Use case 2
- Use case 3

**Location**: `path/to/file` or URL (if applicable)

---

## Quick Reference

**Most common operations:**

| Operation   | Command/Code | Description       |
| ----------- | ------------ | ----------------- |
| Operation 1 | `command`    | Brief description |
| Operation 2 | `command`    | Brief description |
| Operation 3 | `command`    | Brief description |

---

## Complete Specification

### Option 1: [Name]

- **Type**: `string | number | boolean`
- **Default**: `defaultValue`
- **Required**: Yes | No
- **Description**: Detailed description of what this option does

**Example**:

```typescript
// Example usage
const example = {
  option1: "value",
};
```

---

### Option 2: [Name]

- **Type**: `string | number | boolean`
- **Default**: `defaultValue`
- **Required**: Yes | No
- **Description**: Detailed description

**Valid values**:

- `value1` - Description
- `value2` - Description
- `value3` - Description

**Example**:

```typescript
// Example usage
const example = {
  option2: "value1",
};
```

---

### Option 3: [Name]

(Continue for all options/parameters)

---

## API Endpoints (if applicable)

### GET /api/endpoint

**Description**: What this endpoint does.

**Request**:

**Headers**:

```
Content-Type: application/json
Authorization: Bearer <token> (if required)
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1 | string | Yes | Description |
| param2 | number | No | Description |

**Example Request**:

```bash
curl -X GET "https://api.example.com/endpoint?param1=value" \
  -H "Content-Type: application/json"
```

**Response**:

**Success (200)**:

```typescript
interface Response {
  data: string;
  status: "success";
}
```

**Example Response**:

```json
{
  "data": "example",
  "status": "success"
}
```

**Error Responses**:

| Status Code | Description  | Response Body            |
| ----------- | ------------ | ------------------------ |
| 400         | Bad Request  | `{ "error": "message" }` |
| 401         | Unauthorized | `{ "error": "message" }` |
| 500         | Server Error | `{ "error": "message" }` |

---

### POST /api/endpoint

(Document additional endpoints)

---

## Configuration (if applicable)

### Configuration File

**Location**: `path/to/config.file`

**Format**: JSON | YAML | TypeScript

**Structure**:

```typescript
interface Config {
  option1: string;
  option2: number;
  option3?: boolean;
}
```

**Complete Example**:

```json
{
  "option1": "value",
  "option2": 42,
  "option3": true
}
```

**Configuration Options**:

| Option  | Type    | Default | Description           |
| ------- | ------- | ------- | --------------------- |
| option1 | string  | -       | Required option       |
| option2 | number  | 42      | Optional with default |
| option3 | boolean | false   | Optional setting      |

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

**Properties**:

- **property1**: `string` - Description of property
- **property2**: `number` - Description of property
- **property3**: `boolean` (optional) - Description of property

---

### Type Name 2

(Document all types)

---

## Examples

### Example 1: [Common Use Case]

**Scenario**: What you're trying to achieve.

```typescript
// Complete working example
const example = "implementation";
```

**Output**:

```
Expected output
```

---

### Example 2: [Advanced Use Case]

**Scenario**: What you're trying to achieve.

```typescript
// Complete working example
const advanced = "implementation";
```

---

## Validation Rules (if applicable)

| Rule   | Description | Example Valid | Example Invalid |
| ------ | ----------- | ------------- | --------------- |
| Rule 1 | Description | `valid`       | `invalid`       |
| Rule 2 | Description | `valid`       | `invalid`       |

---

## Performance Considerations

- 📊 **Performance note 1**: Description
- 📊 **Performance note 2**: Description
- ⚡ **Optimization tip**: Description

---

## Compatibility

**Supported versions**:

- Technology A: >= x.y.z
- Technology B: >= x.y.z

**Known issues**:

- Issue 1 with version X
- Issue 2 with configuration Y

---

## See Also

### Guides

- [How to Use [Technology]](../guides/how-to-use.md) - Practical usage

### Explanation

- [Why [Technology] Works This Way](../explanation/concept.md) - Concepts

### Related Reference

- [Related Technology Reference](./related-tech.md)
- [Related API Reference](./api/related-api.md)

### External Documentation

- [Official Documentation](https://example.com/docs)
- [API Documentation](https://example.com/api)

---

## Changelog (if applicable)

### Version x.y.z (YYYY-MM-DD)

- Added feature 1
- Changed behavior of option 2
- Fixed issue with option 3
- Deprecated option 4

---

## Template Instructions (Remove this section)

**How to use this reference template:**

1. **Title**: Use format "[Technology/Component/API Name] Reference"
2. **Frontmatter**: Fill in all YAML fields
3. **Overview**: Brief description and use cases
4. **Quick Reference**: Table of most common operations
5. **Complete Specification**: Exhaustive list of all options/parameters
6. **Examples**: Minimal working examples
7. **See Also**: Link to guides, explanations, related refs

**Best practices:**

- Be exhaustively complete (list ALL options)
- Use consistent formatting (tables preferred)
- Include type signatures
- Provide minimal working examples
- Keep descriptions factual (no "how-to" instructions)
- Use tables for structured data
- Include valid/invalid examples
- Document all error cases
- Link to external docs
- Update version and changelog when content changes

**Reference vs Guide:**

- **Reference**: "The `enabled` option accepts boolean values (true/false)"
- **Guide**: "To enable the feature, set `enabled: true` in your config"

Reference states facts. Guide shows how to use them.
