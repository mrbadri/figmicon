import { FigmiconConfigSchema } from "./schema";
import { ConfigReturn, ConfigOptions } from "./types";

export type LoadOptions = {
  cwd?: string;
  /** specific path for config, like "./figmicon.config.ts" */
  configFile?: string;
};

export async function loadConfig(
  opts: LoadOptions = {}
): Promise<{ config: ConfigReturn; source?: string }> {
  const { loadConfig } = await import("c12");
  const { cwd = process.cwd(), configFile } = opts;

  const { config, layers } = await loadConfig<ConfigOptions>({
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
  let source = layers?.[layers.length - 1]?.source;

  // If source is not available, try to construct it from the first layer that has a configFile
  if (!source) {
    const firstLayer = layers?.[0];
    if (firstLayer?.configFile && firstLayer?.cwd) {
      source = `${firstLayer.cwd}/${firstLayer.configFile}.ts`;
    }
  }

  return { config: parsed.data, source };
}

// for better DX in TS/MJS files
export const iconConfig = (c: ConfigOptions) => c;
