// src/config.ts
import path from "node:path";
import { pathToFileURL } from "node:url";
import fs from "node:fs/promises";
import { type FigmiconConfig } from "./types.js";

export async function loadConfig(cwd = process.cwd()): Promise<FigmiconConfig> {
  const candidates = [
    "figmicon.config.ts",
    "figmicon.config.mjs",
    "figmicon.config.js",
  ];
  for (const name of candidates) {
    const p = path.join(cwd, name);
    try {
      await fs.access(p);
      const mod = await import(pathToFileURL(p).href);
      const cfg: FigmiconConfig = mod.default || mod.config || mod;
      // حداقل ولیدیشن
      if (!cfg.figmaToken || !cfg.fileId || !cfg.nodeIds?.length) {
        throw new Error(
          "Invalid config: figmaToken, fileId, nodeIds required."
        );
      }
      return cfg;
    } catch {
      // try next
    }
  }
  throw new Error("No figmicon.config.{ts,mjs,js} found.");
}

export const defineConfig = (c: FigmiconConfig) => c;
