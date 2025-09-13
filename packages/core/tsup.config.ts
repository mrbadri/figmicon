// tsup.config.ts
import { defineConfig } from 'tsup';

const common = {
  outDir: 'dist',
  target: 'node18',
  sourcemap: true,
  clean: false,
  splitting: false,
  // Make esbuild treat .hbs imports as text (string)
  esbuildOptions(options: { loader?: Record<string, string> }) {
    options.loader = {
      ...(options.loader ?? {}),
      '.hbs': 'text',
    };
  },
  // Make sure @/* works for both builds
  alias: {
    '@': './src',
  },
} as const;

export default defineConfig([
  {
    ...common,
    entry: { cli: 'src/cli/index.ts' },
    format: ['cjs'],
    dts: false,
    banner: { js: '#!/usr/bin/env node' },
    platform: 'node',
  },
  {
    ...common,
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    platform: 'node',
  },
]);
