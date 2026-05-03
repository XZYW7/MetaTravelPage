# 完整工作流指南

本指南介绍使用 travel-page 框架创建旅程/流程指南应用的完整工作流。

## 概述

工作流包含三个主要阶段：
1. **Agent 生成**：AI Agent 从材料生成配置
2. **资源准备**：开发者提供所需资源
3. **部署发布**：部署应用

## 工作流图

```
用户输入（旅行材料）
        ↓
   Agent 处理
   ├── 读取 schema/journey.schema.json
   ├── 读取 docs/AGENT_PROMPT.md
   └── 分析用户材料
        ↓
   Agent 输出
   ├── config/journey.json
   └── 资源需求清单
        ↓
   开发者操作
   ├── 提供音频文件
   ├── 提供图片资源
   └── 按需自定义
        ↓
   框架渲染
   └── 完整的旅程卡片应用
```

## 第 1 步：准备材料

以任意格式收集旅行/流程材料：
- 文本文档
- 网页
- PDF 文件
- 电子表格
- 笔记

**示例材料：**
- 旅行行程
- 酒店预订
- 航班信息
- 活动安排
- 联系方式
- 常用短语

## 第 2 步：Agent 生成

### 方式 A：使用 ChatGPT/Claude

1. 打开 AI 助手
2. 提供 `docs/AGENT_PROMPT.md` 中的系统提示词
3. 提供 `schema/journey.schema.json` 的 Schema 定义
4. 提供旅行材料
5. 让 Agent 生成 `journey.json`

**示例提示词：**
```
请为我的泰国旅行生成 journey.json 配置。

旅行材料：
- 第1天：抵达曼谷，入住酒店
- 第2天：大皇宫、卧佛寺、湄南河
- 第3天：购物、水上市场
- 第4天：飞往清迈，古城漫步
- 第5天：返程

需要泰语短语：
- 你好：สวัสดี
- 谢谢：ขอบคุณ
- 多少钱：เท่าไหร่
```

### 方式 B：使用框架校验

生成配置后进行校验：

```javascript
// 在浏览器控制台中
const response = await fetch('config/journey.json');
const config = await response.json();
const result = validateJourney(config);
console.log(result);
```

## 第 3 步：资源准备

根据 Agent 输出准备所需资源：

### 音频文件

如果配置包含短语本，提供音频文件：

```
assets/audio/
├── hello.mp3
├── thank_you.mp3
├── how_much.mp3
└── ...
```

**音频要求：**
- 格式：MP3
- 质量：128kbps 或更高
- 时长：每个短语 2-5 秒

### 图片资源

如果配置中引用了图片：

```
assets/images/
├── map.png
├── hotel.jpg
└── ...
```

**图片要求：**
- 格式：PNG、JPG 或 WebP
- 尺寸：针对移动端优化（最大宽度 1920px）
- 文件大小：每张图片不超过 500KB

## 第 4 步：配置

### 复制配置

将生成的 `journey.json` 复制到 `config/` 目录：

```bash
cp path/to/generated/journey.json config/
```

### 自定义主题

在 `journey.json` 中调整主题颜色：

```json
{
  "app": {
    "theme": {
      "primary": "#5BC0EB",
      "secondary": "#F5A9B8",
      "dark_mode": true
    }
  }
}
```

### 启用/禁用功能

根据需要切换功能：

```json
{
  "features": {
    "diary": { "enabled": true, "storage": "local" },
    "timer": { "enabled": false },
    "phrasebook": { "enabled": true }
  }
}
```

## 第 5 步：测试

### 本地测试

1. 在浏览器中打开 `index.html`
2. 测试卡片导航（滑动或方向键）
3. 测试插件（计时器、日记、短语本）
4. 在移动设备上测试

### 校验

在浏览器控制台运行校验：

