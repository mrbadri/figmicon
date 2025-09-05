import { loadFigmaConfig } from "../../config";
import { downloadNode } from "./download-node";
import { fetchFigmaDocumentNode } from "./fetch-figma-document-node";

export const fetchCommand = async () => {
  const { config } = await loadFigmaConfig();
  const { figma, fetch } = config;

  const documentNode = await fetchFigmaDocumentNode({
    apiToken: figma.token,
    fileId: figma.fileId,
    nodeId: figma.nodeId,
  });

  if (!documentNode) {
    throw new Error("Document node not found");
  }

  documentNode.children.forEach(async (child) => {
    // if nodeTypes is provided, and it's not in the nodeTypes, skip
    if (
      fetch?.nodeTypes &&
      fetch?.nodeTypes?.length > 0 &&
      !fetch?.nodeTypes?.includes(child.type)
    )
      return;

    if (child.type === "COMPONENT_SET") {
      child.children.forEach(async (ComponentSetChild) => {
        await downloadNode({
          fileId: figma.fileId,
          apiToken: figma.token,
          node: ComponentSetChild,
          generateFileName: fetch?.generateFileName,
          outDir: fetch?.outDir,
          parentNode: child,
        });
      });
    } else {
      await downloadNode({
        fileId: figma.fileId,
        apiToken: figma.token,
        node: child,
        generateFileName: fetch?.generateFileName,
        outDir: fetch?.outDir,
        parentNode: documentNode,
      });
    }
  });
};
