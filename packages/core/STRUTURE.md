```
packages/core/
├── src/
│ ├── features/ # 🎯 Feature-based organization
│ │ ├── config/ # Configuration management
│ │ │ ├── index.ts # Main exports
│ │ │ ├── loader.ts # Config loading logic
│ │ │ ├── schema.ts # Zod schemas & validation
│ │ │ └── types.ts # Config-specific types
│ │ ├── figma/ # Figma API integration
│ │ │ ├── index.ts # Main exports
│ │ │ ├── client.ts # Figma API client
│ │ │ ├── parser.ts # URL parsing & utilities
│ │ │ └── types.ts # Figma-specific types
│ │ ├── cache/ # Caching system
│ │ │ ├── index.ts # Main exports
│ │ │ ├── node-cache.ts # Node.js cache implementation
│ │ │ └── types.ts # Cache-specific types
│ │ ├── fetch/ # Icon fetching
│ │ │ ├── index.ts # Main exports
│ │ │ ├── download.ts # Download logic
│ │ │ ├── document.ts # Document fetching
│ │ │ └── types.ts # Fetch-specific types
│ │ └── generate/ # Code generation
│ │ ├── index.ts # Main exports
│ │ ├── react.ts # React component generation
│ │ ├── sprite.ts # SVG sprite generation
│ │ └── types.ts # Generation types
│ ├── cli/ # 🖥️ CLI commands
│ │ ├── index.ts # CLI setup & routing
│ │ ├── fetch.ts # Fetch command
│ │ ├── cache.ts # Cache management commands
│ │ └── utils.ts # CLI utilities
│ └──
└──
```
