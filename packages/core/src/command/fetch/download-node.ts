import fs from "node:fs/promises";
import path from "node:path";
import { type Node } from "@figma/rest-api-spec";
import { type GenerateFileName } from "../../types";
import { bgBlue, cyan, green } from "kolorist";

export const downloadNode = async ({
  fileId,
  apiToken,
  node,
  outDir = "icons",
  generateFileName = (node: Node, parentNode: Node) => node.name || node.id,
  sanitizeName = true,
  parentNode,
}: {
  fileId: string;
  apiToken: string;
  node: Node;
  parentNode: Node;
  outDir?: string;
  generateFileName?: GenerateFileName;
  sanitizeName?: boolean;
}) => {
  // 1) get temporary URL for SVG
  const apiUrl = new URL(`https://api.figma.com/v1/images/${fileId}`);
  apiUrl.searchParams.set("ids", node.id);
  apiUrl.searchParams.set("format", "svg");
  apiUrl.searchParams.set("svg_include_id", "true");

  const res = await fetch(apiUrl, {
    headers: { "X-Figma-Token": apiToken },
  });

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

  console.log(
    bgBlue(" Figma "),
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
