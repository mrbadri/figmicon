// figma-url.ts
export type FigmaUrl = {
  fileId: string;
  nodeId: string;
};

/**
 * Parse a Figma URL and return { fileId, nodeId }.
 * Throws if either part is missing.
 *
 * Supports links like:
 *  - https://www.figma.com/file/<FILE_KEY>/<title>?node-id=12-34
 *  - https://www.figma.com/design/<FILE_KEY>/<title>?node-id=12%3A34
 *  - ...#node-id=12-34
 * Normalizes node-id "12-34" → "12:34".
 */
export function parseFigmaUrl(input: string | URL): FigmaUrl {
  const u = typeof input === "string" ? new URL(input) : input;

  // 1) fileId after /file/ or /design/ or /proto/
  const parts = u.pathname.split("/").filter(Boolean);
  const markerIdx = parts.findIndex(
    (p) => p === "file" || p === "design" || p === "proto"
  );
  const fileId = markerIdx >= 0 ? parts[markerIdx + 1] : "";

  if (!fileId) {
    throw new Error(
      "Invalid Figma URL: missing fileId after /file/ or /design/."
    );
  }

  // 2) node-id from query or hash
  let rawNode =
    u.searchParams.get("node-id") ?? u.searchParams.get("nodeId") ?? null;

  if (!rawNode && u.hash) {
    // Some links carry node-id in the hash: #node-id=12-34
    const hash = u.hash.startsWith("#") ? u.hash.slice(1) : u.hash;
    const hp = new URLSearchParams(hash);
    rawNode = hp.get("node-id") ?? hp.get("nodeId");
  }

  if (!rawNode) {
    throw new Error("Invalid Figma URL: missing node-id in query or hash.");
  }

  // 3) normalize nodeId:
  //    - decode percent encoding
  //    - accept already-coloned values (e.g. "12:34")
  //    - if it matches "digits-digits", convert first "-" to ":"
  const decoded = decodeURIComponent(rawNode);
  let nodeId: string;

  if (decoded.includes(":")) {
    nodeId = decoded;
  } else if (/^\d+-\d+$/.test(decoded)) {
    nodeId = decoded.replace("-", ":");
  } else {
    // If it doesn't match known shapes, treat as invalid
    throw new Error(
      `Invalid node-id format: "${decoded}". Expected "number:number" (e.g., "12:34").`
    );
  }

  return { fileId, nodeId };
}
