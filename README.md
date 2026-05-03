# Travel Page Framework

A generic card-based journey/flow guide application framework. Transform any travel itinerary, recovery guide, or process documentation into a beautiful, swipeable card-based mobile application.

## Features

- **Data-Driven**: Content defined in JSON configuration
- **Agent-Friendly**: AI agents can generate configurations from text materials
- **Plugin System**: Timer, diary, phrasebook, and more
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode**: Automatic dark/light theme support
- **Offline Support**: Local storage for diaries and data
- **Easy Deployment**: Static files, no server required (optional backend available)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/XZYW7/travel-page.git
   cd travel-page
   ```

2. Open `index.html` in a browser

3. Edit `config/journey.json` to customize your content

## Project Structure

```
travel-page/
├── core/                        # Core engine (don't modify)
│   ├── renderer.js             # Dynamic rendering engine
│   ├── swipe.js                # Card swipe logic
│   ├── calendar.js             # Calendar component
│   ├── diary.js                # Diary management
│   ├── timer.js                # Timer plugin
│   ├── phrasebook.js           # Phrasebook plugin
│   ├── storage.js              # Storage adapter
│   └── validate.js             # Schema validation
├── config/                      # Configuration (customize this)
│   └── journey.json            # Application config
├── examples/                    # Example configurations
│   └── thailand-travel/        # Thailand travel guide example
├── assets/                      # Static resources
│   ├── audio/                  # Audio files
│   └── images/                 # Image files
├── schema/                      # JSON Schema
│   └── journey.schema.json
├── docs/                        # Documentation
│   ├── AGENT_PROMPT.md         # Agent configuration guide
│   ├── SCHEMA.md               # Schema documentation
│   └── PLUGINS.md              # Plugin development guide
├── index.html                  # Main page (skeleton)
├── styles.css                  # Styles
├── server.py                   # Optional backend
└── README.md                   # This file
```

## How It Works

1. **Define Content**: Create a `journey.json` configuration file
2. **Dynamic Rendering**: The framework reads the config and generates card DOM
3. **User Interaction**: Users swipe through cards, use plugins, write diaries

## Agent Workflow

This framework is designed to work with AI agents:

1. Agent reads `schema/journey.schema.json` for structure
2. Agent reads `docs/AGENT_PROMPT.md` for generation guidelines
3. Agent analyzes user-provided travel materials
4. Agent generates `journey.json` configuration
5. Framework renders the configuration into a beautiful app

## Configuration

### Basic Structure

```json
{
  "schema_version": "1.0.0",
  "app": {
    "title": "My Travel Guide",
    "subtitle": "A beautiful journey",
    "icon": "✈️"
  },
  "features": {
    "diary": { "enabled": true },
    "timer": { "enabled": true },
    "phrasebook": { "enabled": true }
  },
  "cards": [
    {
      "id": "cover",
      "type": "cover",
      "title": "My Travel Guide"
    },
    {
      "id": "day_1",
      "type": "standard",
      "date": "Day 1",
      "title": "First Day",
      "sections": [...]
    }
  ]
}
```

### Card Types

- **cover**: Landing page with title and icon
- **standard**: Main content cards with sections
- **reference**: Appendix/quick reference cards

### Section Types

- **timeline**: Chronological events
- **table**: Structured data
- **info_box**: Important notices (info/warning/danger/success)
- **checklist**: Task/item lists
- **expandable**: Collapsible content
- **phrasebook**: Foreign language phrases with audio

## Examples

See `examples/thailand-travel/` for a complete example of a Thailand travel guide.

### Using the Example

**Option 1: PowerShell Script**
```powershell
.\use-example.ps1
```

**Option 2: Manual Copy**
```bash
# Copy config
copy examples\thailand-travel\journey.json config\journey.json

# Copy audio files
xcopy /E /I /Y examples\thailand-travel\assets\audio assets\audio
```

**Option 3: Direct Reference**
Edit `config/journey.json` and point to the example:
```json
{
  "$ref": "examples/thailand-travel/journey.json"
}
```

## Documentation

- [Agent Prompt Guide](docs/AGENT_PROMPT.md) - How to use AI agents to generate configs
- [Schema Documentation](docs/SCHEMA.md) - Detailed schema reference
- [Plugin Guide](docs/PLUGINS.md) - How to develop custom plugins

## Deployment

### Static Hosting

Simply upload the entire directory to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server

### With Backend (Optional)

For diary sync across devices, deploy `server.py`:

```bash
python server.py
```

The server runs on port 5000 by default.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built with ❤️ for travelers, patients, and anyone who needs a beautiful step-by-step guide.
