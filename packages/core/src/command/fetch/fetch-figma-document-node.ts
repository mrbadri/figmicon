import type { GetFileNodesResponse } from "@figma/rest-api-spec";
import { green, cyan, bgBlue } from "kolorist";

/**
 * Options for fetching a Figma document node.
 * @interface FigmaNodeFetchOptions
 * @property {string} fileId - The ID of the Figma file to fetch from
 * @property {string} nodeId - The ID of the node to fetch (supports both "123-456" and "123:456" formats)
 * @property {string} apiToken - The Figma API access token for authentication
 */
export interface FigmaNodeFetchOptions {
  fileId: string;
  nodeId: string;
  apiToken: string;
}

/**
 * Represents a node in the Figma document tree.
 * This is a base type that includes all properties from the Figma API response.
 */
export type FigmaDocumentNode =
  GetFileNodesResponse["nodes"][string]["document"];

/**
 * Represents a Figma node that contains child nodes.
 * This type ensures the node has a children array containing other document nodes.
 */
export type FigmaParentNode = FigmaDocumentNode & {
  children: FigmaDocumentNode[];
};

/**
 * Type guard that checks if a node has children.
 * @param {FigmaDocumentNode} node - The node to check
 * @returns {boolean} True if the node has children, false otherwise
 */
export function isFigmaParentNode(
  node: FigmaDocumentNode
): node is FigmaParentNode {
  return Array.isArray((node as any)?.children);
}

/**
 * Fetches a Figma document node by its ID.
 * @returns The document node if found and has children, null if not found.
 * @throws Error if the node exists but has no children or if the API request fails.
 */
export const fetchFigmaDocumentNode = async ({
  fileId,
  nodeId,
  apiToken,
}: FigmaNodeFetchOptions): Promise<FigmaParentNode | null> => {
  const formattedNodeId = nodeId.includes(":")
    ? nodeId
    : nodeId.replace(/-/g, ":"); // Figma IDs use ":" not "-"

  // Log fetch initiation
  console.log(
    bgBlue(" Figma "),
    "Fetching node:",
    cyan(formattedNodeId),
    "from file:",
    green(fileId)
  );

  const url = `https://api.figma.com/v1/files/${fileId}/nodes?ids=${formattedNodeId}`;

  const response = await fetch(url, {
    headers: { "X-Figma-Token": apiToken },
  });

  // Log API response status
  if (response.ok) {
    console.log(bgBlue(" Figma "), green("✔"), "API request successful");
  }

  if (!response.ok) {
    const errorMessage = `Failed to fetch Figma node (${response.status} ${response.statusText})`;
    console.error(bgBlue(" Figma "), "❌", errorMessage);
    throw new Error(errorMessage);
  }

  const data: GetFileNodesResponse = await response.json();
  const nodeData = data.nodes?.[formattedNodeId];

  if (!nodeData?.document) {
    console.warn(bgBlue(" Figma "), "⚠️", `Node not found: ${formattedNodeId}`);
    return null;
  }

  const documentNode = nodeData.document as FigmaDocumentNode;

  if (isFigmaParentNode(documentNode)) {
    console.log(
      bgBlue(" Figma "),
      green("✔"),
      "Node retrieved successfully with",
      cyan(documentNode.children.length.toString()),
      "children"
    );
    return documentNode;
  } else {
    const errorMessage = `Selected node must have children (node type: ${documentNode.type})`;
    console.error(bgBlue(" Figma "), "❌", errorMessage);
    throw new Error(errorMessage);
  }
};
