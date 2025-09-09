import { type Node } from "@figma/rest-api-spec";
import { cyan, green } from "kolorist";
import fs from "node:fs/promises";
import path from "node:path";
import { NodeCache } from "@/features/cache";
import { cacheLogger } from "@/features/cache";
import { type GenerateFileName } from "@/features/config/types";
import { getFigmaImageByIds, figmaLogger } from "@/features/figma";

export const downloadNode = async ({
  fileId,
  node,
  outDir = "icons",
  generateFileName = (node: Node, parentNode: Node) => node.name || node.id,
  sanitizeName = true,
  parentNode,
  configPath,
  cache,
}: {
  fileId: string;
  node: Node;
  parentNode: Node;
  outDir?: string;
  generateFileName?: GenerateFileName;
  sanitizeName?: boolean;
  configPath?: string;
  cache?: NodeCache | null;
}) => {
  // Initialize cache if not provided and configPath is available
  const nodeCache = cache || (configPath ? new NodeCache(configPath) : null);

  // Check cache first if available
  if (nodeCache) {
    const isCached = await nodeCache.isCached(node, parentNode, fileId);
    if (isCached) {
      const cachedPath = nodeCache.getCachedFilePath(node.id, fileId);
      if (cachedPath) {
        console.log(
          cacheLogger(),
          green("✔"),
          `Using cached ${cyan(node.name || node.id)} → ${green(cachedPath)}`
        );
        return cachedPath;
      }
    }
  }
  // 1) get temporary URL for SVG
  const res = await getFigmaImageByIds({ fileId, ids: node.id });

  if (!res.ok) {
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
    `Downloaded ${cyan(node.name || node.id)} → ${green(filePath)}`
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
