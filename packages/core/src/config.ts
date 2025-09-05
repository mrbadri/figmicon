// src/config.ts

import { FigmiconConfigSchema, type FigmiconConfig } from "./types.js";

export type LoadOptions = {
  cwd?: string;
  /** specific path for config, like "./figmicon.config.ts" */
  configFile?: string;
};

export async function loadFigmaConfig(
  opts: LoadOptions = {}
): Promise<{ config: FigmiconConfig; source?: string }> {
  const { loadConfig } = await import("c12");
  const { cwd = process.cwd(), configFile } = opts;

  const { config, layers } = await loadConfig<FigmiconConfig>({
    name: "icon", // search: figmicon.config.*، .figmiconrc*، package.json
    cwd,
    configFile, // if you give specific path, it will load that directly
    dotenv: true, // load .env
  });

  if (!config) {
    throw new Error(
      "No configuration found. Create a figmicon.config.(cjs|mjs|js|ts|mts|cts) " +
        'or .figmiconrc.(json|yaml|yml|js|cjs|mjs) or add { "figmicon": { ... } } to package.json.'
    );
  }

  // validation + default values
  const parsed = FigmiconConfigSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error("Invalid figmicon config:\n" + parsed.error.toString());
  }

  // source of the config (for debugging)
  const source = layers?.[layers.length - 1]?.source;
  return { config: parsed.data, source };
}

// for better DX in TS/MJS files
export const defineConfig = (c: FigmiconConfig) => c;
