# 插件开发指南

本指南介绍如何为 MetaTravelPage 框架开发自定义插件。

## 插件架构

框架使用插件系统扩展功能。插件根据 `journey.json` 中的 `features` 配置进行初始化。

## 内置插件

### 日记插件 (`core/diary.js`)

管理个人日记/日志条目。

**功能：**
- 创建和编辑日记条目
- 富文本编辑（Quill.js）
- 图片上传支持
- 本地和云端存储

**配置：**
```json
{
  "diary": {
    "enabled": true,
    "storage": "local",
    "backend_url": null
  }
}
```

### 计时器插件 (`core/timer.js`)

提供倒计时功能。

**功能：**
- 可配置的预设时间
- 开始/暂停/重置控制
- 振动通知
- 可自定义标签

**配置：**
```json
{
  "timer": {
    "enabled": true,
    "presets": [15, 30, 45, 60],
    "label": "计时器"
  }
}
```

### 短语本插件 (`core/phrasebook.js`)

提供外语短语播放功能。

**功能：**
- 音频文件播放
- 从配置映射短语
- 支持多语言

**配置：**
```json
{
  "phrasebook": {
    "enabled": true,
    "language": "泰语",
    "audio_path": "assets/audio/"
  }
}
```

## 创建自定义插件

### 第 1 步：创建插件文件

在 `core/` 目录下创建新文件，如 `core/myplugin.js`。

```javascript
// ========== 我的插件 ==========
// 插件描述

let myPluginConfig = null;

function initMyPlugin(config) {
  if (!config) return;
  myPluginConfig = config;
  
  // 初始化插件
  console.log('插件已初始化');
}

function myPluginFunction() {
  // 插件功能
}
```

### 第 2 步：添加配置 Schema

在 `schema/journey.schema.json` 中添加插件配置：

```json
{
  "features": {
    "myplugin": {
      "type": "object",
      "properties": {
        "enabled": {
          "type": "boolean"
        },
        "option1": {
          "type": "string"
        }
      }
    }
  }
}
```

### 第 3 步：更新渲染器

在 `core/renderer.js` 中初始化插件：

```javascript
function initFeatures(features) {
  // ... 现有代码 ...
  
  // 如果启用则初始化你的插件
  if (features.myplugin?.enabled) {
    initMyPlugin(features.myplugin);
  }
}
```

### 第 4 步：添加到 HTML

在 `index.html` 中添加插件脚本：

```html
<script src="core/myplugin.js"></script>
```

## 插件接口

每个插件应实现：

### 初始化函数

```javascript
function initPluginName(config) {
  // 使用配置初始化插件
}
```

### 公共函数

```javascript
function pluginNameAction() {
  // 插件的公共 API
}
```

## 存储集成

插件可以使用存储适配器进行数据持久化：

```javascript
const storage = getStorageAdapter();

// 保存数据
await storage.saveDiary(date, content);

// 加载数据
const data = await storage.getDiary(date);
```

## 事件处理

插件可以监听 DOM 事件：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 插件初始化
});

document.addEventListener('touchstart', (e) => {
  // 处理触摸事件
});
```

## 最佳实践

1. **配置驱动**：使用配置控制插件行为
2. **优雅降级**：即使配置缺失，插件也应正常工作
3. **错误处理**：优雅处理错误，不影响应用运行
4. **性能优化**：减少 DOM 操作，使用高效算法
5. **文档完善**：记录插件 API 和配置选项

## 示例：天气插件

天气插件示例：

```javascript
// core/weather.js

let weatherConfig = null;
let weatherData = null;

function initWeather(config) {
  if (!config) return;
  weatherConfig = config;
  
  // 获取天气数据
  fetchWeather();
}

async function fetchWeather() {
  if (!weatherConfig.api_key) return;
  
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${weatherConfig.api_key}&q=${weatherConfig.location}`
    );
    weatherData = await response.json();
    updateWeatherDisplay();
  } catch (error) {
    console.error('获取天气失败:', error);
  }
}

function updateWeatherDisplay() {
  // 使用天气数据更新 UI
}
```

配置：
```json
{
  "weather": {
    "enabled": true,
    "api_key": "YOUR_API_KEY",
    "location": "曼谷"
  }
}
```

## 常见问题

### 插件未初始化

1. 检查配置中是否启用了插件
2. 确认脚本已在 HTML 中加载
3. 查看浏览器控制台是否有错误

### 插件函数不工作

1. 确保函数是全局可访问的
2. 检查函数名是否拼写正确
3. 验证配置是否有效

### 存储问题

1. 检查存储适配器是否已初始化
2. 验证 IndexedDB 是否可用（本地存储）
3. 检查网络连接（云端存储）
