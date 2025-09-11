import { cacheLogger, NodeCache } from "@/features/cache";
import { type GenerateFileName } from "@/features/config/types";
import { figmaLogger, getFigmaImageByIds } from "@/features/figma";
import { arrowPad, firstPad } from "@/features/log";
import { type Node } from "@figma/rest-api-spec";
import {
  blue,
  bold,
  cyan,
  gray,
  green,
  lightRed,
  lightYellow,
  red,
} from "kolorist";
import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_OUT_DIR_FETCH } from "./constant";

export const downloadNode = async ({
  fileId,
  node,
  outDir = DEFAULT_OUT_DIR_FETCH,
  generateFileName = (node: Node) => node.name || node.id,
  sanitizeName = true,
  parentNode,
  configPath,
  cache,
  retryCount = 0,
}: {
  fileId: string;
  node: Node;
  parentNode: Node;
  outDir?: string;
  generateFileName?: GenerateFileName;
  sanitizeName?: boolean;
  configPath?: string;
  cache?: NodeCache | null;
  retryCount?: number;
}): Promise<string> => {
  // Initialize cache if not provided and configPath is available
  const nodeCache = cache || (configPath ? new NodeCache(configPath) : null);

  // Check cache first if available
  if (nodeCache) {
    const isCached = await nodeCache.isCached(node, parentNode, fileId);
    if (isCached) {
      const cachedPath = nodeCache.getCachedFilePath(node.id, fileId);
      const nodeName = node.name || node.id;
      if (cachedPath) {
        console.log(
          cacheLogger(),
          green("✔"),
          firstPad("Using cached"),
          `${cyan(nodeName)} ${arrowPad(nodeName, 40)} ${green(cachedPath)}`
        );
        return cachedPath;
      }
    }
  }
  // 1) get temporary URL for SVG
  console.log(figmaLogger(), "⏳", `Downloading ${cyan(node.name || node.id)}`);
  const res = await getFigmaImageByIds({ fileId, ids: node.id });

  if (!res.ok) {
    console.error(
      figmaLogger(),
      "❌",
      `Failed to call Figma API: ${red(bold(res.status.toString()))} ${lightRed(res.statusText)}`
    );
    if (res.status === 429 && retryCount < 3) {
      const randomDelay = Math.floor(Math.random() * 2000) + 1000;
      console.log(
        figmaLogger(),
        "⏳",
        // better log with retry count and delay
        `Rate limit exceeded, ${gray("retrying...")} ${lightYellow(`${retryCount + 1}/3`)} , ${gray(`delaying for ${randomDelay}ms`)}`
      );
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
      return await downloadNode({
        fileId,
        node,
        parentNode,
        outDir,
        generateFileName,
        sanitizeName,
        configPath,
        cache,
        retryCount: retryCount + 1,
      });
    }
    console.error(
      figmaLogger(),
      "❌",
      red(bold("Failed to call Figma API after 3 retries.")),
      blue(
        "please wait a moment and try again or check your internet connection."
      )
    );
    throw new Error(
      `Failed to call Figma API: ${res.status} ${res.statusText}`
    );
  }

  const json: { images: Record<string, string>; err?: string } =
    await res.json();
  if (json.err) throw new Error(`Figma API error: ${json.err}`);

  const svgUrl = json.images[node.id];
  if (!svgUrl) throw new Error(`No SVG URL returned for node ${node.id}`);

  // 2) download the SVG
  const svgRes = await fetch(svgUrl);
  if (!svgRes.ok) {
    throw new Error(
      `Failed to download SVG: ${svgRes.status} ${svgRes.statusText}`
    );
  }

  const svg = await svgRes.text();

  let relPath: string;

  if (sanitizeName) {
    relPath = `${sanitizeFileName(generateFileName(node, parentNode), node.id)}.svg`;
  } else {
    relPath = `${generateFileName(node, parentNode)}.svg`;
  }

  const filePath = path.join(outDir, relPath);

  // 4) create folders
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // 5) write file
  await fs.writeFile(filePath, svg, "utf8");

  // 6) update cache
  if (nodeCache) {
    await nodeCache.setCacheEntry(node, parentNode, fileId, filePath);
  }

  console.log(
    figmaLogger(),
    green("✔"),
    firstPad("Downloaded"),
    `${cyan(node.name || node.id)} ${arrowPad(node.name || node.id)} ${green(filePath)}`
  );
  return filePath;
};

function sanitizeFileName(name: string, fallback: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || fallback
  );
}
