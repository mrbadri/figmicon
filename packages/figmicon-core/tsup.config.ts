// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "src/index.ts" },
  outDir: "dist",
  format: ["esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: false,
  banner: { js: "#!/usr/bin/env node" },
  target: "node18",
});
