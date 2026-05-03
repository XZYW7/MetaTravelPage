# Schema Documentation

This document provides detailed documentation for the `journey.schema.json` schema.

## Overview

The schema defines the structure for card-based journey/flow guide applications. It uses JSON Schema Draft-07.

## Root Properties

### schema_version
- **Type**: `string`
- **Required**: Yes
- **Value**: `"1.0.0"`
- **Description**: Schema version for compatibility management

### app
- **Type**: `object`
- **Required**: Yes
- **Description**: Application metadata and theme configuration

#### app.title
- **Type**: `string`
- **Required**: Yes
- **Description**: Application title displayed on cover and navigation

#### app.subtitle
- **Type**: `string`
- **Required**: No
- **Description**: Application subtitle or tagline

#### app.icon
- **Type**: `string`
- **Required**: No
- **Description**: Emoji or icon identifier for the application

#### app.theme
- **Type**: `object`
- **Required**: No
- **Description**: Visual theme configuration

##### app.theme.primary
- **Type**: `string`
- **Pattern**: `^#[0-9A-Fa-f]{6}$`
- **Description**: Primary accent color (hex)

##### app.theme.secondary
- **Type**: `string`
- **Pattern**: `^#[0-9A-Fa-f]{6}$`
- **Description**: Secondary accent color (hex)

##### app.theme.dark_mode
- **Type**: `boolean`
- **Description**: Whether dark mode is enabled by default

#### app.date_range
- **Type**: `object`
- **Required**: No
- **Description**: Date range for the journey/flow

##### app.date_range.start
- **Type**: `string`
- **Format**: `date`
- **Description**: Start date (YYYY-MM-DD)

##### app.date_range.end
- **Type**: `string`
- **Format**: `date`
- **Description**: End date (YYYY-MM-DD)

### features
- **Type**: `object`
- **Required**: No
- **Description**: Feature toggles and plugin configurations

#### features.diary
- **Type**: `object`
- **Description**: Diary/journal feature configuration

##### features.diary.enabled
- **Type**: `boolean`
- **Description**: Whether diary feature is enabled

##### features.diary.storage
- **Type**: `string`
- **Enum**: `["local", "remote"]`
- **Description**: Storage backend type

##### features.diary.backend_url
- **Type**: `string | null`
- **Description**: Remote backend URL (null for local storage)

#### features.timer
- **Type**: `object`
- **Description**: Timer/countdown plugin configuration

##### features.timer.enabled
- **Type**: `boolean`
- **Description**: Whether timer feature is enabled

##### features.timer.presets
- **Type**: `array` of `integer`
- **Description**: Timer preset values in minutes

##### features.timer.label
- **Type**: `string`
- **Description**: Timer display label

#### features.phrasebook
- **Type**: `object`
- **Description**: Phrasebook/audio playback plugin configuration

##### features.phrasebook.enabled
- **Type**: `boolean`
- **Description**: Whether phrasebook feature is enabled

##### features.phrasebook.language
- **Type**: `string`
- **Description**: Target language name

##### features.phrasebook.audio_path
- **Type**: `string`
- **Description**: Path to audio files directory

### cards
- **Type**: `array`
- **Required**: Yes
- **Min Items**: 1
- **Description**: Array of card definitions

## Card Types

### Cover Card

```json
{
  "id": "cover",
  "type": "cover",
  "sort_index": 1,
  "title": "Application Title",
  "subtitle": "Application Subtitle",
  "icon": "✈️",
  "date_range": "2026.01.01 — 2026.12.31",
  "download_link": {
    "text": "Download APK",
    "url": "app.apk"
  }
}
```

### Standard Card

```json
{
  "id": "day_1",
  "type": "standard",
  "sort_index": 1000,
  "date": "Day 1",
  "title": "First Day",
  "subtitle": "Description",
  "plugins": {
    "timer": {
      "enabled": true,
      "preset": 30,
      "label": "Timer"
    }
  },
  "sections": [...]
}
```

### Reference Card

```json
{
  "id": "reference",
  "type": "reference",
  "sort_index": 90000001,
  "title": "Quick Reference",
  "subtitle": "Essential Information",
  "sections": [...]
}
```

## Section Types

### Timeline Section

```json
{
  "type": "timeline",
  "title": "Timeline Title",
  "items": [
    {
      "time": "08:00",
      "content": "Event description",
      "variant": "default|success|warning|danger"
    }
  ]
}
```

### Table Section

```json
{
  "type": "table",
  "title": "Table Title",
  "headers": ["Column 1", "Column 2"],
  "rows": [
    ["Value 1", "Value 2"]
  ]
}
```

### Info Box Section

```json
{
  "type": "info_box",
  "variant": "info|warning|danger|success",
  "title": "Notice Title",
  "content": "Notice content (supports HTML)"
}
```

### Checklist Section

```json
{
  "type": "checklist",
  "title": "Checklist Title",
  "items": ["Item 1", "Item 2"]
}
```

### Expandable Section

```json
{
  "type": "expandable",
  "title": "Expandable Title",
  "content": "HTML content"
}
```

### Phrasebook Section

```json
{
  "type": "phrasebook",
  "title": "Language Phrases",
  "phrases": [
    {
      "id": "phrase_1",
      "中文": "Hello",
      "外语": "Bonjour",
      "发音": "Bon-zhoor",
      "audio": "hello.mp3"
    }
  ]
}
```

## Variants

### Timeline Item Variants
- `default`: Normal events
- `success`: Positive milestones
- `warning`: Caution needed
- `danger`: Critical alerts

### Info Box Variants
- `info`: General information
- `warning`: Caution notices
- `danger`: Critical warnings
- `success`: Positive confirmations

## Sort Index Guidelines

Use increments of 1000 for flexibility:
- Cover: `1`
- First card: `1000`
- Second card: `2000`
- Reference: `90000001`

## Validation

Use `core/validate.js` to validate configurations:

```javascript
const result = validateJourney(config);
if (result.valid) {
  console.log('Configuration is valid');
} else {
  console.error('Validation errors:', result.errors);
}
```
