import {
  type FigmaDocumentNode,
  type FigmaParentNode,
  getFigmaNodeByIds,
  figmaLogger,
} from "@/features/figma";
import type { GetFileNodesResponse } from "@figma/rest-api-spec";
import { cyan, green } from "kolorist";

export interface FigmaNodeFetchOptions {
  fileId: string;
  nodeId: string;
}

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
}: FigmaNodeFetchOptions): Promise<FigmaParentNode | null> => {
  const formattedNodeId = nodeId.includes(":")
    ? nodeId
    : nodeId.replace(/-/g, ":"); // Figma IDs use ":" not "-"

  // Log fetch initiation
  console.log(
    figmaLogger(),
    "Fetching node:",
    cyan(formattedNodeId),
    "from file:",
    green(fileId)
  );

  const response = await getFigmaNodeByIds({ fileId, ids: formattedNodeId });

  // Log API response status
  if (response.ok) {
    console.log(figmaLogger(), green("✔"), "API request successful");
  }

  if (!response.ok) {
    const errorMessage = `Failed to fetch Figma node (${response.status} ${response.statusText})`;
    console.error(figmaLogger(), "❌", errorMessage);
    throw new Error(errorMessage);
  }

  const data: GetFileNodesResponse = await response.json();
  const nodeData = data.nodes?.[formattedNodeId];

  if (!nodeData?.document) {
    console.warn(figmaLogger(), "⚠️", `Node not found: ${formattedNodeId}`);
    return null;
  }

  const documentNode = nodeData.document as FigmaDocumentNode;

  if (isFigmaParentNode(documentNode)) {
    console.log(
      figmaLogger(),
      green("✔"),
      "Node retrieved successfully with",
      cyan(documentNode.children.length.toString()),
      "children"
    );
    return documentNode;
  } else {
    const errorMessage = `Selected node must have children (node type: ${documentNode.type})`;
    console.error(figmaLogger(), "❌", errorMessage);
    throw new Error(errorMessage);
  }
};
