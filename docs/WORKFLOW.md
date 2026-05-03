# Complete Workflow Guide

This guide describes the complete workflow for creating a journey/flow guide application using the travel-page framework.

## Overview

The workflow consists of three main stages:
1. **Agent Generation**: AI agent generates configuration from materials
2. **Asset Preparation**: Developer provides required assets
3. **Deployment**: Deploy the application

## Workflow Diagram

```
User Input (Travel Materials)
        ↓
   Agent Processing
   ├── Read schema/journey.schema.json
   ├── Read docs/AGENT_PROMPT.md
   └── Analyze user materials
        ↓
   Agent Output
   ├── config/journey.json
   └── Asset requirements list
        ↓
   Developer Action
   ├── Provide audio files
   ├── Provide images
   └── Customize as needed
        ↓
   Framework Rendering
   └── Complete journey card application
```

## Step 1: Prepare Materials

Gather your travel/flow materials in any format:
- Text documents
- Web pages
- PDFs
- Spreadsheets
- Notes

**Example Materials:**
- Travel itinerary
- Hotel bookings
- Flight details
- Activity schedules
- Contact information
- Important phrases

## Step 2: Agent Generation

### Option A: Using ChatGPT/Claude

1. Open your AI assistant
2. Provide the System Prompt from `docs/AGENT_PROMPT.md`
3. Provide the Schema from `schema/journey.schema.json`
4. Provide your travel materials
5. Ask the agent to generate `journey.json`

**Example Prompt:**
```
Please generate a journey.json configuration for my Thailand travel guide.

Here are my travel materials:
- Day 1: Arrive Bangkok, check into hotel
- Day 2: Visit Grand Palace, Wat Pho
- Day 3: Floating market tour
- Day 4: Beach day in Pattaya
- Day 5: Return home

I need Thai language phrases for:
- Hello: สวัสดี
- Thank you: ขอบคุณ
- How much: เท่าไหร่
```

### Option B: Using the Framework's Validation

After generating the configuration, validate it:

```javascript
// In browser console
const response = await fetch('config/journey.json');
const config = await response.json();
const result = validateJourney(config);
console.log(result);
```

## Step 3: Asset Preparation

Based on the agent's output, prepare required assets:

### Audio Files

If the configuration includes a phrasebook, provide audio files:

```
assets/audio/
├── hello.mp3
├── thank_you.mp3
├── how_much.mp3
└── ...
```

**Audio Requirements:**
- Format: MP3
- Quality: 128kbps or higher
- Duration: 2-5 seconds per phrase

### Images

If the configuration includes image references:

```
assets/images/
├── map.png
├── hotel.jpg
└── ...
```

**Image Requirements:**
- Format: PNG, JPG, or WebP
- Size: Optimize for mobile (max 1920px width)
- File size: Keep under 500KB per image

## Step 4: Configuration

### Copy Configuration

Copy the generated `journey.json` to the `config/` directory:

```bash
cp path/to/generated/journey.json config/
```

### Customize Theme

Adjust theme colors in `journey.json`:

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

### Enable/Disable Features

Toggle features as needed:

```json
{
  "features": {
    "diary": { "enabled": true },
    "timer": { "enabled": false },
    "phrasebook": { "enabled": true }
  }
}
```

## Step 5: Testing

### Local Testing

1. Open `index.html` in a browser
2. Test card navigation (swipe or arrow keys)
3. Test plugins (timer, diary, phrasebook)
4. Test on mobile devices

### Validation

Run validation in browser console:

```javascript
const response = await fetch('config/journey.json');
const config = await response.json();
const result = validateJourney(config);

if (result.valid) {
  console.log('✅ Configuration is valid');
} else {
  console.error('❌ Validation errors:', result.errors);
}
```

## Step 6: Deployment

### Static Hosting

Upload the entire directory to any static hosting:

**GitHub Pages:**
```bash
git add .
git commit -m "Deploy travel guide"
git push origin main
# Enable GitHub Pages in repository settings
```

**Netlify:**
1. Connect your GitHub repository
2. Set build command: (leave empty)
3. Set publish directory: `.`
4. Deploy

**Vercel:**
1. Import your GitHub repository
2. Framework preset: Other
3. Deploy

### Custom Domain

Configure custom domain in your hosting provider's settings.

## Step 7: Distribution

### Share Link

Share the deployed URL with users.

### APK Generation (Optional)

For Android app distribution:

1. Use Capacitor to wrap the web app
2. Build APK:
   ```bash
   npx cap init
   npx cap add android
   npx cap sync
   npx cap open android
   ```

## Example Workflow

### Input Materials

```
Thailand Travel Guide
- 5 days in Bangkok and Pattaya
- Need Thai phrases
- Budget: $1000
```

### Agent Output

```json
{
  "schema_version": "1.0.0",
  "app": {
    "title": "Thailand Travel Guide",
    "subtitle": "5-Day Adventure",
    "icon": "🇹🇭"
  },
  "features": {
    "phrasebook": { "enabled": true, "language": "Thai" }
  },
  "cards": [...]
}
```

### Developer Action

1. Generate Thai language audio files
2. Add images of destinations
3. Customize theme colors
4. Test on mobile

### Final Result

A beautiful, swipeable card-based travel guide application with:
- Cover page
- Daily itinerary cards
- Thai language phrasebook
- Important information cards
- Diary functionality
- Timer for activities

## Troubleshooting

### Configuration Not Loading

1. Check `config/journey.json` exists
2. Verify JSON syntax is valid
3. Check browser console for errors

### Audio Not Playing

1. Verify audio files exist in `assets/audio/`
2. Check audio file format (MP3 recommended)
3. Ensure file names match configuration

### Styling Issues

1. Clear browser cache
2. Check CSS file is loaded
3. Verify theme configuration

### Mobile Issues

1. Test on actual device
2. Check viewport meta tag
3. Test touch interactions

## Best Practices

1. **Start Simple**: Begin with basic configuration, add features later
2. **Test Early**: Test on mobile devices throughout development
3. **Validate Often**: Run validation after each configuration change
4. **Backup**: Keep backups of your configuration and assets
5. **Document**: Document any customizations for future reference
