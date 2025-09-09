import { GetFileNodesResponse, Node } from "@figma/rest-api-spec";

export type NodeType = Node["type"];

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
