# 泰国旅行指南示例

这是一个完整的示例，展示如何使用 travel-page 框架创建泰国旅行指南应用。

## 概述

本示例展示了：
- 完整的旅程配置（由 Agent 生成）
- 多种卡片类型（封面、标准、参考）
- 时间线 section 按时间顺序展示事件
- 提示框 section 标记重要信息
- 可展开 section 展示详细内容
- 短语本 section 包含泰语短语
- 计时器功能
- 日记功能

## 文件说明

- `journey.json` - 主配置文件（Agent 生成）
- `assets/audio/` - 泰语音频文件
- `assets/images/` - 图片资源

## 使用方法

1. 将 `config/journey.json` 复制到根目录的 `config/` 目录
2. 将 `assets/` 文件夹复制到根目录
3. 打开 `index.html` 查看效果

## Agent 生成过程

本配置使用 `docs/AGENT_PROMPT.md` 指南生成。Agent：

1. 分析了泰国旅行相关材料
2. 提取了关键信息（日期、活动、联系方式）
3. 将内容组织为逻辑清晰的卡片结构
4. 生成了完整的 `journey.json` 配置

## 自定义

要自定义本示例：

1. 编辑 `journey.json` 修改内容
2. 替换 `assets/audio/` 中的音频文件
3. 在 `assets/images/` 中添加图片
4. 在 `app.theme` 中调整主题颜色

## 使用的功能

- **日记**：已启用，使用本地存储
- **计时器**：已启用，预设 15/30/45/60 分钟
- **短语本**：泰语短语，支持音频播放

## Schema 兼容性

本示例完全符合 `schema/journey.schema.json` 1.0.0 版本。