```javascript
const response = await fetch('config/journey.json');
const config = await response.json();
const result = validateJourney(config);

if (result.valid) {
  console.log('✅ 配置有效');
} else {
  console.error('❌ 校验错误:', result.errors);
}
```

## 第 6 步：部署

### 静态托管

将整个目录上传到任意静态托管服务：

**GitHub Pages：**
```bash
git add .
git commit -m "部署旅行指南"
git push origin main
# 在仓库设置中启用 GitHub Pages
```

**Netlify：**
1. 连接 GitHub 仓库
2. 构建命令：留空
3. 发布目录：`.`
4. 部署

**Vercel：**
1. 导入 GitHub 仓库
2. 框架预设：Other
3. 部署

### 自定义域名

在托管服务商的设置中配置自定义域名。

## 第 7 步：分发

### 分享链接

将部署后的 URL 分享给用户。

### APK 生成（可选）

用于 Android 应用分发。

#### 前置条件

- 安装 Node.js（建议 v16+）
- 安装 Android Studio
- 安装 JDK 11+

#### 步骤

1. **安装 Capacitor 依赖**：
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. **初始化 Capacitor**：
   ```bash
   npx cap init "旅行指南" com.example.travelguide --web-dir .
   ```
   注意：`--web-dir .` 表示当前目录作为 Web 资源根目录。

3. **添加 Android 平台**：
   ```bash
   npx cap add android
   ```

4. **同步资源到 Android 项目**：
   ```bash
   npx cap sync
   ```
   每次修改 Web 资源后都需要执行此命令。

5. **打开 Android Studio**：
   ```bash
   npx cap open android
   ```

6. **在 Android Studio 中构建 APK**：
   - 菜单：Build → Build Bundle(s) / APK(s) → Build APK(s)
   - 等待构建完成
   - APK 输出路径：`android/app/build/outputs/apk/debug/app-debug.apk`

7. **安装到手机**：
   - 将 APK 传输到 Android 手机
   - 在手机上打开 APK 文件安装
   - 首次安装需要允许"未知来源"应用

#### 注意事项

- 调试版 APK 可以直接安装，不需要签名
- 发布到应用商店需要签名：Build → Generate Signed Bundle / APK
- 每次更新内容后需要重新执行 `npx cap sync` 并重新构建

## 示例工作流

### 输入材料

```
泰国旅行指南
- 曼谷和清迈 5 天
- 需要泰语短语
- 预算：¥8000
```

### Agent 输出

```json
{
  "schema_version": "1.0.0",
  "app": {
    "title": "泰国旅行指南",
    "subtitle": "5日自由行",
    "icon": "🇹🇭"
  },
  "features": {
    "phrasebook": { "enabled": true, "language": "泰语" }
  },
  "cards": [...]
}
```

### 开发者操作

1. 生成泰语音频文件
2. 添加目的地图片
3. 自定义主题颜色
4. 移动端测试

### 最终成果

一个美观的、可滑动的卡片式旅行指南应用，包含：
- 封面页
- 每日行程卡片
- 泰语短语本
- 重要信息卡片
- 日记功能
- 计时器功能

## 常见问题

### 配置未加载

1. 检查 `config/journey.json` 是否存在
2. 验证 JSON 语法是否有效
3. 查看浏览器控制台错误信息

### 音频不播放

1. 确认音频文件存在于 `assets/audio/`
2. 检查音频格式（推荐 MP3）
3. 确保文件名与配置匹配

### 样式问题

1. 清除浏览器缓存
2. 检查 CSS 文件是否加载
3. 验证主题配置

### 移动端问题

1. 在真机上测试
2. 检查 viewport meta 标签
3. 测试触摸交互

## 最佳实践

1. **从简单开始**：先用基本配置，后续再添加功能
2. **尽早测试**：在整个开发过程中在移动设备上测试
3. **经常校验**：每次修改配置后运行校验
4. **做好备份**：备份配置和资源文件
5. **记录变更**：记录自定义内容以便后续参考
