# @iconsync/core

A powerful tool for synchronizing Figma icons with your codebase. Fetch icons from Figma and generate React components automatically.

[![Documentation](https://img.shields.io/badge/docs-visit-blue.svg)](https://iconsync-docs.vercel.app/)

## Documentation

For full documentation, visit [https://iconsync-docs.vercel.app/](https://iconsync-docs.vercel.app/)

## Installation

```bash
# npm
npm install @iconsync/core

# yarn
yarn add @iconsync/core

# pnpm
pnpm add @iconsync/core
```

## Usage

### 1. Create a configuration file

Create an `icon.config.ts` file in your project root:

```typescript
import { iconConfig } from "@iconsync/core";

export default iconConfig({
  figma: {
    token: process.env.FIGMA_TOKEN!, // Your Figma API token
    url: "https://www.figma.com/design/YOUR_FILE_ID/YOUR_FILE_NAME?node-id=YOUR_NODE_ID",
    // Alternatively, you can specify fileId and nodeId directly:
    // fileId: "YOUR_FILE_ID",
    // nodeId: "YOUR_NODE_ID",
  },
  fetch: {
    concurrentDownloads: 5, // Number of concurrent downloads
    // Optional configurations:
    // nodeTypes: ["COMPONENT", "COMPONENT_SET"], // Types of nodes to fetch
    // generateFileName: (node, parentNode) => node.name + "--" + parentNode.name, // Custom filename generator
    // sanitizeName: true, // Sanitize filenames
    // limit: 10, // Limit the number of icons to fetch
  },
  generator: {
    icon: true, // Generate icon components
    typescript: true, // Generate TypeScript files
    titleProp: true, // Add title prop to components
    dimensions: false, // Include width/height dimensions
    expandProps: "end", // Position of expanded props
    replaceAttrValues: {
      "#000000": "currentColor", // Replace specific colors
      "#fff": "currentColor",
    },
    outDir: "src/components/icons", // Output directory
    ext: "tsx", // File extension
    prettier: true, // Format with Prettier
    memo: false, // Use React.memo
    ref: false, // Forward refs
    filenameCase: "camel", // Filename case style: "pascal", "camel", "kebab", "snake"
  },
});
```

### 2. Add scripts to your package.json

```json
{
  "scripts": {
    "icon:fetch": "iconsync fetch",
    "icon:cache:stats": "iconsync cache:stats",
    "icon:cache:clear": "iconsync cache:clear",
    "icon:generate": "iconsync generator"
  }
}
```

### 3. Set up your Figma token

Create a `.env` file and add your Figma token:

```
FIGMA_TOKEN=your_figma_api_token
```

### 4. Run the commands

```bash
# Fetch icons from Figma
npm run icon:fetch

# Generate React components
npm run icon:generate

# View cache statistics
npm run icon:cache:stats

# Clear the cache
npm run icon:cache:clear
```

## API Reference

### iconConfig(options)

The main configuration function that accepts the following options:

#### figma

- `token`: Your Figma API token
- `url`: Figma file URL with node ID
- `fileId`: Figma file ID (alternative to URL)
- `nodeId`: Figma node ID (alternative to URL)

#### fetch

- `concurrentDownloads`: Number of concurrent downloads
- `nodeTypes`: Types of nodes to fetch (default: `["COMPONENT", "COMPONENT_SET"]`)
- `generateFileName`: Custom filename generator function
- `sanitizeName`: Whether to sanitize filenames (default: `true`)
- `limit`: Limit the number of icons to fetch

#### generator

- `icon`: Generate icon components (default: `true`)
- `typescript`: Generate TypeScript files (default: `true`)
- `titleProp`: Add title prop to components (default: `true`)
- `dimensions`: Include width/height dimensions (default: `false`)
- `expandProps`: Position of expanded props (default: `"end"`)
- `replaceAttrValues`: Object mapping colors to replace
- `outDir`: Output directory for generated components
- `ext`: File extension for generated components (default: `"tsx"`)
- `prettier`: Format with Prettier (default: `true`)
- `memo`: Use React.memo (default: `false`)
- `ref`: Forward refs (default: `false`)
- `filenameCase`: Filename case style (default: `"camel"`)

## CLI Commands

- `iconsync fetch`: Fetch icons from Figma
- `iconsync generator`: Generate React components from fetched icons
- `iconsync cache:stats`: View cache statistics
- `iconsync cache:clear`: Clear the cache

## License

MIT
