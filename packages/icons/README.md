# @figmicon/icons

React icon components generated from SVG files using SVGR.

## Installation

```bash
pnpm add @figmicon/icons
```

## Usage

```tsx
import {
  Arrowarrowleftsm,
  Arrowarrowrightsm,
  Arrowchevrondown,
} from "@figmicon/icons";

function MyComponent() {
  return (
    <div>
      <Arrowarrowleftsm className="w-6 h-6 text-gray-600" />
      <Arrowarrowrightsm className="w-6 h-6 text-blue-500" />
      <Arrowchevrondown className="w-4 h-4" />
    </div>
  );
}
```

## Features

- ✅ 74+ icon components
- ✅ TypeScript support
- ✅ Tree-shakable imports
- ✅ Customizable colors with `currentColor`
- ✅ Accessible with title props
- ✅ Consistent naming convention

## Development

### Regenerate icons from SVG files

```bash
# Generate React components from SVG files
pnpm generate:icons

# Generate index file with exports
pnpm generate:index

# Do both in one command
pnpm generate

# Build the package
pnpm build
```

### Icon naming

Icons are automatically converted from kebab-case SVG filenames to PascalCase component names:

- `arrow-arrow_left_sm.svg` → `Arrowarrowleftsm`
- `element-tag-label.svg` → `Elementtaglabel`

### Color customization

Icons use `currentColor` for strokes and fills, so you can customize them with CSS:

```tsx
<Arrowarrowleftsm className="text-red-500" />
<Arrowarrowrightsm style={{ color: '#3B82F6' }} />
```

### Icon props

All icons accept standard SVG props plus:

- `title?: string` - Accessible title for screen readers
- `titleId?: string` - Custom ID for the title element

```tsx
<Arrowarrowleftsm title="Go back" className="w-6 h-6" onClick={handleBack} />
```
