// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig([
  // 1) CLI (ESM) — فقط اجرا، بدون dts
  {
    entry: { cli: "src/cli/index.ts" },
    outDir: "dist",
    format: ["cjs"],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: false,
    banner: { js: "#!/usr/bin/env node" },
    target: "node18",
  },
  // 2) Library (ESM) — برای import و تولید types
  {
    entry: { index: "src/index.ts" },
    outDir: "dist",
    format: ["esm", "cjs"],
    splitting: false,
    sourcemap: true,
    clean: false,
    target: "node18",
    dts: true,
  },
]);
