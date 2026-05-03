# MetaTravelPage - 通用旅程/流程指南应用框架

一个通用的卡片式旅程/流程指南应用框架。可以将任何旅行行程、康复指南、流程文档转化为美观的滑动卡片式移动端应用。

## 功能特点

- **数据驱动**：通过 JSON 配置文件定义内容
- **Agent 友好**：AI Agent 可从文本材料自动生成配置
- **插件系统**：计时器、日记、语音短语本等
- **响应式设计**：支持移动端和桌面端
- **深色模式**：自动适配深色/浅色主题
- **离线支持**：日记和数据可本地存储
- **易于部署**：纯静态文件，无需服务器（可选后端）

## 快速开始

1. 克隆仓库：
   ```bash
   git clone https://github.com/XZYW7/MetaTravelPage.git
   cd MetaTravelPage
   ```

2. 启动本地服务器：
   ```bash
   start-server.bat
   # 或者
   python -m http.server 8000
   ```

3. 打开浏览器访问 http://localhost:8000

4. 编辑 `config/journey.json` 自定义内容

## 项目结构

```
MetaTravelPage/
├── core/                        # 核心引擎（不要修改）
│   ├── renderer.js             # 动态渲染引擎
│   ├── swipe.js                # 卡片滑动逻辑
│   ├── calendar.js             # 日历组件
│   ├── diary.js                # 日记管理
│   ├── timer.js                # 计时器插件
│   ├── phrasebook.js           # 语音短语本插件
│   ├── storage.js              # 存储适配器
│   └── validate.js             # Schema 校验
├── config/                      # 配置文件（自定义此目录）
│   └── journey.json            # 应用配置
├── examples/                    # 示例配置（仅作参考）
│   └── thailand-travel/        # 泰国旅行指南示例
├── assets/                      # 静态资源
│   ├── audio/                  # 音频文件
│   └── images/                 # 图片文件
├── schema/                      # JSON Schema
│   └── journey.schema.json
├── docs/                        # 文档
│   ├── AGENT_PROMPT.md         # Agent 配置生成指南
│   ├── SCHEMA.md               # Schema 文档
│   ├── PLUGINS.md              # 插件开发指南
│   └── WORKFLOW.md             # 完整工作流指南
├── index.html                  # 主页面（骨架）
├── styles.css                  # 样式
├── server.py                   # 可选后端
├── start-server.bat            # 启动本地服务器
├── capacitor.config.json       # Capacitor 配置（APK 打包用）
└── README.md                   # 本文件
```

## 工作原理

1. **定义内容**：创建 `journey.json` 配置文件
2. **动态渲染**：框架读取配置并生成卡片 DOM
3. **用户交互**：用户滑动卡片、使用插件、写日记

## Agent 工作流

本框架专为与 AI Agent 协作设计：

1. Agent 读取 `schema/journey.schema.json` 了解结构
2. Agent 读取 `docs/AGENT_PROMPT.md` 了解生成规范
3. Agent 分析用户提供的旅行材料
4. Agent 生成 `journey.json` 配置文件
5. 框架将配置渲染为美观的应用

详细流程请参考 [完整工作流指南](docs/WORKFLOW.md)。

## 配置说明

### 基本结构

```json
{
  "schema_version": "1.0.0",
  "app": {
    "title": "我的旅行指南",
    "subtitle": "一段美好的旅程",
    "icon": "✈️"
  },
  "features": {
    "diary": { "enabled": true, "storage": "local" },
    "timer": { "enabled": true },
    "phrasebook": { "enabled": true }
  },
  "cards": [...]
}
```

### 存储模式

日记功能支持两种存储模式：

| 模式 | 配置 | 说明 |
|------|------|------|
| 本地存储 | `"storage": "local"` | 保存在浏览器 IndexedDB，换浏览器或清缓存会丢失 |
| 云端存储 | `"storage": "remote"` + `"backend_url"` | 保存到 `server.py` 服务器的 `diaries/` 目录 |

配置示例：
```json
{
  "diary": {
    "enabled": true,
    "storage": "remote",
    "backend_url": "http://localhost:5000"
  }
}
```

使用云端存储需要启动后端：
```bash
python server.py
```

### 卡片类型

- **cover**：封面页，包含标题和图标
- **standard**：主要内容卡片，包含多个 section
- **reference**：附录/速查卡片

### Section 类型

- **timeline**：时间线，按时间顺序展示事件
- **table**：表格，展示结构化数据
- **info_box**：提示框（info/warning/danger/success 四种样式）
- **checklist**：清单，待办事项列表
- **expandable**：可展开内容，点击展开/收起
- **phrasebook**：短语本，外语短语带发音

## 示例

查看 `examples/thailand-travel/` 目录，这是一个完整的泰国旅行指南示例。

切换到 `example` 分支可以查看完整运行效果：
```bash
git checkout example
start-server.bat
```

## 部署

### 静态托管

将整个目录上传到任意静态托管服务即可：
- GitHub Pages
- Netlify
- Vercel
- 任意 Web 服务器

### 使用后端（可选）

如需跨设备同步日记，部署 `server.py`：

```bash
python server.py
```

服务默认运行在 5000 端口。

### 打包 APK

使用 Capacitor 将 Web 应用打包为 Android APK：

1. 安装依赖：
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. 初始化 Capacitor：
   ```bash
   npx cap init "旅行指南" com.example.travelguide
   ```

3. 添加 Android 平台：
   ```bash
   npx cap add android
   ```

4. 同步资源：
   ```bash
   npx cap sync
   ```

5. 打开 Android Studio：
   ```bash
   npx cap open android
   ```

6. 在 Android Studio 中构建 APK：
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - APK 输出路径：`android/app/build/outputs/apk/debug/app-debug.apk`

## 文档

- [Agent 配置生成指南](docs/AGENT_PROMPT.md) - 如何使用 AI Agent 生成配置
- [Schema 文档](docs/SCHEMA.md) - 详细的 Schema 参考
- [插件开发指南](docs/PLUGINS.md) - 如何开发自定义插件
- [完整工作流指南](docs/WORKFLOW.md) - 从材料到应用的完整流程

## 贡献

1. Fork 本仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

---

> 本项目使用 [opencode](https://opencode.ai) 协作开发。
