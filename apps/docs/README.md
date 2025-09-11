# Figmicon Documentation

This is the documentation site for Figmicon, built with [Nextra](https://nextra.site/) and [Next.js](https://nextjs.org/).

## Development

To start the development server:

```bash
pnpm dev
```

This will start the Next.js development server on [http://localhost:3000](http://localhost:3000).

## Building

To build the documentation site:

```bash
pnpm build
```

## Structure

- `pages/`: Documentation content in MDX format
- `theme.config.jsx`: Nextra theme configuration
- `next.config.js`: Next.js configuration with Nextra setup

## Adding New Documentation

1. Create a new `.mdx` file in the `pages/` directory
2. Add the page to the appropriate `_meta.json` file to include it in the navigation

## Features

- **MDX Support**: Write documentation in Markdown with JSX components
- **Code Highlighting**: Syntax highlighting for code blocks
- **Search**: Full-text search functionality
- **Dark Mode**: Built-in dark mode support
- **Navigation**: Automatically generated sidebar navigation
