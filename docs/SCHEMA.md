# Schema 文档

本文档详细说明 `journey.schema.json` 的结构。

## 概述

该 Schema 定义了卡片式旅程/流程指南应用的配置结构，使用 JSON Schema Draft-07。

## 根属性

### schema_version
- **类型**：`string`
- **必需**：是
- **值**：`"1.0.0"`
- **说明**：Schema 版本，用于兼容性管理

### app
- **类型**：`object`
- **必需**：是
- **说明**：应用元数据和主题配置

#### app.title
- **类型**：`string`
- **必需**：是
- **说明**：应用标题，显示在封面和导航栏

#### app.subtitle
- **类型**：`string`
- **必需**：否
- **说明**：应用副标题或标语

#### app.icon
- **类型**：`string`
- **必需**：否
- **说明**：应用图标（Emoji 或图标标识符）

#### app.theme
- **类型**：`object`
- **必需**：否
- **说明**：视觉主题配置

##### app.theme.primary
- **类型**：`string`
- **格式**：十六进制颜色值（如 `#5BC0EB`）
- **说明**：主色调

##### app.theme.secondary
- **类型**：`string`
- **格式**：十六进制颜色值
- **说明**：次要色调

##### app.theme.dark_mode
- **类型**：`boolean`
- **说明**：是否默认启用深色模式

#### app.date_range
- **类型**：`object`
- **必需**：否
- **说明**：旅程/流程的日期范围

##### app.date_range.start
- **类型**：`string`
- **格式**：`date`（YYYY-MM-DD）
- **说明**：开始日期

##### app.date_range.end
- **类型**：`string`
- **格式**：`date`（YYYY-MM-DD）
- **说明**：结束日期

### features
- **类型**：`object`
- **必需**：否
- **说明**：功能开关和插件配置

#### features.diary
- **类型**：`object`
- **说明**：日记功能配置

| 字段 | 类型 | 说明 |
|------|------|------|
| enabled | boolean | 是否启用日记功能 |
| storage | string | 存储类型：`"local"` 或 `"remote"` |
| backend_url | string\|null | 远程后端地址（本地存储时为 null） |

#### features.timer
- **类型**：`object`
- **说明**：计时器插件配置

| 字段 | 类型 | 说明 |
|------|------|------|
| enabled | boolean | 是否启用计时器 |
| presets | array | 预设时间值（分钟） |
| label | string | 计时器显示标签 |

#### features.phrasebook
- **类型**：`object`
- **说明**：语音短语本插件配置

| 字段 | 类型 | 说明 |
|------|------|------|
| enabled | boolean | 是否启用短语本 |
| language | string | 目标语言名称 |
| audio_path | string | 音频文件目录路径 |

### cards
- **类型**：`array`
- **必需**：是
- **最少项数**：1
- **说明**：卡片定义数组

## 卡片类型

### 封面卡片 (cover)

```json
{
  "id": "cover",
  "type": "cover",
  "sort_index": 1,
  "title": "应用标题",
  "subtitle": "应用副标题",
  "icon": "✈️",
  "date_range": "2026.01.01 — 2026.12.31",
  "download_link": {
    "text": "下载 APK",
    "url": "app.apk"
  }
}
```

### 标准卡片 (standard)

```json
{
  "id": "day_1",
  "type": "standard",
  "sort_index": 1000,
  "date": "第1天",
  "title": "卡片标题",
  "subtitle": "卡片副标题",
  "plugins": {
    "timer": {
      "enabled": true,
      "preset": 30,
      "label": "计时器"
    }
  },
  "sections": [...]
}
```

### 参考卡片 (reference)

```json
{
  "id": "reference",
  "type": "reference",
  "sort_index": 90000001,
  "title": "实用信息",
  "subtitle": "随时翻看的备忘",
  "sections": [...]
}
```

## Section 类型

### timeline（时间线）

```json
{
  "type": "timeline",
  "title": "时间线标题",
  "items": [
    {
      "time": "08:00",
      "content": "事件描述",
      "variant": "default|success|warning|danger"
    }
  ]
}
```

### table（表格）

```json
{
  "type": "table",
  "title": "表格标题",
  "headers": ["列1", "列2"],
  "rows": [
    ["值1", "值2"]
  ]
}
```

### info_box（提示框）

```json
{
  "type": "info_box",
  "variant": "info|warning|danger|success",
  "title": "提示标题",
  "content": "提示内容（支持 HTML）"
}
```

### checklist（清单）

```json
{
  "type": "checklist",
  "title": "清单标题",
  "items": ["项目1", "项目2"]
}
```

### expandable（可展开）

```json
{
  "type": "expandable",
  "title": "展开标题",
  "content": "HTML 内容"
}
```

### phrasebook（短语本）

```json
{
  "type": "phrasebook",
  "title": "语言短语",
  "phrases": [
    {
      "id": "phrase_1",
      "中文": "你好",
      "外语": "Bonjour",
      "发音": "Bon-zhoor",
      "audio": "hello.mp3"
    }
  ]
}
```

## Variant 值

### 时间线 variant
- `default`：普通事件
- `success`：积极里程碑
- `warning`：需要注意
- `danger`：关键警告

### 提示框 variant
- `info`：一般信息
- `warning`：注意事项
- `danger`：严重警告
- `success`：成功确认

## 排序索引规则

使用 1000 的倍数以留出灵活性：
- 封面：`1`
- 第一个内容卡片：`1000`
- 第二个内容卡片：`2000`
- 参考卡片：`90000001`

日期卡片会自动从日期计算排序值（如 "6月15日" → `6150`）。

## 校验

使用 `core/validate.js` 校验配置：

```javascript
const result = validateJourney(config);
if (result.valid) {
  console.log('配置有效');
} else {
  console.error('校验错误:', result.errors);
}
```
