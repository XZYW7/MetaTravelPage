# Plugin Development Guide

This guide explains how to develop custom plugins for the travel-page framework.

## Plugin Architecture

The framework uses a plugin system to extend functionality. Plugins are initialized based on the `features` configuration in `journey.json`.

## Built-in Plugins

### Diary Plugin (`core/diary.js`)

Manages personal diary/journal entries.

**Features:**
- Create and edit diary entries
- Rich text editing with Quill.js
- Image upload support
- Local and remote storage

**Configuration:**
```json
{
  "diary": {
    "enabled": true,
    "storage": "local",
    "backend_url": null
  }
}
```

### Timer Plugin (`core/timer.js`)

Provides countdown timer functionality.

**Features:**
- Configurable presets
- Start/pause/reset controls
- Vibration notification
- Customizable label

**Configuration:**
```json
{
  "timer": {
    "enabled": true,
    "presets": [15, 30, 45, 60],
    "label": "Timer"
  }
}
```

### Phrasebook Plugin (`core/phrasebook.js`)

Provides foreign language phrase playback.

**Features:**
- Audio file playback
- Phrase mapping from configuration
- Multiple language support

**Configuration:**
```json
{
  "phrasebook": {
    "enabled": true,
    "language": "Thai",
    "audio_path": "assets/audio/"
  }
}
```

## Creating a Custom Plugin

### Step 1: Create Plugin File

Create a new file in `core/` directory, e.g., `core/myplugin.js`.

```javascript
// ========== MY PLUGIN ==========
// Description of your plugin

let myPluginConfig = null;

function initMyPlugin(config) {
  if (!config) return;
  myPluginConfig = config;
  
  // Initialize your plugin
  console.log('My plugin initialized');
}

function myPluginFunction() {
  // Plugin functionality
}
```

### Step 2: Add Configuration Schema

Add your plugin configuration to the schema in `schema/journey.schema.json`:

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

### Step 3: Update Renderer

Update `core/renderer.js` to initialize your plugin:

```javascript
function initFeatures(features) {
  // ... existing code ...
  
  // Initialize your plugin if enabled
  if (features.myplugin?.enabled) {
    initMyPlugin(features.myplugin);
  }
}
```

### Step 4: Add to HTML

Add your plugin script to `index.html`:

```html
<script src="core/myplugin.js"></script>
```

## Plugin Interface

Each plugin should implement:

### Initialization Function

```javascript
function initPluginName(config) {
  // Initialize plugin with configuration
}
```

### Public Functions

```javascript
function pluginNameAction() {
  // Public API for the plugin
}
```

## Storage Integration

Plugins can use the storage adapter for persistence:

```javascript
const storage = getStorageAdapter();

// Save data
await storage.saveDiary(date, content);

// Load data
const data = await storage.getDiary(date);
```

## Event Handling

Plugins can listen to DOM events:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Plugin initialization
});

document.addEventListener('touchstart', (e) => {
  // Handle touch events
});
```

## Best Practices

1. **Configuration-Driven**: Use configuration to control plugin behavior
2. **Graceful Degradation**: Plugin should work even if config is missing
3. **Error Handling**: Handle errors gracefully without breaking the app
4. **Performance**: Minimize DOM operations and use efficient algorithms
5. **Documentation**: Document plugin API and configuration options

## Example: Weather Plugin

Here's an example of a weather plugin:

```javascript
// core/weather.js

let weatherConfig = null;
let weatherData = null;

function initWeather(config) {
  if (!config) return;
  weatherConfig = config;
  
  // Fetch weather data
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
    console.error('Failed to fetch weather:', error);
  }
}

function updateWeatherDisplay() {
  // Update UI with weather data
}
```

Configuration:
```json
{
  "weather": {
    "enabled": true,
    "api_key": "YOUR_API_KEY",
    "location": "Bangkok"
  }
}
```

## Troubleshooting

### Plugin Not Initializing

1. Check if plugin is enabled in configuration
2. Verify script is loaded in HTML
3. Check browser console for errors

### Plugin Functions Not Working

1. Ensure functions are globally accessible
2. Check for typos in function names
3. Verify configuration is valid

### Storage Issues

1. Check if storage adapter is initialized
2. Verify IndexedDB is available (for local storage)
3. Check network connectivity (for remote storage)
